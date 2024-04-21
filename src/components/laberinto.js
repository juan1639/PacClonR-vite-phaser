import { matrixLevels } from "../scenes/matrixLevels.js";
import { Settings } from "../scenes/settings.js";

export class Laberinto
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        const nivel = Settings.getNivel();

        this.tile = this.relatedScene.physics.add.staticGroup();

        for (let i = 0; i < matrixLevels.array_levels[nivel].length; i ++)
        {
            for (let ii = 0; ii < matrixLevels.array_levels[nivel][0].length; ii ++)
            {
                const valor = matrixLevels.array_levels[nivel][i][ii];

                this.elegir_tilesNiveles(valor, nivel, i, ii);
            }
        }

        console.log(this.tile);
    }

    static check_colision(x, y)
    {
        const nivel = Settings.getNivel();

        if (matrixLevels.array_levels[nivel][y][x] <= 12) return true;
        return false;
    }

    elegir_tilesNiveles(valor, nivel, i, ii)
    {
        const scale = Settings.getScaleGame();
        const frame = 0;

        /* if (valor <= 12)
        {
            this.tile.create(
                (ii * Settings.tileXY.x) * scale,
                (i * Settings.tileXY.y) * scale,
                'tile-map-ssheet', frame
            ).setScale(scale).refreshBody();
        } */

        if (valor <= 12)
        {
            this.tile.create(
                (ii * Settings.tileXY.x) * scale,
                (i * Settings.tileXY.y) * scale,
                'tile-pacman-marron'
            ).setScale((Settings.tileXY.y * scale) / 64); // 64x64px = tile-pacman-marron
        }
    }

    get()
    {
        return this.tile;
    }
}
