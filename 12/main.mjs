import { readLines, printd, buildMapMatrix, printdMap } from "../common.mjs";

let DEBUG = false

function mapOutPlot(lin, col, map) {
	let area = 0;
	let perimeter = 0;

	const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	const crop = map[lin][col];
	const visited = [];
	const toVisit = [[lin, col]];

	printd(`Analyzing crop ${crop}`, DEBUG);
	while (toVisit.length > 0) {
		const [pLin, pCol] = toVisit.shift();

		area++;

		directions.forEach(d => {
			const nLin = pLin + d[0];
			const nCol = pCol + d[1];

			if (!map[nLin] || !map[nLin][nCol]) {
				perimeter++;
			} else if (map[nLin][nCol] !== "#" && map[nLin][nCol] !== crop) {
				perimeter++;
			} else if (map[nLin][nCol] === crop) {
				if (toVisit.findIndex(e => e[0] === nLin && e[1] === nCol) === -1) {
					toVisit.push([nLin, nCol]);
				}
			}
		})

		map[pLin][pCol] = "#";
		visited.push([pLin, pCol]);
	}

	visited.forEach(pos => {
		map[pos[0]][pos[1]] = "."
	})

	return area * perimeter;
}

function mapOutPlotPerimeterFirst(lin, col, map) {
	let area = 0;

	const directions = [[-1, 0, 'N'], [0, 1, 'E'], [1, 0, 'S'], [0, -1, 'W']];
	const crop = map[lin][col];
	const visited = [];
	const toVisit = [[lin, col]];
	const outsideNodes = new Set();

	printd(`Analyzing crop ${crop}`, DEBUG);
	while (toVisit.length > 0) {
		const [pLin, pCol] = toVisit.shift();

		area++;

		directions.forEach(d => {
			const nLin = pLin + d[0];
			const nCol = pCol + d[1];

			if (!map[nLin] || !map[nLin][nCol]) {
				outsideNodes.add([pLin, pCol, d[2]])
			} else if (map[nLin][nCol] !== "#" && map[nLin][nCol] !== crop) {
				outsideNodes.add([pLin, pCol, d[2]])
			} else if (map[nLin][nCol] === crop) {
				if (toVisit.findIndex(e => e[0] === nLin && e[1] === nCol) === -1) {
					toVisit.push([nLin, nCol]);
				}
			}
		})

		map[pLin][pCol] = "#";
		visited.push([pLin, pCol]);
	}

	visited.forEach(pos => {
		map[pos[0]][pos[1]] = "."
	})

	const perimeter = calculatePerimeter(outsideNodes);
	return area * perimeter;
}

/**
	* @param {Set} nodes 
	*/
function calculatePerimeter(nodes) {
	const nNodes = {};
	const eNodes = {};
	const wNodes = {};
	const sNodes = {};
	nodes.forEach(n => {
		switch (n[2]) {
			case 'N':
				if (nNodes[n[0]]) {
					nNodes[n[0]].push(n[1]);
				} else {
					nNodes[n[0]] = [n[1]];
				}
				break;
			case 'E':
				if (eNodes[n[1]]) {
					eNodes[n[1]].push(n[0]);
				} else {
					eNodes[n[1]] = [n[0]];
				}
				break;
			case 'W':
				if (wNodes[n[1]]) {
					wNodes[n[1]].push(n[0]);
				} else {
					wNodes[n[1]] = [n[0]];
				}
				break;
			case 'S':
				if (sNodes[n[0]]) {
					sNodes[n[0]].push(n[1]);
				} else {
					sNodes[n[0]] = [n[1]];
				}
				break;
		}
	});

	let sides = 0;
	sides += countContiguous(nNodes)
	console.log(" North sides ", nNodes, sides);
	sides += countContiguous(sNodes)
	console.log(" South sides ", sNodes, sides);
	sides += countContiguous(eNodes)
	console.log(" East sides ", eNodes, sides);
	sides += countContiguous(wNodes)
	console.log(" West sides ", wNodes, sides);

	printd(`  Has ${sides} sides`, DEBUG);
	return sides;
}

/**
	* @param {Record<number, number[]>} nodes
	*/
function countContiguous(nodes) {
	let sides = 0
	Object.values(nodes).forEach(val => {
		val.sort()

		let last = val[0];
		sides++;
		val.forEach(i => {
			if (i - last > 1) {
				sides++;
			}

			last = i;
		})
	})
	return sides;
}

function part1(map) {

	let totalPrice = 0;
	map.forEach((lin, lIdx) => {
		lin.forEach((col, cIdx) => {
			if (map[lIdx][cIdx] !== '.') {
				totalPrice += mapOutPlot(lIdx, cIdx, map);
			}
		})
	})

	console.log("Total price: ", totalPrice);
}

function part2(map) {

	let totalPrice = 0;
	map.forEach((lin, lIdx) => {
		lin.forEach((col, cIdx) => {
			if (map[lIdx][cIdx] !== '.') {
				totalPrice += mapOutPlotPerimeterFirst(lIdx, cIdx, map);
			}
		})
	})

	console.log("Total price: ", totalPrice);
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

	const map = buildMapMatrix(lines);
	printdMap(map, DEBUG);

	if (part === 1) {
		part1(map);
	} else if (part === 2) {
		part2(map);
	}
})();
