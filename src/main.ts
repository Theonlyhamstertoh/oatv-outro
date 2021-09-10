import "./style.css";
import * as PIXI from "pixi.js";
// import MovingSprite from "./MovingSprite";
import resolveCollision from "./collisionDetection";
import { v4 as uuidv4 } from "uuid";
import { OldFilmFilter } from "@pixi/filter-old-film";
import randomColor from "randomcolor";
// import { AsciiFilter } from "@pixi/filter-ascii";
// import { OldFilmFilter } from "@pixi/filter-old-film";
// color array

export const app: PIXI.Application = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  backgroundColor: 0x22222,
  antialias: true,
  height: window.innerHeight,
  autoDensity: true,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
});

/**
 *
 * Old Film Filter
 *
 */

class BackgroundOldFilm {
  oldFilm: OldFilmFilter;
  background: PIXI.Sprite;
  container: PIXI.Container;

  constructor() {
    this.oldFilm = new OldFilmFilter();
    this.background = new PIXI.Sprite();
    this.container = new PIXI.Container();

    this.oldFilm.sepia = 0.4;
    this.oldFilm.noise = 0.2;
    this.oldFilm.scratch = 0.7;
    this.oldFilm.scratchDensity = 0.5;

    app.stage.addChild(this.background);
    // this.container.addChild(this.background);
    // app.stage.addChild(this.container);
    // this.container.filters = [this.oldFilm];
    app.stage.filters = [this.oldFilm];

    // this.background.tint = 0xb38c38;
    this.background.alpha = 0.5;
  }
}

/**
 * Filters
 */
// array of oatvs
export const oatvArray: Array<MovingSprite> = [];
const totalOATVCount = 5;
const loader: PIXI.Loader = PIXI.Loader.shared;
const oatvContainer = new PIXI.Container();
const scaleFactor = 0.5;

const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

const filmTexture = new BackgroundOldFilm();
app.stage.addChild(oatvContainer);
loader.add(["/oatv-logo.png", "/grunge.jpg"]).load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/oatv-logo.png"].texture!;
  const grungeTexture: PIXI.Texture<PIXI.Resource> = loader.resources["/grunge.jpg"].texture!;
  filmTexture.background.texture = grungeTexture;
  for (let i = 0; i < totalOATVCount; i++) {
    const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    oatv_sprite.anchor.set(0.5);
    oatv_sprite.scale.set(scaleFactor);

    oatv_sprite.x = Math.random() * (app.view.width - oatv_sprite.width) + oatv_sprite.width / 2;
    oatv_sprite.y = Math.random() * (app.view.height - oatv_sprite.height) + oatv_sprite.height / 2;

    oatvContainer.addChild(oatv_sprite);
    oatvArray.push(new MovingSprite(oatv_sprite, scaleFactor));
  }
  oatvContainer.filters = [colorMatrixFilter];
  colorMatrixFilter.brightness(2, true);
});

app.ticker.add(() => {
  filmTexture.oldFilm.seed += 0.01;

  oatvArray.forEach((oatv) => {
    oatv.update();
  });
});

/**
 * Resizing function
 */
window.addEventListener("resize", () => {
  oatvArray.forEach(() => {
    // oatv.sprite.scale.set(0.3);
    // oatv.update();
  });
});

// function distance(a: PIXI.Sprite, b: PIXI.Sprite) {
//   const xDistance: number = b.x - a.x;
//   const yDistance = b.y - a.y;
//   console.log(a.x, b);
//   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
// }

interface velocityObject {
  x: number;
  y: number;
}

/**
 *
 * Moving Sprite CLass
 *
 */
export default class MovingSprite {
  sprite: PIXI.Sprite;
  scaleFactor: number;
  mass: number;
  key: string;
  velocity: velocityObject;

  constructor(sprite: PIXI.Sprite, scaleFactor: number) {
    this.sprite = sprite;

    this.scaleFactor = scaleFactor;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.mass = 1;
    this.key = uuidv4();
  }

  update() {
    const { width, height } = this.sprite.texture.frame;

    if (
      this.sprite.x >= app.view.width - (width * this.scaleFactor) / 2 ||
      this.sprite.x <= 0 + (width * this.scaleFactor) / 2
    ) {
      this.velocity.x = -this.velocity.x;

      this.sprite.tint = this.generateColor();
    }

    if (
      this.sprite.y <= 0 + (height * this.scaleFactor) / 2 ||
      this.sprite.y >= app.view.height - (height * this.scaleFactor) / 2
    ) {
      this.velocity.y = -this.velocity.y;
      this.sprite.tint = this.generateColor();
    }

    this.animate();
    this.detectCollision();
  }

  animate() {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  generateColor() {
    const color = randomColor({ luminosity: "light" });
    const convertedColor = color.replace(/#/, "0x");
    const numberColor = parseInt(convertedColor, 16);
    return numberColor;
  }
  detectCollision() {
    oatvArray.forEach((oatv) => {
      if (oatv.key === this.key) return;
      const xSpaceBetween: number = oatv.sprite.width / 2 + this.sprite.width / 2;
      const ySpaceBetween = oatv.sprite.height / 2 + this.sprite.height / 2;
      const xDistance: number = Math.abs(this.sprite.x - oatv.sprite.x);
      const yDistance = Math.abs(this.sprite.y - oatv.sprite.y);
      if (ySpaceBetween >= yDistance && xSpaceBetween >= xDistance) {
        resolveCollision(this, oatv);
        this.sprite.tint = this.generateColor();
        oatv.sprite.tint = this.generateColor();
        // oatv.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
      }
    });
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
