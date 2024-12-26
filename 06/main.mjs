import { readLines, printd, printdMap, buildMapMatrix } from "../common.mjs";

let DEBUG = false;

function findStart(map) {
	const idLine = map.findIndex(line => line.includes('^'));
	const idCol = map[idLine].findIndex(c => c === "^");

	return [idLine, idCol];
}

function nextStep(line, col, dir) {
	let newDir = [];
	switch (dir) {
		case '>':
			newDir = [0, 1];
			break;
		case 'v':
			newDir = [1, 0];
			break;
		case '<':
			newDir = [0, -1];
			break;
		case '^':
			newDir = [-1, 0];
			break;
	}

	return [line + newDir[0], col + newDir[1]];
}

function nextDirection(line, col, dir, map) {
	const [nLin, nCol] = nextStep(line, col, dir);

	let nDir = dir;
	if (map[nLin] && map[nLin][nCol] && map[nLin][nCol] === '#') {
		switch (dir) {
			case '>':
				nDir = 'v';
				break;
			case 'v':
				nDir = '<';
				break;
			case '<':
				nDir = '^';
				break;
			case '^':
				nDir = '>';
				break;

		}
	}

	return nDir;
}

/**
	* @param {number} lin 
	* @param {number} col
	* @param {string} dir
	* @param {string[][]} map 
	* @param {Map} beenThereMap
	*/
function canBeLoop(lin, col, dir, map, beenThereMap) {
	printd(`Check for loop at (${lin},${col}) '${dir}'`, DEBUG);

	// Where to put the obstruction
	const [oLin, oCol] = nextStep(lin, col, dir);
	printd(`  Obstruction would be at (${oLin}, ${oCol})`, DEBUG)


	//console.log(`  (${lin}, ${col}) ${dir} (${oLin}, ${oCol})`);
	if (!map[oLin] || !map[oLin][oCol] || map[oLin][oCol] === "#") {
		return false;
	}

	map[oLin][oCol] = "#";
	let isLoop = true;
	let isOnArea = true;
	let steps = 0;

	const beenThere = new Map(beenThereMap);
	while (isOnArea) {
		dir = nextDirection(lin, col, dir, map);

		const key = getMoveKey(lin, col, dir);
		if (beenThere.has(key)) {
			//Found loop
			isOnArea = false
		} else {
			beenThere.set(key, 1);

			[lin, col] = nextStep(lin, col, dir);


			if (!map[lin] || !map[lin][col]) {
				isOnArea = false;
				isLoop = false;
			} else if (steps > 1300000) {
				// Hail mary exit clause
				isOnArea = false;
			}
			steps++;
		}
	}

	printd(`  This can be a loop: ${isLoop} `, DEBUG)
	map[oLin][oCol] = ".";
	return isLoop;
}
// 897 < ans < 1977 
function getMoveKey(lin, col, dir) {
	return `${lin}-${col}-${dir}`;
}

function part1(map) {
	let [lin, col] = findStart(map);
	let direction = '^';
	let isOnArea = true;

	printd(`Start position at(${lin}, ${col})`, DEBUG);

	while (isOnArea) {
		map[lin][col] = "X";

		// Look ahead and see if we can continue on that direction (or turn)
		direction = nextDirection(lin, col, direction, map);

		// Now check the next step with the correct direction
		[lin, col] = nextStep(lin, col, direction);

		// Are we still in the map?
		if (!map[lin] || !map[lin][col]) {
			isOnArea = false;
		}
	}

	const visited = map.flat().filter(c => c === 'X').length;

	console.log(`Visited ${visited} areas`);
}

function part2(map) {
	let [lin, col] = findStart(map);
	let direction = '^';
	let isOnArea = true;
	let possibleObstructionPosition = 0;

	printd(`Start position at(${lin}, ${col})`, DEBUG);

	const beenThereMap = new Map();
	let count = 0;
	while (isOnArea) {
		map[lin][col] = "X";
		count++;

		if (count % 10 === 0) {
			console.log(`Ran ${count} times`);
		}

		// Look ahead and see if we can continue on that direction (or turn)
		direction = nextDirection(lin, col, direction, map);

		// Remember we were here and at that direction
		beenThereMap.set(getMoveKey(lin, col, direction), 1);

		// Now check the next step with the correct direction
		[lin, col] = nextStep(lin, col, direction);

		//test for possible loop
		//printdMap(map, DEBUG);
		if (canBeLoop(lin, col, direction, map, beenThereMap)) {
			possibleObstructionPosition++;
		}

		// Are we still in the map?
		if (!map[lin] || !map[lin][col]) {
			isOnArea = false;
		}
	}

	console.log(`Possible obstructions position ${possibleObstructionPosition}`);
}

(async () => {
	let mode = 'r'; //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val, index, array) {
		if (val === '-d') {
			DEBUG = true;
		} else if (val.startsWith('-t')) {
			mode = val.slice(1);
		} else if (val === '2') {
			part = 2;
		}
	});
	const filePath = `${mode}input.txt`;
	const lines = await readLines(filePath);

	const map = buildMapMatrix(lines);
	printdMap(map, DEBUG);

	if (part === 1) {
		part1(map);
	} else if (part === 2) {
		part2(map);
	}
})();

