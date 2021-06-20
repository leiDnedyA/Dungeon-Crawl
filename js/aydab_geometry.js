
class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

const addVectors = (a, b)=>{
	return new Vector2(a.x + b.x, a.y + b.y);
}

module.exports = {Vector2: Vector2, addVectors : addVectors}