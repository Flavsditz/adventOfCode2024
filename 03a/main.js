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

function printd(str) {
	if (DEBUG_MODE) {
		console.log(str);
	}
}

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines);

		let sum = 0;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const myRe = /(mul\(\d+,\d+\))/gm;
				const text = line.trim();
				const myArray = [...text.matchAll(myRe)];

				myArray.forEach(entry => {
					printd(`Got ${entry[0]}`);
					const numsStr = [...entry[0].matchAll(/\d+/gm)];
					printd(`  With ${numsStr}`);
					const nums = numsStr.map(e => Number(e[0])).reduce((acc, val) => acc * val, 1);

					sum += nums;
				});

				printd("\n");


			}
		});


		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

