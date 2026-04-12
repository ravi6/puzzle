/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/

import {placeWord} from "./place.js" ;
import {rows, cols, cells, Clues} from "./puz.js" ;
import {gapColor, wColor, bufColor} from "./puz.js" ;

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
		    console.log("Cross and Down ", r, c, clue.nc.c);
		    placeWord(r, c, "cross", clue.nc.c);
		    placeWord(r, c, "down", clue.nc.d);
		    matched = true;
		}
	    } else if (clue.nc.c > 0) {
		// only cross clue
		if (hasRunway(r, c, "cross", clue.nc.c)) {
		    console.log("Cross ", r, c, clue.nc.c);
		    placeWord(r, c, "cross", clue.nc.c);
		    matched = true;
		}
	    } else if (clue.nc.d > 0) {
		// only down clue
		if (hasRunway(r, c, "down", clue.nc.d)) {
		    console.log("Down ", r, c, clue.nc.d);
		    placeWord(r, c, "down", clue.nc.d);
		    matched = true;
		}
	    }

	    if (matched) {
		console.log("Matched Cell", cell);
		console.log("Matched Clue", keys[cluePointer]);
		cell.children[0].innerHTML = keys[cluePointer];
		cluePointer++;
		if (cluePointer == keys.length) return;
	    } else if (cell.style.backgroundColor !== wColor) {
		// If it didn't match the current clue
		// and isn't a letter, it's a block
		blockCell (r, c);
	    }
	}
    } // end scanning all rows
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
	// For the rest of the word, it's okay if it's white (intersection)
	// but it MUST NOT be a black square
	if (target.style.backgroundColor === gapColor) return false;

	// If it's not white, it must have the directional flag
	let avail = (dir === 'cross') ? target.rowAvail : target.colAvail;
	if (target.style.backgroundColor !== 'white' && !avail) return false;
    }
    return true;
}

function blockCell (r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  let cell = cells[r][c];
  cell.style.backgroundColor = gapColor ;
  cell.rowAvail = false;
  cell.colAvail = false;
}
// A very clever ascending order   .sort((a, b) => parseInt(a) - parseInt(b));
