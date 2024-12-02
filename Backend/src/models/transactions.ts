import mongoose, { Schema, Document } from 'mongoose';

const transactionSchema = new mongoose.Schema({
  txnHash: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  transactionType: { type: String, required: true },
  value: { type: String, required: true }, // Store as string to accommodate large values
  tokenValueInUSD: { type: Number, required: true }, // Assuming it's a numeric value
  gasPrice: { type: String, required: true }, // Store as string to accommodate large values
  gasUsed: { type: String, required: true }, // Store as string to accommodate large values
  blockNumber: { type: Number, required: true },
  blockTimestamp: { type: String, required: true }, // Assuming formattedDate is a date
  status: { type: String, enum: ['Success', 'Failure'], required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
