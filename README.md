# Crossword Digitizer: Grid Reconstruction from Clues

This project explores the feasibility of digitizing newspaper crossword puzzles using only the text from the clues section. 

While traditional digitization often relies on scanning the grid as an image, this tool "reverse-engineers" the layout by processing the word lengths provided in the OCR-extracted text of Across and Down clues.

## The Challenge
The goal of this project was to determine if a valid crossword grid could be reconstructed solely from clue metadata (length and sequence) without any visual reference to the original black-and-white squares.

## Logic & Rules of the Puzzle Layout
Through this experiment, I identified several core rules that govern standard newspaper crossword layouts. These rules form the foundation of the reconstruction algorithm:

*   **Standard Dimensions:** The grid size is typically 15x15.
*   **Word Termination:** Every word (Across or Down) must end at a black square, unless it reaches the outer boundary of the grid.
*   **Word Separation:** There must be at least one black square between any two distinct words in the same row or column.
*   **Intersection Logic:** To permit the intersection of Across and Down words, grid occupancy is managed with two state flags. This allows the algorithm to handle overlapping paths correctly.
*   **Rotational Symmetry:** Professional crosswords are designed with rotational symmetry. While the crossword is pre-designed using this rule, this project treats symmetry as an inherent quality of the data rather than a necessary constraint for the reconstruction process.

## How it Works
1.  **OCR Processing:** The clues section of the newspaper is scanned and read as simple text.
2.  **Metadata Extraction:** The system parses the clue numbers and their associated word lengths.
3.  **Grid Mapping:** The algorithm places words based on the sequence of lengths, ensuring all intersections are valid and all word-terminations adhere to the layout rules.

## Acknowledgements
Google AI assisted me in polishing this README. Also helped me with identifying
my blind spots in handling word crossings.
