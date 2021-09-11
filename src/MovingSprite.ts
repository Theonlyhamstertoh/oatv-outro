import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import randomColor from "randomcolor";
import type Controller from "./Controller";

/**
 *
 * Moving Sprite CLass
 *
 */

interface velocityObject {
  x: number;
  y: number;
}

export default class MovingSprite {
  sprite: PIXI.Sprite;
  scaleFactor: number;
  mass: number;
  key: string;
  velocity: velocityObject;

  constructor(sprite: PIXI.Sprite, scaleFactor: number) {
    this.sprite = sprite;

    this.scaleFactor = scaleFactor;
    this.mass = 1 * scaleFactor;
    this.velocity = {
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 7,
    };
    this.key = uuidv4();
  }

  update(controller: Controller): void {
    const { width, height } = this.sprite.texture.frame;

    if (
      this.sprite.x >= controller.app.view.width - (width * this.scaleFactor) / 2 ||
      this.sprite.x <= 0 + (width * this.scaleFactor) / 2
    ) {
      this.velocity.x = -this.velocity.x;
      this.sprite.tint = generateColor();
    }

    if (
      this.sprite.y <= 0 + (height * this.scaleFactor) / 2 ||
      this.sprite.y >= controller.app.view.height - (height * this.scaleFactor) / 2
    ) {
      this.velocity.y = -this.velocity.y;
      this.sprite.tint = generateColor();
    }

    this.animate();
    // this.detectCollision(controller);
  }

  animate() {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  // detectCollision(controller: Controller) {
  //   // console.log(this.sprite.getBounds());
  //   controller.oatvArray.forEach((oatv) => {
  //     if (oatv.key === this.key) return;

  //     const xSpaceBetween: number = oatv.sprite.width / 2 + this.sprite.width / 2;
  //     const ySpaceBetween = oatv.sprite.height / 2 + this.sprite.height / 2;
  //     const xDistance: number = Math.abs(this.sprite.x - oatv.sprite.x);
  //     const yDistance = Math.abs(this.sprite.y - oatv.sprite.y);
  //     if (ySpaceBetween >= yDistance && xSpaceBetween >= xDistance) {
  //       this.sprite.tint = generateColor();
  //       oatv.sprite.tint = generateColor();
  //     }
  //   });
  // }
}

function generateColor() {
  const color = randomColor({ luminosity: "light" });
  const convertedColor = color.replace(/#/, "0x");
  const numberColor = parseInt(convertedColor, 16);
  return numberColor;
}
