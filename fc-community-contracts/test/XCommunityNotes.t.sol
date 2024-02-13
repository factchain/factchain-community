// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {XCommunityNotes, IXCommunityNotes} from "../src/XCommunityNotes.sol";
import {IOwnable} from "../src/utils/Ownable.sol";

contract XCommunityNotesTest is Test, IXCommunityNotes, IOwnable {
    XCommunityNotes collection;
    uint256 public constant MAX_TOKEN_SUPPLY = 42;
    uint256 public constant SUPPLY_EXHAUSTED = MAX_TOKEN_SUPPLY + 1;
    address public owner = address(1);
    address public recipient = address(2);
    address public other = address(3);

    // *backend public key*
    // use the associated private key
    // to sign token ids to mint for the first time.
    // mandatory to prevent the mint of tokens without associated metadata.
    address public backend = address(0x90bfaBa1671799a249fD2EAb12ff67de59a588ce);

    function setUp() public {
        collection = new XCommunityNotes(owner, backend);
        vm.deal(recipient, 100 ether);
        vm.deal(other, 100 ether);
    }

    function testMintUnkownToken() public {
        uint256 mintPrice = collection.mintPrice();
        // Should not be able to mint unknown tokens
        // To mint a token for the first time
        // provide a token ID signed by the backend
        vm.expectRevert(IXCommunityNotes.UnknownToken.selector);
        collection.mint{value: mintPrice}(123, 1);
    }

    function testGetTokenID() public {
        uint256 mintPrice = collection.mintPrice();
        vm.prank(recipient);
        collection.mint{value: mintPrice * 3}(
            424273286,
            3,
            hex"84fac280d097e9c99d8522dd6adb8fcb46d9c1d0798d309b3abfd511d24e43b8",
            hex"4d27fe7200c3628938070a426865303178724b6165088e1de049e4c6a94ba0f73b73ea6636c85494ae5b516c0f1094f51d751738ab0d383ba254c5ade08a99fb1b"
        );
        vm.prank(recipient);
        collection.mint{value: mintPrice * 3}(
            2742163345,
            3,
            hex"a683622ff02d5db7693fc088d7382b73f03bf1656a4cc771f2410e30d521bb87", // keccak(bytes("2742163345", "utf-8")).hex()
            hex"2c07228dcd8c019203a2bbead06a3db9e0ad417fdc1bf82ce8216eba01fff70421aa09a1da9238e93da10da266f4d7824f9a48488a2252652af7485b18197d9d1c"
        );

        uint256 res1 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727169224186167620");
        assertEq(res1, 424273286);
        uint256 res2 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727720872138391787");
        assertEq(res2, 2742163345);
        vm.expectRevert(IXCommunityNotes.NoTokenAssociated.selector);
        collection.getTokenID("https://twitter.com/i/birdwatch/n/notMinted");
    }

    function testMintBalanceUpdate() public {
        uint256 mintPrice = collection.mintPrice();
        // Mint 3 tokens of ID 123 for the first time
        // provide signature of "123"
        vm.prank(recipient);
        collection.mint{value: mintPrice * 3}(
            123,
            3,
            // keccak(bytes("123", "utf-8")).hex()
            hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
            // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
            hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
        );
        // Check if the balance of the recipient has increased by 3
        uint256 balanceAfterMint = collection.balanceOf(recipient, 123);
        assertEq(balanceAfterMint, 3, "Recipient should have 3 tokens after minting");
        // Check the contract balance
        assertEq(address(collection).balance, mintPrice * 3, "Contract Balance should have been increased by MintPrice");

        uint256 balanceBefore = address(recipient).balance;
        vm.prank(recipient);
        vm.expectEmit();
        // in this test: random supply is alway 29 case because block.timestamp and msg.sender are fixed.
        // see worstRandEver contract function.
        // in this test: we've already minted 3 quantiy of token 123 in the above mint call
        // remaining supply *should be* = 23
        emit Refunded(recipient, (MAX_TOKEN_SUPPLY - 23) * mintPrice);
        collection.mint{value: mintPrice * MAX_TOKEN_SUPPLY}(123, MAX_TOKEN_SUPPLY);
        assertEq(address(recipient).balance, balanceBefore - (23 * mintPrice));
    }

    function testMintSupplyDecrease() public {
        uint256 mintPrice = collection.mintPrice();
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        collection.mint{value: mintPrice * 3}(
            123,
            3,
            // keccak(bytes("123", "utf-8")).hex()
            hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
            // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
            hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
        );

        // Check if the supply has decreased
        vm.startPrank(other);
        // second mint, token already created
        // mint only requires token id and quantity
        collection.mint{value: mintPrice * 3}(123, 3);
        uint256 supplyBeforeMint = collection.supply(123);
        collection.mint{value: mintPrice}(123, 1);
        assertEq(collection.supply(123), supplyBeforeMint - 1, "Supply should have been decreased!");
    }

    function testMintSupplyExhausted() public {
        uint256 mintPrice = collection.mintPrice();
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        collection.mint{value: mintPrice * MAX_TOKEN_SUPPLY}(
            123,
            MAX_TOKEN_SUPPLY,
            // keccak(bytes("123", "utf-8")).hex()
            hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
            // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
            hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
        );

        vm.expectRevert(IXCommunityNotes.SupplyExhausted.selector);
        collection.mint{value: mintPrice}(123, 1);
    }

    function testMintNotAllowed() public {
        uint256 mintPrice = collection.mintPrice();
        vm.prank(owner);
        // set new backend
        // following signatures should be wrong!
        collection.setBackend(address(42));
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        vm.expectRevert(IXCommunityNotes.NotAllowed.selector);
        collection.mint{value: mintPrice}(
            123,
            1,
            // keccak(bytes("123", "utf-8")).hex()
            hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
            // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
            // SIGNED WITH BACKEND PRIVATE KEY
            hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
        );
    }

    function testVerifyHash() public {
        collection.verifyHash("4242", hex"4eb414e5f218735a9e5b97a6c7e857d97a6a95052baed384e4cc91216e62d1d1");
        vm.expectRevert(IXCommunityNotes.ValueError.selector);
        collection.verifyHash("424", hex"4eb414e5f218735a9e5b97a6c7e857d97a6a95052baed384e4cc91216e62d1d1");
    }

    function testVerifySignature() public view {
        collection.verifySignature(
            // keccak("4242")
            hex"4eb414e5f218735a9e5b97a6c7e857d97a6a95052baed384e4cc91216e62d1d1",
            // sign(keccak(bytes(b'\x19Ethereum Signed Message:\n32' + bytes.fromhex('4eb414e5f218735a9e5b97a6c7e857d97a6a95052baed384e4cc91216e62d1d1'))))
            hex"fabeca823a16f8c83bf368c57395d63712809ae8c0e01a3fe40751d0b5ea0ea1663a0746e4fd273cd727e2ea3d0dafc10272d98ae61cdc868521138fa0d3e7621c"
        );
    }

    function testSetBackend() public {
        vm.prank(owner);
        vm.expectEmit();
        emit NewBackend(backend);
        collection.setBackend(backend);
    }

    function test_setMintPrice() public {
        vm.prank(owner);
        collection.setMintPrice(123);
        assert(collection.mintPrice() == 123);
    }

    function test_setMintPrice_RevertIf_notOwner() public {
        vm.expectRevert(IOwnable.NotOwner.selector);
        vm.prank(recipient);
        collection.setMintPrice(123);
    }
}
