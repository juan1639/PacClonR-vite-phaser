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
        this.laberinto = this.relatedScene.physics.add.sprite(0, 0, 'laberinto-1', 1);
        this.laberinto.setOrigin(0, 0).setScale(3, 3);

        /* const nivel = Settings.getNivel();

        this.tile = this.relatedScene.physics.add.staticGroup();

        for (let i = 0; i < Laberinto.array_laberinto.length; i ++)
        {
            for (let ii = 0; ii < Laberinto.array_laberinto[i].length; ii ++)
            {
                const valor = Laberinto.array_laberinto[i][ii];

                this.elegir_tilesNiveles(valor, nivel, i, ii);
            }
        } */

        console.log(this.laberinto);
    }

    static check_colision(x, y)
    {
        const nivel = Settings.getNivel();

        if (matrixLevels.array_levels[nivel][y][x] === 9) return true;
        return false;
    }

    elegir_tilesNiveles(valor, nivel, i, ii)
    {
        if (valor === 9)
        {
            this.tile.create(
                ii * Settings.tileXY.x,
                i * Settings.tileXY.y,
                `tile${nivel}`
            ).refreshBody();
        }
    }

    get()
    {
        return this.tile;
    }
}
