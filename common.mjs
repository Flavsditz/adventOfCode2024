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

