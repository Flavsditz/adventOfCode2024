import { readLines, printd, printdMap, buildMapMatrix } from "../common.mjs";

let DEBUG = false

function findAntenaMap(map) {
	const antenaMap = {};

	map.forEach((row, rIndex) => {
		row.forEach((col, cIndex) => {
			if (col != ".") {
				if (!antenaMap[col]) {
					antenaMap[col] = [[rIndex, cIndex]];
				} else {
					antenaMap[col].push([rIndex, cIndex]);
				}
			}
		});
	});

	return antenaMap;
}

function findHotspot(ant1, ant2, mapWidth, mapHeight, part2 = false) {
	const rDiff = ant1[0] - ant2[0];
	const cDiff = ant1[1] - ant2[1];

	const hotspots = [];
	let hot1 = ant1;
	let hot2 = ant2;
	while (true) {
		hot1 = [hot1[0] + rDiff, hot1[1] + cDiff];

		if (hot1[0] >= 0 && hot1[0] < mapHeight && hot1[1] >= 0 && hot1[1] < mapWidth) {
			hotspots.push(hot1)
		} else {
			break;
		}

		if (!part2) {
			break;
		}

	}
	while (true) {
		hot2 = [hot2[0] - rDiff, hot2[1] - cDiff];

		if (hot2[0] >= 0 && hot2[0] < mapHeight && hot2[1] >= 0 && hot2[1] < mapWidth) {
			hotspots.push(hot2)
		} else {
			break;
		}

		if (!part2) {
			break;
		}
	}

	printd(`    For pair (${ant1}) and (${ant2}) hotspots are ==> (${JSON.stringify(hotspots)})`, DEBUG);
	return hotspots;
}

function part1(map) {
	const mapWidth = map[0].length;
	const mapHeight = map.length;
	const antenaMap = findAntenaMap(map);

	printd(antenaMap, DEBUG);

	const hotspotsLocations = new Set();
	Object.keys(antenaMap).forEach(antena => {
		const locations = antenaMap[antena];
		printd(`  Working through antena '${antena}'`, DEBUG);
		for (let i = 0; i < locations.length - 1; i++) {
			for (let j = i + 1; j < locations.length; j++) {
				findHotspot(locations[i], locations[j], mapWidth, mapHeight).forEach(h => hotspotsLocations.add(`${h[0]}-${h[1]}`));
			}
		}
	});
	const sum = hotspotsLocations.size;

	printd(hotspotsLocations, DEBUG);
	console.log("Total sum: ", sum);
}

function part2(map) {
	const mapWidth = map[0].length;
	const mapHeight = map.length;
	const antenaMap = findAntenaMap(map);

	printd(antenaMap, DEBUG);

	const hotspotsLocations = new Set();
	Object.keys(antenaMap).forEach(antena => {
		const locations = antenaMap[antena];
		printd(`  Working through antena '${antena}'`, DEBUG);
		for (let i = 0; i < locations.length - 1; i++) {
			for (let j = i + 1; j < locations.length; j++) {
				findHotspot(locations[i], locations[j], mapWidth, mapHeight, true).forEach(h => hotspotsLocations.add(`${h[0]}-${h[1]}`));
			}
		}
		locations.forEach(a => hotspotsLocations.add(`${a[0]}-${a[1]}`));
	});
	const sum = hotspotsLocations.size;

	printd(hotspotsLocations, DEBUG);
	console.log("Total sum: ", sum);
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

