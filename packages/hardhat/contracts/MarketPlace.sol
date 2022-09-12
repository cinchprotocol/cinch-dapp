// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MarketPlaceStorage.sol";

contract MarketPlace is MarketPlaceStorage, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Address for address;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    /**
     * @dev Constructor of the contract.
     * @param _feesCollector - fees collector
     * @param _feesCollectorCutPerMillion - fees collector cut per million
     */
    constructor(address _feesCollector, uint256 _feesCollectorCutPerMillion)
        Pausable()
    {
        // Address init
        setFeesCollector(_feesCollector);

        // Fee init
        setFeesCollectorCutPerMillion(_feesCollectorCutPerMillion);
    }

    // ##########################
    // #####   Listing   #####
    // ##########################
    function getMarketItem(uint256 marketItemId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    function createMarketItem(
        string memory name,
        address feeCollector,
        address multiSig,
        uint256 revenuePct,
        uint256 price,
        uint256 expAmount
    ) public payable nonReentrant {
        _requireGnosisSafe(multiSig);
        require(price > 0, "Price must be at least 1 wei");

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

    function fetchUnsoldMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].buyer == address(0)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchMyListings() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchMyPurchases() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].buyer == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].buyer == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchMyBids() public view returns (Bid[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 currentIndex = 0;
        uint256 bidCount = 0;
        address sender = _msgSender();

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 itemId = i + 1;
            if (
                idToMarketItem[itemId].buyer == address(0) &&
                _bidderHasABid(itemId, sender)
            ) {
                bidCount++;
            }
        }
        Bid[] memory bids = new Bid[](bidCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 itemId = i + 1;
            if (
                idToMarketItem[itemId].buyer == address(0) &&
                _bidderHasABid(itemId, sender)
            ) {
                bids[currentIndex] = getBidByBidder(itemId, sender);
                currentIndex += 1;
            }
        }

        return bids;
    }

    /**
     * @dev Check if the multi-sig is the Gnosis safe
     * @param _multiSig - address of the multi-sig
     */
    function _requireGnosisSafe(address _multiSig) internal view {
        // "MarketPlace#_requireGnosisSafe: INVALID_MULTISIG"
    }

    // ##########################
    // #####   Bid   #####
    // ##########################

    Counters.Counter private _bidIds;

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
    ) public payable whenNotPaused {
        address sender = _msgSender();

        require(_price > 0, "Bid#_placeBid: PRICE_MUST_BE_GT_0");

        MarketItem memory item = idToMarketItem[_itemId];

        require(
            _itemId > 0 || _itemId <= _itemIds.current(),
            "Bid#placeBid: INVALID_ITEM"
        );

        require(
            item.price == msg.value,
            "Bid#placeBid: PRICE_SHOULD_BE_GTE_ASKING_PRICE"
        );

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

        uint256 expiresAt = block.timestamp + _duration;

        _bidIds.increment();
        uint256 bidId = _bidIds.current();

        // TODO transfer money into escrow

        if (_bidderHasABid(_itemId, sender)) {
            uint256 oldBidId;
            Bid memory oldBid = getBidByBidder(_itemId, sender);

            // TODO - Update older bid
        } else {
            // Use the bid counter to assign the index if there is not an active bid.
            bidId = bidCounterByItem[_itemId];
            // Increase bid counter
            bidCounterByItem[_itemId]++;
        }

        // Set bid references
        bidIdByItemAndBidder[_itemId][sender] = bidId;

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
        public
        whenNotPaused
        returns (bool)
    {
        Bid memory bid = _getBid(_itemId, _bidId);
        address sender = _msgSender();

        // Check if the item belongs to the current user
        MarketItem memory item = idToMarketItem[_itemId];
        require(item.seller == sender, "Bid#acceptBid: ONLY_SELLER_CAN_ACCEPT");

        // Check if the bid is valid.
        require(bid.expiresAt >= block.timestamp, "Bid#acceptBid: BID_EXPIRED");

        // Delete bid references from contract storage
        delete bidsByItem[_itemId][_bidId];
        delete bidIdByItemAndBidder[_itemId][bid.bidder];

        // TODO- need this?  Reset bid counter to invalidate other bids placed for the item
        delete bidCounterByItem[_itemId];

        // TODO - Setup custom multi-sig logic, fee destination address is updated

        //TODO - Release fund

        idToMarketItem[_itemId].buyer = payable(msg.sender);
        _itemsSold.increment();

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
    ) public {
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

        _cancelBid(bid.id, _itemId, _bidder);
    }

    /**
     * @dev Cancel a bid for an item
     * @param _itemId - uint256 of the item id
     */
    function cancelBid(uint256 _itemId) public whenNotPaused {
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
            revert("Bid#getBidByBidder: BIDDER_HAS_NOT_ACTIVE_BIDS_FOR_ITEM");
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
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
}
