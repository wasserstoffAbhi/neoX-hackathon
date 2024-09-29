import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  balance: { type: String, required: true },
  txnCount : { type: Number, required: true }
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
