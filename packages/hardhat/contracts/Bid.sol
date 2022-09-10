// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BidStorage.sol";

contract Bid is Ownable, Pausable, BidStorage {
    using Address for address;
    Counters.Counter private _bidIds;

    /**
     * @dev Constructor of the contract.
     * @param _feesCollector - fees collector
     * @param _feesCollectorCutPerMillion - fees collector cut per million
     */
    constructor(
        address _feesCollector,
        uint256 _feesCollectorCutPerMillion,
        uint256 _royaltiesCutPerMillion
    ) Pausable() {
        // Address init
        setFeesCollector(_feesCollector);

        // Fee init
        setFeesCollectorCutPerMillion(_feesCollectorCutPerMillion);
    }

    /**
     * @dev Place a bid for an item.
     * @notice Tokens can have multiple bids by different users.
     * Users can have only one bid per token.
     * If the user places a bid and has an active bid for that token,
     * the older one will be replaced with the new one.
    * @param _itemId - uint256 of the token id
     * @param _price - uint256 of the price for the bid
       * @param _revenueReceiver - address where revenue will be forwarded
     * @param _duration - uint256 of the duration in seconds for the bid
   
     */
    function placeBid(
        uint256 _itemId,
        uint256 _price,
        address _revenueReceiver,
        uint256 _duration
    ) public whenNotPaused {
        address sender = _msgSender();

        require(_price > 0, "Bid#_placeBid: PRICE_MUST_BE_GT_0");

        //TODO - get price of the item
        //  require(
        //     msg.value == price,
        //     "Please submit the asking price in order to complete the purchase"
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

        //TODO check if caller is not the item owner

        uint256 expiresAt = block.timestamp + _duration;

        _bidIds.increment();
        uint256 bidId = _bidIds.current();

        // TODO transfer money into escrow

        if (_bidderHasABid(_itemId, sender)) {
            bytes32 oldBidId;
            (oldBidId, , , ) = getBidByBidder(_itemId, sender);

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

        // TODO check if the items belongs to current user

        // Check if the bid is valid.
        require(bid.expiresAt >= block.timestamp, "Bid#acceptBid: BID_EXPIRED");

        // Delete bid references from contract storage
        delete bidsByItem[_itemId][_bidId];
        delete bidIdByItemAndBidder[_itemId][bid.bidder];

        // TODO- need this?  Reset bid counter to invalidate other bids placed for the token
        delete bidCounterByItem[_itemId];

        // TODO - Setup custom multi-sig logic, fee destination address is updated

        //TODO - Release fund

        emit BidAccepted(_bidId, _itemId, bid.bidder, msg.sender, bid.price);

        // TODO check scenarios where it will be false
        return true;
    }

    /**
     * @dev Remove expired bids
     * @param _itemIds - uint256[] of the token ids
     * @param _bidders - address[] of the bidders
     */
    function removeExpiredBids(
        uint256[] memory _itemIds,
        address[] memory _bidders
    ) public {
        uint256 loopLength = _itemIds.length;

        require(
            loopLength == _bidders.length,
            "Bid#removeExpiredBids: LENGHT_MISMATCH"
        );

        for (uint256 i = 0; i < loopLength; i++) {
            _removeExpiredBid(_itemIds[i], _bidders[i]);
        }
    }

    /**
     * @dev Remove expired bid
     * @param _itemId - uint256 of the token id
     * @param _bidder - address of the bidder
     */
    function _removeExpiredBid(uint256 _itemId, address _bidder) internal {
        (uint256 bidId, , , uint256 expiresAt) = getBidByBidder(
            _itemId,
            _bidder
        );

        require(
            expiresAt < block.timestamp,
            "Bid#_removeExpiredBid: BID_NOT_EXPIRED"
        );

        _cancelBid(bidId, _itemId, _bidder);
    }

    /**
     * @dev Cancel a bid for an token
     * @param _itemId - uint256 of the token id
     */
    function cancelBid(uint256 _itemId) public whenNotPaused {
        //TODO - check if caller is the bidder
        address sender = _msgSender();
        // Get active bid
        (uint256 bidId, , , ) = getBidByBidder(_itemId, sender);

        _cancelBid(bidId, _itemId, sender);
    }

    /**
     * @dev Cancel a bid for an token
     * @param _bidId - bytes32 of the bid id
     * @param _itemId - uint256 of the token id
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
     * @dev Check if the bidder has a bid for an specific token.
     * @param _itemId - uint256 of the token id
     * @param _bidder - address of the bidder
     * @return bool whether the bidder has an active bid
     */
    function _bidderHasABid(uint256 _itemId, address _bidder)
        internal
        view
        returns (bool)
    {
        bytes32 bidId = bidIdByItemAndBidder[_itemId][_bidder];

        (bidId, bidder, price, expiresAt) = getBidByItem(_itemId, bidId);
        if (_bidder == bidder) {
            return true;
        }
        return false;
    }

    /**
     * @dev Get the active bid id and index by a bidder and an specific token.
     * @notice If the bidder has not a valid bid, the transaction will be reverted.
     * @param _itemId - uint256 of the token id
     * @param _bidder - address of the bidder
     * @return bidId - uint256 of the bid id
     * @return bidder - address of the bidder address
     * @return price - uint256 of the bid price
     * @return expiresAt - uint256 of the expiration time
     */
    function getBidByBidder(uint256 _itemId, address _bidder)
        public
        view
        returns (
            uint256 bidId,
            address bidder,
            uint256 price,
            uint256 expiresAt
        )
    {
        bidId = bidIdByItemAndBidder[_itemId][_bidder];
        (bidId, bidder, price, expiresAt) = getBidByItem(_itemId, bidId);
        if (_bidder != bidder) {
            revert("Bid#getBidByBidder: BIDDER_HAS_NOT_ACTIVE_BIDS_FOR_TOKEN");
        }
    }

    /**
     * @dev Get a bid by item
     * @param _itemId - uint256 of the token id
     * @param _bidId - uint256 of the bid Id
     * @return uint256 of the bid id
     * @return address of the bidder address
     * @return uint256 of the bid price
     * @return uint256 of the expiration time
     */
    function getBidByItem(uint256 _itemId, uint256 _bidId)
        public
        view
        returns (
            uint256,
            address,
            uint256,
            uint256
        )
    {
        Bid memory bid = _getBid(_itemId, _bidId);
        return (bid.id, bid.bidder, bid.price, bid.expiresAt);
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
            feesCollectorCutPerMillion + royaltiesCutPerMillion < 1000000,
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
