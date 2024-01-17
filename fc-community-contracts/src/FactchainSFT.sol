//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "./utils/Ownable.sol";

import {Arrays} from "openzeppelin-contracts/contracts/utils/Arrays.sol";

interface IFactChainSFTEvents {
    event FactchainMainContractUpdated(address FACTCHAIN_NFT_CONTRACT);
    event FactchainBuildersRewarded(uint256 amount);
    event CreatorRewarded(address creator, uint256 amount);
}

interface IFactChainSFT is IFactChainSFTEvents {
    // Errors
    error SupplyExhausted();
    error ValueError();
    error BadMintPrice();
    error NegativeBalance();
    error FailedToReward();
    error ReservedToFactChain();
}

contract FactChainSFT is Ownable, ERC1155, IFactChainSFT {
    address FACTCHAIN_NFT_CONTRACT;
    uint256 public constant FACTCHAINERS_MINT_SUPPLY = 42;
    uint256 public constant MINT_PRICE = 1_000_000;

    mapping(uint256 id => string ipfsHash) private _metadata;
    mapping(uint256 id => uint256) private _supply;

    using Arrays for address[];

    constructor(address _owner, address _factchainMainContract)
        Ownable(_owner)
        ERC1155("https://gateway.pinata.cloud/ipfs/")
    {
        FACTCHAIN_NFT_CONTRACT = _factchainMainContract;
    }

    function setFactchainMainContract(address _factchainMainContract) public onlyOwner {
        FACTCHAIN_NFT_CONTRACT = _factchainMainContract;
        emit FactchainMainContractUpdated(_factchainMainContract);
    }

    function mint(address[] memory raters, string memory ipfsHash, uint256 id) public returns (uint256) {
        if (msg.sender != FACTCHAIN_NFT_CONTRACT) {
            revert ReservedToFactChain();
        }
        _supply[id] = FACTCHAINERS_MINT_SUPPLY;
        _metadata[id] = ipfsHash;
        for (uint256 i = 0; i < raters.length; ++i) {
            _mint(raters.unsafeMemoryAccess(i), id, 1, "");
        }
        return id;
    }

    function mint(uint256 id, uint256 value, address creator) external payable {
        if (msg.value != MINT_PRICE * value) revert BadMintPrice();
        if (value <= 0) revert ValueError();
        if (value > _supply[id]) {
            revert SupplyExhausted();
        }
        _supply[id] -= value;
        uint256 reward = msg.value / 2;
        (bool result,) = payable(creator).call{value: reward}("");
        if (!result) revert FailedToReward();
        emit FactchainBuildersRewarded(reward);
        emit CreatorRewarded(creator, reward);
        _mint(msg.sender, id, value, "");
    }

    function uri(uint256 id) public view virtual override returns (string memory) {
        return string.concat(_uri, _metadata[id]);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Ownable) returns (bool) {
        // https://docs.soliditylang.org/en/develop/contracts.html#multiple-inheritance-and-linearization
        // Solidity uses C3 linearization (like Python) but MRO is from right to left (unlike Python)
        // We rewrite the Ownbale supportInterface check first to have it included in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }
}
