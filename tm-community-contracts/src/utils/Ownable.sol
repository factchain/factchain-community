//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.19;

interface IOwnableEvents {
    /// @dev This emits when ownership of a contract changes.
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
}

interface IOwnable is IOwnableEvents {
    /// Errors
    error NotOwner();
}

/// There are multiple extensions from OpenZepplin, 0x, etc. that we could use.
/// But since Ownable is rather simple to implement, I wanted to do it myself once.
contract Ownable is IOwnable {
    address public owner;

    /// @notice Instantiate a new contract and set its owner
    /// @param _owner New owner of the contract
    constructor(address _owner)
    {
        owner = _owner;
        emit OwnershipTransferred({
            previousOwner: address(0),
            newOwner: owner
        });
    }

    /// @notice Query if a contract implements an interface
    /// @param interfaceId The interface identifier, as specified in ERC-165
    /// @return bool `true` if the contract implements `interfaceId` and
    ///  `interfaceId` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == 0x7f5828d0; // ERC165 Interface ID for ERC173
    }

    /// @notice Modifier to enforce ownership control
    modifier onlyOwner {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /// @notice Set the address of the new owner of the contract
    /// @dev Set _newOwner to address(0) to renounce any ownership.
    /// @param _newOwner The address of the new owner of the contract
    function transferOwnership(address _newOwner) external onlyOwner {
        address previousOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred({
            previousOwner: previousOwner,
            newOwner: owner
        });
    }
}