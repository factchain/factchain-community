// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {FactchainNFT} from "../src/FactchainNFT.sol";
import {FactchainProxy} from "../src/FactchainProxy.sol";

contract FactchainNFTTest is Test {
    FactchainNFT collection;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address public owner = address(1);
    address public admin = address(2);
    address public recipient = address(3);
    address public factChainSFT = address(4);
    address[] public raters = [address(5), address(6)];
    string public postUrl = "https://twitter.com/rektorship/status/1750724519705153835";

    function setUp() public {
        FactchainNFT implementation = new FactchainNFT();
        FactchainProxy proxy =
        new FactchainProxy(address(implementation), abi.encodeCall(collection.initialize, (owner, factChainSFT, "https://gateway.pinata.cloud/ipfs/")));
        collection = FactchainNFT(payable(address(proxy)));

        hoax(owner);
        collection.grantRole(MINTER_ROLE, admin);
    }

    function test_mint() public {
        vm.prank(admin);
        collection.mint(recipient, postUrl, raters, "QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv");
    }

    function test_mint_RevertIf_notAdmin() public {
        vm.expectRevert();
        vm.prank(owner);
        collection.mint(recipient, postUrl, raters, "QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv");
    }

    function test_getTokenURI() public {
        vm.prank(admin);
        collection.mint(recipient, postUrl, raters, "QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv");
        assertEq(
            collection.tokenURI(1), "https://gateway.pinata.cloud/ipfs/QmdByzCXRCbPZ2DYq3wqURjShNEGZ2qDNW4w9mcwA9oWLv"
        );
    }

    function test_setBaseURI() public {
        vm.prank(owner);
        collection.setBaseURI("http://ipfs.com/");
        vm.prank(admin);
        collection.mint(recipient, postUrl, raters, "QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
        assertEq(collection.tokenURI(1), "http://ipfs.com/QmNSYBE2J3gnDrwXJAVnL6KfCzKvsgnWFVpxzyUUWcDmtt");
    }
}
