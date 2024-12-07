import { readLines, printd } from "../common.mjs";

let DEBUG = false

function findPermutations(objList, positions) {
	var res = {};
	for (let i = 1; i <= positions; i++) {
		res[i] = res[i - 1] ? res[i - 1].reduce((r, e) => r.concat(objList.map(n => e.concat(n))), []) : objList.map(e => [e]);
	}

	return res[positions];
}

function calculate(nums, ops, refMap) {
	if (nums.length - 1 !== ops.length) {
		return 0;
	}

	if (nums.length === 1) {
		printd(`      Last item: ${nums}`, DEBUG)
		return nums[0];
	}

	const key = `${nums}${ops}`;
	if (refMap.has(key)) {
		printd(`    Got hit for ${key}  --  ${refMap.get(key)}`, DEBUG)
		return refMap.get(key);
	}

	const partial = calculate(nums.slice(0, -1), ops.slice(0, -1), refMap);

	let res = 0;
	switch (String(ops.slice(-1))) {
		case '+':
			res = partial + Number(nums.slice(-1));
			break;
		case '*':
			res = partial * Number(nums.slice(-1));
			break;
		case '||':
			res = Number(`${partial}${nums.slice(-1)} `);
			break;
	}

	refMap.set(key, res);
	printd(`    Saved for ${key}  --   ${res} `, DEBUG)

	return res;
}

function part1(lines) {
	let sum = 0;
	lines.forEach(line => {
		if (line.trim() !== "") {
			const split = line.trim().split(':');
			const result = Number(split[0].trim());
			const nums = split[1].trim().split(' ').map(c => Number(c))

			const perms = findPermutations(['+', '*'], nums.length - 1);
			printd(`  (${result}): ${nums} (${perms})`, DEBUG)

			const mneMap = new Map();
			const sols = perms.map(p => calculate(nums, p, mneMap)).filter(r => r === result).length;

			if (sols > 0) {
				printd(`    THIS IS VALID`, DEBUG)
				sum += result;
			}
		}
	});

	console.log("Sum is ", sum);
}

function part2(lines) {
	let sum = 0;
	lines.forEach(line => {
		if (line.trim() !== "") {
			const split = line.trim().split(':');
			const result = Number(split[0].trim());
			const nums = split[1].trim().split(' ').map(c => Number(c))

			const perms = findPermutations(['+', '*', '||'], nums.length - 1);
			printd(`  (${result}): ${nums} (${perms})`, DEBUG)

			const mneMap = new Map();
			const sols = perms.map(p => calculate(nums, p, mneMap)).filter(r => r === result).length;
			if (sols > 0) {
				printd(`    THIS IS VALID`, DEBUG)
				sum += result;
			}
		}
	});

	console.log("Sum is ", sum);
}

(async () => {
	let mode = 'r' //t - test, r - real
	let part = 1;

	process.argv.forEach(function(val, index, array) {
		if (val === '-d') {
			DEBUG = true;
		}
		if (val === '-t') {
			mode = 't';
		}
		if (val === '2') {
			part = 2;
		}
	});
	const filePath = `${mode}input.txt`;
	const lines = await readLines(filePath);

	printd(lines, DEBUG);

	if (part === 1) {
		part1(lines);
	} else if (part === 2) {
		part2(lines);
	}
})();

