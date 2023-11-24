// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {FactChain1155} from "../src/FactChain1155.sol";

contract FactChain1155Test is Test {
    FactChain1155 collection;
    uint256 public constant MINT_PRICE = 1_000_000;
    address public owner = address(1);
    address public recipient = address(2);

    function setUp() public {
        collection = new FactChain1155(owner);
    }

    function testGetTokenID() public {
        vm.prank(recipient);
        vm.deal(recipient, 100 ether);
        collection.mint{value: MINT_PRICE}(424273286, 3, "");
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE}(2742163345, 3, "");
        uint256 res1 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727169224186167620");
        assertEq(res1, 424273286);
        uint256 res2 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727720872138391787");
        assertEq(res2, 2742163345);
    }
}
