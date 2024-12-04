const fs = require('fs').promises;

const DEBUG_MODE = true
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

function isSafeLevels(nums) {
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

	return isSafe;
}

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines);

		let sum = 0;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const nums = line.trim().split(/\s+/).map(Number);

				printd(`Testing ${line}:`);

				if (isSafeLevels(nums)) {
					sum++
					printd(`   ----The line is safe as it is`);
				} else {
					for (let i = 0; i < nums.length; i++) {
						const testNums = nums.slice()
						testNums.splice(i, 1)
						if (isSafeLevels(testNums)) {
							sum++;
							printd(`   ----The line ${line} is safe with variant ${testNums}`);
							break
						}
					}
				}
			}
		});

		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

