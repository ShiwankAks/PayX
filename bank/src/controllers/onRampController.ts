import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";

export const onRampTransfer = async (req: Request, res: Response) => {
  try {
    const { token, transactionId } = req.body;
    if (!token || !transactionId) {
      throw new Error("Invalid Request");
    }
    const message = JSON.stringify({
      token,
      transactionId,
    });

    const signature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET!)
      .update(message)
      .digest("hex");
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });


    const resp = await axios.post(
      `${process.env.BACKEND_URL}/webhook/verify-payment-bank`,
      {
        token,
        transactionId,
      },
      {
        headers: {
          "Webhook-Signature": signature,
        },
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
