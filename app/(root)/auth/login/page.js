"use client";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public/talkzen.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zSchema } from "@/lib/zodSchema";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/Application/ButtonLoading";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoute";

function LoginPage() {
  const [loading, sestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("3", "password field is required"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values) => {
  try {
    sestLoading(true);

    const { data: loginResponse } = await axios.post("/api/auth/login", values);
    console.log("values",values)
    console.log("api login responsuve",loginResponse)
    if (!loginResponse.success) {
      throw new Error(loginResponse.message);
    }

    form.reset();
    alert(loginResponse.message);
  } catch (error) {
    alert(error.message);
    console.error(error);
  } finally {
    sestLoading(false);
  }
};


  return (
    <Card className="w-[392px]">
      <CardContent>
        <div className="flex justify-center items-center">
<Image
  className="w-[50px] h-[50px]"
  alt="logo"
  src={logo}
  width={50}
  height={50}
/>
            <p>QuickCart</p>
        </div>
        <div className="text-center"> 
          <h1 className="text-3xl font-bold mb-3">Login into Account</h1>
          <p> login into your account by filling out the form below</p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5 relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                  
                      <FormMessage />
                    </FormItem>
                  )}
                />
                    <p
                        className="cursor-pointer absolute top-1/2 right-4"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
                      </p>
              </div>

              {/* button */}
              <div className="mb-3">
                <ButtonLoading
                  loading={loading}
                  className="cursor-pointer w-full"
                  type="submit"
                  text="Login"
                />
              </div>
              <div className="text-center mb-2 ">
                <p className="cursor-pointer ">
                  {" "}
                  don't have account ?{" "}
                  <Link
                    href={WEBSITE_REGISTER}
                    className="hover:underline text-[16px] text-purple-500"
                  >
                    create new
                  </Link>
                </p>
              </div>


              <div className="text-center ">
                  <Link
                    href=""
                    className="underline text-[16px] text-purple-500"
                  >
                Forgate Password
                  </Link>
              </div>


            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
