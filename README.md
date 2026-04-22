# Generating Cross word Puzzle Grid 
  
This is my attempt to digitize crossword puzzles
published in newspaper. While I could have 
scanned the grid as image and used javascript to 
get its digital version, I wanted to explore
if I am able to generate the grid just from the
clues section that is read as simple text (using OCR)
that has details of word lenths.

It gave me some understanding of rules that
govern the layout of a type of cross word puzzle.

The rules appear to be
 1. Cross word grid size is normally 15x15
 2. End of each word (either across or down) will
    terminate with a black square excepting when
    word ending the boundary of puzzle
 3. There is at least one grid cell space between
    any two words in either down or cross directions
 4. Grid occupancy in either direction have to be
    handled with two state flags to permit intersection
    of cross and down clues.
 5. The grid has rotational symmetry by design. However, this
    detail does not play any role in reconstructing the
    cross word grid. Note that the cross word is already
    designed using this rule. 
