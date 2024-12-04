import { readLines, printd } from "../common.mjs";

const D = true
const MODE = 't' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;


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
		printd(lines, D);

		let sum = 0;

		lines.forEach((line) => {
			if (line.trim() !== "") {
				const nums = line.trim().split(/\s+/).map(Number);

				printd(`Testing ${line}:`, D);

				if (isSafeLevels(nums)) {
					sum++
					printd(`   ----The line is safe as it is`, D);
				} else {
					for (let i = 0; i < nums.length; i++) {
						const testNums = nums.slice()
						testNums.splice(i, 1)
						if (isSafeLevels(testNums)) {
							sum++;
							printd(`   ----The line ${line} is safe with variant ${testNums}`, D);
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
