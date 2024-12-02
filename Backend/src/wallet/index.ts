// Initialize Web3 with NeoX RPC URL
import Web3 from "web3"; 
import createHash from "create-hash";
import { abi } from "./abi";
import dotenv from "dotenv";

const rpcUrl = 'https://mainnet-2.rpc.banelabs.org'; // Replace with NeoX RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
const contractAddress = "0xEf486A477c2C7C0059bF38Ad1D6ec289BDECc07D";
dotenv.config();
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

export async function getBalanceInTokens(address:string) {
  try {
      const balanceWei = await web3.eth.getBalance(address); // Get balance in wei
      const balanceEther = web3.utils.fromWei(balanceWei, 'ether'); // Convert wei to ether
      const balanceAsNumber = parseFloat(balanceEther); // Convert to a number for database storage
      return balanceAsNumber;
  } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
  }
}


const contract = new web3.eth.Contract(abi, contractAddress);

export async function transferTokensToUser(recipient: string, amount: string) {
    try {
        // Get the sender's address from the private key
        const amountInWei = web3.utils.toWei(amount, "ether");
        console.log("amount: ", amountInWei)
        const gasPrice = await web3.eth.getGasPrice()
        // Prepare the transaction data
        const gasEstimate = await contract.methods.sendEther(recipient, amountInWei).estimateGas({
          from: "0x1FC0Cae5752d7CbD6e3875Ac348A840c87F8202a",
          value: amountInWei
      });
      const tx = {
          from: "0x1FC0Cae5752d7CbD6e3875Ac348A840c87F8202a",
          to: contractAddress,
          gas: gasEstimate,
          gasPrice: gasPrice,
          value: amountInWei,
          data: contract.methods.sendEther(recipient, amountInWei).encodeABI()
      };
      let privateKey = process.env.CONTRACT_PRIVATE_KEY as string;
      console.log("Transaction Details:", tx,privateKey);
      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      console.log("Signed Transaction:", signedTx);
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

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
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (error) {
      console.error("An error occurred during the transaction:", error);
      throw error;
    }
}
