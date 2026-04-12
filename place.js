/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {rows, cols, cells} from "./puz.js";
import {gapColor, wColor, bufColor} from "./puz.js" ;
export {placeWord} ;

function placeWord(r, c, dir, len) {
    for (let k = 0; k < len; k++) {
	const currR = dir === "cross" ? r : r + k;
	const currC = dir === "down" ? c : c + k;

	const cell = cells[currR][currC];
	cell.style.backgroundColor = wColor;

	if (dir === "cross") {
	    cell.rowAvail = false; // Occupied for Across
	    // Consolidate: mark side buffers for lanes above and below
	    constrain(currR - 1, currC, false, "cross");
	    constrain(currR + 1, currC, false, "cross");
	} else {
	    cell.colAvail = false; // Occupied for Down
	    // Consolidate: mark side buffers for lanes left and right
	    constrain(currR, currC - 1, false, "down");
	    constrain(currR, currC + 1, false, "down");
	}
    }

    // Final step: Place the hard block at the end using the switch
    const endR = dir === "cross" ? r : r + len;
    const endC = dir === "down" ? c : c + len;
    constrain(endR, endC, true, dir);
} // placeWord

function constrain(r, c, isEnd, dir) {
    // ensure we are within the 15x15 grid
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;

    let cell = cells[r][c];

    if (isEnd) {
	// mandatory black square gap at the end of a word.
	// completely block it
	if (cell.style.backgroundColor !== wColor) {
	    cell.style.backgroundColor = gapColor;
	    cell.rowAvail = false;
	    cell.colAvail = false;
	}
	return;
    }

    // Prevent side-by-side word placement (crosss or down)
    if (dir === "cross")
	cell.rowAvail = false; // Block new Across starts above/below
    else cell.colAvail = false; // Block new Down starts left/right

    // Optional: Visual cue for development
    if (cell.style.backgroundColor !== wColor) {
	cell.style.backgroundColor = bufColor; // subtle hint
    }
} // end constrain
