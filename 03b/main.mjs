import { readLines, printd } from "../common.mjs";

const D = false
const MODE = 'r' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines, D);

		let sum = 0;
		let enabled = true;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const myRe = /(?:do\(\)|don't\(\))|mul\(\d+,\d+\)/gm;
				const text = line.trim();
				const myArray = [...text.matchAll(myRe)];

				myArray.forEach(entry => {
					const cmd = entry[0].trim();

					printd(`Got ${cmd}`);
					if (cmd === "do()") {
						enabled = true;
					} else if (cmd === "don't()") {
						enabled = false;
					} else if (cmd.startsWith("mul")) {
						if (enabled) {
							const numsStr = [...cmd.matchAll(/\d+/gm)];
							if (numsStr.length !== 2) {
								console.log("PROBLEM: ", numsStr);
							}
							const nums = numsStr.map(en => Number(en[0])).reduce((acc, val) => acc * val, 1);
							printd(`  With ${numsStr} - Total B/A: ${sum}/${sum + nums}`, D);
							sum += nums;
						}
					} else {
						console.log("ERROR!!!", cmd);
					}
				});

				printd("\n", D);
			}
		});


		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

