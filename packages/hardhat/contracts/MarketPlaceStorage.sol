// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract MarketPlaceStorage {
    address public feesCollector;
    uint256 public feesCollectorCutPerMillion;

    struct MarketItem {
        uint256 itemId;
        string name;
        address feeCollector;
        address multiSig;
        address feeBeneficiary;
        uint256 revenuePct;
        address payable seller;
        address payable buyer;
        uint256 expAmount;
    }

    mapping(uint256 => MarketItem) internal idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        string indexed name,
        address indexed feeCollector,
        address multiSig,
        address feeBeneficiary,
        uint256 revenuePct,
        address seller,
        address buyer,
        uint256 expAmount
    );

    event ChangedFeesCollectorCutPerMillion(
        uint256 _feesCollectorCutPerMillion
    );
    event ChangedRoyaltiesCutPerMillion(uint256 _royaltiesCutPerMillion);
    event FeesCollectorSet(
        address indexed _oldFeesCollector,
        address indexed _newFeesCollector
    );
     event ChangedUSDCAddress(
        address indexed _usdcAddress
    );

    event VaultCreated(
        address indexed seller,
        address indexed vaultAddress
    );
}
