import { Request, Response } from "express";
import prisma from "../config/db.js";
import axios from "axios";
import crypto from "crypto";

export const checkBalance = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Unauthorized access");
    }
    const userId = Number(req.user.id);
    

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        balance: true,
      },
    });

    if (!user || !user.balance) {
      throw new Error("User/balance not found")
    }
    const balance = user.balance.amount;

    return res
      .status(200)
      .json({ success: true, balance, message: "Balance Fetched" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Balance fetch failed" });
  }
};

export const addMoney = async (req: Request, res: Response) => {
  let transactionId 
  try {
    const { amount, provider } = req.body;
    const token = crypto.randomBytes(32).toString("hex");

    if (req.user == undefined) {
      throw new Error("Unauthorized");
    }

    const userId = Number(req.user.id);

    const transaction = await prisma.onRampTransaction.create({
      data: {
        userId: userId,
        amount,
        provider,
        status: "Processing",
        startTime: new Date(),
        token,
      },
    });
    transactionId = transaction.id;
    let details;
    try {
      details = await axios.post("http://localhost:3001/api/b2p/transfer-bank", {
        transactionId: transactionId,
        token,
        amount
      });
    } catch (error) {
      console.log(error);
      await prisma.onRampTransaction.update({
        where: {
          id: transactionId,
        },
        data: {
          status: "Failure",
        },
      });
      return res
        .status(400)
        .json({ success: false, message: "Transaction failed" });
    }

    const response = details.data
    return res
      .status(200)
      .json({ success: true, message: "Transaction initiated", response });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Transaction failed" });
  }
};

export const onRampTransactions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("Unauthorized")
    }
    const userId = Number(req.user.id)
    const transactions = await prisma.onRampTransaction.findMany({
      where:{
        userId
      }
    })
    return res.status(200).json({success:true, message:"On-Ramp transactions fetched",transactions})
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "On-Ramp transactions fetch failed" });
  }
};
