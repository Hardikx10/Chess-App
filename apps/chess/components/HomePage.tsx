"use client"

import { useSocket } from "../hooks/useSocket";

export function HomePage(){
    const socket=useSocket()
    function SocketClick() {
        
        console.log("Socket Clicked");
        
        if (!socket) {
            console.log("loading...");
            
            
        }
        socket?.send("Game init")
        
        
    }
    return(
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold">Play Chess Online</h1>
              </div>
            </div> */}
            {/* <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-center"> */}
            <div className="p-6 rounded-md">
                <img src="https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png" alt="Chessboard" className="size-4/5"/>
            </div>
            {/* </div> */}
            <div className="ml-6 mt-3">
              <button onClick={SocketClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center ">
               
                  Play Online
              </button>
            </div>
          </div>
        </div>
    )
}