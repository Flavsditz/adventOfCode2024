import { readLines, printd } from "../common.mjs";

let DEBUG = false

class MemoryChunk {
	constructor(id, size, isFree) {
		this.id = id;
		this.size = size;
		this.isFree = isFree;
	}

	toString() {
		return `${this.id} x ${this.size}`;
	}
}

function findTotalDiskSpace(diskMap) {
	return String(diskMap).split('').map(c => Number(c)).reduce((acc, el) => acc + el, 0);
}

function returnUsedUnusedMap(diskMap) {
	const used = [];
	const free = [];

	let idCounter = 0;
	String(diskMap).split('').map(c => Number(c)).forEach((val, idx) => {
		if (idx % 2 === 0) {
			used.push(new MemoryChunk(idCounter, val, false));
			idCounter++;
		} else {
			free.push(new MemoryChunk(-1, val, true));
		}
	});

	return [used, free];
}

function part1(lines) {

	lines.filter(l => l !== "").forEach(line => {
		const [used, unused] = returnUsedUnusedMap(line);

		const diskSize = findTotalDiskSpace(line);
		const emptySpace = unused.map(u => u.size).reduce((acc, val) => acc + val, 0);

		const dataSize = diskSize - emptySpace;
		printd(`Datasize = ${dataSize}`, DEBUG);
		let checkSum = 0;
		let head = 0;
		while (head < dataSize) {
			const data = used.shift();

			for (let i = 0; i < data.size; i++) {
				checkSum += head * data.id;
				head++;
			}

			if (used.length === 0) {
				// Finished no need to continue
				break;
			}

			const space = unused.shift();
			for (let i = 0; i < space.size; i++) {
				const last = used[used.length - 1];
				checkSum += head * last.id;
				last.size--;
				head++;

				if (last.size === 0) {
					used.pop();
				}
			}

		}

		console.log("Checksum is: ", checkSum);
	});
}

function part2(lines) {
	lines.filter(l => l !== "").forEach(line => {
		const [used, unused] = returnUsedUnusedMap(line);

		const diskSize = findTotalDiskSpace(line);
		printd(`Disksize = ${diskSize}`, DEBUG);

		const orderedSlots = [];
		while (true) {
			const file = used.shift();
			orderedSlots.push(file);
			printd(`   Added slot: ${file}`, DEBUG);

			const space = unused.shift();
			printd(`   Checking space: ${space.size}`, DEBUG);

			for (let i = used.length - 1; i >= 0; i--) {
				if (used[i].size <= space.size) {
					const relocated = used.splice(i, 1)[0];
					printd(`   Added slot: ${relocated}`, DEBUG);
					orderedSlots.push(relocated);
					space.size -= relocated.size;
				}

				if (space.size === 0) {
					printd(`     No free space left. Moving on...`, DEBUG);
					break;
				}
			}

			if (space.size !== 0) {
				orderedSlots.push(space);
				printd(`   Space left: ${space.size}`, DEBUG);
			}

			if (used.length === 0) {
				break;
			}
		}


		console.log(orderedSlots);
		printDisk(orderedSlots);
		let checkSum = 0;
		console.log("Checksum is: ", checkSum);
	});
}

function printDisk(slots) {
	let s = '';
	slots.forEach(slot => {
		s += slot.id === -1 ? '.'.repeat(slot.size) : `${slot.id}`.repeat(slot.size);
	});

	console.log("Disk: ", s);
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

