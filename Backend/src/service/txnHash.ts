import axios from "axios";
import { ethers } from "ethers";
import dotenv from 'dotenv';

dotenv.config();

const rpcUrl = process.env.ETHER_RPC_URL || '';
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const functionSignatures:any= {
    '0xa9059cbb': 'transfer(address,uint256)',   
    '0x095ea7b3': 'approve(address,uint256)',  
    '0x23b872dd': 'transferFrom(address,address,uint256)', 
    '0x40c10f19': 'mint(address,uint256)',       
    '0x': 'transfer ETH'        

};

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

// export const transferAmount = async(walletAddress:string,amount:string)=>{
//     try {
//         console.log(amount)
//         const provider = new ethers.providers.JsonRpcProvider(process.env.NEO_RPC_URL as string);
//         const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
//         const contract = new ethers.Contract("0xA346B20600Df856AF2142dd7d60eeA89140e954F", abi, wallet);
//         const contractRes = await contract.transferEther(walletAddress, ethers.utils.parseUnits(amount, '18'));
//         console.log(contractRes)

//     } catch (error:any) {
//         throw new Error(error);
//     }
// }

export const transferAmount = async(walletAddress: string, amount: string) => {
    try {
        console.log(amount);

        const provider = new ethers.providers.JsonRpcProvider(process.env.NEO_RPC_URL as string);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
        const contract = new ethers.Contract("0xA346B20600Df856AF2142dd7d60eeA89140e954F", abi, wallet);

        // Define the gas settings
        const gasLimit = 100000; // Set the gas limit (you can adjust this based on your contract's requirements)
        const gasTipCap = ethers.utils.parseUnits('20', 'gwei'); // Minimum gas tip required
        const gasFeeCap = ethers.utils.parseUnits('42', 'gwei'); // Ensure gas fee cap is high enough

        // Execute the transaction with gas settings
        const contractRes = await contract.transferEther(walletAddress, ethers.utils.parseUnits(amount, '18'), {
            gasLimit,             // Gas limit for the transaction
            maxPriorityFeePerGas: gasTipCap,  // Gas tip cap (maxPriorityFeePerGas in EIP-1559 transactions)
            maxFeePerGas: gasFeeCap           // Gas fee cap (maxFeePerGas in EIP-1559 transactions)
        });

        console.log(contractRes);

    } catch (error: any) {
        throw new Error(error.message || error);
    }
};

export async function usdData(ids: string, time: string): Promise<string> {
    try {
        const currencies = 'usd';
        const url = new URL(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currencies}&date=${time}`);
        const convUSD = await axios.get(url.toString(), { timeout: 2000 });
        const prices = convUSD.data;
        return JSON.stringify(prices); 
    } catch (error) {
        console.error('Error retrieving prices:', error);
        return "Error retrieving prices";
    }
}

export const getWalletBalance = async (address: string): Promise<number> => {
    try {
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.utils.formatEther(balance));
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
    }
}

export async function getTransactionInfo(transactionHash: string): Promise<any | null> {
    try {
        const tx = await provider.getTransaction(transactionHash);
        if (!tx) {
            console.error('Transaction not found');
            return null;
        }
        const inputData = tx.data;
        if(!inputData) throw new Error('No input data found');
        const functionSelector = inputData.slice(0, 10);
        const functionType:any = functionSignatures[functionSelector] || 'Unknown function';
        const receipt = await provider.getTransactionReceipt(transactionHash);
        if (!receipt) {
            console.error('Transaction receipt not found');
            return null;
        }
        const block = await provider.getBlock(receipt.blockNumber);
        if (!block) {
            console.error('Block not found');
            return null;
        }

        const date = new Date(block.timestamp * 1000);
        const formattedDate = date.toLocaleString();

        const ids = 'ethereum,neo'; 
        const tokenValueInUSD :string = await usdData(ids, date.toLocaleDateString());
        const valueInUSD:number= parseFloat(JSON.parse(tokenValueInUSD).ethereum.usd) * parseFloat(ethers.utils.formatEther(tx.value));
        const content = {
            txnHash: tx.hash,
            from: tx.from,
            to: receipt.to,
            transactionType: functionType,
            value: ethers.utils.formatEther(tx.value),
            tokenValueInUSD: valueInUSD,
            gasPrice: ethers.utils.formatUnits(tx.gasPrice || 0, 'gwei'),
            gasUsed: receipt.gasUsed.toString(),
            blockNumber: receipt.blockNumber,
            blockTimestamp: formattedDate,
            status: receipt.status === 1 ? 'Success' : 'Failure',
        };
        return content;
    } catch (error:any) {
        console.error('Error fetching transaction information:', error["stack"]);
        return null;
    }
}