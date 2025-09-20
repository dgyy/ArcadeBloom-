import { SpriteClass } from "kontra";

type SuperProps = ConstructorParameters<typeof SpriteClass>[0];

export default class Door extends SpriteClass {
  private isOpening: boolean = false;
  public isOpen: boolean = false;

  init(props: SuperProps) {
    super.init({
      ...props,
      width: 16,
      height: 16,
      anchor: { x: 0, y: 0 },
    });
    this.playAnimation("doorClosed");
  }

  open() {
    if (this.isOpening || this.isOpen) {
      return;
    }

    this.playAnimation("doorOpen");
    this.isOpening = true;
  }

  update() {
    this.advance();

    if (this.currentAnimation.isStopped && this.isOpening && !this.isOpen) {
      this.isOpen = true;
    }
  }
}
