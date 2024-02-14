//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155URIStorageUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {Arrays} from "openzeppelin-contracts/contracts/utils/Arrays.sol";

interface IFactchainSFTEvents {
    event FactchainNFTContractUpdated(address factchainNFTContract);
    event FactchainBuildersRewarded(uint256 amount);
    event CreatorRewarded(address creator, uint256 amount);
}

interface IFactchainSFT is IFactchainSFTEvents {
    // Errors
    error SupplyExhausted();
    error ValueError();
    error BadMintPrice();
    error NegativeBalance();
    error FailedToReward();
    error ReservedToFactchain();
}

contract FactchainSFT is OwnableUpgradeable, ERC1155URIStorageUpgradeable, UUPSUpgradeable, IFactchainSFT {
    address public FACTCHAIN_NFT_CONTRACT;
    uint256 public constant FACTCHAINERS_MINT_SUPPLY = 42;
    uint256 public mintPrice;

    mapping(uint256 => uint256) public supply;

    /// @notice Mapping of creators's addresses to NFT
    mapping(uint256 => address) private _creatorsNFT;

    using Arrays for address[];

    // disable contract until initialization
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner) public initializer {
        __ERC1155_init("https://gateway.pinata.cloud/ipfs/");
        __ERC1155URIStorage_init();
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        mintPrice = 1_000_000_000_000_000;
        _setBaseURI("https://gateway.pinata.cloud/ipfs/");
    }

    function _authorizeUpgrade(address /* newImplementation */ ) internal view override onlyOwner {}

    function setFactchainNFTContract(address _factchainNFTContract) public onlyOwner {
        FACTCHAIN_NFT_CONTRACT = _factchainNFTContract;
        emit FactchainNFTContractUpdated(_factchainNFTContract);
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function initialMint(address creator, address[] memory raters, string memory ipfsHash, uint256 id)
        public
        returns (uint256)
    {
        if (msg.sender != FACTCHAIN_NFT_CONTRACT) {
            revert ReservedToFactchain();
        }
        supply[id] = FACTCHAINERS_MINT_SUPPLY;
        _creatorsNFT[id] = creator;
        _setURI(id, ipfsHash);
        for (uint256 i = 0; i < raters.length; ++i) {
            _mint(raters.unsafeMemoryAccess(i), id, 1, "");
        }
        return id;
    }

    function mint(uint256 id, uint256 value) external payable {
        if (msg.value != mintPrice * value) revert BadMintPrice();
        if (value <= 0) revert ValueError();
        if (value > supply[id]) {
            revert SupplyExhausted();
        }
        supply[id] -= value;
        address creator = _creatorsNFT[id];
        uint256 reward = msg.value / 2;
        (bool result,) = payable(creator).call{value: reward}("");
        if (!result) revert FailedToReward();
        emit FactchainBuildersRewarded(reward);
        emit CreatorRewarded(creator, reward);
        _mint(msg.sender, id, value, "");
    }
}
