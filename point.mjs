export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	* @param {Point} p The Other point to be added with this one
	*
	* @returns {Point} Result of summing both points together (does not modify current point)
	*/
	add(p) {
		return new Point(this.x + p.x, this.y + p.y);
	}
}
