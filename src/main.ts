import "./style.css";
import * as PIXI from "pixi.js";
import Controller from "./Controller";

// import { AsciiFilter } from "@pixi/filter-ascii";
// import { OldFilmFilter } from "@pixi/filter-old-film";
// color array

const controller = new Controller();

const loader: PIXI.Loader = PIXI.Loader.shared;

loader.add(["/oatv-logo.png", "/grunge.jpg"]).load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/oatv-logo.png"].texture!;
  const grungeTexture: PIXI.Texture<PIXI.Resource> = loader.resources["/grunge.jpg"].texture!;
  // controller.oldFilmTexture.background.texture = grungeTexture;

  for (let i = 0; i < controller.count; i++) {
    controller.addOATV(texture);
  }
});

/**
 * Resizing function
 */

// function distance(a: PIXI.Sprite, b: PIXI.Sprite) {
//   const xDistance: number = b.x - a.x;
//   const yDistance = b.y - a.y;
//   console.log(a.x, b);
//   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
// }
