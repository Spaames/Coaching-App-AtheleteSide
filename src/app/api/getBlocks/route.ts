import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { athlete } = await req.json();
        if (!athlete) {
            return NextResponse.json({ message: "athlete is required" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db("rmManagerProd");
        const collection = db.collection("blocks");

        const fetchList = collection.find(
            { athlete: athlete.toString() }
        ).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No blocks for this user " + athlete });
        }

        const blockList = (await fetchList).map(item => ({
            id: item.id,
            name: item.name,
            start: item.start,
            end: item.end,
            exercises: item.exercises,
        }));

        return NextResponse.json({ message: "blocks for this athlete", blockList: blockList });

    } catch (error) {
        console.log("Error during request", error);
    }
}