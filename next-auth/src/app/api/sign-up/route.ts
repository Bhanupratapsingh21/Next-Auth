import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermodel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserByEmail = await UserModel.findOne({ email });

        if (existingUserByEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User Already Exists With This Email"
                },
                {
                    status: 400
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email."
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.log("Error While Registering User", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error While Registering User"
            },
            {
                status: 500
            }
        );
    }
}
