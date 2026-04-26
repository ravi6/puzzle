/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/

import {grid, cols, rows} from "./puz.js" ;

export function sumit(v) {
    return v.reduce((s, i) => s + i, 0);
}

export function clrWord(wlen, dir, r, c) {
    for (let k = 0; k < wlen; k++) {
	let rr = dir === "down" ? r + k : c;
	let cc = dir === "cross" ? c : c + k;
	let cell = getCell(rr, cc);
	cell.style.backgroundColor = "white";
	cell.children[1].textContent = "";
    }
} // clrWord

export function getCell(r, c) {
    // grid is stored row wise
    const n = r * cols + c;
    const cell = grid.children[n];
    return cell;
} // end getCell

export function getPos(cell) {
    // Given cell object find i, j pos of it in grid
    const cells = grid.children;
    const n = Array.from(cells).indexOf(cell);
    const r = Math.floor(n / cols);
    const c = n % cols;
    return { r: r, c: c };
} //end getPos

export function saveState () {
   let state = {etime: 0, ccs: []} ;
   state.fills = [] ;
   for (let r=0 ; r < rows ; r ++) {
     for (let c=0 ; c < cols ; c++) {
       let cell = getCell (r, c) ;
       state.ccs.push (
         {asc: cell.children[1].innerText,
           r: r, c: c} ) ;
    }}
   
   // save it for next use
   localStorage.setItem ("puzState", JSON.stringify (state));
}

export function loadState () {
  let  state =  localStorage.getItem ("puzState"); 
  if (state) {
     state = JSON.parse (state) ;
     state.ccs.forEach ( (obj) => {
         let cell = getCell (obj.r, obj.c) ;
         cell.children[1].innerText = obj.asc ;
        }) ;
  } else {console.log ("load Failed");}    
} // loadState 
