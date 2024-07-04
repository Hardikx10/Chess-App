import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { NextResponse } from "next/server";


export const GET=async ()=>{
        
    const session=await getServerSession(authOptions)
    const user=await prisma.user.findFirst({
        where:{
            email:session?.user?.email,
        }
    })
    const username:any=user?.username
    
    return NextResponse.json({
        username:username
    })
    
}