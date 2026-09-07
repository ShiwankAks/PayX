import { Request, Response } from "express";
import axios from "axios";

export const bankTransfer = async (req: Request, res: Response) => {
  try {
    const { transferId, amount, senderId, receiverId } = req.body;
    if (!transferId || !amount || !senderId || !receiverId) {
      throw new Error("Details not found");
    }
    // console.log("Bank received:", req.body);
    await new Promise((resolve)=>{
        setTimeout(resolve, 1000)
    })
    ;
    const response = await axios.post("http://localhost:3000/api/v1/webhook/verify-payment", {
      transferId,
      amount,
      senderId,
      receiverId,
    });

    // console.log("Webhook response:", response.data);
    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "Bank verification failed" });
  }
};
