// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MarketPlaceStorage.sol";
import "./CinchSafeGuard.sol";
import "./Vault.sol";

//TODO: add docs/comments for each function
contract MarketPlace is MarketPlaceStorage, Pausable, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    using Address for address;
    Counters.Counter private _itemIds;
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
        address feeBeneficiary,
        uint256 revenuePct,
        uint256 expAmount
    ) public payable nonReentrant {
        // _requireGnosisSafe(multiSig);

        //TODO: guard against zero revenuePct ?
        //TODO: use address sender = _msgSender(); instead of msg.sender ?

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            name,
            feeCollector,
            multiSig,
            feeBeneficiary,
            revenuePct,
            payable(msg.sender),
            payable(address(0)),
            expAmount
        );

         CinchSafeGuard multiSigGuard = new CinchSafeGuard();
         Vault vault = new Vault();
         vault.initialize(underlyingToken, name, name, feeCollector, multiSig, address(multiSigGuard));   

        emit MarketItemCreated(
            itemId,
            name,
            feeCollector,
            multiSig,
            feeBeneficiary,
            revenuePct,
            payable(msg.sender),
            payable(address(0)),
            expAmount
        );

        emit VaultCreated(msg.sender, address(vault));
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
    function fetchVaultAddressOfItem(uint256 itemId)
        external
        view
        returns (address)
    {
        MarketItem memory item = idToMarketItem[itemId];
        return address(0);
    }

    // /**
    //  * @param _itemId The identifier of the item
    //  * @param _bidId bid identifier for the item
    //  * @return `bool`
    //  */
    // function acceptBid(uint256 _itemId, uint256 _bidId)
    //     external
    //     whenNotPaused
    //     returns (bool)
    // {
    //     Bid memory bid = _getBid(_itemId, _bidId);
    //     address sender = _msgSender();

    //     // Check if the item belongs to the current user
    //     MarketItem storage item = idToMarketItem[_itemId];
    //     require(item.seller == sender, "Bid#acceptBid: ONLY_SELLER_CAN_ACCEPT");

    //     // Check if the bid is valid.
    //     require(bid.expiresAt >= block.timestamp, "Bid#acceptBid: BID_EXPIRED");

    //     // Cancel other bids
    //     Bid[] memory bids = fetchBidsOfItem(_itemId);
    //     for (uint256 i = 0; i < bids.length; i++) {
    //         Bid memory _bid = bids[i];
    //         if (_bid.id != _bidId) {
    //             _cancelBid(_bid.id, _itemId, _bid.bidder);
    //         }
    //     }

    //     // Delete bid references from contract storage
    //     delete bidsByItem[_itemId][_bidId];
    //     delete bidIdByItemAndBidder[_itemId][bid.bidder];

    //     // Reset bid counter to invalidate other bids placed for the item
    //     delete bidCounterByItem[_itemId];

    //     item.buyer = payable(bid.bidder);
    //     item.soldPrice = bid.price;

    //     _itemsSold.increment();

    //     // Create vault
    //     address vault = createVault(item, underlyingToken);

    //     IERC20(underlyingToken).transferFrom(bid.bidder, vault, bid.price);

    //     emit BidAccepted(_bidId, _itemId, bid.bidder, msg.sender, bid.price);

    //     // TODO check scenarios where it will be false
    //     return true;
    // }

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
            0x26FAB5e65D551A29B41897BD4BFd37C11Cc90282,
            50 * (10**18),
            800 * (10**18)
        );
    }

    function createTestItem2() external payable {
        createMarketItem(
            "Test Protocol 2",
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            0x26FAB5e65D551A29B41897BD4BFd37C11Cc90282,
            50 * (10**18),
            800 * (10**18)
        );
    }
}
