import { Request, response, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import url from "node:url"
import User from "../models/userSchema";
import { finalChain, neoXRag, transactionDetails } from "../service/Agent";
import { getTransactions } from "../service/walletAdd";
import Transaction from "../models/transactions";
import { queryFilter,extractAndParseJSON } from "../helper";
import { getTransactionInfo } from "../service/txnHash";

let txnObj:any = {
}

export class Users {
    
  static userdetails = async (req: Request, res: Response) => {
    try {
      const chatId = req.body.chatId
      console.log(chatId)
      const user = await User.findOne({ chatId: chatId });
      console.log(user)
      console.log(user?.points)
      res.status(200).send({points: user?.points || null});
    } 
    catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  }


  static updatePoints = async(req:Request,res:Response)=>{
    const { chatId, points } = req.body
    console.log(chatId, points,"..............")
    try {
      const user = await User.findOneAndUpdate(
        { chatId },
        { $set: { points : points } },
        { new: true }
      );

      if((points % 1000 ) == 0){
        // send The Transaction to user
        await User.findOneAndUpdate(
          { chatId },
          { $inc: { token:  0.001} },
          { new: true }
          );
      }
      res.status(200).json({ message: "Points updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update points", error });
    }
  }


  static getTransaction = async(res:Response,req:Request)=>{
    const { hash,chatId } = req.body;
    try {
      const transaction = await getTransactionInfo(hash);
      if(!transaction) return res.status(200).send({message:"Transaction not found. Please try Again",data: null});
      txnObj[chatId] = transaction;
      const txnSummary = await transactionDetails(hash,[],JSON.stringify(transaction));
      console.log(txnSummary)
      res.status(200).send({ message:"Transaction Found",data: {detail:transaction,explanation:txnSummary}});
    } catch (error) { 
      res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
    }
  }


  static getTransactionMsg = async(req:Request,res:Response)=>{
    const { message, history, chatId } = req.body;
    const hash = ""
    try {
      const transaction = await transactionDetails(message,history,JSON.stringify(txnObj[chatId]));
      res.status(200).send({ message:"Transaction Found",data: transaction});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
    }
  }


  static getNeox = async(res:Response,req:Request)=>{
    const { message, history } = req.body;
    try {
      const neox = await neoXRag(message,history);
      res.status(200).send({ message:"NeoX Found",data: neox});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NeoX. Please Try Again", data:null });
    }
  }


  static fillWallet = async(res:Response,req:Request)=>{
    const { walletAddress } = req.body;
    try {
      const transaction = await getTransactions("0x8697477f54897ACADD7673B7c325ac31bd7F080d");
      res.status(200).send({ message:"Transaction Found",data: "Wallet Has been synced with RPC. You can now query the wallet"});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
    }
  }


  static queryWallet = async(res:Response,req:Request)=>{
    const { message } = req.body;
    try {
      const query:any = await finalChain(message,[]);
      console.log(query)
      const jsonObj = extractAndParseJSON(query);
      console.log(jsonObj)
      if(jsonObj){
        const query = queryFilter(jsonObj);
        try {
          let qStr = JSON.stringify(query);
          console.log(qStr)
          const transactions = await Transaction.find(query);
          return res.status(200).send({ message:"Transactions Found",data: transactions});
        } catch (error:any) {
          throw new Error(error);
        }
      }
      else {
        return res.status(200).send({ message:"Error Parsing the Message please try again",data: null});
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Failed to fetch transactions. Please Try Again", data:null });
    }
  }

}