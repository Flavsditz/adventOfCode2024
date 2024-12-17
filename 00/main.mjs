import { readLines, printd } from "../common.mjs";

let DEBUG = false

function part1(lines) {
}

function part2(lines) {
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val) {
		if (val === '-d') {
			DEBUG = true;
		}
		if (val.startsWith('-t')) {
			mode = val.slice(1);
		}
		if (val === '2') {
			part = 2;
		}
	});
	const filePath = `${process.cwd()}/${mode}input.txt`;
	const lines = await readLines(filePath);

	printd(lines, DEBUG);

	if (part === 1) {
		part1(lines);
	} else if (part === 2) {
		part2(lines);
	}
})();

