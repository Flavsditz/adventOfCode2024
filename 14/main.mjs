import { inherits } from "util";
import { readLines, printd, printdMap } from "../common.mjs";
import { Point } from "../point.mjs";

let DEBUG = false;

class Robot {
	constructor(x, y, vx, vy) {
		this.lin = Number(y);
		this.col = Number(x);
		this.linSpeed = Number(vy);
		this.colSpeed = Number(vx);
	}

	move() {
		this.lin += this.linSpeed;
		this.col += this.colSpeed;
	}

	findInMap(mLines, mCols) {
		let restLins = this.lin % mLines;
		let restCols = this.col % mCols;

		if (restLins < 0) {
			restLins = mLines + restLins;
		}

		if (restCols < 0) {
			restCols = mCols + restCols;
		}

		return [restLins, restCols];
	}
}

/**
	* @param {string} line
	* @returns {Robot}
	*/
function parseRobot(line) {
	const regex = /p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)/g;
	const matches = [];
	let match;
	while ((match = regex.exec(line)) !== null) {
		matches.push(match.slice(1)); // Extract groups as an array
	}
	return new Robot(matches[0][0], matches[0][1], matches[0][2], matches[0][3]);
}

function part1(lines, map, seconds = 100) {
	const robots = lines.filter(l => l.trim() !== "").map(l => parseRobot(l));

	for (let i = 0; i < seconds; i++) {
		robots.forEach(r => r.move());
	}

	const mapWidth = map[0].length;
	const mapHeight = map.length;
	const midLine = Math.floor(mapHeight / 2);
	const midCol = Math.floor(mapWidth / 2);
	const quadrants = [0, 0, 0, 0];
	robots.forEach(r => {
		const [lin, col] = r.findInMap(mapHeight, mapWidth);

		if (map[lin][col] === '.') {
			map[lin][col] = '1';
		} else {
			map[lin][col] = String(Number(map[lin][col]) + 1)
		}

		if (lin < midLine) {
			if (col < midCol) {
				quadrants[0] += 1;
			} else if (col > midCol) {
				quadrants[1] += 1;
			}
		} else if (lin > midLine) {
			if (col < midCol) {
				quadrants[2] += 1;
			} else if (col > midCol) {
				quadrants[3] += 1;
			}
		}
	})

	printd(`AFTER ${seconds} SECONDS`, DEBUG);
	printdMap(map, DEBUG);
	printd(`Quadrants: ${quadrants}`, DEBUG);

	const result = quadrants.reduce((acc, val) => acc * val, 1);
	console.log(`Safety factor: `, result);
}

function variance(arr) {
	if (arr.length === 0) return 0; // Handle empty array
	const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;
	return arr.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / arr.length;
}

// Modular inverse of W modulo H
function modInverse(a, m) {
	const [g, x] = extendedGCD(a, m);
	if (g !== 1) throw new Error("Modular inverse does not exist");
	return (x % m + m) % m;
}

// Extended GCD to compute modular inverse
function extendedGCD(a, b) {
	if (b === 0) return [a, 1, 0];
	const [g, x1, y1] = extendedGCD(b, a % b);
	return [g, y1, x1 - Math.floor(a / b) * y1];
}

function part2(lines, map) {
	const robots = lines.filter(l => l.trim() !== "").map(l => parseRobot(l));
	const mapWidth = map[0].length;
	const mapHeight = map.length;

	let baseX = 0;
	let baseY = 0;
	let baseXVar = 10000;
	let baseYVar = 10000;
	for (let i = 0; i < 103; i++) {
		robots.forEach(r => r.move());

		const robotsX = robots.map(r => r.findInMap(mapHeight, mapWidth)[1]);
		const robotsY = robots.map(r => r.findInMap(mapHeight, mapWidth)[0]);

		const tVarX = variance(robotsX);
		const tVarY = variance(robotsY);

		if (tVarX < baseXVar) {
			[baseX, baseXVar] = [i + 1, tVarX];
		}
		if (tVarY < baseYVar) {
			[baseY, baseYVar] = [i + 1, tVarY];
		}
	}

	const modularInverseW = modInverse(mapWidth, mapHeight);
	let modResult = (modularInverseW * (baseY - baseX)) % mapHeight;
	if (modResult < 0) {
		modResult = mapHeight + modResult;
	}
	const result = baseX + modResult * mapWidth;

	console.log("Part 2:", result);
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 2;

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

	const map = mode !== 'r' ? Array.from(Array(7), () => new Array(11)) : Array.from(Array(103), () => new Array(101));
	map.forEach(l => l.fill('.'));

	if (part === 1) {
		part1(lines, map);
	} else if (part === 2) {
		part2(lines, map);
	}
})();

