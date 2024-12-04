import { readLines, printd } from "../common.mjs";

const D = false
const MODE = 'r' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines, D);

		let sum = 0;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const myRe = /(mul\(\d+,\d+\))/gm;
				const text = line.trim();
				const myArray = [...text.matchAll(myRe)];

				myArray.forEach(entry => {
					printd(`Got ${entry[0]}`, D);
					const numsStr = [...entry[0].matchAll(/\d+/gm)];
					printd(`  With ${numsStr}`, D);
					const nums = numsStr.map(e => Number(e[0])).reduce((acc, val) => acc * val, 1);

					sum += nums;
				});

				printd("\n", D);
			}
		});

		console.log("The Sum is: ", sum);
	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

