import "./style.css";
import * as PIXI from "pixi.js";
const app: PIXI.Application = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  backgroundColor: 0x7fa1fd,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
});

const loader: PIXI.Loader = PIXI.Loader.shared;
const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
const oatv_sprite2: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
loader.add("/texture.png").load(() => {
  const texture: PIXI.Texture<PIXI.Resource> = loader.resources["/texture.png"].texture!;
  console.log(texture);
  // const sheet: PIXI.Spritesheet = loader.resources["/texture.png"].spritesheet!;
  // oatv_sprite.texture = sheet.textures["oatv-logo.png"];
  oatv_sprite.texture = texture;
  oatv_sprite.anchor.set(0.5);
  oatv_sprite.x = app.view.width / 2;
  oatv_sprite.y = app.view.height / 2;

  app.stage.addChild(oatv_sprite);
});

console.log(app.view.width, oatv_sprite.width);
app.ticker.add((delta) => {
  const { width, height } = oatv_sprite.texture.frame;
  if (oatv_sprite.x >= app.view.width - width / 2) {
    // console.log(width);
    console.log(oatv_sprite.x, app.view.width - width / 2);
    return;
  }
  oatv_sprite.x += 2.5;
});

/**
 * Resizing function
 */
window.addEventListener("resize", () => {});
