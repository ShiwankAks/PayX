import { Request, Response } from "express";
import prisma from "../config/db.js";

export const checkBalance = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        balance: true,
      },
    });

    const balance = user?.balance?.amount;

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
  try {
  } catch (error) {}
};

export const onRampTransactions = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
