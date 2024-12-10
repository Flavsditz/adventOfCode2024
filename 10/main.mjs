import { readLines, printd, printdMap, buildMapMatrix } from "../common.mjs";

let DEBUG = false
let PART1 = true

/**
	* @param {number} zRow The row of the zero point to be analyzed
	* @param {number} zCol The col of the zero point to be analyzed
	* @param {number[][]} map The map
	*
	* @returns {string[]} the possible directions ( <, >, ^, v)
	*/
function findPossibleDirections(zRow, zCol, map) {
	const next = String(Number(map[zRow][zCol]) + 1);

	if (next > 9) {
		return ['='];
	}

	const res = []

	if (map[zRow - 1] && map[zRow - 1][zCol] === next) {
		res.push('^');
	}

	if (map[zRow + 1] && map[zRow + 1][zCol] === next) {
		res.push('v');
	}

	if (map[zRow][zCol - 1] && map[zRow][zCol - 1] === next) {
		res.push('<');
	}
	if (map[zRow][zCol + 1] && map[zRow][zCol + 1] === next) {
		res.push('>');
	}

	printd(`    Found directions for (${zRow},${zCol}): ${JSON.stringify(res)}`, DEBUG);
	return res;
}

/**
	* @param {number} row The row of the point we are in
	* @param {number} col The col of the point we are in
	* @param {number[][]} map The map
	* @param {object} visited A map of visited places
	*
	* @returns {number} the count of possible trails from that point
	*/
function countTrails(row, col, map, visited) {

	if (PART1) {
		const key = `${row}-${col}`;
		if (visited[key]) {
			return 0;
		}

		visited[key] = 1;

	}
	let peaks = 0;
	findPossibleDirections(row, col, map).forEach(dir => {
		switch (dir) {
			case '=':
				peaks++;
				break;
			case '^':
				peaks += countTrails(row - 1, col, map, visited);
				break;
			case 'v':
				peaks += countTrails(row + 1, col, map, visited);
				break;
			case '<':
				peaks += countTrails(row, col - 1, map, visited);
				break;
			case '>':
				peaks += countTrails(row, col + 1, map, visited);
				break;
		}
	});

	return peaks;
}

/**
	* @param {number[][]} map The map
	*/
function part1(map) {

	let sum = 0;
	map.forEach((row, rIdx) => {
		row.forEach((num, cIdx) => {
			if (Number(num) === 0) {
				printd(`  Found 0 in ${rIdx}, ${cIdx}`, DEBUG);
				const found = countTrails(rIdx, cIdx, map, {});

				printd(`   There are ${found} trails here`, DEBUG);
				sum += found;
			};
		});
	});

	console.log("Sum is: ", sum);
}

/**
	* @param {number[][]} map The map
	*/
function part2(map) {
	let sum = 0;
	map.forEach((row, rIdx) => {
		row.forEach((num, cIdx) => {
			if (Number(num) === 0) {
				printd(`  Found 0 in ${rIdx}, ${cIdx}`, DEBUG);
				const found = countTrails(rIdx, cIdx, map, {});

				printd(`   There are ${found} trails here`, DEBUG);
				sum += found;
			};
		});
	});

	console.log("Sum is: ", sum);
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val, index, array) {
		if (val === '-d') {
			DEBUG = true;
		}
		if (val === '-t') {
			mode = 't';
		}
		if (val === '-s') {
			mode = 's';
		}
		if (val === '2') {
			part = 2;
			PART1 = false;
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
