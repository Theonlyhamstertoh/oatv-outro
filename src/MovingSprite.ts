import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { app, oatvArray } from "./main";
import resolveCollision from "./collisionDetection";
const colorArray = [
  0xdfff00, 0xffbf00, 0x9fe2bf, 0xcae5ff, 0xccccff, 0xdaf7dc, 0xa6808c, 0xccb7ae, 0xd6cfcb,
  0xf9f7f3, 0xe8fcc2,
];

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
      this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    if (
      this.sprite.y <= 0 + (height * this.scaleFactor) / 2 ||
      this.sprite.y >= app.view.height - (height * this.scaleFactor) / 2
    ) {
      this.velocity.y = -this.velocity.y;
      this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    this.animate();
    this.detectCollision();
  }

  animate() {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
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
        this.sprite.tint = colorArray[Math.floor(Math.random() * colorArray.length)];
        oatv.sprite.tint = Math.random() * 0xffffff;
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
