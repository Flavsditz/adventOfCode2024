import { readLines, printd } from "../common.mjs";

let DEBUG = false;
const DB = new Map();


function saveInDB(stone, turnus, count) {
	const key = `${stone}-${turnus}`;
	if (!DB.has(key)) {
		DB.set(key, count);
	}
}

function isInDB(stone, turnus) {
	const key = `${stone}-${turnus}`;

	return DB.has(key);
}

function getFromDB(stone, turnus) {
	const key = `${stone}-${turnus}`;

	return DB.get(key);
}

/**
	* @param {string} stone
	* @param {number} countLeft
	*
	* @returns {number} stone count
	*/
function blink(stone, countLeft) {
	printd(`${"-".repeat(countLeft)}Stone ${stone} (${countLeft})`, DEBUG);
	if (countLeft === 0) {
		return 1;
	}

	if (isInDB(stone, countLeft)) {
		const res = getFromDB(stone, countLeft);
		printd(`${"-".repeat(countLeft)}HIT ${stone} (${countLeft}) = ${res}`, DEBUG);

		return res;
	}

	let totalCount = 0;
	if (stone === "0") {
		const newStone = "1"
		totalCount += blink(newStone, countLeft - 1);

		saveInDB(newStone, countLeft - 1, totalCount);
	} else if (stone.length % 2 === 0) {
		const halfIdx = stone.length / 2;

		const newCount = countLeft - 1;
		let newStone = String(Number(stone.slice(0, halfIdx)));
		totalCount += blink(newStone, newCount);
		saveInDB(newStone, newCount, totalCount);

		newStone = String(Number(stone.slice(halfIdx)));
		const partialResult = blink(newStone, newCount);
		saveInDB(newStone, newCount, partialResult);

		totalCount += partialResult;
	} else {
		const newStone = String(Number(stone) * 2024);
		totalCount += blink(newStone, countLeft - 1);

		saveInDB(newStone, countLeft - 1, totalCount);
	}

	return totalCount;
}

function part1(lines, initialCount) {
	const sum = lines.join(" ").trim().split(" ").map(stone => blink(stone, initialCount)).reduce((acc, val) => acc + val, 0);

	console.log("Number of stones: ", sum);
}

function part2(lines, initialCount) {
	const sum = lines.join(" ").trim().split(" ").map(stone => blink(stone, initialCount)).reduce((acc, val) => acc + val, 0);

	console.log("Number of stones: ", sum);
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;
	let count = 1;

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
		if (val.startsWith("-c")) {
			count = Number(val.slice(2));
		}
	});
	const filePath = `${mode}input.txt`;
	const lines = await readLines(filePath);

	printd(lines, DEBUG);

	if (part === 1) {
		part1(lines, count);
	} else if (part === 2) {
		part2(lines, count);
	}
})();

