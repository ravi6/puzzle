/* Puzzle Digitization: 
   Ravi Saripalli
   6th April 2026
*/
import {sumit} from "./util.js" ;

export function getClues() {
    // Read both cross and down clues and get
    // a consolidated clues object
    let obj = readClues();
    let crossClues = parseClues(obj.cross);
    let downClues = parseClues(obj.down);
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


function readClues() {

const cross = 
`1 Get dell filling for roll (5)
4 Pages on work describe shake as summer treat (6,3)
9 Like fairy lights, often wasted (6,3)
10 Legendary Oz journo warmed drink (5)
11 CIN__K SALMON? (4,3,2,5)
14 Paid for release? Perhaps with some foreign currency envelopes (8)
15 Seasonal policy clicked for constituents (6)
17 Best judge of mid-year for US? (6)
19 Nerve fibre tender I'd fancy (8)
22 Hurry up sneak, say, and got ruled out (6,4,4)
24 White House heading off 7-down near 25-down? (5)
26 7-down keeper quietly drinks plonk, blended red (9)
27 Reverse a try after fight (5,4)
28 Contents of used and customised car (5)`;

const down = 
`1 Coach kid starting to sing for change (4)
2 Cryptically adoring puzzle with simple solution (7,4)
3 Commercial tea urn's dregs added to impure alcohol, mainly (3,4)
4 Secured for better (8)
5 Largely assigned rise in popular germicide (6)
6 For Spooner, Batman secretly set passage (7)
7 Boor irrational on Greenpeace's origin (3)
8 Danish whiz beyond each fray tossing airheads out (6,4)
12 TV expert abridged story on powerful duo? (7,4)
13 Beer organiser forgoes anger in a northern NSW town (10)
16 Alien place out east is an imbroglio (8)
18 Preclude cry over hooligan, we hear (4,3)
20 Rebuilt odd classics for carnival ride (7)
21 You search tips to visit promoted British island (6)
23 Norse honcho gains thirds from stock dividend (4)
25 Scanning republican gents? (3)`;
return { cross: cross, down: down };
} // end readClues
