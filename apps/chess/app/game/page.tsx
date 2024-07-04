"use client"

import { useEffect, useState } from "react";
import { Button } from "../../components/Button"
const ChessBoard = dynamic(() => import('../../components/ChessBoard'), {
    ssr: false,
});
import { useSocket } from "../../hooks/useSocket";
import { Chess } from 'chess.js'
import { useSession } from "next-auth/react";
import { AppBar } from "../../components/AppBar";
import axios from "axios";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";


export default function ()

{
    
    const INIT_GAME = "init_game";
    const MOVE = "move";
    const GAME_OVER = "game_over";

    const session = useSession();
    const user = session.data?.user;

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false)
    const [playerColor,setplayerColor]=useState("")
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [username, setUsername] = useState("")
    let [opponentName,setopponentName]=useState("opponent")
  
    let moveSound: HTMLAudioElement, captureSound: HTMLAudioElement, illegalSound: HTMLAudioElement, castleSound: HTMLAudioElement, checkSound: HTMLAudioElement, drawSound: HTMLAudioElement,notifySound: HTMLAudioElement,gameendSound:HTMLAudioElement;

    if (typeof window !== 'undefined') {
        notifySound=new Audio('/audio/notify.mp3')
        gameendSound=new Audio('/audio/game-end.mp3')
        moveSound = new Audio('/audio/move-self.mp3');
        captureSound = new Audio('/audio/capture.mp3');
        illegalSound = new Audio('/audio/illegal.mp3');
        castleSound = new Audio('/audio/castle.mp3');
        checkSound = new Audio('/audio/move-check.mp3');
        drawSound = new Audio('/audio/draw.mp3');
    }

    if (!user) {
        redirect("/signup");
        
    }
    const fetchData = async () => {
        try {
                const response = await axios.get('/api/user');
                setUsername(response.data.username)
              
        } catch (error) {
                console.error("Error fetching data:", error);
        }
    };
    fetchData()
useEffect(() => {
    
    if (!socket) {
        return;
    }
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case INIT_GAME:

            if (typeof window !== 'undefined') {
                notifySound?.play();
              }
               
                console.log(username);
                
                
                setBoard(chess.board());
                setStarted(true)
                setConnecting(false); // Stop showing "Connecting..." when the game starts
                
                
               
                if(message.payload.color ==="white") {
                    setplayerColor("w")
                    setopponentName(message.payload.opponentName);
                  
                }
                else{
                    setplayerColor("b")

                    setopponentName(message.payload.opponentName);
                    
                }
                console.log(opponentName);
                    
                // if(message.payload.opponentName){
                //     setopponentName(message.payload.opponentName);
                //     console.log(opponentName);
                // }

                break;

            case MOVE:
                const move = message.payload;
                const moveResult=chess.move(move);
                setBoard(chess.board());
                console.log("Move made");

                if (typeof window !== 'undefined') {
                    if (chess.inCheck()) {
                        checkSound?.play();
                    } else if (moveResult.san.includes('x')) {
                        captureSound?.play();
                    } else if (moveResult.san.includes('O-O') || moveResult.san.includes('O-O-O')) {
                        castleSound?.play();
                    } else {
                        
                        moveSound?.play();
                        console.log("move sound played");
                        
                    }
                }
            
                // Check for game over
                if (chess.isGameOver() || chess.isDraw()) {
                    const drawMessage = JSON.stringify({
                        type: GAME_OVER,
                        payload: { winner: null, message: "Draw by insufficient material or threefold repetition." }
                    });
                    socket.send(drawMessage);
                    
                    setGameOverMessage("Draw by insufficient material or threefold repetition.");
                    console.log("Draw by insufficient material or threefold repetition");
                }
                break;

            case GAME_OVER:
                
                const winner = message.payload.winner;
                if(winner==="draw"){
                    setGameOverMessage("Draw by insufficient material or threefold repetition.");
                    if (typeof window !== 'undefined') {
                        drawSound?.play();
                      }
                    break
                }
                if (typeof window !== 'undefined') {
                    gameendSound?.play()    
                }
                setGameOverMessage(`Game Over! Winner: ${winner}`);
            
                break;
        }
    }
}, [socket]);


const handleNewGame = () => {
    // const newChess = new Chess();
    // setChess(newChess);
    // setBoard(newChess.board());
    // setStarted(false);
    // setGameOver(false);
    window.location.reload()
    //@ts-ignore
   
    // socket.send(JSON.stringify({
    //     type: INIT_GAME
    // }));
};


if (!socket) return <div>Connecting...</div>

return (<div className="justify-center w-full h-screen bg-slate-800 flex">
    
    <div className="pt-8 max-w-screen-lg w-full">
        <AppBar/> 
        <div className="mt-1 text-white text-xl">
            
               {opponentName}               
               
        </div>
        <div className="grid grid-cols-6 gap-4 w-full">
            <div className="col-span-4 mt-5 w-full flex justify-center">
            
                <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} playerColor={playerColor}  />

            </div>
            <div className="col-span-2 mt-5 bg-slate-900 w-full flex justify-center">
                <div className="pt-8 text-white">
                {started ? (
                            gameOverMessage ? (
                                <><div className="text-white text-2xl">{gameOverMessage}</div>
                                <div className="mt-12 content-center ml-12"><Button onClick={handleNewGame}>
                                New Game
                            </Button></div></>
                            ) : (
                                <div className="text-white text-2xl">Game Started</div>

                            )
                        ) : (
                            
                            connecting ? (
                                <div className="text-white text-2xl">Connecting...</div>
                            ) :

                            (<Button onClick={() => {
                               
                                socket.send(JSON.stringify({
                                    type: INIT_GAME,
                                    name: username  // send name also 
                                }));

                                setConnecting(true); // Show "Connecting..." when "Play" is pressed
                            }}>
                                Play
                            </Button>

                        )
                            
                        )}

                    
                </div>
            </div>
           
        </div>
        
       
       
            
        <div className="mt-2 text-white text-xl">
            
            {username}
            
        </div>              
               
        

    </div>

</div>)
}
