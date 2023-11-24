// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {FactChain1155, IFactChain1155} from "../src/FactChain1155.sol";

contract FactChain1155Test is Test, IFactChain1155 {
    FactChain1155 collection;
    uint256 public constant MAX_TOKEN_SUPPLY = 42;
    uint256 public constant MINT_PRICE = 1_000_000;
    uint256 public constant SUPPLY_EXHAUSTED = MAX_TOKEN_SUPPLY + 1;
    address public owner = address(1);
    address public recipient = address(2);
    address public other = address(3);


    function setUp() public {
        collection = new FactChain1155(owner);
        vm.deal(recipient, 100 ether);
        vm.deal(other, 100 ether);
    }

    function testGetTokenID() public {
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE}(424273286, 3, "");
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE}(2742163345, 3, "");
        uint256 res1 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727169224186167620");
        assertEq(res1, 424273286);
        uint256 res2 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727720872138391787");
        assertEq(res2, 2742163345);
        vm.expectRevert(IFactChain1155.NoTokenAssociated.selector);
        collection.getTokenID("https://twitter.com/i/birdwatch/n/notMinted");

    }

    function testMintBalanceUpdate() public {
        // Mint tokens
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE}(123, 3, "");
        
        // Check if the balance of the recipient has increased
        uint256 balanceAfterMint = collection.balanceOf(recipient, 123);
        assertEq(balanceAfterMint, 3, "Recipient should have 3 tokens after minting");
        assertEq(address(collection).balance, MINT_PRICE, "Contract Balance should have been increased by MintPrice");
    }

    function testMintSupplyDecrease() public {
        // Check if the supply has decreased
        vm.startPrank(other);
        collection.mint{value: MINT_PRICE}(123, 3, "");
        uint256 supplyBeforeMint = collection.supply(123);
        collection.mint{value: MINT_PRICE}(123, 1, "");
        assertEq(collection.supply(123), supplyBeforeMint - 1, "Supply should have been decreased!");
    }

    function testMintSupplyExhausted() public {
         vm.startPrank(other);
         collection.mint{value: MINT_PRICE}(123, MAX_TOKEN_SUPPLY, "");

         vm.expectRevert(IFactChain1155.SupplyExhausted.selector);
         collection.mint{value: MINT_PRICE}(123, 1, "");
    }

    function testAntiGreed() public {
        // Avoid Greedy users check
        vm.expectRevert(IFactChain1155.Greed.selector);
        collection.mint{value: MINT_PRICE}(123, MAX_TOKEN_SUPPLY + 1, "");
    }

    function testMintWithAdjustedValue() public {
        vm.startPrank(owner);
        collection.setTokenSupply(42, 24);
        vm.startPrank(other);
        vm.expectEmit();
        emit MintWithAdjustedValue(42, 24);
        collection.mint{value: MINT_PRICE}(42, 26, "");
    }

    function testMintWithProvidedValue() public {
        vm.startPrank(owner);
        collection.setTokenSupply(42, 24);
        vm.startPrank(other);
        vm.expectEmit();

        emit MintWithProvidedValue(42, 12);
        collection.mint{value: MINT_PRICE}(42, 12, "");
        assertEq(collection.supply(42), 12, "Supply should have been decreased by 12!");

        vm.expectEmit();
        emit MintWithProvidedValue(42, 12);
        collection.mint{value: MINT_PRICE}(42, 12, "");
        assertEq(collection.supply(42), SUPPLY_EXHAUSTED, "Supply should be exhausted!");
    }
}
