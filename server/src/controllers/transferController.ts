import { Request, Response } from "express";
import prisma from "../config/db.js";
import axios from "axios";

export const findReciever = async (req: Request, res: Response) => {
  try {
    const senderId = Number(req.user?.id);
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: senderId,
        },
      },
      select: {
        id: true,
        username: true,
        phone: true,
      },
    });

    return res
      .status(200)
      .json({ success: true, users, message: "Users fetched" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: "Users not found" });
  }
};

export const transferBalance = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const receiverId = Number(req.params.receiverId);

    const { value } = req.body;

    const transfer = await prisma.$transaction(async (txn) => {
      const sender = await txn.balance.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!sender) {
        throw new Error("Please Login");
      }
      const senderBalance = sender.amount;

      //   if (!senderBalance) {
      //     throw new Error("Balance not found");
      //   }
      if (value > senderBalance) {
        throw new Error("insufficient balance");
      }
      // console.log("before transaction start"+sender.locked)
      await txn.balance.update({
        where: {
          userId: userId,
        },
        data: {
          amount: senderBalance - value,
          locked: sender.locked + value,
        },
      });
      // console.log("after locking"+sender.locked)

      const receiver = await txn.balance.findUnique({
        where: {
          userId: receiverId,
        },
      });
      if (!receiver) {
        throw new Error("Receiver not found");
      }

      const transfer = await txn.transfer.create({
        data: {
          amount: value,
          senderId: userId,
          receiverId: receiverId,
          status: "Processing",
        },
      });

      // console.log("Transfer created:", transfer);
      return transfer;
    });

    await axios.post("http://localhost:3001/api/transfer", {
      transferId: transfer.id,
      amount: value,
      senderId: userId,
      receiverId: receiverId,
    });

    return res
      .status(200)
      .json({ success: true, message: "Transfer successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Transfer failed" });
  }
};

export const transferHistory = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const history = await prisma.transfer.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
    return res
      .status(200)
      .json({ success: true, history, message: "Transactions fetched" });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ success: false, message: "could not fetch transfer history" });
  }
};
