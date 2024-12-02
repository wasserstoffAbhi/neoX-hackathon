import { NextFunction, Request, Response } from "express";
import User from "../models/userSchema";

// get the req,res,next and also new Argument from which function middleware is called
export const hasValidAmount = (funcName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.body;
      
      // Check if the user exists
      const user = await User.findOne({ chatId });
      if (!user) {
        return res.status(400).json({ message: "Invalid chatId" });
      }

      // Define the function map
      const functionMap: Record<string, number> = {
        fillWallet: 0.1,
        queryWallet: 0.001,
        fillTransaction: 0.01,
        queryTransaction: 0.0001,
      };

      // Check if the function exists in the map
      if (!(funcName in functionMap)) {
        return res.status(400).json({ message: "Invalid function name" });
      }

      // Check if the user has sufficient tokens
      if (user.token < functionMap[funcName]) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      user.token -= functionMap[funcName];
      await user.save();
      // If everything is valid, call the next middleware
      next();
    } catch (error) {
      console.error("Error in hasValidAmount middleware:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};
