import Web3 from "web3";
import createHash from "create-hash";
// Initialize Web3 with NeoX RPC URL
const rpcUrl = 'https://testnet.rpc.banelabs.org'; // Replace with NeoX RPC URL
const web3 = new Web3(rpcUrl); // Updated initialization

/**
 * Create a wallet based on Telegram chat ID and a secret key.
 * @param {string} chatId - The Telegram chat ID.
 * @param {string} secretKey - A user-provided secret key.
 * @returns {object} The wallet object with address and private key.
 */
export function createWallet(chatId:any) {
    const telegramId = chatId.toString();
    const secretKey = 'varun';
  
    // Generate a deterministic private key using chat ID and secret key
    const source = telegramId + secretKey;
    const privateKeyBuffer = createHash("sha256")
        .update(source)
        .digest()
        .slice(0, 32);
    
    // Convert the Buffer to a hexadecimal string
    const privateKeyHex = privateKeyBuffer.toString('hex');
    // Create the wallet from the deterministic private key
    const wallet = web3.eth.accounts.privateKeyToAccount(privateKeyHex);
    // Return wallet details
    return wallet;
}