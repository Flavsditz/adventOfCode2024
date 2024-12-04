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

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		if (DEBUG_MODE) {
			console.log(lines);
		}

		const list1 = [];
		const list2 = [];

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const [first, second] = line.trim().split(/\s+/).map(Number);
				list1.push(first);
				list2.push(second);
			}
		});

		if (DEBUG_MODE) {
			console.log("List1: ", list1);
			console.log("List2: ", list2);
		}

		let sum = 0;

		const refMap = list2.reduce((map, num) => {
			map[num] = (map[num] || 0) + 1;
			return map;
		}, {});

		for (const i in list1) {
			const n = list1[i];

			if (refMap[n]) {
				sum += n * refMap[n];
			}
		}

		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

