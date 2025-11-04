import { connectDb } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { z } from "zod";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { sendMail } from "@/lib/sendMailer";

export async function POST(request) {
  try {
    // 1️⃣ Database connect
    await connectDb();

    // 2️⃣ Input payload
    const payload = await request.json();

    // 3️⃣ Validation schema (email + password)
    const validationSchema = zSchema
      .pick({ email: true }) // existing schema se email le liya
      .extend({
        password: z.string(),
      });

    const validationData = validationSchema.safeParse(payload);
    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { email, password } = validationData.data;

    // 4️⃣ Check user exist?
    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // 5️⃣ Compare password
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return response(false, 401, "Invalid email or password");
    }

    // 6️⃣ Check email verified or not
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({
        userId: getUser._id.toString(),
      })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail(
        "Email verification request from vishal",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return response(false,401,"your email is not verified. we sent you a verification link to your registered email address.")
    }

    return response(true, 200, "Login successful", { token, user });
  } catch (error) {
    return catchError(error, "Login failed");
  }
}
