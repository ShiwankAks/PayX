import { Request, Response } from "express";
import prisma from "../config/db.js";

export const verifyPayment = async (req: Request, res: Response) => {
  const { transferId, amount, senderId, receiverId } = req.body;

  try {
    await prisma.$transaction(async (txn) => {
      const sender = await txn.balance.findUnique({
        where: {
          userId: senderId,
        },
      });
      if (!sender) {
        throw new Error("Sender not found");
      }

      await txn.balance.update({
        where: {
          userId: senderId,
        },
        data: {
          locked: sender.locked - amount,
        },
      });

      const receiver = await txn.balance.findUnique({
        where: {
          userId: receiverId,
        },
      });

      if (!receiver) {
        throw new Error("Sender not found");
      }

      await txn.balance.update({
        where: {
          userId: receiverId,
        },
        data: {
          amount: receiver.amount + amount,
        },
      });

      const transfer = await txn.transfer.update({
        where: {
          id: transferId,
        },
        data: {
          status: "Success",
        },
      });
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment successfull" });
  } catch (error) {
    console.log(error);
    await prisma.transfer.update({
      where: {
        id: transferId,
      },
      data: {
        status: "Failed",
      },
    });
    return res
      .status(400)
      .json({ success: false, message: "Bank could not verify your payment" });
  }
};

export const verifyPaymentbank = async (req: Request, res: Response) => {
  const { token, transactionId } = req.body;

  let transaction;
  try {
    await prisma.$transaction(async (txn) => {
      transaction = await txn.onRampTransaction.findUnique({
        where: {
          token,
        },
      });
      if (!transaction) {
        throw new Error("Transaction failed");
      }
      if (transactionId != transaction.id) {
        throw new Error("Invalid Transaction");
      }
      const userId = transaction.userId;
      const userBalance = await txn.balance.findUnique({
        where: {
          userId,
        },
      });
      if (!userBalance) {
        throw new Error("User not found");
      }
      if (transaction.status == "Processing") {
        await txn.balance.update({
          where: {
            userId: userId,
          },
          data: {
            amount: userBalance.amount + transaction.amount,
          },
        });

        await txn.onRampTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Success",
          },
        });
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment successfull" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Bank could not verify your payment" });
  }
};
