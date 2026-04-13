/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {rows, cols, cells} from "./puz.js";
export {placeWord} ;

function placeWord(r, c, dir, len) {
    for (let k = 0; k < len; k++) {
	const currR = dir === "cross" ? r : r + k;
	const currC = dir === "down" ? c : c + k;

	const cell = cells[currR][currC];
        cell.hasChar = true ;

	if (dir === "cross") {
	    cell.rowAvail = false; // Occupied for Across
	    // Consolidate: mark side buffers for lanes above and below
	    constrain(currR - 1, currC, "cross");
	    constrain(currR + 1, currC, "cross");
	} else {
	    cell.colAvail = false; // Occupied for Down
	    // Consolidate: mark side buffers for lanes left and right
	    constrain(currR, currC - 1, "down");
	    constrain(currR, currC + 1, "down");
	}
    }

    // Final step: Place the hard block at the end using the switch
    const endR = dir === "cross" ? r : r + len;
    const endC = dir === "down" ? c : c + len;
    constrain(endR, endC, dir,  true); // cell after end of word call
} // placeWord

function constrain(r, c,  dir, isEnd = false) {
    // ensure we are within the 15x15 grid
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    let cell = cells[r][c];

    if (isEnd) {
	// mandatory word end gap
	// completely block it (as long as a word is starting there) 
	if (!cell.hasChar) { 
	    cell.rowAvail = false;
	    cell.colAvail = false;
	}
	return;
    }

    // Prevent side-by-side word placement (crosss or down)
    if (dir === "cross")
	cell.rowAvail = false; // Block new Across starts above/below
    else cell.colAvail = false; // Block new Down starts left/right

} // end constrain
