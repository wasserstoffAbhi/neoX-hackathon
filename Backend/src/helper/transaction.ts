import Web3 from "web3";

// Replace with your provider (local or external)
const web3 = new Web3("https://testnet.rpc.banelabs.org"); // Update this to Infura/Alchemy URL if needed

const contractAddress = "0x3BdaDa86C5C050E19462FcB4C63949583086Ca0a";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EtherReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EtherSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EtherWithdrawn",
		"type": "event"
	},
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
		"name": "sendEther",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contract = new web3.eth.Contract(abi, contractAddress);

export async function transferTokens(recipient: string, amount: string, privateKey: string) {
    try {
        // Get the sender's address from the private key
   
        console.log("amount: ", amount)
        const gasPrice = await web3.eth.getGasPrice()
        // Prepare the transaction data
        const tx = {
            from: "0x5d0037F32Ec69BbE45ae1Eb83fDE378B360D3a78",
            privateKey: privateKey,
            to: contractAddress,
            gas: 21584, // Set a reasonable gas limit
            gasPrice,
            value: web3.utils.toWei(amount, "ether"), // Convert amount to wei
            data: contract.methods.sendEther(recipient, amount).encodeABI() // Encode function data
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        return receipt;
    } catch (error) {
        console.error("An error occurred during the transaction:", error);
    }
}
