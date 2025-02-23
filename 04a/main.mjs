import { readLines, printd } from "../common.mjs";

const D = false
const MODE = 'r' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;

/**
	* there are 8 directions to check so we'll use the cardinal directions to denote them (N, S, E, W, NE, NW, SE, SW)
	* we assume that the starting i,j contain an X
	*/
function countXMAS(mat, i, j) {
	if (mat[i][j] !== 'X') {
		return 0;
	}

	const searchWord = "XMAS";
	const searchLen = searchWord.length;
	let sum = 0;

	if (i + 1 >= searchLen) {
		// can check for N safely
		if (mat[i][j] + mat[i - 1][j] + mat[i - 2][j] + mat[i - 3][j] === searchWord) {
			printd(`Found for (${i},${j}) in N`, D);
			sum++;
		}
	}
	if ((mat.length - i) >= searchLen) {
		// can check for S safely
		if (mat[i][j] + mat[i + 1][j] + mat[i + 2][j] + mat[i + 3][j] === searchWord) {
			printd(`Found for (${i},${j}) in S`, D);
			sum++;
		}
	}
	if ((mat[i].length - j) >= searchLen) {
		// can check for E safely
		if (mat[i].substr(j, searchLen) === searchWord) {
			printd(`Found for (${i},${j}) in E`, D);
			sum++;
		}
	}
	if (j + 1 >= searchLen) {
		// can check for W safely
		if (mat[i][j] + mat[i][j - 1] + mat[i][j - 2] + mat[i][j - 3] === searchWord) {
			printd(`Found for (${i},${j}) in W`, D);
			sum++;
		}
	}
	if (j + 1 >= searchLen && i + 1 >= searchLen) {
		// can check for NW safely
		if (mat[i][j] + mat[i - 1][j - 1] + mat[i - 2][j - 2] + mat[i - 3][j - 3] === searchWord) {
			printd(`Found for (${i},${j}) in NW`, D);
			sum++;
		}
	}
	if (j + 1 >= searchLen && (mat[i].length - i) >= searchLen) {
		// can check for NE safely
		if (mat[i][j] + mat[i + 1][j - 1] + mat[i + 2][j - 2] + mat[i + 3][j - 3] === searchWord) {
			printd(`Found for (${i},${j}) in NE`, D);
			sum++;
		}
	}
	if ((mat.length - j) >= searchLen && i + 1 >= searchLen) {
		// can check for SW safely
		if (mat[i][j] + mat[i - 1][j + 1] + mat[i - 2][j + 2] + mat[i - 3][j + 3] === searchWord) {
			printd(`Found for (${i},${j}) in SW`, D);
			sum++;
		}
	}
	if ((mat.length - j) >= searchLen && (mat[i].length - i) >= searchLen) {
		// can check for SE safely
		if (mat[i][j] + mat[i + 1][j + 1] + mat[i + 2][j + 2] + mat[i + 3][j + 3] === searchWord) {
			printd(`Found for (${i},${j}) in SE`, D);
			sum++;
		}
	}

	return sum;
}

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines, D);

		let sum = 0;

		const puzzle = lines.filter(line => line !== "").map((line) => line.trim());

		for (let row = 0; row < puzzle.length; row++) {
			for (let col = 0; col < puzzle.length; col++) {
				if (puzzle[row][col] === 'X') {
					sum += countXMAS(puzzle, row, col);
				}
			}

		}

		console.log("The Sum is: ", sum);
	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

