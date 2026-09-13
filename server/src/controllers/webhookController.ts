import { Request, Response } from "express";
import prisma from "../config/db.js";
import crypto from "crypto";
import { webhookSchema } from "../validation/webhook.schema.js";

export const verifyPaymentbank = async (req: Request, res: Response) => {
  
  const result = webhookSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid details" });
  }

  const { token, transactionId } = result.data;

  const receivedSignature = req.headers["webhook-signature"];

  if (typeof receivedSignature !== "string") {
    return res.status(400).json({ message: "Invalid signature" });
  }
  const message = JSON.stringify({ token, transactionId });
  const expectedSignature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(message)
    .digest("hex");

  const received = Buffer.from(receivedSignature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) {
    return res.status(400).json({ message: "currupt signature" });
  }

  if (!crypto.timingSafeEqual(received, expected)) {
    return res.status(400).json({ message: "currupt signature" });
  }

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
