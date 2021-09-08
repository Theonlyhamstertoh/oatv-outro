import "./style.css";
import * as PIXI from "pixi.js";

// array of oatvs
const oatvArray: Array<MovingSprite> = [];
const app: PIXI.Application = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  backgroundColor: 0x7fa1fd,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
});

const loader: PIXI.Loader = PIXI.Loader.shared;
loader.add("/texture.png").load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/texture.png"].texture!;
  const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  oatv_sprite.anchor.set(0.5);
  oatv_sprite.x = Math.random() * (app.view.width - 260) + 130;
  oatv_sprite.y = Math.random() * (app.view.height - 260) + 130;

  app.stage.addChild(oatv_sprite);
  oatvArray.push(new MovingSprite(oatv_sprite));
});

app.ticker.add((delta) => {
  oatvArray.forEach((oatv) => {
    oatv.update();
  });
});

/**
 * Resizing function
 */
window.addEventListener("resize", () => {});

class MovingSprite {
  sprite: PIXI.Sprite;
  dx: number;
  dy: number;

  constructor(sprite: PIXI.Sprite) {
    this.sprite = sprite;
    this.dx = Math.random() * 3 * Math.sign(Math.random() > 0.5 ? 1 : -1);
    this.dy = Math.random() * 3 * Math.sign(Math.random() > 0.5 ? 1 : -1);
  }

  update() {
    const { width, height } = this.sprite.texture.frame;
    if (this.sprite.x >= app.view.width - width / 2 || this.sprite.x <= 0 + width / 2) {
      this.dx = -this.dx;
    }

    if (this.sprite.y <= 0 + height / 2 || this.sprite.y >= app.view.height - height / 2) {
      this.dy = -this.dy;
    }

    this.animate();
  }

  animate() {
    this.sprite.x += this.dx;
    this.sprite.y += this.dy;
  }
}
