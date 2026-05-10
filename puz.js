/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {getClues} from "./clues.js" ;
import {layout}   from "./layout.js" ;
import {getPos, getCell, hexColor} from "./util.js" ;
import {saveState, loadState}  from "./util.js" ;
export {initPuz} ;

export   const cols = 15;
export   const rows = 15;
export   const grid = document.getElementById("board");
export   let cells = [] ;
export   let Clues = {} ;
export   const myBlack = hexColor("rgba(0, 0, 0, 0.1)");

// State Variables
let endWord = false ; 
let cClue = true ;
let mcClue = true ;
let actCell = null ;

async function initPuz() {
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
    
    Clues = await getClues () ;
    layout () ;
    AddMouseListener () ;
    AddKeyListener () ;
} // initPuz

function AddKeyListener () {
  document.addEventListener ("keydown", (e) => {
   if (e.ctrlKey && e.key.toUpperCase() === "S") {
       e.preventDefault () ;
       saveState () ;
       return ;
   }
   if (e.ctrlKey && e.key.toUpperCase() === "R") {
       e.preventDefault () ;
       loadState () ;
       return ;
   }

   // grab key that is alphabet and enter in the cell
   // if allowed 
   if (endWord)  return ; // no typing allowed 
   const isAlpha = /^[a-zA-Z]$/.test(e.key);
   const isSpace = e.key === " " ;
   if (isAlpha || isSpace) {
      e.preventDefault () ;
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

function removeWordHighLight () {
   let hCells = document.querySelectorAll('.agrid div.highlighted');
   hCells.forEach(el => {
      el.classList.remove('highlighted');
    });
}

function AddMouseListener () {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
       let cell = cells [r][c] ;
       if (cell.style.backgroundColor === "white") { 
	   cell.addEventListener ("click", 
                (e) => {hMouseClick (cell);} ); 
       }
   }}
} // end MouseListener

function hMouseClick (cell) {
  removeWordHighLight () ;
  if (cell.children[0].innerHTML == "") 
     hMidWord (cell) ;  // handle mid of the words
  else 
     showClue (cell) ;
  highLight (cell) ;
  endWord = false ; // allow typing
} // hMouseClick

function highLight (cell) {
  if (actCell === null) actCell = cell ;
  actCell.style.backgroundColor = "white" ;
  cell.style.backgroundColor = "lightBlue";
  actCell = cell ;
} // end highlight

function highLightWord (cell, dir, nc) {
    removeWordHighLight () ; // remove existing
    let pos = getPos (cell) ;
    if (dir === "cross") {
        for (let i=0 ; i < nc ; i++)
          getCell (pos.r, pos.c + i).classList.add('highlighted'); 
    } 
    else {
        for (let i=0 ; i < nc ; i++)
          getCell (pos.r + i , pos.c).classList.add('highlighted'); 
    }

} // end highlightWord

function showClue (cell) {
  // Show clue if clicked on start of word
  let corner = cell.children[0];
  let cnrTxt = corner.innerText ;
  let cnum = Number (cnrTxt) ;
  let clue  = Clues [cnum] ;
  let stxt ="" ;
  if (clue.txt.d === "") { // Cross Clue Only
         stxt = cnum + " Cross: " + clue.txt.c 
               + "(" +  clue.wg.c + ")" ;
         cClue = true ; 
         highLightWord (cell, "cross", clue.nc.c) ;
  }
  else if (clue.txt.c === "") { // Down Clue Only
         stxt = cnum + " Down: " + clue.txt.d 
               + "(" +  clue.wg.d + ")" ;
         cClue = false ; 
         highLightWord (cell, "down", clue.nc.d) ;
  }
  else { // toggle Clue string if cross and down
    if (cClue) { 
       stxt = cnum + " Cross: " +  clue.txt.c
               + "(" +  clue.wg.c + ")" ;
        highLightWord (cell, "cross", clue.nc.c) ;
    }
    else {
      stxt = cnum + " Down: " + clue.txt.d 
               + "(" +  clue.wg.d + ")" ;
      highLightWord (cell, "down", clue.nc.d) ;
    }
    cClue = !cClue ; // toggle 
  }
  document.getElementById("clue").innerHTML = stxt ;
} // show Clue

function hMidWord (cell) {
 let cWord = getWordAtCell (cell, "cross") ;
 let dWord = getWordAtCell (cell, "down") ;
 if (cWord.sCell != null && dWord.sCell != null) {
    if (mcClue) showClue (cWord.sCell) ;
    else       showClue (dWord.sCell) ;
    mcClue = !mcClue ;
    return ;
 }

 if (cWord.sCell != null) showClue (cWord.sCell);
 if (dWord.sCell != null) showClue (dWord.sCell);
}

function getWordAtCell(cell, dir) {
  let pos = getPos(cell);
  let r = pos.r;
  let c = pos.c;
  let sCell = null;
  let clueKey = "";

  // Scan backwards (Up for "down", Left for "cross")
  while (r >= 0 && c >= 0) {
      let curCell = getCell(r, c);
      if (!curCell || curCell.style.backgroundColor === myBlack)  break;

      // Check if this cell has a clue number (the first <span>)
      let cnrText = curCell.children[0].innerHTML;
      if (cnrText !== "") {
          sCell = curCell;
          clueKey = cnrText;
          break; 
      }
      // Move to the previous cell
      if (dir === "cross") c--;
      else r--;
  } // end while loop

  let ans = {
     sCell: sCell,
     clueKey: clueKey,
     direction: dir
   };
  return (ans) ;
} // end getWordAtCell
