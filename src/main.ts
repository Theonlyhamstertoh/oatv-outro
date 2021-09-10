import "./style.css";
import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { AsciiFilter } from "@pixi/filter-ascii";
import { OldFilmFilter } from "@pixi/filter-old-film";
// color array
const colorArray = [
  0xdfff00, 0xffbf00, 0x9fe2bf, 0xcae5ff, 0xccccff, 0xdaf7dc, 0xa6808c, 0xccb7ae, 0xd6cfcb,
  0xf9f7f3, 0xe8fcc2,
];
// array of oatvs
const oatvArray: Array<MovingSprite> = [];
console.log(window.innerWidth);
const app: PIXI.Application = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  backgroundColor: 0x22222,
  height: window.innerHeight,
  // autoDensity: true,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
});

window.onload = () => {
  console.log(window.innerWidth, window.innerHeight);
};
/**
 * Filters
 */

const number = 5;
const loader: PIXI.Loader = PIXI.Loader.shared;
const container = new PIXI.Container();

loader.add("/oatv-logo.png").load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/oatv-logo.png"].texture!;

  const WHITE = new PIXI.Sprite(PIXI.Texture.WHITE);
  WHITE.width = window.innerWidth;

  WHITE.height = window.innerHeight;
  WHITE.anchor.set(0.5);
  // container.addChild(WHITE);
  for (let i = 0; i < number; i++) {
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
  app.stage.filters = [colorMatrixFilter];
  app.stage.addChild(container);
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

interface velocityObject {
  x: number;
  y: number;
}
class MovingSprite {
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

// function distance(a: PIXI.Sprite, b: PIXI.Sprite) {
//   const xDistance: number = b.x - a.x;
//   const yDistance = b.y - a.y;
//   console.log(a.x, b);
//   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
// }

function resolveCollision(particle: MovingSprite, otherParticle: MovingSprite) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.sprite.x - particle.sprite.x;
  const yDist = otherParticle.sprite.y - particle.sprite.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.sprite.y - particle.sprite.y,
      otherParticle.sprite.x - particle.sprite.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = { x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2), y: u1.y };
    const v2 = { x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2), y: u2.y };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

function rotate(velocity: velocityObject, angle: number) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}
