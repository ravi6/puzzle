/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/

import {getClues} from "./clues.js" ;
import {layout}   from "./layout.js" ;
export {initPuz} ;

export   const cols = 15;
export   const rows = 15;
export   const grid = document.getElementById("board");
export   let cells = [] ;
export   let Clues = {} ;
export   let gapColor = "rgba(0, 0, 0, 0.2)";
export   let wColor = "white";
export   let bufColor = "rgba(0, 0, 0, 0.1)";

function initPuz() {
  for (let r = 0; r < rows; r++) {
    cells[r] = []; // Initialize row
	for (let c = 0; c < cols; c++) {
	    let itm = document.createElement("div");
	    itm.rowAvail = true;
	    itm.colAvail = true;
	    itm.r = r; // Store its own coordinates
	    itm.c = c;
	    cells[r][c] = itm; // Store in 2D array
	    let corner = document.createElement("span");
	    let center = document.createElement("span");
	    itm.append(corner);
	    itm.append(center);
	    grid.append(itm);
	}
    }
    
    Clues = getClues () ;
    layout () ;;
    
} // initPuz

