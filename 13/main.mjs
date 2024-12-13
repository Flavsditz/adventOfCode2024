import { readLines, printd } from "../common.mjs";

let DEBUG = false

class GameData {
	constructor(aX = 0, aY = 0, bX = 0, bY = 0, prizeX = 0, prizeY = 0) {
		this.a = { x: aX, y: aY };
		this.b = { x: bX, y: bY };
		this.prize = { x: prizeX, y: prizeY };
	}
}

function parseBlock(lines) {
	const gameData = new GameData();
	lines.forEach(line => {
		// Match the line using a regular expression
		const match = line.match(/(Button A|Button B|Prize):\s*X[+=](\d+),\s*Y[+=](\d+)/);
		if (match) {
			const label = match[1];
			const x = parseInt(match[2], 10);
			const y = parseInt(match[3], 10);

			if (label === "Button A") {
				gameData.a.x = x;
				gameData.a.y = y;
			} else if (label === "Button B") {
				gameData.b.x = x;
				gameData.b.y = y;
			} else if (label === "Prize") {
				gameData.prize.x = x;
				gameData.prize.y = y;
			}
		}
	});
	return gameData;
}

/**
	* @param {GameData} data
	*
	* @returns {number}
	*/
function calculateBestGame(data) {
	const { a, b, prize } = data;

	let [pressA, pressB] = [0, 0];
	if (prize.x > prize.y) {
		if (a.y > b.y) {
			[pressA, pressB] = calcOptimum(Math.floor(prize.y / a.y), prize.y, prize.x, a.y, a.x, b.y, b.x);
		} else {
			[pressB, pressA] = calcOptimum(Math.floor(prize.y / b.y), prize.y, prize.x, b.y, b.x, a.y, a.x);
		}
	} else {
		if (a.x > b.x) {
			[pressA, pressB] = calcOptimum(Math.floor(prize.x / a.x), prize.x, prize.y, a.x, a.y, b.x, b.y);
		} else {
			[pressB, pressA] = calcOptimum(Math.floor(prize.x / b.x), prize.x, prize.y, b.x, b.y, a.x, a.y);
		}
	}

	printd(`For game ${JSON.stringify(data)} the press are A: ${pressA} and B: ${pressB} (total=${3 * pressA + pressB})`, DEBUG)
	return 3 * pressA + pressB
}

function calcOptimum(maxPress, prizeDim1, prizeDim2, btn1Dim1, btn1Dim2, btn2Dim1, btn2Dim2) {
	if (maxPress > 100) {
		maxPress = 100;
	}

	for (let i = maxPress; i > 0; i--) {
		if (Number.isInteger((prizeDim1 - btn1Dim1 * i) / btn2Dim1)) {
			const presses = (prizeDim2 - btn1Dim2 * i) / btn2Dim2;
			if (Number.isInteger(presses)) {
				return presses > 100 ? [0, 0] : [i, presses];
			}
		}
	}

	return [0, 0];
}

function part1(lines) {
	let currentBlock = [];
	let totalInvestment = 0;

	lines.forEach(line => {
		if (line.trim() === "") {
			// Blank line indicates end of block
			if (currentBlock.length > 0) {
				const gameData = parseBlock(currentBlock);
				totalInvestment += calculateBestGame(gameData);
				currentBlock = [];
			}
		} else {
			// Collect lines for the current block
			currentBlock.push(line.trim())
		}
	});

	// Handle the last block if the file doesn't end with a blank line
	if (currentBlock.length > 0) {
		const gameData = parseBlock(currentBlock);
		totalInvestment += calculateBestGame(gameData);
	}


	console.log("Total Investment: ", totalInvestment);

}

function part2(lines) {
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val, index, array) {
		if (val === '-d') {
			DEBUG = true;
		}
		if (val.startsWith('-t')) {
			mode = val.slice(1);
		}
		if (val === '2') {
			part = 2;
		}
	});
	const filePath = `${mode}input.txt`;
	const lines = await readLines(filePath);

	printd(lines, DEBUG);

	if (part === 1) {
		part1(lines);
	} else if (part === 2) {
		part2(lines);
	}
})();

