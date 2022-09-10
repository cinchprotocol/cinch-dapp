// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MarketPlace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    constructor() {}

    struct MarketItem {
        uint256 itemId;
        string name;
        address feeCollector;
        address multiSig;
        uint256 revenuePct;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 expAmount;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        string indexed name,
        address indexed feeCollector,
        address multiSig,
        uint256 revenuePct,
        address seller,
        address owner,
        uint256 price,
        uint256 expAmount
    );

    function getMarketItem(uint256 marketItemId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    function createMarketItem(
        string name,
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

    function createMarketSale(address feeCollector, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 revenuePct = idToMarketItem[itemId].revenuePct;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(feeCollector).transferFrom(
            address(this),
            msg.sender,
            revenuePct
        );
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
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
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @dev Check if the multi-sig is the Gnosis safe
     * @param _multiSig - address of the multi-sig
     */
    function _requireGnosisSafe(address _multiSig) internal view {
        // "MarketPlace#_requireGnosisSafe: INVALID_MULTISIG"
    }
}
