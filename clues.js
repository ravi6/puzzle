/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {sumit} from "./util.js" ;

export async function getClues() {
    // Read both cross and down clues and get
    // a consolidated clues object
    let obj = await readClues();
    let crossClues = await parseClues(obj.cross);
    let downClues = await parseClues(obj.down);
    let clues = {};
    Object.entries(crossClues).forEach(([key, cross]) => {
	clues[key] = {
	    nc: { c: cross.nc, d: 0 },
	    txt: { c: cross.txt, d: "" },
	    wg: { c: cross.wg, d: [] },
	};
    });
    Object.entries(downClues).forEach(([key, down]) => {
	if (clues[key]) {
	    // Cross clue has same origin
	    clues[key].nc.d = down.nc;
	    clues[key].txt.d = down.txt;
	    clues[key].wg.d = down.wg;
	} else {
	    // unshared down clues
	    clues[key] = {
		nc: { c: 0, d: down.nc },
		txt: { c: "", d: down.txt },
		wg: { c: [], d: down.wg },
	    };
	}
    });
    //console.log(JSON.stringify(clues, null, 2));
    return clues;
} // end mergeClues

function parseClues(str) {
    const lines = str.split("\n");
    let clues = {};
    lines.forEach((line) => {
	// Assume clue index is right at start of line
	let [key, ...rest] = line.split(" ");
	key = parseInt(key);
	line = rest.join(" ");
	clues[key] = {};
	// Assume rest of the string upto "(" is clue
        let txt ;
	[txt, ...rest] = line.split("(");
	clues[key].txt = txt;
	rest = rest.join("(");
	rest = "[" + rest.replace(/[()]/g, "") + "]";
	clues[key].wg = JSON.parse(rest);
	clues[key].nc = sumit(clues[key].wg);
    });
    //console.log(JSON.stringify(clues, null, 2));
    return clues;
} // end Parse Clues

async function readClues() {
  const resp = await fetch ("./clues") ;
  const txt = await resp.text () ;
  const parser = new Function(`${txt}; return { cross: CROSS, down: DOWN };`);
  const result = parser(); 
  console.log (result) ;
  return (result);
} // end readClues

