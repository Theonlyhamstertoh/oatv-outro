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
    this.oldFilm.noise = 0.1;
    this.oldFilm.scratch = 0.7;
    this.oldFilm.scratchDensity = 0.5;

    this.background.alpha = 0.7;

    app.stage.addChild(this.background);
    app.stage.filters = [this.oldFilm];
    // app.stage.addChild(this.container)
    app.ticker.add((delta) => {
      this.oldFilm.seed += 0.01 * delta;
      // this.oldFilm.seed > 4 && (this.oldFilm.seed = 0);
    });
  }

  initializeBackground() {}
}
