// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RBFVault.sol";
import "./CinchSafeGuard.sol";

/**
 * @title RBFVaultFactory
 * @notice Contract allows to create vaults which allows Lender to secure royalty revenue streams from a borrower(DAO/Protocols) and split payments between them based on agreed terms
 * @dev Should be deployed once for the app
 */
contract RBFVaultFactory is Ownable {
    event RBFVaultCreated(
        address indexed lender,
        address indexed borrower,
        address indexed vaultAddress
    );

    mapping(address => address[]) public borrowerVault;
    mapping(address => address[]) public lenderVault;

    /**
     *
     * @dev Create vault and configure the data for the vault
     *
     */
    function createVault(
        string memory name,
        address feeCollector,
        address multiSig,
        uint256 revenuePct,
        uint256 price,
        uint256 expAmount,
        address borrower,
        address lender
    ) internal returns (address) {
        // Deploy Cinch multi-sig guard
        //TODO - get function sig input during the listing of item so it can be set here in the guard
        CinchSafeGuard multiSigGuard = new CinchSafeGuard();

        RBFVault vault = new RBFVault(
            name,
            feeCollector,
            multiSig,
            revenuePct,
            price,
            expAmount,
            borrower,
            lender,
            address(multiSigGuard)
        );
        borrowerVault[borrower].push(address(vault));
        lenderVault[lender].push(address(vault));

        emit RBFVaultCreated(lender, borrower, address(vault));
        return address(vault);
    }

    function getlenderVaults(address lender)
        public
        view
        returns (address[] memory)
    {
        return lenderVault[lender];
    }

    function getBorrowerVaults(address borrower)
        public
        view
        returns (address[] memory)
    {
        return borrowerVault[borrower];
    }
}
