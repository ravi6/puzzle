/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/

import {placeWord} from "./place.js" ;
import {rows, cols, cells, Clues} from "./puz.js" ;

export function layout() {
    const keys = Object.keys(Clues); 
    let cluePointer = 0;

    for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
	    let cell = cells[r][c];
	    let clue = Clues[keys[cluePointer]];
	    let matched = false;

	    if (clue.nc.c > 0 && clue.nc.d > 0) {
		//cross & down
		if (
		    hasRunway(r, c, "cross", clue.nc.c) &&
		    hasRunway(r, c, "down", clue.nc.d)
		) {
		    //console.log("Cross and Down ", r, c, clue.nc.c);
		    placeWord(r, c, "cross", clue.nc.c);
		    placeWord(r, c, "down", clue.nc.d);
		    matched = true;
		}
	    } else if (clue.nc.c > 0) {
		// only cross clue
		if (hasRunway(r, c, "cross", clue.nc.c)) {
		    //console.log("Cross ", r, c, clue.nc.c);
		    placeWord(r, c, "cross", clue.nc.c);
		    matched = true;
		}
	    } else if (clue.nc.d > 0) {
		// only down clue
		if (hasRunway(r, c, "down", clue.nc.d)) {
		    //console.log("Down ", r, c, clue.nc.d);
		    placeWord(r, c, "down", clue.nc.d);
		    matched = true;
		}
	    }

	    if (matched) {
		//console.log("Matched Cell", cell);
		//console.log("Matched Clue", keys[cluePointer]);
                // add clue number in the left corner
		cell.children[0].innerHTML = keys[cluePointer];
		cluePointer++;
		if (cluePointer == keys.length) break;
	    } else if (!cell.isChar) {
		// If it didn't match the current clue
		// and isn't a letter, it's a block
		blockCell (r, c);
	    }
	}
    } // end scanning all rows
  colorCells () ;
} // end Laying out the Puzzle

function hasRunway(r, c, dir, len) {
    // RULE: The STARTING cell of a new clue cannot be an intersection
    // It MUST be a fresh start (rowAvail/colAvail must be true)
    let startCell = cells[r][c];
    if (dir === "cross" && !startCell.rowAvail) return false;
    if (dir === "down" && !startCell.colAvail) return false;

    for (let k = 0; k < len; k++) {
	let rr = dir === "cross" ? r : r + k;
	let cc = dir === "cross" ? c + k : c;

	if (rr >= rows || cc >= cols) return false;

	let target = cells[rr][cc];
	// Return if it is blocked by end of word
	if (!target.rowAvail && !target.colAvail) return false;


	// If the cell is not yet occupied and not availablex 
        // in the current direction return false
	let avail = (dir === 'cross') ? target.rowAvail : target.colAvail;
	if (!target.isChar && !avail) return false;
    }
    return true;
} // end hasRunway

function blockCell (r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  let cell = cells[r][c];
  cell.rowAvail = false;
  cell.colAvail = false;
} // end blockCell

function colorCells () {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let cell = cells[r][c];
        if (cell.hasChar) cell.style.backgroundColor = "white" ;
        else cell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)' ;
      }}
} // end colorCells

// A very clever ascending order   .sort((a, b) => parseInt(a) - parseInt(b));
