import { readLines, printd, printdMap, buildMapMatrix } from "../common.mjs";

let DEBUG = false;

function findStart(map) {
	const idLine = map.findIndex(line => line.includes('^'));
	const idCol = map[idLine].findIndex(c => c === "^");

	return [idLine, idCol];
}

function nextStep(line, col, dir) {
	let newLine, newCol = 0;
	switch (dir) {
		case '>':
			newLine = line;
			newCol = col + 1;
			break;
		case 'v':
			newLine = line + 1;
			newCol = col;
			break;
		case '<':
			newLine = line;
			newCol = col - 1;
			break;
		case '^':
			newLine = line - 1;
			newCol = col;
			break;
	}

	return [newLine, newCol];
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

function canBeLoop(lin, col, dir, map) {
	printd(`Check for loop at (${lin},${col}) '${dir}'`, DEBUG);
	//if we put an obstruction on the next step would we loop?
	const cp = JSON.parse(JSON.stringify(map));

	// Register starting point
	const [stLin, stCol, sDir] = [lin, col, dir];

	// Where to put the obstruction
	const [oLin, oCol] = nextStep(lin, col, dir);
	printd(`  Obstruction would be at (${oLin}, ${oCol})`, DEBUG)


	//console.log(`  (${lin}, ${col}) ${dir} (${oLin}, ${oCol})`);
	if (!cp[oLin] || !cp[oLin][oCol]) {
		return false;
	}

	cp[oLin][oCol] = "#";
	let isLoop = true;
	let isOnArea = true;
	let steps = 0;
	while (isOnArea) {
		dir = nextDirection(lin, col, dir, cp);
		[lin, col] = nextStep(lin, col, dir);


		if (!cp[lin] || !cp[lin][col]) {
			isOnArea = false;
			isLoop = false;
		} else if (stLin === lin && stCol === col && sDir === dir || steps > 1300000) {
			// Found loop let's get out of this one
			isOnArea = false;
		}
		steps++;
	}


	printd(`  This can be a loop: ${isLoop} `, DEBUG)
	return isLoop;
}
// 897 < ans < 1977 

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

	let count = 0;
	while (isOnArea) {
		map[lin][col] = "X";
		count++;

		if (count % 10 === 0) {
			console.log(`Ran ${count} times`);
		}

		// Look ahead and see if we can continue on that direction (or turn)
		direction = nextDirection(lin, col, direction, map);

		// Now check the next step with the correct direction
		[lin, col] = nextStep(lin, col, direction);

		//If next step has been visited already test for possible loop
		//printdMap(map, DEBUG);
		if (canBeLoop(lin, col, direction, map)) {
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
		}
		if (val === '-t') {
			mode = 't';
		}
		if (val === '2') {
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

