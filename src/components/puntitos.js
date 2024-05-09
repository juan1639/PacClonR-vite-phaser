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
        const gordos = Settings.puntitosGordos;

        const arrayNoPuntitos = [
            [Settings.pacman.iniY, Settings.pacman.iniX],
            [gordos.uple],[gordos.upri],[gordos.dole],[gordos.dori],
            [1, 1], [1, 17], [16, 1], [16, 17],
            [12, 0], [12, 1], [12, 2], [12, 3],
            [12, 15], [12, 16], [12, 17], [12, 18],
            [10, 0], [10, 18],
            [8, 0], [8, 1], [8, 2], [8, 3],
            [8, 15], [8, 16], [8, 17], [8, 18]
        ];

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
                    const noPuntito = arrayNoPuntitos.some(coor => i === coor[0] && ii === coor[1]);

                    if (noPuntito) continue;

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
        const gordos = Settings.puntitosGordos;
        const scale = Settings.getScaleGame();

        // 512x512px = particula1.png
        const scalePtoGordoX = (Settings.tileXY.x / 512) * scale;
        const scalePtoGordoY = (Settings.tileXY.y / 512) * scale;

        this.puntitosgordos = this.relatedScene.physics.add.staticGroup();

        Object.keys(gordos).forEach(gordo =>
        {
            this.puntitosgordos.create(
                gordos[gordo][1] * (Settings.tileXY.x * scale),
                gordos[gordo][0] * (Settings.tileXY.y * scale),
                'particula1'
            ).setData('puntos', 50).setScale(scalePtoGordoX, scalePtoGordoY).setBlendMode('ADD').refreshBody();
        });

        this.relatedScene.tweens.add(
        {
            targets: this.puntitosgordos.getChildren(),
            scale: scalePtoGordoX * 2,
            // tint: new Phaser.Display.Color(255, Phaser.Math.Between(150, 255), 255).color,
            yoyo: true,
            duration: 900,
            repeat: -1
        });

        this.relatedScene.tweens.add(
        {
            targets: this.puntitosgordos.getChildren(),
            angle: 359,
            // tint: new Phaser.Display.Color(255, Phaser.Math.Between(150, 255), 255).color,
            duration: 900,
            repeat: -1
        });

        console.log(this.puntitosgordos);
    }

    get()
    {
        return this.puntitosgordos;
    }
}
