// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {FactChainNFT} from "../src/FactChainNFT.sol";

contract FactChainNFTTest is Test {
    FactChainNFT collection;
    address public owner = address(1);
    address public recipient = address(2);

    function setUp() public {
        collection = new FactChainNFT(owner, "https://gateway.pinata.cloud/ipfs/");
    }

    function testGetTokenURI() public {
        vm.prank(owner);
        collection.mint(recipient, "QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv");
        assertEq(
            collection.tokenURI(1), "https://gateway.pinata.cloud/ipfs/QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv"
        );
    }

    function testSetBaseURI() public {
        vm.startPrank(owner);
        collection.setBaseURI("http://ipfs.com/");
        collection.mint(recipient, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
        assertEq(collection.tokenURI(1), "http://ipfs.com/QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
    }

    function test_supportInterfaces() public {
        assertTrue(collection.supportsInterface(0x7f5828d0)); // Ownable_INTERFACT_ID
        assertTrue(collection.supportsInterface(0x49064906)); // ERC4906_INTERFACE_ID
        assertTrue(collection.supportsInterface(0x80ac58cd)); // ERC721
        assertFalse(collection.supportsInterface(0xffffffff));
    }
}
