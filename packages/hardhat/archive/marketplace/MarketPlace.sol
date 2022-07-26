// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MarketPlaceStorage.sol";
import "./Withdrawable.sol";
import "./RBFVaultFactory.sol";

//TODO: add docs/comments for each function
contract MarketPlace is
    MarketPlaceStorage,
    Withdrawable,
    RBFVaultFactory,
    Pausable,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    using Address for address;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address public underlyingToken;

    /**
     * @dev Constructor of the contract.
     * @param _feesCollector - fees collector
     * @param _feesCollectorCutPerMillion - fees collector cut per million
     */
    constructor(
        address _feesCollector,
        uint256 _feesCollectorCutPerMillion,
        address usdc
    ) Pausable() {
        // Address init
        setFeesCollector(_feesCollector);

        // Fee init
        setFeesCollectorCutPerMillion(_feesCollectorCutPerMillion);

        setUSDCAddress(usdc);
    }

    // ##########################
    // #####   Listing   #####
    // ##########################
    function getMarketItem(uint256 marketItemId)
        external
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    function getMarketItemCount() external view returns (uint256) {
        return _itemIds.current();
    }

    //TODO: remove the test item functions and change createMarketItem from public to external
    function createMarketItem(
        string memory name,
        address feeCollector,
        address multiSig,
        uint256 revenuePct,
        uint256 price,
        uint256 expAmount
    ) public payable nonReentrant {
        _requireGnosisSafe(multiSig);
        require(price > 0, "PRICE_MUST_BE_GT_0");

        //TODO: guard against zero revenuePct ?
        //TODO: use address sender = _msgSender(); instead of msg.sender ?

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            name,
            feeCollector,
            multiSig,
            revenuePct,
            payable(msg.sender),
            payable(address(0)),
            price,
            0,
            expAmount
        );

        emit MarketItemCreated(
            itemId,
            name,
            feeCollector,
            multiSig,
            revenuePct,
            payable(msg.sender),
            payable(address(0)),
            price,
            expAmount
        );
    }

    function fetchBidsOfItem(uint256 itemId)
        public
        view
        returns (Bid[] memory)
    {
        uint256 bidCount = bidCounterByItem[itemId];
        Bid[] memory bids = new Bid[](bidCount);
        for (uint256 i = 0; i < bidCount; i++) {
            bids[i] = bidsByItem[itemId][i];
        }
        return bids;
    }

    //TODO: fix implementation
    /**
     * @dev Check if the multi-sig is the Gnosis safe
     * @param _multiSig - address of the multi-sig
     */
    function _requireGnosisSafe(address _multiSig) internal view {
        // "MarketPlace#_requireGnosisSafe: INVALID_MULTISIG"
    }

    /**
     * @dev fetch the Vault address as the feeCollector.feeReceiver after the item was sold, otherwise return address(0)
     * @param itemId - id of the market item
     */
    function fetchVaultAddressOfItem(uint256 itemId) external view returns (address) {
        MarketItem memory item = idToMarketItem[itemId];
        if (item.buyer == address(0)) {
            return address(0);
        } else {
            return IBorrowerContract(item.feeCollector).feeReceiver();
        }
    }

    // ##########################
    // #####   Bid   #####
    // ##########################

    /**
     * @dev Place a bid for an item.
     * @notice Tokens can have multiple bids by different users.
     * Users can have only one bid per item.
     * If the user places a bid and has an active bid for that item,
     * the older one will be replaced with the new one.
     * @param _itemId - uint256 of the item id
     * @param _price - uint256 of the price for the bid
     * @param _revenueReceiver - address where revenue will be forwarded
     * @param _duration - uint256 of the duration in seconds for the bid
   
     */
    function placeBid(
        uint256 _itemId,
        uint256 _price,
        address _revenueReceiver,
        uint256 _duration
    ) external payable whenNotPaused {
        address sender = _msgSender();

        require(_price > 0, "Bid#_placeBid: PRICE_MUST_BE_GT_0");

        MarketItem memory item = idToMarketItem[_itemId];

        require(
            _itemId > 0 || _itemId <= _itemIds.current(),
            "Bid#placeBid: INVALID_ITEM"
        );

        require(
            _price >= item.price,
            "Bid#placeBid: PRICE_SHOULD_BE_GTE_ASKING_PRICE"
        );

        //TODO: Are we still securing the fund upon placeBid ? Should we uncomment the following ?
        // require(
        //     _price <= IERC20(underlyingToken).allowance(sender, address(this)),
        //     "Bid#placeBid: MUST_BE_AUTHORIZED_TO_SPEND_ENOUGH_TOKEN"
        // );

        require(
            _duration >= MIN_BID_DURATION,
            "Bid#_placeBid: DURATION_MUST_BE_GTE_MIN_BID_DURATION"
        );

        require(
            _duration <= MAX_BID_DURATION,
            "Bid#_placeBid: DURATION_MUST_BE_LTE_MAX_BID_DURATION"
        );

        require(
            _revenueReceiver != address(0),
            "Bid#_placeBid: INVALID_REVENUE_RECEIVER"
        );

        require(item.seller != sender, "Bid#_placeBid: SELLER_CANT_PLACE_BID");

        require(item.buyer == address(0), "Bid#placeBid: ITEM_ALREADY_SOLD");

        uint256 expiresAt = block.timestamp + _duration;
        uint256 bidId;

        if (_bidderHasABid(_itemId, sender)) {
            Bid memory oldBid = getBidByBidder(_itemId, sender);

            // TODO - Update older bid
            bidId = oldBid.id;
        } else {
            bidId = bidCounterByItem[_itemId];
            // Increase bid counter
            bidCounterByItem[_itemId]++;
            // Set bid references
            bidIdByItemAndBidder[_itemId][sender] = bidId;
        }

        // Save Bid
        bidsByItem[_itemId][bidId] = Bid({
            id: bidId,
            itemId: _itemId,
            bidder: sender,
            revenueReceiver: _revenueReceiver,
            price: _price,
            expiresAt: expiresAt
        });

        emit BidCreated(bidId, _itemId, sender, _price, expiresAt);
    }

    /**
     * @param _itemId The identifier of the item
     * @param _bidId bid identifier for the item
     * @return `bool`
     */
    function acceptBid(uint256 _itemId, uint256 _bidId)
        external
        whenNotPaused
        returns (bool)
    {
        Bid memory bid = _getBid(_itemId, _bidId);
        address sender = _msgSender();

        // Check if the item belongs to the current user
        MarketItem storage item = idToMarketItem[_itemId];
        require(item.seller == sender, "Bid#acceptBid: ONLY_SELLER_CAN_ACCEPT");

        // Check if the bid is valid.
        require(bid.expiresAt >= block.timestamp, "Bid#acceptBid: BID_EXPIRED");

        // Cancel other bids
        Bid[] memory bids = fetchBidsOfItem(_itemId);
        for (uint256 i = 0; i < bids.length; i++) {
            Bid memory _bid = bids[i];
            if (_bid.id != _bidId) {
                _cancelBid(_bid.id, _itemId, _bid.bidder);
            }
        }

        // Delete bid references from contract storage
        delete bidsByItem[_itemId][_bidId];
        delete bidIdByItemAndBidder[_itemId][bid.bidder];

        // Reset bid counter to invalidate other bids placed for the item
        delete bidCounterByItem[_itemId];

        item.buyer = payable(bid.bidder);
        item.soldPrice = bid.price;

        _itemsSold.increment();

        // Create vault
        address vault = createVault(item, underlyingToken);

        IERC20(underlyingToken).transferFrom(bid.bidder, vault, bid.price);

        emit BidAccepted(_bidId, _itemId, bid.bidder, msg.sender, bid.price);

        // TODO check scenarios where it will be false
        return true;
    }

    /**
     * @dev Remove expired bids
     * @param _itemsIds - uint256[] of the item ids
     * @param _bidders - address[] of the bidders
     */
    function removeExpiredBids(
        uint256[] memory _itemsIds,
        address[] memory _bidders
    ) external {
        uint256 loopLength = _itemsIds.length;

        require(
            loopLength == _bidders.length,
            "Bid#removeExpiredBids: LENGHT_MISMATCH"
        );

        for (uint256 i = 0; i < loopLength; i++) {
            _removeExpiredBid(_itemsIds[i], _bidders[i]);
        }
    }

    /**
     * @dev Remove expired bid
     * @param _itemId - uint256 of the item id
     * @param _bidder - address of the bidder
     */
    function _removeExpiredBid(uint256 _itemId, address _bidder) internal {
        Bid memory bid = getBidByBidder(_itemId, _bidder);

        require(
            bid.expiresAt < block.timestamp,
            "Bid#_removeExpiredBid: BID_NOT_EXPIRED"
        );

        //TODO: guard against accepted bid

        _cancelBid(bid.id, _itemId, _bidder);
    }

    /**
     * @dev Cancel a bid for an item
     * @param _itemId - uint256 of the item id
     */
    function cancelBid(uint256 _itemId) external whenNotPaused {
        address sender = _msgSender();

        // Get active bid
        Bid memory bid = getBidByBidder(_itemId, sender);
        require(bid.bidder == sender, "Bid#cancelBid: ONLY_BIDDER_CAN_CANCEL");

        _cancelBid(bid.id, _itemId, sender);
    }

    /**
     * @dev Cancel a bid for an item
     * @param _bidId - bytes32 of the bid id
     * @param _itemId - uint256 of the item id
     * @param _bidder - address of the bidder
     */
    function _cancelBid(
        uint256 _bidId,
        uint256 _itemId,
        address _bidder
    ) internal {
        // TODO - need this? Delete bid references
        delete bidIdByItemAndBidder[_itemId][_bidder];

        //TODO - validate this- Delete empty index
        delete bidsByItem[_itemId][_bidId];

        // Decrease bids counter
        bidCounterByItem[_itemId]--;

        _increasePendingWithdrawal(_bidder, bidsByItem[_itemId][_bidId].price);

        // emit BidCancelled event
        emit BidCancelled(_bidId, _itemId, _bidder);
    }

    /**
     * @dev Check if the bidder has a bid for an specific item.
     * @param _itemId - uint256 of the item id
     * @param _bidder - address of the bidder
     * @return bool whether the bidder has an active bid
     */
    function _bidderHasABid(uint256 _itemId, address _bidder)
        internal
        view
        returns (bool)
    {
        uint256 bidId = bidIdByItemAndBidder[_itemId][_bidder];
        if (bidId == 0) {
            return false;
        }
        Bid memory bid = getBidByItem(_itemId, bidId);
        if (_bidder == bid.bidder) {
            return true;
        }
        return false;
    }

    /**
     * @dev Get the active bid id and index by a bidder and an specific item.
     * @notice If the bidder has not a valid bid, the transaction will be reverted.
     * @param _itemId - uint256 of the item id
     * @param _bidder - address of the bidder
     * @return bid - bid struct
     */
    function getBidByBidder(uint256 _itemId, address _bidder)
        public
        view
        returns (Bid memory bid)
    {
        uint256 bidId = bidIdByItemAndBidder[_itemId][_bidder];
        bid = getBidByItem(_itemId, bidId);
        if (_bidder != bid.bidder) {
            revert("Bid#getBidByBidder: BIDDER_HAS_NO_ACTIVE_BID_FOR_ITEM");
        }
    }

    /**
     * @dev Get a bid by item
     * @param _itemId - uint256 of the item id
     * @param _bidId - uint256 of the bid Id
     * @return bid - bid struct
     */
    function getBidByItem(uint256 _itemId, uint256 _bidId)
        public
        view
        returns (Bid memory bid)
    {
        return _getBid(_itemId, _bidId);
    }

    /**
     * @notice If the bidId is not valid, it will revert.
     * @param _itemId - uint256 of the item id
     * @param _bidId - uint256 of the bid id
     * @return Bid
     */
    function _getBid(uint256 _itemId, uint256 _bidId)
        internal
        view
        returns (Bid memory)
    {
        require(
            _bidId < bidCounterByItem[_itemId],
            "Bid#_getBid: INVALID_BID_ID"
        );
        return bidsByItem[_itemId][_bidId];
    }

    /**
     * @dev Sets the share cut for the fees collector of the contract that's
     *  charged to the seller on a successful sale
     * @param _feesCollectorCutPerMillion - fees for the collector
     */
    function setFeesCollectorCutPerMillion(uint256 _feesCollectorCutPerMillion)
        public
        onlyOwner
    {
        feesCollectorCutPerMillion = _feesCollectorCutPerMillion;

        require(
            feesCollectorCutPerMillion < 1000000,
            "Bid#setFeesCollectorCutPerMillion: TOTAL_FEES_MUST_BE_BETWEEN_0_AND_999999"
        );

        emit ChangedFeesCollectorCutPerMillion(feesCollectorCutPerMillion);
    }

    /**
     * @notice Set the fees collector
     * @param _newFeesCollector - fees collector
     */
    function setFeesCollector(address _newFeesCollector) public onlyOwner {
        require(
            _newFeesCollector != address(0),
            "Bid#setFeesCollector: INVALID_FEES_COLLECTOR"
        );

        emit FeesCollectorSet(feesCollector, _newFeesCollector);
        feesCollector = _newFeesCollector;
    }

    /**
     * @dev Sets the address for the usdc ERC20
     * @param usdcAddress - address of the USDC ERC20 contract
     */
    function setUSDCAddress(address usdcAddress) public onlyOwner {
        require(
            usdcAddress != address(0),
            "setUSDCAddress: CANNOT_BE_ZERO_ADDRESS"
        );

        emit ChangedUSDCAddress(usdcAddress);
        underlyingToken = usdcAddress;
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    function createTestItem1() external payable {
        createMarketItem(
            "Test Protocol 1",
            0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
            0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
            50 * (10**18),
            500 * (10**18),
            800 * (10**18)
        );
    }

    function createTestItem2() external payable {
        createMarketItem(
            "Test Protocol 2",
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            50 * (10**18),
            500 * (10**18),
            800 * (10**18)
        );
    }
}
