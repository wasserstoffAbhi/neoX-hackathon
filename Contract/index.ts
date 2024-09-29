const abi = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferEther",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "getEtherBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// solidity code 

// SPDX-License-Identifier: MIT
/*pragma solidity ^0.8.0;

contract TransferContract {
    // Function to transfer Ether from the contract to the recipient's wallet address
    function transferEther(address payable recipient, uint256 amount) external {
        require(address(this).balance >= amount, "Insufficient Ether balance in contract");
        require(recipient != address(0), "Invalid recipient address");

        // Transfer the Ether
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Ether transfer failed.");
    }

    // Function to check the contract's Ether balance
    function getEtherBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to allow the contract to receive Ether
    receive() external payable {
        // This allows the contract to accept Ether
    }
}*/



const contractAddress = "0xA346B20600Df856AF2142dd7d60eeA89140e954F"
