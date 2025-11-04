"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { use, useEffect, useState } from 'react'

import verifiedImg from "@/public/images/verified.gif"
import verificationfaildImg  from "@/public/images/verification-failed.gif"

import axios from 'axios'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'


function EmailVerification({params}) {
  let  {token} = use(params)
  const [isVerified,setIsVerified]  = useState(false)

  useEffect(()=>{
      const verify = async ()=>{
      const {data:verificationResponse} = await axios.post('/api/auth/verify-email',{token})
      if (verificationResponse.success) {
        setIsVerified(true)
      }
      }
verify()

  },[token])

  return (
    <Card className="w-[400px]">
      <CardContent>
        {
          isVerified ?
           <div> 
                <div className='flex justify-center items-center'>
                  <Image className='h-[200px] w-auto' src={verifiedImg.src} height={verifiedImg.height} width={verifiedImg.width} alt="verification success"/>
                </div>

                <div className='text-center'>
                  <h1 className='text-2xl  text-green-500 font-bold my-5'>Email Verification Success!</h1>
                  <Button asChild>
                        <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                  </Button>
                </div>

           </div>
           
           :
          
                     <div> 
                <div className='flex justify-center items-center'>
                  <Image className='h-[100px] w-auto' src={verificationfaildImg.src} height={verificationfaildImg.height} width={verificationfaildImg.width} alt="verification failed "/>
                </div>

                <div className='text-center'>
                  <h1 className='text-2xl text-red-500 font-bold my-5'>Email Verification Failed!</h1>
                  <Button asChild>
                        <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                  </Button>
                </div>

           </div>
           
        }
      </CardContent>
    </Card>
  )
}

export default EmailVerification