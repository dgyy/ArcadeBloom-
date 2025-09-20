import { Vector2 } from "../mMath.js";

export var StandBy=[new Vector2(0,0), new Vector2(35, 20), new Vector2(64, -15), new Vector2(20, 30), new Vector2(45, 0), new Vector2(0, 47), new Vector2(-29, 93), new Vector2(29, 93)];

export var RightAttack=[new Vector2(45, 0), new Vector2(73, 0)];

export var LeftAttack=[new Vector2(45, 0), new Vector2(79, 0)];

// export var RightAttackBack=[new Vector2(-45, 0), new Vector2(-73, 0)];

// export var LeftAttackBack=[new Vector2(-45, 0), new Vector2(-79, 0)];

// export var StandByBack=[new Vector2(-35, 20), new Vector2(-64, -15), new Vector2(-20, 30), new Vector2(-45, 0)];

export var move=[new Vector2(0,93),new Vector2(0,93)];

export function combine(r, l, m)
{
    return [StandBy[0],...r,...l,StandBy[5],...m];
}
