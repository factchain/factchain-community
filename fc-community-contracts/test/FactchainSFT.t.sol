// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {IOwnable} from "../src/utils/Ownable.sol";
import {FactchainSFT, IFactchainSFT} from "../src/FactchainSFT.sol";

contract FactchainSFTTest is Test, IFactchainSFT, IOwnable {
    FactchainSFT collection;

    address public owner = address(1);
    address public factchainNFT = address(2);
    address public rater1 = address(3);
    address public rater2 = address(4);
    address public rater3 = address(5);
    address public creator = address(6);
    address public nftBuyer = address(7);
    address[] public raters = [rater1, rater2, rater3];

    function setUp() public {
        collection = new FactchainSFT(owner);
        vm.deal(nftBuyer, 100 ether);
        vm.deal(creator, 100 ether);
        vm.deal(factchainNFT, 100 ether);
    }

    function testCloseMint() public {
        vm.startPrank(owner);
        collection.setFactchainNFTContract(factchainNFT);
        vm.startPrank(address(100));
        vm.expectRevert(IFactchainSFT.ReservedToFactchain.selector);
        collection.initialMint(creator, raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        assertEq(collection.uri(42), "https://gateway.pinata.cloud/ipfs/");
        vm.startPrank(factchainNFT);
        collection.initialMint(creator, raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        assertEq(collection.uri(42), "https://gateway.pinata.cloud/ipfs/QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
    }

    function testOpenMint() public {
        uint256 mintPrice = collection.mintPrice();
        vm.startPrank(owner);
        collection.setFactchainNFTContract(factchainNFT);
        vm.startPrank(nftBuyer);
        vm.expectRevert(IFactchainSFT.BadMintPrice.selector);
        collection.mint{value: mintPrice + 1}(42, 1);
        vm.expectRevert(IFactchainSFT.SupplyExhausted.selector);
        collection.mint{value: mintPrice * 43}(42, 43);
        // first valid mint should be initiated by the factchain main contract
        // to rewards all raters of the note, raise SupplyExhaused otherwise
        vm.startPrank(factchainNFT);
        collection.initialMint(creator, raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt", 42);
        uint256 creatorBalanceBefore = address(creator).balance;
        uint256 factchainSFTBalanceBefore = address(collection).balance;
        vm.expectEmit();
        emit FactchainBuildersRewarded(mintPrice / 2);
        emit CreatorRewarded(creator, mintPrice / 2);
        collection.mint{value: mintPrice}(42, 1);
        assertEq(
            address(creator).balance,
            creatorBalanceBefore + mintPrice / 2,
            "Contract Balance should have been increased by half MintPrice"
        );
        assertEq(
            address(collection).balance,
            factchainSFTBalanceBefore + mintPrice / 2,
            "Factchain builders should have been rewarded too by half MintPrice"
        );
        // should exhaust the supply
        collection.mint{value: mintPrice * 41}(42, 41);
        vm.expectRevert(IFactchainSFT.SupplyExhausted.selector);
        collection.mint{value: mintPrice}(42, 1);
    }

    function test_setMintPrice() public {
        vm.prank(owner);
        collection.setMintPrice(123);
        assert(collection.mintPrice() == 123);
    }

    function test_setMintPrice_RevertIf_notOwner() public {
        vm.expectRevert(IOwnable.NotOwner.selector);
        vm.prank(nftBuyer);
        collection.setMintPrice(123);
    }
}
