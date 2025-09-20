package math;

class Transform {
    public var position:Point = [0, 0];

    public function new() {
    }

    public function copyFrom(other:Transform) {
        position.copyFrom(other.position);
    }
}
