import { Request, Response } from "express";
import prisma from "../config/db.js";


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
      if (transactionId !== transaction.id) {
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
