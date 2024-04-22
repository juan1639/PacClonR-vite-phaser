import { matrixLevels } from "../scenes/matrixLevels.js";
import { Settings } from "../scenes/settings.js";
import { particulas } from "../functions/functions.js";

export class Puntitos
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        const scale = Settings.getScaleGame();
        const nivel = Settings.getNivel();

        this.puntito = this.relatedScene.physics.add.staticGroup();

        for (let i = 0; i < matrixLevels.array_levels[nivel].length; i ++)
        {
            for (let ii = 0; ii < matrixLevels.array_levels[nivel][i].length; ii ++)
            {
                const valor = matrixLevels.array_levels[nivel][i][ii];

                if (valor > 12)
                {
                    if (i === Settings.pacman.iniY && ii === Settings.pacman.iniX) continue;

                    this.puntito.create(
                        ii * Settings.tileXY.x * scale,
                        i * Settings.tileXY.y * scale,
                        'puntito'
                    ).setScale(0.6).setDepth(Settings.depth.puntitos).setData('puntos', 10).refreshBody();
                }
            }
        }

        console.log(this.puntito);
    }

    get()
    {
        return this.puntito;
    }
}

// ===========================================================================
export class PuntitosGordos
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.puntitosgordos = this.relatedScene.physics.add.staticGroup();

        for (let i = 0; i < Laberinto.array_laberinto.length; i ++)
        {
            for (let ii = 0; ii < Laberinto.array_laberinto[i].length; ii ++)
            {
                const valor = Laberinto.array_laberinto[i][ii];

                if (valor === 5)
                {
                    this.puntitosgordos.create(ii * Settings.tileXY.x, i * Settings.tileXY.y, 'puntito')
                        .setData('puntos', 50).setScale(1.6).refreshBody();
                }
            }
        }

        this.relatedScene.tweens.add(
        {
            targets: this.puntitosgordos.getChildren(),
            scale: 0.8,
            tint: new Phaser.Display.Color(255, Phaser.Math.Between(150, 255), 255).color,
            yoyo: true,
            duration: 900,
            repeat: -1
        });

        this.puntitosgordos.children.iterate(gordo =>
        {
            particulas(
                gordo.x, gordo.y,
                'sparkle',
                100,
                500,
                {start: 0.17, end: 0},
                0xffff55,
                null, false, this.relatedScene
            );
        });

        console.log(this.puntitosgordos);
    }

    get()
    {
        return this.puntitosgordos;
    }
}
