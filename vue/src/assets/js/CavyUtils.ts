export class Vector2D {

    _x = 0;
    _y = 0;

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    /**
     * Set x for 2d vector.
     * @param x - Number to set
     */
    setX(x) {
        this._x = x;
        return this
    }

    /**
     * Set y for 2d vector.
     * @param y - Number to set
     */
    setY(y) {
        this._y = y;
        return this
    }

    clone() {
        return new Vector2D(this._x, this._y);
    }

    toString() {
        return "("+this._x+", "+this._y+")";
    }

    toJSON() {
        return {x: this._x, y: this._y};
    }

    add(x, y) {
        this._x += x;
        this._y += y;
        return this
    }

    addVec(vector) {
        this._x += vector.x;
        this._y += vector.y;
        return this
    }

    subtract() {
        this._x -= this._x;
        this._y -= this._y;
        return this
    }

    subtractVec(vector) {
        this._x -= vector.x;
        this._y -= vector.y;
        return this
    }

    reverse() {
        this._x -= this._x;
        this._y -= this._y;
        return this
    }

    rotate(rads) {
        const cos = Math.cos(rads)
        const sin = Math.sin(rads)

        const ox = this.x
        const oy = this.y

        this.x = ox * cos - oy * sin
        this.y = ox * sin + oy * cos

        return this
    }
}
