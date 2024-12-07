import { readFile } from 'fs/promises';

export async function readLines(path) {
	try {
		const inputD = await readFile(path);
		return inputD.toString().split('\n');
	} catch (err) {
		throw err;
	}
}

export function printd(str, debug_mode) {
	if (debug_mode) {
		console.log(str);
	}
}

export function printdMap(map, debug_mode) {
	if (debug_mode) {
		const width = map[0].length;

		let tensHeader = "     "; // 5 spaces for line lables
		let unitHeader = "     ";
		for (let i = 0; i < Math.floor(width / 10); i++) {
			tensHeader += `${i}         `;

			for (let j = 0; j < 10; j++) {
				unitHeader += `${j}`;
			}
		}
		console.log(tensHeader);
		console.log(unitHeader);


		for (let i = 0; i < map.length; i++) {
			console.log(`${String(i).padStart(4, ' ')} ${map[i].join('')}`)
		}

	}
}
