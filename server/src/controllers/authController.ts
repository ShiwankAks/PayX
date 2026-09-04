import { Request, Response } from "express";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response) => {
  try {
    const { email, phone, username, password } = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            phone: phone,
          },
        ],
      },
    });
    if (userExist) {
      return res.json({
        status: 409,
        message: "Email or phone number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        balance: {
          create: {
            amount: 10000000,
            locked: 0,
          },
        },
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        balance: true,
      },
    });

    return res.status(201).json({
      success: true,
      newUser,
      message: "Account Created successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while creating new account" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        phone: phone,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "10d" },
    );

    return res.status(200).json({
      success: true,
      token,
      message: "Login Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while Logging In" });
  }
};

export { signup, login };
