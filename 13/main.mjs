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
	* @param {GamepadButton} buttonData
	* @param {number} offset
	*
	* @returns {number}
	*/
function solveMachine(buttonData, offset) {
	printd(`Solving for ${JSON.stringify(buttonData)}`, DEBUG);
	const { prize, a, b } = buttonData;
	// Adjust the prize coordinates with the offset
	const rPrize = {
		x: prize.x + offset,
		y: prize.y + offset
	};

	// Calculate the determinant of the matrix
	const det = a.x * b.y - a.y * b.x;

	if (det === 0) {
		printd("Determinant is zero, cannot solve the system", DEBUG);
		return 0;
	}

	// Solve for coefficients 'a' and 'b'
	const pressA = Math.floor((rPrize.x * b.y - rPrize.y * b.x) / det);
	const pressB = Math.floor((a.x * rPrize.y - a.y * rPrize.x) / det);

	// Recalculate prize to validate the solution
	const recalculatedPrize = {
		x: a.x * pressA + b.x * pressB,
		y: a.y * pressA + b.y * pressB
	};

	printd(` PressA=${pressA}`, DEBUG);
	printd(` PressB=${pressB}`, DEBUG);
	printd(` Recalc=${JSON.stringify(recalculatedPrize)}`, DEBUG);
	// Check if the recalculated prize matches the adjusted prize
	if (recalculatedPrize.x === rPrize.x && recalculatedPrize.y === rPrize.y) {
		return pressA * 3 + pressB;
	} else {
		return 0;
	}
}

function part1(lines) {
	let currentBlock = [];
	let totalInvestment = 0;

	lines.forEach(line => {
		if (line.trim() === "") {
			// Blank line indicates end of block
			if (currentBlock.length > 0) {
				const gameData = parseBlock(currentBlock);
				totalInvestment += solveMachine(gameData, 0);
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
		totalInvestment += solveMachine(gameData, 0);
	}


	console.log("Total Investment: ", totalInvestment);

}

function part2(lines) {
	let currentBlock = [];
	let totalInvestment = 0;

	lines.forEach(line => {
		if (line.trim() === "") {
			// Blank line indicates end of block
			if (currentBlock.length > 0) {
				const gameData = parseBlock(currentBlock);
				totalInvestment += solveMachine(gameData, 10000000000000);
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
		totalInvestment += solveMachine(gameData, 10000000000000);
	}


	console.log("Total Investment: ", totalInvestment);
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val) {
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
	const filePath = `${process.cwd()}/${mode}input.txt`;
	const lines = await readLines(filePath);

	printd(lines, DEBUG);

	if (part === 1) {
		part1(lines);
	} else if (part === 2) {
		part2(lines);
	}
})();

