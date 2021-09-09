import "./style.css";
import * as PIXI from "pixi.js";
// import { AsciiFilter } from "@pixi/filter-ascii";

// color array
const colorArray = [
  0xdfff00, 0xffbf00, 0x9fe2bf, 0xcae5ff, 0xccccff, 0xdaf7dc, 0xa6808c, 0xccb7ae, 0xd6cfcb,
  0xf9f7f3, 0xe8fcc2,
];
// array of oatvs
const oatvArray: Array<MovingSprite> = [];
const app: PIXI.Application = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  backgroundColor: 0x22222,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
});

/**
 * Filters
 */

const loader: PIXI.Loader = PIXI.Loader.shared;
loader.add("/oatv-logo.png").load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/oatv-logo.png"].texture!;

  for (let i = 0; i < 2; i++) {
    const scaleFactor = 0.5;
    const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    oatv_sprite.anchor.set(0.5);
    oatv_sprite.scale.set(scaleFactor);
    oatv_sprite.x = Math.random() * (app.view.width - oatv_sprite.width) + oatv_sprite.width / 2;
    oatv_sprite.y = Math.random() * (app.view.height - oatv_sprite.height) + oatv_sprite.height / 2;

    app.stage.addChild(oatv_sprite);
    oatvArray.push(new MovingSprite(oatv_sprite, scaleFactor));
  }
  const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
  app.stage.filters = [
    colorMatrixFilter,
    // new  AsciiFilter(4.5)
  ];
  colorMatrixFilter.brightness(2, true);
});

app.ticker.add(() => {
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
  scaleFactor: number;

  constructor(sprite: PIXI.Sprite, scaleFactor: number) {
    this.sprite = sprite;
    this.dx = Math.random() * 5 * Math.sign(Math.random() > 0.5 ? 1 : -1);
    this.dy = Math.random() * 5 * Math.sign(Math.random() > 0.5 ? 1 : -1);
    this.scaleFactor = scaleFactor;
  }

  update() {
    const { width, height } = this.sprite.texture.frame;
    if (
      this.sprite.x >= app.view.width - (width * this.scaleFactor) / 2 ||
      this.sprite.x <= 0 + (width * this.scaleFactor) / 2
    ) {
      this.dx = -this.dx;
      this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    if (
      this.sprite.y <= 0 + (height * this.scaleFactor) / 2 ||
      this.sprite.y >= app.view.height - (height * this.scaleFactor) / 2
    ) {
      this.dy = -this.dy;
      this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    this.animate();
    // this.detectCollision();
  }

  animate() {
    this.sprite.x += this.dx;
    this.sprite.y += this.dy;
  }

  detectCollision() {
    // const xDistance = Math.abs(oatvArray[1].sprite.x - this.sprite.x);
    // const xSpaceBetween = oatvArray[1].sprite.width / 2 + this.sprite.width / 2;
    // const yDistance = Math.abs(oatvArray[1].sprite.y - this.sprite.y);
    // const ySpaceBetween = oatvArray[1].sprite.height / 2 + this.sprite.height / 2;
    // console.log(xDistance, xSpaceBetween);
    // console.log(xDistance);
    // if (xSpaceBetween >= xDistance ) {
    //   this.dx = -this.dx;
    //   this.sprite.tint = 0xff0000;
    //   // this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    // }
    // if (ySpaceBetween >= yDistance) {
    //   this.dy = -this.dy;
    //   // console.log(yDistance);
    //   this.sprite.tint = 0x00ff00;
    //   // this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    // }
  }
}
