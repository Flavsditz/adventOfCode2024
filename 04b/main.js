const fs = require('fs').promises;

const DEBUG_MODE = false
const MODE = 'r' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;

async function readLines(path) {
	try {
		const inputD = await fs.readFile(path);
		return inputD.toString().split('\n');
	} catch (err) {
		throw err;
	}
}

function printd(str) {
	if (DEBUG_MODE) {
		console.log(str);
	}
}

/**
	* We look at the central A and check if the cardinal positions correspond to our expectation 
	* we assume that the starting i,j contain an X
	*/
function isXMAS(mat, i, j) {
	if (mat[i][j] !== 'A') {
		return 0;
	}

	if ((i - 1 >= 0) && (i + 1 < mat.length) && (j - 1 >= 0) && (j + 1 < mat[0].length)) {
		printd(`Safe to get in at (${i},${j})`)
		//We can check for XMAS
		//Count if we got 2 M and 2 S
		const checkStr = mat[i - 1][j - 1] + mat[i - 1][j + 1] + mat[i + 1][j - 1] + mat[i + 1][j + 1];

		const countM = Array.from(checkStr).filter(c => c === "M").length;
		const countS = Array.from(checkStr).filter(c => c === "S").length;

		if (countM !== 2 || countS !== 2) {
			return false;
		}

		//Check if each M has an S opposite to it

		if (mat[i - 1][j - 1] === 'M') {
			if (mat[i + 1][j + 1] !== 'S') {
				return false;
			}
		}
		if (mat[i - 1][j + 1] === 'M') {
			if (mat[i + 1][j - 1] !== 'S') {
				return false;
			}
		}
		if (mat[i + 1][j - 1] === 'M') {
			if (mat[i - 1][j + 1] !== 'S') {
				return false;
			}
		}
		if (mat[i + 1][j + 1] === 'M') {
			if (mat[i - 1][j - 1] !== 'S') {
				return false;
			}
		}
	} else {
		return false;
	}

	printd("   - true")
	return true;
}

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines);

		let sum = 0;

		const puzzle = lines.filter(line => line !== "").map((line) => line.trim());

		for (let row = 0; row < puzzle.length; row++) {
			for (let col = 0; col < puzzle.length; col++) {
				if (puzzle[row][col] === 'A') {
					sum += isXMAS(puzzle, row, col) ? 1 : 0;
				}
			}

		}

		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

