// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import {FactChainSFT, IFactChainSFT} from "../src/FactChainSFT.sol";

contract FactChainSFTTest is Test, IFactChainSFT {
    FactChainSFT collection;

    uint256 public constant MINT_PRICE = 1_000_000;

    address public owner = address(1);
    address public factchainMain = address(2);
    address public rater1 = address(3);
    address public rater2 = address(4);
    address public rater3 = address(5);
    address public creator = address(6);
    address public nftBuyer = address(7);
    address[] public raters = [rater1, rater2, rater3];

    function setUp() public {
        collection = new FactChainSFT(owner, factchainMain);
        vm.deal(nftBuyer, 100 ether);
        vm.deal(creator, 100 ether);
        vm.deal(factchainMain, 100 ether);
    }

    function testCloseMint() public {
        vm.startPrank(address(100));
        vm.expectRevert(IFactChainSFT.ReservedToFactChain.selector);
        collection.mint(raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        assertEq(collection.uri(42), "https://gateway.pinata.cloud/ipfs/");
        vm.startPrank(factchainMain);
        collection.mint(raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        assertEq(collection.uri(42), "https://gateway.pinata.cloud/ipfs/QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
    }

    function testOpenMint() public {
        vm.startPrank(nftBuyer);
        vm.expectRevert(IFactChainSFT.BadMintPrice.selector);
        collection.mint{value: MINT_PRICE + 1}(42, 1, creator);
        vm.expectRevert(IFactChainSFT.SupplyExhausted.selector);
        collection.mint{value: MINT_PRICE * 43}(42, 43, creator);
        // first valid mint should be initiated by the factchain main contract
        // to rewards all raters of the note, raise SupplyExhaused otherwise
        vm.startPrank(factchainMain);
        collection.mint(raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        uint256 creatorBalanceBefore = address(creator).balance;
        uint256 factchainSFTBalanceBefore = address(collection).balance;
        vm.expectEmit();
        emit FactchainBuildersRewarded(MINT_PRICE / 2);
        emit CreatorRewarded(creator, MINT_PRICE / 2);
        collection.mint{value: MINT_PRICE}(42, 1, creator);
        assertEq(
            address(creator).balance,
            creatorBalanceBefore + MINT_PRICE / 2,
            "Contract Balance should have been increased by half MintPrice"
        );
        assertEq(
            address(collection).balance,
            factchainSFTBalanceBefore + MINT_PRICE / 2,
            "Factchain builders should have been rewarded too by half MintPrice"
        );
        // should exhaust the supply
        collection.mint{value: MINT_PRICE * 41}(42, 41, creator);
        vm.expectRevert(IFactChainSFT.SupplyExhausted.selector);
        collection.mint{value: MINT_PRICE}(42, 1, creator);
    }
}
