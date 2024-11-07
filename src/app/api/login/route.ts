import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoClientPromise from "@/lib/mongodb";
import { dbName } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        if (!username || !password) {
            return NextResponse.json({ message: "Username and password required" }, { status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (!existingUser) {
            return NextResponse.json({ message: "User does not exist" }, { status: 401 });
        }

        /*
        console.log("Password input:", password);
        console.log("Stored hashed password:", existingUser.password);
        bcrypt.hash('test', 10, (err, hash) => {
            console.log(hash);
        });
         */

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                id: existingUser.id,
                username: existingUser.username,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const user = {
            username: existingUser.username,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        };

        const response = NextResponse.json({ message: "User logged in", user });
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: false, // change this in production
            maxAge: 60 * 60,
            path: "/",
            sameSite: "strict",
        });

        return response;

    } catch (error) {
        console.error("Error during login", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}