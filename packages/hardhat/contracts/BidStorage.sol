// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title Interface for contracts conforming to ERC-20
 */
interface ERC20Interface {
    function balanceOf(address from) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
}

/**
 * @title Interface for contracts conforming to ERC-721
 */
interface ERC721Interface {
    function ownerOf(uint256 _tokenId) external view returns (address _owner);

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;

    function supportsInterface(bytes4) external view returns (bool);
}

interface ERC721Verifiable is ERC721Interface {
    function verifyFingerprint(uint256, bytes memory)
        external
        view
        returns (bool);
}

contract BidStorage {
    // 182 days - 26 weeks - 6 months
    uint256 public constant MAX_BID_DURATION = 60 days;
    uint256 public constant MIN_BID_DURATION = 1 days;
    uint256 public constant ONE_MILLION = 1000000;
    bytes4 public constant ERC721_Interface = 0x80ac58cd;
    bytes4 public constant ERC721_Received = 0x150b7a02;
    bytes4 public constant ERC721Composable_ValidateFingerprint = 0x8f9f4b63;

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

    // MANA token
    ERC20Interface public manaToken;

    // Bid by item id => bid id => bid
    mapping(uint256 => mapping(uint256 => Bid)) internal bidsByItem;
    // Bid count by item id => bid counts
    mapping(uint256 => uint256) public bidCounterByItem;
    // Bid id by item id => bidder address => bidId
    mapping(uint256 => mapping(address => uint256)) public bidIdByItemAndBidder;

    address public feesCollector;

    uint256 public feesCollectorCutPerMillion;
    uint256 public royaltiesCutPerMillion;

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
        uint256 _id,
        address indexed _tokenAddress,
        uint256 indexed _tokenId,
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
