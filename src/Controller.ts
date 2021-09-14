import "./style.css";
import * as PIXI from "pixi.js";
import BackgroundOldFilm from "./BackgroundOldFilm";
import MovingSprite from "./MovingSprite";

/**
 *
 * Controller Class
 *
 */
export default class Controller {
  app: PIXI.Application;
  oatvArray: Array<MovingSprite>;
  scaleFactor: number;
  count: number;
  colorMatrixFilter: any; // suppose to be PIXI.filters.ColorMatrixFilter()
  oldFilmTexture: BackgroundOldFilm;
  oatvContainer: PIXI.Container;

  constructor() {
    this.app = new PIXI.Application({
      resizeTo: window,
      width: window.innerWidth,
      backgroundColor: 0x111111,
      antialias: true,
      height: window.innerHeight,
      autoDensity: true,
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    });

    this.count = 1;
    this.oatvArray = [];
    this.scaleFactor = 0.45;
    this.oldFilmTexture = new BackgroundOldFilm(this.app);
    this.oatvContainer = new PIXI.Container();
    this.app.stage.addChild(this.oatvContainer);

    this.colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
    this.oatvContainer.filters = [this.colorMatrixFilter];
    this.colorMatrixFilter.brightness(1.7, true);

    this.resizeListener();
    this.app.ticker.add(() => {
      this.oatvArray.forEach((oatv) => {
        oatv.update(this);
      });
    });
  }

  addOATV(texture: PIXI.Texture<PIXI.Resource>) {
    const oatv_sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    oatv_sprite.anchor.set(0.5);
    oatv_sprite.scale.set(this.scaleFactor);

    oatv_sprite.x =
      Math.random() * (this.app.view.width - oatv_sprite.width) + oatv_sprite.width / 2;
    oatv_sprite.y =
      Math.random() * (this.app.view.height - oatv_sprite.height) + oatv_sprite.height / 2;
    this.oatvContainer.addChild(oatv_sprite);
    this.oatvArray.push(new MovingSprite(oatv_sprite, this.scaleFactor));
  }

  resizeListener() {
    window.addEventListener("resize", () => {
      this.oldFilmTexture.background.width = window.innerWidth;
      this.oldFilmTexture.background.height = window.innerHeight;
      this.oldFilmTexture.background.x = window.innerWidth / 2;
      this.oldFilmTexture.background.y = window.innerHeight / 2;
    });
  }
}
