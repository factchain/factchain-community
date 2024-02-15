// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {FactchainSFT, IFactchainSFT} from "../src/FactchainSFT.sol";
import {FactchainSFTProxy} from "../src/FactchainSFTProxy.sol";

contract FactchainSFTTest is Test, IFactchainSFT {
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
        address payable proxy = payable(address(new FactchainSFTProxy(owner)));
        collection = FactchainSFT(proxy);
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
        vm.startPrank(owner);
        vm.expectEmit();
        emit ProtocolRewardUpdated(250000000000000);
        collection.setProtocolReward(mintPrice / 4);
        vm.startPrank(nftBuyer);
        vm.expectEmit();
        uint256 expectedFactchainBuildersReward = 250000000000000 * 41;
        emit FactchainBuildersRewarded(expectedFactchainBuildersReward);
        emit CreatorRewarded(creator, mintPrice * 41 - expectedFactchainBuildersReward);
        collection.mint{value: mintPrice * 41}(42, 41);
        // should exhaust the supply
        vm.expectRevert(IFactchainSFT.SupplyExhausted.selector);
        collection.mint{value: mintPrice}(42, 1);
    }

    function test_setMintPrice() public {
        vm.prank(owner);
        vm.expectEmit();
        emit MintPriceUpdated(123);
        collection.setMintPrice(123);
        assert(collection.mintPrice() == 123);
    }

    function test_setProtocolReward() public {
        vm.prank(owner);
        vm.expectEmit();
        uint256 protocolReward = 1_000_000_000_000_000 / 2;
        emit ProtocolRewardUpdated(protocolReward);
        collection.setProtocolReward(protocolReward);
    }

    function test_setWrongProtocolReward() public {
        vm.prank(owner);
        vm.expectRevert(IFactchainSFT.ProtocolRewardTooHigh.selector);
        collection.setProtocolReward(1_000_000_000_000_001);
    }

    function test_setProtocolReward_RevertIf_notOwner() public {
        vm.expectRevert();
        vm.prank(nftBuyer);
        collection.setProtocolReward(1_000_000_000_000_000 / 2);
    }

    function test_setMintPrice_RevertIf_notOwner() public {
        vm.expectRevert();
        vm.prank(nftBuyer);
        collection.setMintPrice(123);
    }
}
