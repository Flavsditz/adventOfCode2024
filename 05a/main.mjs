import { readLines, printd } from "../common.mjs";

let DEBUG = false

function containsAll(arr1, arr2) {
	return arr2.every(function(val) { return arr1.indexOf(val) >= 0; });
}

function findMiddleElement(arr) {
	const middleIndex = Math.floor(arr.length / 2);

	return arr[middleIndex];
}

function parseRulesAndUpdates(lines) {
	const refMap = {};
	const updates = [];
	let parsingRules = true;

	lines.forEach(line => {
		if (line.trim() === "") {
			printd("Finished parsing rules..", DEBUG);
			parsingRules = false;
		} else {
			if (parsingRules) {
				const [a, b] = line.split("|");

				if (refMap[a] === undefined) {
					refMap[a] = [Number(b)];
				} else {
					refMap[a].push(Number(b));
				}
			} else {
				if (line.trim() !== "") {
					const nums = line.trim().split(",").map(n => Number(n));
					updates.push(nums);
				}
			}
		}
	});

	printd(`Rules map: ${JSON.stringify(refMap)}`, DEBUG);
	printd(`Updates: ${updates}`, DEBUG);
	return [refMap, updates];
}

/**
	* Returns if the update is following the rules or not
	* it also returns the index of the faulty item 
	*/
function isUpdateValid(rules, update) {
	let isValid = true;
	let i = 0;
	while (i < update.length - 1) {
		const pageRules = rules[update[i]];

		printd(`   For ${update[i]} we have the rules: ${pageRules}`, DEBUG)
		if (!pageRules) {
			printd(`        No rules found`, DEBUG);
			isValid = false;
			break;
		}

		if (!containsAll(pageRules, update.slice(i + 1))) {
			printd(`        Doesn't contain all rules`, DEBUG);
			isValid = false;
			break;
		}

		i++;
	}
	return isValid;
}

function getValidAndInvalidUpdates(rules, updates) {
	const validLines = [];
	const invalidLines = [];

	updates.forEach(update => {
		printd(`Analyzing ${update} (${update.length})`, DEBUG);

		const isValid = isUpdateValid(rules, update);

		if (isValid) {
			validLines.push(update);
		} else {
			invalidLines.push(update);
		}
	});

	return [validLines, invalidLines];
}

function part1(lines) {
	const [refMap, updates] = parseRulesAndUpdates(lines);

	const [validLines,] = getValidAndInvalidUpdates(refMap, updates);

	printd(validLines, DEBUG);

	let sum = validLines.map(line => findMiddleElement(line)).reduce((acc, curVal) => acc + curVal, 0);

	console.log("The Sum is: ", sum);
}

function part2(lines) {
	const [refMap, updates] = parseRulesAndUpdates(lines);

	const [, invalidCases] = getValidAndInvalidUpdates(refMap, updates);

	printd(`Got invalid cases:\n ${JSON.stringify(invalidCases)}`, DEBUG);

	const validated = [];
	invalidCases.forEach(invCase => {
		let line = invCase;
		const fixedLine = [];

		const copy = line.slice()

		printd(`  ** Working on line ${line}`, DEBUG);
		while (copy.length !== 1) {
			const el = copy.shift();
			const rules = refMap[el];

			printd(`    ** Analyzing ${el}`, DEBUG);
			if (rules !== undefined && containsAll(rules, copy)) {
				fixedLine.push(el);
				printd(`    ** Valid! Added to fixed (${fixedLine})`, DEBUG);
			} else {
				copy.push(el);
				printd(`    ** INvalid! Added to end (${copy})`, DEBUG);
			}
		}

		fixedLine.push(...copy);
		printd(`    Valid as ${fixedLine}`, DEBUG);
		validated.push(fixedLine);
	});
	let sum = validated.map(line => findMiddleElement(line)).reduce((acc, curVal) => acc + curVal, 0);

	console.log("The Sum is: ", sum);
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

