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

function returnUsedUnusedMap(diskMap, isPart2 = false) {
	const used = [];
	const free = [];
	const full = [];

	let idCounter = 0;
	String(diskMap).split('').map(c => Number(c)).forEach((val, idx) => {
		if (idx % 2 === 0) {
			const chunk = new MemoryChunk(idCounter, val, false);
			used.push(chunk);
			full.push(chunk);
			idCounter++;
		} else {
			const chunk = new MemoryChunk(-1, val, true);
			free.push(chunk);
			full.push(chunk);
		}
	});

	return isPart2 ? full : [used, free];
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
		const chunks = returnUsedUnusedMap(line, true);

		const diskSize = findTotalDiskSpace(line);
		printd(`Disksize = ${diskSize}`, DEBUG);

		for (let i = chunks.length - 1; i >= 0; i--) {
			if (!chunks[i].isFree) {

				for (let j = 0; j < i; j++) {
					if (chunks[j].isFree) {
						if (chunks[j].size > chunks[i].size) {
							const newId = chunks[i].id;
							const newSize = chunks[i].size;

							chunks[j].size -= newSize;

							chunks[i].id = -1;
							chunks[i].isFree = true;
							chunks.splice(j, 0, new MemoryChunk(newId, newSize, false));
							i++; //fix since we are adding a new item 
							break;
						} else if (chunks[j].size === chunks[i].size) {
							chunks[j].id = chunks[i].id;
							chunks[j].isFree = false;

							chunks[i].id = -1;
							chunks[i].isFree = true;
							break;
						}
					}
				}
			}
		}

		printDisk(chunks);
		let checkSum = 0;
		let head = 0;
		while (head < diskSize) {
			const c = chunks.shift();

			if (c.isFree) {
				head += c.size;
				continue;
			}

			for (let i = 0; i < c.size; i++) {
				checkSum += head * c.id;
				head++;
			}
		}
		console.log("Checksum is: ", checkSum);
	});
}

function printDisk(slots) {
	let s = '';
	slots.forEach(slot => {
		s += slot.id === -1 ? '.'.repeat(slot.size) : `${slot.id}`.repeat(slot.size);
	});

	printd(`Disk: ${s}`, DEBUG);
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

