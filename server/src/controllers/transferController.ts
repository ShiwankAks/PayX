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
        email: true,
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
    const receiverId = Number(req.body.receiverId);

    if (userId === receiverId) {
        throw new Error("Cannot transfer to yourself");
      }

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

      const receiver = await txn.balance.findUnique({
        where: {
          userId: receiverId,
        },
      });
      if (!receiver) {
        throw new Error("Receiver not found");
      }

      
      if (value > senderBalance) throw new Error("insufficient balance");

      await txn.balance.update({
        where: {
          userId: userId,
        },
        data: {
          amount: senderBalance - value,
          locked: sender.locked + value,
        },
      });

      await txn.balance.update({
        where: {
          userId: receiverId,
        },
        data: {
          amount: receiver.amount + value,
        },
      });

      await txn.balance.update({
        where: {
          userId: userId,
        },
        data: {
          locked: sender.locked - value,
        },
      });

      const newTransfer = await txn.transfer.create({
        data: {
          amount: value,
          status: "Success",
          senderId: userId,
          receiverId: receiverId,
        },
      });
      return newTransfer;
    });

    return res
      .status(200)
      .json({ success: true, transfer, message: "Transfer successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Transfer failed" });
  }
};

export const transferHistory = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const userId = Number(req.user?.id);
    const history = await prisma.transfer.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit ? { take: Number(limit) } : {}),
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
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
