import axios from "axios";
import { ethers } from "ethers";
import dotenv from 'dotenv';
import Wallet from "../models/walletAddress";
import Transaction from "../models/transactions";
import { getTransactionInfo, getWalletBalance, usdData } from "./txnHash";

dotenv.config();

const etherScanApiKey=process.env.ETHERSCAN_API_KEY as string;
const etherScanAPI = process.env.ETHERSCAN_API_URL  as string;

export async function getTransactions(address:string) {
  const apiKey = etherScanApiKey;
  const baseUrl = etherScanAPI;
  try {
    const walletFetched = await Wallet.findOne({ address: address });

    if(!walletFetched){
      const response = await axios.get(baseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,      
          endblock: 99999999, 
          sort: 'desc',        
          apikey: apiKey
        }
      });
  
      const transactions = response.data.result;
      let txnArray = [];
      let balance = await getWalletBalance(address);
      console.log(balance);
      let count = 0;
      for(const transaction of transactions){
        console.log(count++,transaction.hash);
        const txnExist = await Transaction.findOne({ txnHash: transaction.hash });
        if(txnExist){
          continue;
        }
        const txn = await getTransactionInfo(transaction.hash);
        txnArray.push(txn);
        await Transaction.create(txn);
        await new Promise(resolve => setTimeout(resolve, 20000));
      }
      await Wallet.create({ address: address,balance:balance,txnCount:203 });
    }else {
      const transactions = await Transaction.find({ $or: [{ from: address }, { to: address }] });
      return transactions;
    }
  } catch (error:any) {
    console.error(`Error fetching transactions: ${error.message}`);
  }
}
