import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDb } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMailer";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";


export  async function POST(request){
    try {
        await connectDb();
        // validationSchema
        const validationSchema = zSchema.pick({
            name:true,
            email:true,
            password:true
        })

const payload =await request.json();
const validationData  = validationSchema.safeParse(payload);

if (!validationData.success) {
    return response(false,401,"invalid or missing input field.",validationData.error)
}

const {name,email,password} = validationData.data


const CheckUser = await UserModel.exists({email})
if(CheckUser){
    return response(true,409,"User already registerd.")
}

const newRegistration =new UserModel({name,email,password})
await newRegistration.save()


// jose library email ke liye

const secret = new TextEncoder().encode(process.env.SECRET_KEY);

const token =await new SignJWT({userId:newRegistration._id.toString()})
.setIssuedAt()
.setExpirationTime("1h")
.setProtectedHeader({alg:"HS256"})
.sign(secret)

await sendMail("Email verification request from vishal",email,emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

return response(true,200,"Registration success, please verify your email address.")


    } catch (error) {
        return catchError(error)
    }

}
