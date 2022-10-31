// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract MarketPlaceStorage {
    // ##########################
    // #####   Marketplace   #####
    // ##########################
    struct MarketItem {
        uint256 itemId;
        string name;
        address feeCollector;
        address multiSig;
        uint256 revenuePct;
        address payable seller;
        address payable buyer;
        uint256 price;
        uint256 soldPrice;
        uint256 expAmount;
    }

    mapping(uint256 => MarketItem) internal idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        string indexed name,
        address indexed feeCollector,
        address multiSig,
        uint256 revenuePct,
        address seller,
        address buyer,
        uint256 price,
        uint256 expAmount
    );

    // ##########################
    // #####   Bid   #####
    // ##########################

    uint256 public constant MAX_BID_DURATION = 60 days;
    uint256 public constant MIN_BID_DURATION = 1 days;
    uint256 public constant ONE_MILLION = 1000000;

    struct Bid {
        // Bid Id
        uint256 id;
        // item id
        uint256 itemId;
        // Bidder address
        address bidder;
        // Revenue receiver
        address revenueReceiver;
        // Price for the bid in wei
        uint256 price;
        // Time when this bid ends
        uint256 expiresAt;
    }

    //TODO: consider to use "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"

    // Bid by item id => bid id => bid
    mapping(uint256 => mapping(uint256 => Bid)) internal bidsByItem;
    // Bid count by item id => bid counts
    mapping(uint256 => uint256) public bidCounterByItem;
    // Bid id by item id => bidder address => bidId
    mapping(uint256 => mapping(address => uint256)) public bidIdByItemAndBidder;

    address public feesCollector;

    uint256 public feesCollectorCutPerMillion;

    // EVENTS
    event BidCreated(
        uint256 indexed _bidId,
        uint256 indexed _itemId,
        address indexed _bidder,
        uint256 _price,
        uint256 _expiresAt
    );

    event BidAccepted(
        uint256 indexed _bidId,
        uint256 _itemId,
        address indexed _bidder,
        address indexed _seller,
        uint256 _price
    );

    event BidCancelled(
        uint256 _bidId,
        uint256 indexed _itemId,
        address indexed _bidder
    );

    event ChangedFeesCollectorCutPerMillion(
        uint256 _feesCollectorCutPerMillion
    );
    event ChangedRoyaltiesCutPerMillion(uint256 _royaltiesCutPerMillion);
    event FeesCollectorSet(
        address indexed _oldFeesCollector,
        address indexed _newFeesCollector
    );
}
