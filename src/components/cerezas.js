import { Settings } from '../scenes/settings.js';
import { Laberinto } from "./laberinto.js";
import { matrixLevels } from '../scenes/matrixLevels.js';

export class Cerezas
{
    static VEL = 1; // Mitad de rapido (para cogerlas mejor)

    // [velX, velY, addWidth, addHeight, angle]
    static INFO_DIRECCION = {
        left: [-1, 0, 0, 0, 180, 'left'],
        right: [1, 0, 1, 0, 0, 'right'],
        up: [0, -1, 0, 0, 270, 'up'],
        down: [0, 1, 0, 1, 90, 'down']
    };

    static OTRA_DIRECCION_RND = {
        left: ['right', 'up', 'down'],
        right: ['left', 'up', 'down'],
        up: ['right', 'left', 'down'],
        down: ['right', 'left', 'up']
    };

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        const scale = Settings.getScaleGame();
        const nivel = Settings.getNivel();

        this.cerezas = this.relatedScene.physics.add.sprite(
            Settings.getCerezasIniXY()[0] * (Settings.tileXY.x * scale),
            Settings.getCerezasIniXY()[1] * (Settings.tileXY.y * scale),
            'frutas'
        );

        this.cerezas.setData('intentoGiro', 'right');
        this.cerezas.setData('direccion', 'right');

        this.cerezas.setCircle(
            Math.floor(Settings.tileXY.y / 3),
            Math.floor(Settings.tileXY.x / 6),
            Math.floor(Settings.tileXY.y / 6),
        );

        this.cerezas.setAngle(-20).setScale(scale).setFrame(0).setFlipX(false);
        this.cerezas.setDepth(Settings.depth.item);

        if (nivel < 14)
        {
            this.cerezas.setData('puntos', Settings.getBonusCerezas()[nivel]);

            if (nivel < 9)
            {
                this.cerezas.setFrame(nivel - 1);
            }
            else
            {
                this.cerezas.setFrame(7);
            }
        }
        else
        {
            this.cerezas.setData('puntos', 7000);
            this.cerezas.setFrame(7);
        }

        this.relatedScene.tweens.add(
        {
            targets: this.cerezas,
            angle: 20,
            ease: 'linear',
            yoyo: true,
            duration: 2000,
            repeat: -1
        });

        console.log(this.cerezas);
    }

    update()
    {
        if (!this.relatedScene.jugador.get().body.enable) return;

        const configVel = Settings.getConfig().vel;
        const nivel = Settings.getNivel();
        const scale = Settings.getScaleGame();
        const direcc = Cerezas.INFO_DIRECCION;

        const x = Math.floor(
            (this.cerezas.x + direcc[this.cerezas.getData('direccion')][0] +
                (Settings.tileXY.x * scale) * direcc[this.cerezas.getData('direccion')][2]) / (Settings.tileXY.x * scale));
        
        const y = Math.floor(
            (this.cerezas.y + direcc[this.cerezas.getData('direccion')][1] +
                (Settings.tileXY.y * scale) * direcc[this.cerezas.getData('direccion')][3]) / (Settings.tileXY.y * scale));
        
        if (!Laberinto.check_colision(x, y))
        {
            this.cerezas.x += direcc[this.cerezas.getData('direccion')][0] * (Cerezas.VEL * configVel);
            this.cerezas.y += direcc[this.cerezas.getData('direccion')][1] * (Cerezas.VEL * configVel);

            // ************* Escapatorias ************
            if (this.cerezas.x > matrixLevels.array_levels[nivel][0].length * (Settings.tileXY.x * scale) && this.cerezas.getData('direccion') === 'right')
            {
                this.cerezas.x = -(Settings.tileXY.x * scale);
            }
            if (this.cerezas.x < -(Settings.tileXY.x * scale) && this.cerezas.getData('direccion') === 'left')
            {
                this.cerezas.x = (matrixLevels.array_levels[nivel][0].length - 1) * (Settings.tileXY.x * scale);
            }

        } else
        {
            this.cerezas.setData('direccion', this.elegir_otra_direccion(direcc, this.cerezas));
        }
    }

    elegir_otra_direccion(direcc, cerezas)
    {
        let actualDirecc = direcc[cerezas.getData('direccion')][5];
        return Cerezas.OTRA_DIRECCION_RND[actualDirecc][Math.floor(Math.random()* 3)];
    }

    get()
    {
        return this.cerezas;
    }
}
