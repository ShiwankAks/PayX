import { Request, Response } from "express";
import axios from "axios";

export const onRampTransfer = async (req: Request, res: Response) => {
  try {
    const { token, transactionId } = req.body;
    if (!token || !transactionId) {
      throw new Error("Invalid Request");
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const resp = await axios.post(
      `${process.env.BACKEND_URL}/webhook/verify-payment-bank`,
      {
        token,
        transactionId,
      },
    );
    const response = resp.data;
    return res
      .status(200)
      .json({ success: true, message: "Verified", response });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Bank verification failed" });
  }
};
