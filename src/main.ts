import "./style.css";
import * as PIXI from "pixi.js";
import { OldFilmFilter } from "@pixi/filter-old-film";
import { PixelateFilter } from "@pixi/filter-pixelate";
import { AsciiFilter } from "@pixi/filter-ascii";

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

  for (let i = 0; i < 50; i++) {
    const scaleFactor = 0.5;
    const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    oatv_sprite.anchor.set(0.5);
    oatv_sprite.scale.set(scaleFactor);
    const spawnWidthZone = Math.ceil(oatv_sprite.width);
    console.log(spawnWidthZone);
    oatv_sprite.x = Math.random() * (app.view.width - spawnWidthZone) + spawnWidthZone / 2;
    oatv_sprite.y = Math.random() * (app.view.height - 440) + 220;

    app.stage.addChild(oatv_sprite);
    oatvArray.push(new MovingSprite(oatv_sprite, scaleFactor));
  }
  const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
  app.stage.filters = [colorMatrixFilter, new AsciiFilter(4.5)];
  colorMatrixFilter.brightness(2, true);
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
  scaleFactor: number;

  constructor(sprite: PIXI.Sprite, scaleFactor) {
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
  }

  animate() {
    this.sprite.x += this.dx;
    this.sprite.y += this.dy;
  }

  detectCollision() {}
}
