const fs = require('fs').promises;

const DEBUG_MODE = true
const MODE = 't' //t - test, r - real
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

		let sum = 0;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const nums = line.trim().split(/\s+/).map(Number);

				let isDecreasing = undefined;
				let isSafe = true;
				for (let i = 0; i < nums.length - 1; i++) {
					const res = nums[i] - nums[i + 1];

					if (isDecreasing === undefined) {
						if (res < 0) {
							isDecreasing = true;
						} else if (res > 0) {
							isDecreasing = false;
						} else {
							isSafe = false;
							break;
						}
					}

					if ((isDecreasing && res < 0) || (!isDecreasing && res > 0)) {
						if (Math.abs(res) > 3) {
							isSafe = false;
							break;
						}
					} else {
						isSafe = false;
						break;
					}
				}


				if (isSafe) {
					sum++;
				}

				if (DEBUG_MODE) {
					console.log(`The line ${line} is ${isSafe}`);
				}


			}
		});


		if (DEBUG_MODE) {
		}
		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

