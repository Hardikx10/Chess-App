
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";

import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        
        GitHubProvider({
                clientId: process.env.GITHUB_ID ?? "",
                clientSecret: process.env.GITHUB_SECRET ?? ""
        }),
        GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID ?? "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: "Username", type: "text",required:true },
            email: { label: "Email", type: "text", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            console.log(credentials);
            
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser:any = await db.user.findFirst({
                where: {
                    email: credentials.email
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id,
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        username:credentials.username,
                        email: credentials.email,
                        password: hashedPassword,
                        provider:"EMAIL"
                    }
                })
                
               
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    pages: {
        signIn: "/signup",
    },
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async signIn({ user, account, profile }:any) {
          
            if (account.provider === "github" || account.provider === "google") {
              let existingUser = await db.user.findFirst({
                where: { email: user.email }
              });
              console.log(existingUser);
              
              if (!existingUser) {
                try {
                  existingUser = await db.user.create({
                    data: {
                      email: user.email,
                      name: user.name,
                      username: user.email.split('@')[0], // You can modify this logic as needed
                      provider: account.provider.toUpperCase()
                    }
                  });
                } catch (e) {
                  console.error(e);
                  return false;
                }
              }
            }
          
           
            return true;
          },
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }

    }
  }

  