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

    // *backend public key*
    // use the associated private key
    // to sign token ids to mint for the first time.
    // mandatory to prevent the mint of tokens without associated metadata.
    address public backend = address(0x90bfaBa1671799a249fD2EAb12ff67de59a588ce);

    function setUp() public {
        collection = new FactChain1155(owner, backend);
        vm.deal(recipient, 100 ether);
        vm.deal(other, 100 ether);
    }

    function testMintUnkownToken() public {
        // Should not be able to mint unknown tokens
        // To mint a token for the first time
        // provide a token ID signed by the backend
        vm.expectRevert(IFactChain1155.UnknownToken.selector);
        collection.mint{value: MINT_PRICE}(123, 1);
    }

    function testGetTokenID() public {
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE * 3}(
            424273286,
            3,
            hex"84fac280d097e9c99d8522dd6adb8fcb46d9c1d0798d309b3abfd511d24e43b8",
            hex"4d27fe7200c3628938070a426865303178724b6165088e1de049e4c6a94ba0f73b73ea6636c85494ae5b516c0f1094f51d751738ab0d383ba254c5ade08a99fb1b"
        );
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE * 3}(
            2742163345,
            3,
            hex"a683622ff02d5db7693fc088d7382b73f03bf1656a4cc771f2410e30d521bb87", // keccak(bytes("2742163345", "utf-8")).hex()
            hex"2c07228dcd8c019203a2bbead06a3db9e0ad417fdc1bf82ce8216eba01fff70421aa09a1da9238e93da10da266f4d7824f9a48488a2252652af7485b18197d9d1c"
        );

        uint256 res1 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727169224186167620");
        assertEq(res1, 424273286);
        uint256 res2 = collection.getTokenID("https://twitter.com/i/birdwatch/n/1727720872138391787");
        assertEq(res2, 2742163345);
        vm.expectRevert(IFactChain1155.NoTokenAssociated.selector);
        collection.getTokenID("https://twitter.com/i/birdwatch/n/notMinted");
    }

    function testMintBalanceUpdate() public {
        // Mint 3 tokens of ID 123 for the first time
        // provide signature of "123"
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE * 3}(
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
        assertEq(
            address(collection).balance, MINT_PRICE * 3, "Contract Balance should have been increased by MintPrice"
        );

        uint256 balanceBefore = address(recipient).balance;
        vm.prank(recipient);
        vm.expectEmit();
        // in this test: random supply is alway 29 case because block.timestamp and msg.sender are fixed.
        // see worstRandEver contract function.
        // in this test: we've already minted 3 quantiy of token 123 in the above mint call
        // remaining supply *should be* = 23
        emit Refunded(recipient, (MAX_TOKEN_SUPPLY - 23) * MINT_PRICE);
        collection.mint{value: MINT_PRICE * MAX_TOKEN_SUPPLY}(123, MAX_TOKEN_SUPPLY);
        assertEq(address(recipient).balance, balanceBefore - (23 * MINT_PRICE));
    }

    function testMintSupplyDecrease() public {
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE * 3}(
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
        collection.mint{value: MINT_PRICE * 3}(123, 3);
        uint256 supplyBeforeMint = collection.supply(123);
        collection.mint{value: MINT_PRICE}(123, 1);
        assertEq(collection.supply(123), supplyBeforeMint - 1, "Supply should have been decreased!");
    }

    function testMintSupplyExhausted() public {
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        collection.mint{value: MINT_PRICE * MAX_TOKEN_SUPPLY}(
            123,
            MAX_TOKEN_SUPPLY,
            // keccak(bytes("123", "utf-8")).hex()
            hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
            // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
            hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
        );

        vm.expectRevert(IFactChain1155.SupplyExhausted.selector);
        collection.mint{value: MINT_PRICE}(123, 1);
    }

    function testMintNotAllowed() public {
        vm.prank(owner);
        // set new backend
        // following signatures should be wrong!
        collection.setBackend(address(42));
        // First Mint of token 123
        // needs token hash and backend signature
        vm.prank(recipient);
        vm.expectRevert(IFactChain1155.NotAllowed.selector);
        collection.mint{value: MINT_PRICE}(
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
        vm.expectRevert(IFactChain1155.ValueError.selector);
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

    // function testMintWithAdjustedValue() public {
    //     vm.startPrank(owner);
    //     collection.setTokenSupply(42, 24);
    //     vm.startPrank(other);
    //     vm.expectEmit();
    //     emit MintWithAdjustedValue(42, 24);
    //     // value should be adjusted to 24
    //     collection.mint{value: MINT_PRICE * 26}(
    //         42,
    //         26,
    //         // keccak(bytes("123", "utf-8")).hex()
    //         hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
    //         // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
    //         // SIGNED WITH BACKEND PRIVATE KEY
    //         hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
    //     );
    // }

    // function testMintWithProvidedValue() public {
    //     vm.startPrank(owner);
    //     collection.setTokenSupply(42, 24);
    //     vm.startPrank(other);
    //     vm.expectEmit();

    //     emit MintWithProvidedValue(42, 12);
    //     collection.mint{value: MINT_PRICE * 12}(
    //         42,
    //         12,
    //         // keccak(bytes("123", "utf-8")).hex()
    //         hex"64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107",
    //         // sign(bytes(b'\x19Ethereum Signed Message:\n32' + keccak(bytes("123","utf-8")).hex())
    //         // SIGNED WITH BACKEND PRIVATE KEY
    //         hex"fccfdfb298d4f8ec3e534fe76a074f6aa30c0237a20f6375cf1315f370ab816b5133193ecd9ecc89b3359d8c5cc45660fcb2c32e05712a3a4a00c6c012556a961b"
    //     );
    //     assertEq(collection.supply(42), 12, "Supply should have been decreased by 12!");
    //     vm.expectEmit();
    //     emit MintWithProvidedValue(42, 12);
    //     collection.mint{value: MINT_PRICE * 12}(42, 12);
    //     assertEq(collection.supply(42), SUPPLY_EXHAUSTED, "Supply should be exhausted!");
    // }
}
