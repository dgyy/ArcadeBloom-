import { Ground } from '../ground/ground';
import { Input } from '../interaction/input';
import { Vec3 } from '../core/vec3';

export interface CameraState {
  angle: number;
  distance: number;
  horizon: number;
  position: Vec3;
}

export class Camera {
  // x position on the ground
  // y position on the ground
  // height of the camera
  // public position = new Vec3(512., 800., 78.);
  // public angle: number = 0.; // direction of the camera
  // public horizon: number = 100.; // horizon position (look up and down)
  // public distance: number = 800; // distance of ground

  // public angle: number = -5.410183583999763;
  // public distance: number = 800;
  // public height: number = 908.3029068244002;
  // public horizon: number = -260.5505905368517;
  // public x: number = 926.921574909533;
  // public y: number = 898.3151237476166;

  public angle = -2.2983780000001044;
  public distance = 800;
  public horizon = -99.99200000000593;
  public position = new Vec3(276.84564208984375, 303.5342102050781, 700.9903564453125);

  update(dt: number, input: Input, ground: Ground) {
    input.keypressed = false;
    if (input.leftright !== 0) {
      this.angle += input.leftright * 0.1 * dt * 0.03;
      input.keypressed = true;
    }

    if (input.forwardbackward !== 0) {
      this.position.x -= input.forwardbackward * Math.sin(this.angle) * dt * 0.03;
      this.position.y -= input.forwardbackward * Math.cos(this.angle) * dt * 0.03;
      input.keypressed = true;
    }

    if (input.updown !== 0) {
      this.position.z += input.updown * dt * 0.03;
      input.keypressed = true;
    }

    if (input.lookup) {
      this.horizon += 40. * dt * 0.03;
      input.keypressed = true;
    }

    if (input.lookdown) {
      this.horizon -= 40. * dt * 0.03;
      input.keypressed = true;
    }

    // Collision detection. Don't fly below the surface.
    let mapOffset = ((Math.floor(this.position.y) & (ground.width - 1)) << ground.shift) + (Math.floor(this.position.x) & (ground.height - 1)) | 0;
    if ((ground.altitude[mapOffset] + 10) > this.position.z) {
      this.position.z = ground.altitude[mapOffset] + 10;
    }
  }
}
