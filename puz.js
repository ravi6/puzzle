/* Optimized Puzzle Digitization: Ravi Saripalli */
import {getClues} from "./clues.js";
import {layout} from "./layout.js";
import {getPos, getCell, hexColor, saveState, loadState} from "./util.js";

export {initPuz};
export const cols = 15, rows = 15;
export const grid = document.getElementById("board");
export const myBlack = hexColor("rgba(0, 0, 0, 0.1)");
export let cells = [], Clues = {};

let endWord = false, cClue = true, actCell = null;

async function initPuz() {
    for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
            let itm = document.createElement("div");
            Object.assign(itm, { r, c, rowAvail: true, colAvail: true });
            itm.append(document.createElement("span"), 
                        document.createElement("span"));
            cells[r][c] = itm;
            grid.append(itm);
            if (itm.style.backgroundColor !== myBlack) {
                itm.onclick = () => hMouseClick(itm);
            }
        }
    }
    Clues = await getClues();
    layout();
    AddKeyListener();
}

function AddKeyListener() {
    document.addEventListener("keydown", (e) => {
        const key = e.key.toUpperCase();
        if (e.ctrlKey && (key === "S" || key === "R")) {
            e.preventDefault();
            key === "S" ? saveState() : loadState();
            return;
        }

        if (endWord || !/^[A-Z ]$/.test(key) || key.length > 1) return;
        
        e.preventDefault();
        actCell.lastChild.innerText = key;
        if (!nextCell()) endWord = true;
    });
}

function showClue (sCell) {
    const cnum = Number (sCell.firstChild.innerHTML) ;
    const clue = Clues[cnum];
    const dir = cClue ? "c" : "d";
    const label = cClue ? "Cross" : "Down";

    // Update UI
    document.querySelectorAll('.highlighted')
            .forEach(el => el.classList.remove('highlighted'));
    
    let pos = getPos (sCell);
    for (let i = 0; i < clue.nc[dir]; i++) {
        let r = pos.r + (cClue ? 0 : i);
        let c = pos.c + (cClue ? i : 0);
        getCell (r, c).classList.add('highlighted');
    }
    document.getElementById("clue").innerHTML = 
        `${cnum} ${label}: ${clue.txt[dir]} (${clue.wg[dir]})`;
}

function highLight (cell) {
    if (actCell) actCell.style.backgroundColor = "white";
    cell.style.backgroundColor = "lightBlue";
    actCell = cell;
}

function nextCell () {
    let {r, c} = getPos(actCell);
    let nxt = cClue ? getCell(r, c + 1) : getCell(r + 1, c);
    
    if (nxt && nxt.style.backgroundColor === "white") {
        highLight(nxt);
        return true;
    }
    return false;
}

function hMouseClick(cell) {
    if (cell.style.backgroundColor === myBlack) return;
    let startC = getStartCell(cell, "cross");
    let startD = getStartCell(cell, "down");

    // Toggle logic
    if (startC && startD) cClue = !cClue; 
    else cClue = !!startC;

    showClue(cClue ? startC : startD);
    highLight(cell);
    endWord = false;
}

function getStartCell(cell, dir) {
    let {r, c} = getPos(cell);
    while (r >= 0 && c >= 0) {
        let cur = getCell(r, c);
        if (!cur || cur.style.backgroundColor === myBlack) return null;
        let cnum = cur.firstChild?.innerText;
        if (cnum) {
            // Keep scanning until we hit clue of that direction
            const clue = Clues[cnum];
            const hasWordInDir = dir === "cross" ? 
                    clue?.txt.c : clue?.txt.d;
            if (hasWordInDir) return cur;
        }
        dir === "cross" ? c-- : r--;
    }
    return null;
}
