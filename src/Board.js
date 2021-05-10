import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let thisRow = [];
      for (let x = 0; x < ncols; x++) {
        let thisCellState = Math.random() < chanceLightStartsOn ? true : false;
        thisRow.push(thisCellState);
      }
      initialBoard.push(thisRow);
    }
    return initialBoard;
  }

  function hasWon() {
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (!board[y][x]) return false;
      }
    }

    return true;
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // helper; recursively deep copies n-dimensional arrays (n >= 1)
      const deepCopyArray = (arr) => {
        let copy = [];
        arr.forEach((el) => {
          // if we're making a deep copy of an array, recurse
          if (Array.isArray(el)) {
            copy.push(deepCopyArray(el));
          } else {
            // if not, just iterate through and push to the array
            copy.push(el);
          }
        });
        return copy;
      };

      // make a deep copy of our current board
      let copiedBoard = deepCopyArray(board);

      // flip the targeted cell and the cells around it
      flipCell(y, x, copiedBoard);
      flipCell(y - 1, x, copiedBoard);
      flipCell(y + 1, x, copiedBoard);
      flipCell(y, x - 1, copiedBoard);
      flipCell(y, x + 1, copiedBoard);

      return copiedBoard;
    });
  }

  if (hasWon())
    return (
      <a href="/">
        <div className="Board-winner">You Win! Play again?</div>
      </a>
    );

  //   const genCellArray = () => {
  //     let cellArray = [];
  //     for (let y = 0; y < nrows; y++) {
  //       let thisRow = [];
  //       for (let x = 0; x < ncols; x++) {
  //         thisRow.push(
  //           <Cell
  //             flipCellsAroundMe={flipCellsAround(`${y}-${x}`)}
  //             isLit={board[y][x]}
  //           />
  //         );
  //       }
  //       cellArray.push(thisRow);
  //     }
  //     return cellArray;
  //   };

  return (
    <div className="Board">
      <table className="Board-table">
        <tbody>
          {board.map((row, y) => {
            return (
              <tr key={y}>
                {row.map((cell, x) => {
                  return (
                    <Cell
                      flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                      isLit={cell}
                      key={`${y}-${x}`}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
