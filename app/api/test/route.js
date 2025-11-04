import { connectDb } from "@/lib/dataBaseConnection";

import { NextResponse } from "next/server";

export async function GET(){
      await connectDb();
     return NextResponse.json({
        success:true,
        message:"connection success." 

    })
}