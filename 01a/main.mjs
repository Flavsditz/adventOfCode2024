import { readLines, printd } from "../common.mjs";

const D = false
const MODE = 'r' //t - test, r - real
const FILE_PATH = `${MODE}input.txt`;

(async () => {
	try {
		const lines = await readLines(FILE_PATH);
		printd(lines, D);

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

		printd(`List1: ${list1}`, D);
		printd(`List2: ${list2}`, D);
		let sum = 0;
		for (idx in list1) {
			sum += Math.abs(list1[idx] - list2[idx])
		}

		console.log("The Sum is: ", sum);

	} catch (err) {
		console.error("Error reading file:", err);
	}
})();

