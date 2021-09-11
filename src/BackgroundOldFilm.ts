import "./style.css";
import * as PIXI from "pixi.js";
import { OldFilmFilter } from "@pixi/filter-old-film";

/**
 *
 * Old Film Filter
 *
 */
export default class BackgroundOldFilm {
  oldFilm: OldFilmFilter;
  background: PIXI.Sprite;
  container: PIXI.Container;
  constructor(app: PIXI.Application) {
    this.oldFilm = new OldFilmFilter();
    this.background = new PIXI.Sprite();
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
    this.background.anchor.set(0.5);
    this.background.x = app.view.width / 2;
    this.background.y = app.view.height / 2;

    this.container = new PIXI.Container();

    this.oldFilm.sepia = 0;
    this.oldFilm.autoFit = true;
    this.oldFilm.noise = 0.25;
    this.oldFilm.vignetting = 0.37;
    this.oldFilm.scratch = 0.2;
    this.oldFilm.scratchDensity = 0.5;

    this.background.alpha = 0.5;

    app.stage.addChild(this.background);
    app.stage.filters = [this.oldFilm];
    app.ticker.add((delta) => {
      if (this.oldFilm.seed > 1) this.oldFilm.seed = 0;
      this.oldFilm.seed += 0.01 * delta;
    });
  }

  initializeBackground() {}
}
