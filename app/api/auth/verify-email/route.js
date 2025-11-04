import { connectDb } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request){
try {
    await connectDb()
    const {token} =await request.json();
    if (!token) {
        return response(false,400,"Missing token")
    }
const secret = new TextEncoder().encode(process.env.SECRET_KEY);
const decoded = await jwtVerify(token,secret);
const userId = decoded.payload.userId


if(!isValidObjectId(userId)){
 return response(false,404,"invalid userid .",userId)
}

//get user

const user =await UserModel.findById(userId)
if(!user){
    return response(false,404,"User not Found.")
}
user.isEmailVerified =true
await user.save()

return response(true,200,"Email verifition success.")

} catch (error) {
    return catchError(error)
}
}