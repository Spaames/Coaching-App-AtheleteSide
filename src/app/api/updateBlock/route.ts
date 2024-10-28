import { NextResponse, NextRequest} from "next/server";
import mongoClientPromise from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    try {
        const updatedBlock = await req.json();
        console.log(updatedBlock);

        if (!updatedBlock) {
            return NextResponse.json({ message: "Invalid Block Data" }, {status: 400});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerProd");
        const collection = db.collection("blocks");

        const filter = {id: updatedBlock.id};

        const updateDoc = {
            $set: {
                exercises: updatedBlock.exercises,
            }
        };

        const result = await collection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Block not found" }, {status: 404});
        }

        return NextResponse.json({ message: "Block updated" }, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to save Block", status: 500 });
    }
}