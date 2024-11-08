import {Vector2D} from "@/assets/js/CavyUtils.ts";

export class Scene {

    _objects = []
    _canvas = null

    constructor(canvas) {
        this._canvas = canvas;
    }

    getCanvas() {
        return this._canvas;
    }

    addToScene(obj) {
        this._objects.push(obj)
    }

    getObjects() {
        return this._objects;
    }

    updateAll() {
        this._objects.forEach(obj => obj.update())
    }
}

class Particle {

    _position
    _fadeout = 0;
    _speedVec = new Vector2D(0, 0);

    constructor(x, y, fadeout) {
        this._position = new Vector2D(x, y);
        this._y = y;
        this._fadeout = fadeout;
    }

    getPosition() {
        return this._position;
    }

    getX() {
        return this._position.get();
    }

    getY() {
        return this._position.getY();
    }

    getFadeout() {
        return this._fadeout;
    }

    setX(x) {
        this._position.setX(x);
    }

    setY(y) {
        this._position.setY(y);
    }

    setFadeout(value) {
        this._fadeout = value;
    }

    setSpeedVector(vec) {
        this._speedVec = vec;
    }

    getSpeedVector() {
        return this._speedVec;
    }

    update() {
        let x = this.getX();
        let y = this.getY();

        x += this.getSpeedVector().getX()
        y += this.getSpeedVector().getY()

        this.setX(x)
        this.setY(y)
    }
}