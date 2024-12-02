// Initialize Web3 with NeoX RPC URL
import Web3 from "web3"; 
import createHash from "create-hash";
import { abi } from "./abi";

const rpcUrl = 'https://testnet.rpc.banelabs.org'; // Replace with NeoX RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
const contractAddress = "0x3BdaDa86C5C050E19462FcB4C63949583086Ca0a";

/**
 * Create a wallet based on Telegram chat ID and a secret key.
 * @param {string} chatId - The Telegram chat ID.
 * @param {string} secretKey - A user-provided secret key.
 * @returns {object} The wallet object with address and private key.
 */
export function createWallet(chatId:any) {
  
  const telegramId=chatId.toString()
  //  console.log(telegramId)
  const secretKey='abhishekGarg'
  // Generate a deterministic private key using chat ID and secret key
  const source = telegramId +secretKey;
  const privateKey = createHash("sha256")
    .update(source)
    .digest()
    .slice(0,32)

  // Create the wallet from the deterministic private key
  const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
  
  return wallet;
}


const contract = new web3.eth.Contract(abi, contractAddress);

export async function transferTokens(recipient: string, amount: string, privateKey: string) {
    try {
        // Get the sender's address from the private key
   
        console.log("amount: ", amount)
        const gasPrice = await web3.eth.getGasPrice()
        // Prepare the transaction data
        const gasEstimate = await contract.methods.sendEther(recipient, amount).estimateGas({
          from: "0x5d0037F32Ec69BbE45ae1Eb83fDE378B360D3a78",
          value: amount
      });
        const tx = {
          from: "0x5d0037F32Ec69BbE45ae1Eb83fDE378B360D3a78",
          to: contractAddress,
          gas: gasEstimate,
          gasPrice: gasPrice,
          value: amount,
          data: contract.methods.sendEther(recipient, amount).encodeABI()
      };
        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;
    } catch (error) {
        console.error("An error occurred during the transaction:", error);
    }
}

export async function transferTokensToContract(from:any, amount:any, privateKey:any) {
  try {
      // Convert amount to Wei
      const amountInWei = web3.utils.toWei(amount, "ether");

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();

      // Estimate gas required for the transaction
      const gasEstimate = await web3.eth.estimateGas({
          from: from,
          to: contractAddress,
          value: amountInWei,
      });

      // Prepare the transaction data
      const tx = {
          from: from,
          to: contractAddress,
          value: amountInWei,
          gas: gasEstimate,
          gasPrice: gasPrice,
      };

      console.log("Transaction Details:", tx);

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

      // Send the signed transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log("Transaction Successful:", receipt);

      return receipt;
  } catch (error) {
      console.error("An error occurred during the transaction:", error);
      throw error;
    }
}

// createWallet()