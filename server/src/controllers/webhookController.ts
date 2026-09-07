import { Request, Response } from "express";
import prisma from "../config/db.js";

export const verifyPayment = async (req: Request, res: Response) => {
  const { transferId, amount, senderId, receiverId } = req.body;
//   console.log("Webhook received:", req.body);
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
        // console.log("before unlocking "+sender.locked)

      await txn.balance.update({
        where: {
          userId: senderId,
        },
        data: {
          locked: sender.locked - amount,
        },
      });
// console.log("after unlocking "+sender.locked)
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
    //   console.log("Transfer completed:", transfer);
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
