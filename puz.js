/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {getClues} from "./clues.js" ;
import {layout}   from "./layout.js" ;
import {getPos, getCell}  from "./util.js" ;
export {initPuz} ;

export   const cols = 15;
export   const rows = 15;
export   const grid = document.getElementById("board");
export   let cells = [] ;
export   let Clues = {} ;

// State Variables
let endWord = false ; 
let cClue = true ;
let actCell = null ;

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
    AddMouseListener () ;
    AddKeyListener () ;
    
} // initPuz

function AddKeyListener () {
  document.addEventListener ("keydown", (e) => {
    // grab key that is alphabet and enter in the cell
    // if allowed 
    if (endWord)  return ; // no typing allowed 
    if (/^[a-zA-Z]$/.test(e.key)) {
       let sp = actCell.children [actCell.children.length - 1] ;
       sp.innerText = (e.key).toUpperCase() ;
       if (!nextCell ()) endWord = true ;  // word ended
    }
  });
}

function nextCell () { 
  // Move to next cell if possible 
  // if not return false
  let pos = getPos (actCell) ;
  if (pos.r == rows - 1 || pos.c == cols - 1) return (false);

  // make next cell active
  let nxtCell ;
  if (cClue) nxtCell = getCell (pos.r, pos.c + 1) ;
  else       nxtCell = getCell (pos.r + 1, pos.c) ;
  if (nxtCell.style.backgroundColor !== "white") return (false) ;
  highLight (nxtCell) ;
  return (true) ;
} // end nextCell

function AddMouseListener () {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
       let cell = cells [r][c] ;
         if (cell.style.backgroundColor === "white") { 
	   cell.addEventListener ("click", (e) => {
	      showClue (cell) ;
	      highLight (cell) ;
              endWord = false ; // allow typing
           });
         }
   }}
} // end listen

function highLight (cell) {
  if (actCell === null) actCell = cell ;
  actCell.style.backgroundColor = "white" ;
  cell.style.backgroundColor = "lightBlue";
  actCell = cell ;
} // end highlight

function showClue (cell) {
  // Show clue if clicked on start of word
  let corner = cell.children[0];
  let cnrTxt = corner.innerText ;
  if (cnrTxt == "")  { return ; }
  let cnum = Number (cnrTxt) ;
  let clue  = Clues [cnum] ;

  let stxt ="" ;
  if (clue.txt.d === "") {
         stxt = cnum + " Cross: " + clue.txt.c ;
         cClue = true ; 
  }
  else if (clue.txt.c === "") {
         stxt = cnum + " Down: " + clue.txt.d ;
         cClue = false ; 
  }
  else { // toggle Clue string if cross and down
    if (cClue) stxt = cnum + " Cross: " +  clue.txt.c;
    else stxt = cnum + " Down: " + clue.txt.d ;
    cClue = !cClue ; // toggle 
  }
  document.getElementById("clue").innerHTML = stxt ;
} // show Clue

