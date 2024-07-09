import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square btn btn-outline-primary ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (!squares.includes(null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    const highlight = winningSquares && winningSquares.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={highlight}
      />
    );
  };

  const boardSize = 3;
  const board = [];
  for (let row = 0; row < boardSize; row++) {
    const boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      boardRow.push(renderSquare(row * boardSize + col));
    }
    board.push(
      <div key={row} className="board-row d-flex">
        {boardRow}
      </div>
    );
  }

  return (
    <>
      <div className="status my-3">{status}</div>
      <div className="board">{board}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // Define isAscending state
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const col = step.location % 3;
    const row = Math.floor(step.location / 3);
    const desc = move ?
      `Go to move #${move} (${col}, ${row})` :
      'Go to game start';
    return (
      <li key={move} className="list-group-item">
        <button
          className="btn btn-link"
          onClick={() => jumpTo(move)}
          style={{ fontWeight: move === currentMove ? 'bold' : 'normal' }}
        >
          {desc}
        </button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  const winner = calculateWinner(currentSquares);

  return (
    <div className="game container">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winner ? winner.line : null}
        />
      </div>
      <div className="game-info">
        <button className="btn btn-primary mb-3" onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ul className="list-group">{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
