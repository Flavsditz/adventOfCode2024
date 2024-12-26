const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GRID = 15;

let map = [[]];
const reader = new FileReader();
reader.addEventListener('load', (event) => {
	const lines = event.target.result.split("\n").filter(l => l.trim() !== "");

	map = buildMapMatrix(lines);
	canvas.attributes.width.value = map[0].length * GRID;
	canvas.attributes.height.value = map.length * GRID;

	paintMap(map);
	[lin, col] = findStart(map);
});

const fileInputEl = document.getElementById("fileInput");
fileInputEl.addEventListener("change", () => {
	const fileList = fileInputEl.files[0];
	console.log(fileList);
	reader.readAsText(fileList);

}, false);


let [lin, col] = [0, 0];
let direction = '^';
const stepBtn = document.getElementById("step");
stepBtn.addEventListener("click", () => {
	map[lin][col] = "X";

	// Look ahead and see if we can continue on that direction (or turn)
	direction = nextDirection(lin, col, direction, map);

	// Now check the next step with the correct direction
	[lin, col] = nextStep(lin, col, direction);

	paintMap(map);
});


/**
	* @param {string[][]} map
	*/
function paintMap(map) {
	const totalLines = map.length;
	const totalCols = map[0].length;

	for (let l = 0; l < totalLines; l++) {
		for (let c = 0; c < totalCols; c++) {
			ctx.strokeRect(c * GRID, l * GRID, GRID, GRID);

			switch (map[l][c]) {
				case ".":
					ctx.fillStyle = "white";
					ctx.fillRect(c * GRID, l * GRID, GRID, GRID);
					break;
				case "X":
					ctx.fillStyle = "#CDDC39";
					ctx.fillRect(c * GRID, l * GRID, GRID, GRID);
					break;
				case "#":
					ctx.fillStyle = "red";
					ctx.fillRect(c * GRID, l * GRID, GRID, GRID);
					break;
				default:
					ctx.font = "24px sans";
					ctx.fillText(direction, c * GRID, l * GRID);
					break;
			}
		}
	}

}

/**
 * @param {string[]} lines lines read one by one from a file
 * @returns {string[][]}
 */
export function buildMapMatrix(lines) {
	return lines.filter(l => l.trim() !== "").map(l => l.split(''));
}

function nextDirection(line, col, dir, map) {
	const [nLin, nCol] = nextStep(line, col, dir);

	let nDir = dir;
	if (map[nLin] && map[nLin][nCol] && map[nLin][nCol] === '#') {
		switch (dir) {
			case '>':
				nDir = 'v';
				break;
			case 'v':
				nDir = '<';
				break;
			case '<':
				nDir = '^';
				break;
			case '^':
				nDir = '>';
				break;

		}
	}

	return nDir;
}


function findStart(map) {
	const idLine = map.findIndex(line => line.includes('^'));
	const idCol = map[idLine].findIndex(c => c === "^");

	return [idLine, idCol];
}

function nextStep(line, col, dir) {
	let newDir = [];
	switch (dir) {
		case '>':
			newDir = [0, 1];
			break;
		case 'v':
			newDir = [1, 0];
			break;
		case '<':
			newDir = [0, -1];
			break;
		case '^':
			newDir = [-1, 0];
			break;
	}

	return [line + newDir[0], col + newDir[1]];
}
