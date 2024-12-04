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

		list1.sort();
		list2.sort();

		if (DEBUG_MODE) {
			console.log("List1: ", list1);
			console.log("List2: ", list2);
		}
		let sum = 0;
		for (idx in list1) {
			sum += Math.abs(list1[idx] - list2[idx])
		}

		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

