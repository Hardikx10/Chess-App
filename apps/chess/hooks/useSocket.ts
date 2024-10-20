"use client"
import { useEffect, useState } from "react"

const WS_URL = "ws://chess-game-backend-bzde.onrender.com";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("connection established"); // client connected to websocket server
            
            setSocket(ws);
        }
        ws.onmessage = (message) => {
            console.log('Message received:', message);
        }
        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [])

    return socket;  
}
