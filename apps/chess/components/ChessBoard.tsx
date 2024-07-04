"use client"

import { Chess, Color, PieceSymbol, Square } from "chess.js"; // Import necessary types from chess.js
import { useState } from "react"; // Import useState hook from React


const ChessBoard = ({ chess, board, socket, setBoard, playerColor}: {
    chess: Chess;
    setBoard: React.Dispatch<React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>>;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    playerColor: string;
}) => {
    const [from, setFrom] = useState<null | Square>(null); // State to track the selected piece
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]); // State to track possible moves for the selected piece
    const INIT_GAME = "init_game";
    const MOVE = "move";
    const GAME_OVER = "game_over";
    let moveSound: HTMLAudioElement, captureSound: HTMLAudioElement, illegalSound: HTMLAudioElement, castleSound: HTMLAudioElement, checkSound: HTMLAudioElement, drawSound;

    if (typeof window !== 'undefined') {
        moveSound = new Audio('/audio/move-self.mp3');
        captureSound = new Audio('/audio/capture.mp3');
        illegalSound = new Audio('/audio/illegal.mp3');
        castleSound = new Audio('/audio/castle.mp3');
        checkSound = new Audio('/audio/move-check.mp3');
        drawSound = new Audio('/audio/draw.mp3');
    }

    // Function to get the square representation based on player color
    const getSquareRepresentation = (i: number, j: number) => {
        if (playerColor === "w") {
            return String.fromCharCode(97 + j) + (8 - i) as Square; // White perspective square names-a1,a2,a3,...
        } else {
            return String.fromCharCode(97 + (7 - j)) + (i + 1) as Square; // Black perspective square names-h8,h7,...
        }
    };

    // Reverse board and row if player is black
    const reversedBoard = playerColor === "b" ? [...board].reverse() : board;
    const reversedRow = (row: typeof board[0]) =>
        playerColor === "b" ? [...row].reverse() : row;

    // Function to play sound effects based on the move
    // const playSound = (move: string) => {
    //     if (chess.inCheck()) {
    //         checkSound.play();
    //     } else if (move.includes('x')) {
    //         captureSound.play();
    //     } else if (move.includes('O-O') || move.includes('O-O-O')) {
    //         castleSound.play();
    //     } else {
    //         moveSound.play();
    //     }
    // };

    // Handle click on a square
    const handleClick = (squareRepresentation: Square) => {
      const piece = chess.get(squareRepresentation); // Get piece on clicked square

      // If clicking on a new piece of the same color, update selection
      if (piece && piece.color === playerColor) {
          setFrom(squareRepresentation); // Set selected piece
          const moves = chess.moves({ square: squareRepresentation, verbose: true }).map(move => move.to); // Get possible moves
          setPossibleMoves(moves as Square[]); // Set possible moves
          return;
      }
      
      // If clicking on the same square again, reset the selection
      if (from === squareRepresentation) {
          setFrom(null); // Reset selected piece
          setPossibleMoves([]); // Clear possible moves
          return;
      }
      
      // Attempt to move the piece
      if (from) {
        let move = {
          from,
          to: squareRepresentation,
          promotion: "q" // Default promotion to queen
        };
      
        // Check if the move is a pawn promotion
        if (chess.get(from).type === 'p' && (squareRepresentation[1] === '8' || squareRepresentation[1] === '1')) {
          move.promotion = 'q'; // Automatically promote to queen
        }
      
        const moveResult = chess.move(move); // Attempt the move
         
          if (moveResult) {
              // playSound(moveResult.san); // Play sound based on move
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
              socket.send(
                JSON.stringify({
                  type: MOVE,
                  payload: { move: moveResult },
                })
              ); // Send move to server
              setBoard(chess.board()); // Update board state
              setFrom(null); // Reset selected piece
              setPossibleMoves([]); // Clear possible moves
              console.log({
                  from,
                  to: squareRepresentation,
                  promotion: "q"
              });
              if (chess.isGameOver() || chess.isDraw()) { // Check for game over or draw
                // const drawMessage = JSON.stringify({
                //     type: GAME_OVER,
                //     payload: { winner: null, message: "Game Over: Draw by insufficient material or threefold repetition." }
                // });

                // socket.send(drawMessage); // Send game over message to server
                // drawSound.play();
                console.log("Game Over: Draw by insufficient material or threefold repetition");
            }
              
          } else {
            if (typeof window !== 'undefined') {
              illegalSound?.play();
            }
            console.log('Invalid move'); // Log invalid move
          }
      }
    };

    return (
      <div className="text-white-200">
        {reversedBoard.map((row, i) => {
          return (
            <div key={i} className="flex">  
              {reversedRow(row).map((square, j) => {
                const squareRepresentation = getSquareRepresentation(i, j);
                const isHighlighted = possibleMoves.includes(squareRepresentation); // Check if the square is highlighted

                return (
                  <div
                      onClick={() => handleClick(squareRepresentation)} // Handle square click
                      key={j}
                      className={`relative w-16 h-16 ${(i + j) % 2 === 0 ? "bg-slate-50" : "bg-green-600"}`} // Alternate square colors
                  >
                      <div className="w-full justify-center flex h-full">
                          <div className="h-full justify-center flex flex-col">
                              {square ? (
                                  <img
                                      className="w-full h-full"
                                      src={`/images/${square.color}${square.type}.png`} // Display piece image
                                  />
                                  
                                 
                                  
                              ) : null}
                               {/* {squareRepresentation} */}
                              {isHighlighted && <div className="point"></div>} 
                          </div>
                      </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
};

export default ChessBoard