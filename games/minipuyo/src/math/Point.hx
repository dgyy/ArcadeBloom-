package math;

abstract Point(Array<Float>) from Array<Float> to Array<Float> {
    public function new(x=0.0, y=0.0) {
        this = [x, y];
    }
    public var x(get, set):Float;
    inline function get_x() return this[0];
    inline function set_x(value) return this[0] = value;
    public var y(get, set):Float;
    inline function get_y() return this[1];
    inline function set_y(value) return this[1] = value;

    @:op(A * B)
    @:commutative
    inline static public function mulOp(a:Point, b:Float) {
        return new Point(a.x * b, a.y * b);
    }

    @:op(A / B)
    @:commutative
    inline static public function divOp(a:Point, b:Float) {
        return new Point(a.x / b, a.y / b);
    }

    @:op(A + B)
    inline static public function addOp(a:Point, b:Point) {
        return new Point(a.x + b.x, a.y + b.y);
    }

    @:op(A - B)
    inline static public function minOp(a:Point, b:Point) {
        return new Point(a.x - b.x, a.y - b.y);
    }

    static public function dot(a:Point, b:Point):Float {
        return a.x * b.x + a.y * b.y;
    }

    static public inline function getSquareDistance(a:Point, b:Point):Float {
        var dx = a.x - b.x;
        var dy = a.y - b.y;

        return dx * dx + dy *dy;
    }

    public function normalize() {
        var len = getLength();
        this[0] /= len;
        this[1] /= len;
    }

    public function getAngle() : Float{
        return Math.atan2(this[1], this[0]);
    }

    public function getLength() : Float{
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }

    public function getSquareLength() : Float{
        return this[0] * this[0] + this[1] * this[1];
    }

    public function copyFrom(other:Point) {
        this[0] = other[0];
        this[1] = other[1];
    }

    public function set(x, y) {
        this[0] = x;
        this[1] = y;
    }

    public function setFromAngle(angle:Float) {
        this[0] = Math.cos(angle);
        this[1] = Math.sin(angle);
    }
}
