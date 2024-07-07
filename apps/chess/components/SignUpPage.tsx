"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import React from 'react';
import { log } from 'console';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router=useRouter()
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    // Sign up the user by calling NextAuth authorize with isSignUp flag
    const res:any = await signIn('credentials', {
      redirect: false,
      username,
      email,
      password,
      isSignUp: true,
    });
    router.push("/game")

    if (res.error) {
      console.error(res.error);
    } else {
      // Handle successful signup (e.g., redirect to dashboard)
      console.log('User signed up successfully');
    }
  };
  // const handleGoogle=async ()=>{
  //   const res:any=await signIn('google',{
  //     redirect:false,
  //     isSignUp: true,
  //   })
  //   if(res.error){
  //     console.error(res.error)
  //   }
  //   else{
  //     router.push("/game")
  //   }
  // }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-center text-white mb-2">Join Now</h1>
        <p className="text-center text-gray-400 mb-8">and Start Playing Chess!</p>

          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:bg-gray-600"
              />
              
            </div>
          </div>
          <div className="mb-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:bg-gray-600"
              />
             
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:bg-gray-600"
              />
              
              
            </div>
          </div>
          <button type="submit" className="bg-green-500 text-white font-bold py-3 px-4 rounded w-full hover:bg-green-600"
           >
            Sign Up
            
          </button>
        </form>



        {/* <div className="flex items-center w-full max-w-sm mb-4 mt-2">
          <div className="border-t border-gray-500 flex-grow"></div>
          <span className="mx-2">OR</span>
          <div className="border-t border-gray-500 flex-grow"></div>
        </div> */}
        {/* <button onClick={
         async()=>{
            const result=await signIn("google")
            console.log(result);
            
            if (result?.ok) {
              console.log("Google Sign In Success")
              router.push("/game")
            }
            else{

              console.log("signin with google failed");
            
            }
           
         }
        } className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded w-full max-w-sm flex items-center justify-center mb-4">
          <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.3 0 6.3 1.2 8.6 3.2L39.7 6C35.6 2.5 30.1 0 24 0 14.9 0 7.2 5.3 3.7 12.9l8.5 6.5C13.6 13.2 18.3 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.5-1.9 4.7-4 6.1l8.5 6.6C44.3 37.4 46.1 31.4 46.1 24.5z"/><path fill="#FBBC05" d="M12.2 27.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 1-4.4l-8.6-6.5c-1.8 3.4-2.8 7.3-2.8 11.3s1 7.9 2.8 11.3l8.4-6.6z"/><path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16-5.8l-8.5-6.6c-2.3 1.5-5 2.4-7.5 2.4-5.8 0-10.7-3.8-12.5-9l-8.5 6.6C7.2 42.7 14.9 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Continue with Google
        </button>
        <button onClick={async ()=>{
          await signIn("github")
          router.push("/game")
        }} className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full max-w-sm flex items-center justify-center">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.304 3.438 9.8 8.207 11.387.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.727-4.042-1.608-4.042-1.608-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.234 1.838 1.234 1.07 1.834 2.809 1.304 3.495.998.108-.775.418-1.304.76-1.604-2.665-.307-5.466-1.332-5.466-5.932 0-1.31.467-2.381 1.235-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.01-.322 3.31 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.292-1.552 3.298-1.23 3.298-1.23.655 1.653.243 2.874.12 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.62-5.479 5.92.43.37.813 1.096.813 2.21 0 1.595-.014 2.882-.014 3.276 0 .32.216.694.824.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          Continue with GitHub
        </button> */}
      </div>
    </div>
    )
}
export default SignUpPage;
