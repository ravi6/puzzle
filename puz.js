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

let cClue = true ;

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
    layout () ;
    listen () ;
    
} // initPuz

function listen () {
  console.log(Clues) ;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
       let cell = cells [r][c] ;
       let corner = cell.children[0];
       let cText = corner.innerText ;
       if (cText != "") { // at start of a word
         let cnum = Number (cText) ;
         let txt  = Clues [cnum].txt ;
         corner.addEventListener ("click", (e) => showClue (cnum, txt));
       }
  }}
}
function showClue (cnum, txt) {
  let stxt ="" ;
  if (txt.d === "") stxt = cnum + " Cross: " + txt.c ;
  else if (txt.c === "") stxt = cnum + " Down: " + txt.d ;
  else {
    if (cClue) stxt = cnum + " Cross: " +  txt.c;
    else stxt = cnum + " Down: " + txt.d ;
    cClue = !cClue ;
  }
  document.getElementById("clue").innerHTML = stxt ;
}
