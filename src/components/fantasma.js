import { matrixLevels } from '../scenes/matrixLevels.js';
import { Settings } from '../scenes/settings.js';
import { Laberinto } from './laberinto.js';

export class Fantasma
{
    static VEL = 2;

    // [velX, velY, addWidth, addHeight, angle]
    static INFO_DIRECCION =
    {
        left: [-1, 0, 0, 0, 180, 'left'],
        right: [1, 0, 1, 0, 0, 'right'],
        up: [0, -1, 0, 0, 270, 'up'],
        down: [0, 1, 0, 1, 90, 'down']
    };

    // Posible random directions
    static OTRA_DIRECCION_RND =
    {
        left: ['right', 'up', 'down'],
        right: ['left', 'up', 'down'],
        up: ['right', 'left', 'down'],
        down: ['right', 'left', 'up']
    };

    // Algunos ptos del Laberinto donde los fantasmas pueden cambiar de direccion
    // Some points when Ghosts can change direction
    static ptosClave = [
        [4, 1], [14, 1],
        [4, 4], [6, 4], [12, 4], [14, 4],
        [10, 8],
        [4, 10], [6, 10], [9, 10], [12, 10], [14, 10],
        [6, 12],
        [4, 14], [6, 14], [12, 14], [14, 14],
        [4, 16], [8, 16], [10, 16], [14, 16],
        [8, 20], [10, 20]
    ];

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        const scale = Settings.getScaleGame();

        this.fantasmas = this.relatedScene.physics.add.group(
        {
            key: ['fantanim0', 'fantanim1', 'fantanim2'],
            frameQuantity: 1,
            setXY: {
                x: Settings.fantasmasIniXY.azul[0] * Settings.tileXY.x * scale,
                y: Settings.fantasmasIniXY.azul[1] * Settings.tileXY.y * scale,
                stepX: (Settings.tileXY.x * scale)
            }
        });

        this.fantasmas.create(
            Settings.fantasmasIniXY.pink[0] * Settings.tileXY.x * scale,
            Settings.fantasmasIniXY.pink[1] * Settings.tileXY.y * scale,
            'fantanim3'
        );

        this.fantasmas.children.iterate((fant, index) =>
        {
            fant.setData('intentoGiro', 'right');
            fant.setData('direccion', 'right');
            fant.setData('id', index);
            fant.setCircle(
                Math.floor(Settings.tileXY.y / 2),
                Math.floor(Settings.tileXY.x / 12),
                Math.floor(Settings.tileXY.y / 12)
            );

            fant.setAngle(0).setScale(scale).setDepth(Settings.depth.fantasmas);
            fant.setFrame(0).setFlipX(false);
        });

        this.fantasmas.children.iterate((fant, index) =>
        {
            for (let i = 0; i < 4; i ++) {

                // this.relatedScene.anims.remove(`anim${index}${i}`);

                this.relatedScene.anims.create({
                    key: `anim${index}${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim${index}${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            fant.anims.play(`anim${index}0`, true);
        });

        /* Fantasma.ptosClave.forEach(pto =>
        {
            this.relatedScene.add.rectangle(
                pto[0] * Settings.tileXY.x * scale, pto[1] * Settings.tileXY.y * scale,
                50, 50
            ).setStrokeStyle(2, 0x1ac).setDepth(Settings.depth.textos);
        }); */

        console.log(this.fantasmas);
    }

    update()
    {
        if (!this.relatedScene.jugador.get().body.enable || Settings.isPausaComeFantasma() || Settings.isNivelSuperado()) return;

        const direcc = Fantasma.INFO_DIRECCION;

        this.fantasmas.children.iterate((fant, index) =>
        {

            if (Settings.isFantasmasScary())
            {
                // fant.setBlendMode('ADD');
                fant.setTintFill(new Phaser.Display.Color(9, 225, 255).color);

                if (Settings.isFantasmasIntermitente())
                {
                    fant.setTint(new Phaser.Display.Color(20, Phaser.Math.Between(60, 200), Phaser.Math.Between(125, 255)).color);
                }
            }

            let x = 0;
            let y = 0;
            let perseguir;
            const scale = Settings.getScaleGame();

            for (let i = 0; i < Fantasma.ptosClave.length; i ++)
            {
                let pClaveX = Fantasma.ptosClave[i][0] * Settings.tileXY.x * scale;
                let pClaveY = Fantasma.ptosClave[i][1] * Settings.tileXY.y * scale;

                if (fant.x == pClaveX && fant.y == pClaveY)
                {
                    perseguir = Phaser.Math.Between(0, 10);

                    if (perseguir < 7 + Settings.getNivel())
                    {
                        this.fantasma_persigue(fant);
                        this.set_flips(fant, index);
                    }
                }
            }

            x = Math.floor(
                (fant.x + direcc[fant.getData('direccion')][0] +
                    Settings.tileXY.x * scale * direcc[fant.getData('direccion')][2]) / (Settings.tileXY.x * scale));
            
            y = Math.floor(
                (fant.y + direcc[fant.getData('direccion')][1] +
                    Settings.tileXY.y * scale * direcc[fant.getData('direccion')][3]) / (Settings.tileXY.y * scale));
            
            if (!(Laberinto.check_colision(x, y)))
            {
                fant.x += direcc[fant.getData('direccion')][0] * (Fantasma.VEL * Settings.getConfig().vel);
                fant.y += direcc[fant.getData('direccion')][1] * (Fantasma.VEL * Settings.getConfig().vel);

                // Escapatorias
                const nivel = Settings.getNivel();

                if (fant.x > matrixLevels.array_levels[nivel][0].length * (Settings.tileXY.x * scale) && fant.getData('direccion') === 'right')
                {
                    fant.x = -(Settings.tileXY.x * scale);
                }

                if (fant.x < -(Settings.tileXY.x * scale) && fant.getData('direccion') === 'left')
                {
                    fant.x = (matrixLevels.array_levels[nivel][0].length - 1) * (Settings.tileXY.x * scale);
                }

            } else
            {
                perseguir = Phaser.Math.Between(0, 10);

                if (perseguir < 5 + Settings.getNivel()) {
                    this.fantasma_persigue(fant);
                    
                } else
                {
                    fant.setData('direccion', this.elegir_otra_direccion(direcc, fant));
                }

                this.set_flips(fant, index);
            }
        });
    }

    elegir_otra_direccion(direcc, fant)
    {
        let actualDirecc = direcc[fant.getData('direccion')][5];
        return Fantasma.OTRA_DIRECCION_RND[actualDirecc][Math.floor(Math.random()* 3)];
    }

    fantasma_persigue(fant)
    {
        const hor_ver = Phaser.Math.Between(0, 10);

        if (hor_ver < 5)
        {
            if (fant.y < this.relatedScene.jugador.get().y) {
                fant.setData('direccion', 'down');

            } else
            {
                fant.setData('direccion', 'up');
            }

        } else
        {
            if (fant.x < this.relatedScene.jugador.get().x)
            {
                fant.setData('direccion', 'right');

            } else
            {
                fant.setData('direccion', 'left');
            }
        }
    }

    set_flips(fant, index)
    {
        if (fant.getData('direccion') === 'left')
        {
            fant.anims.play(`anim${index}1`, true);
            
        } else if (fant.getData('direccion') === 'right')
        {
            fant.anims.play(`anim${index}0`, true);
            
        } else if (fant.getData('direccion') === 'up')
        {
            fant.anims.play(`anim${index}2`, true);

        } else if (fant.getData('direccion') === 'down')
        {
            fant.anims.play(`anim${index}3`, true);
        }
    }

    duracion_scary()
    {
        let duracion = Settings.getFantasmasScaryDuracion() - Settings.getNivel() * 900;
        console.log(duracion);

        if (duracion < 1900) return 1900;
        return duracion;
    }

    clear_tint()
    {
        this.fantasmas.children.iterate(fant =>
        {
            if (!fant.visible)
            {
                fant.setVisible(true).clearTint();
                this.relatedScene.ojos.get().getChildren()[fant.getData('id')].setVisible(false);
            
            } else
            {
                fant.clearTint();
            }
        });
    }

    get()
    {
        return this.fantasmas;
    }
}

// ===========================================================================
export class FantasmaPreGame
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.fantasmaspregame = this.relatedScene.physics.add.group(
        {
            key: ['fantanim0', 'fantanim1', 'fantanim2', 'fantanim3'],
            frameQuantity: 1,
            setXY: {
                x: (Settings.fantasmasIniXY.azul[0] - 12) * Settings.tileXY.x,
                y: (Settings.fantasmasIniXY.azul[1] - 7) * Settings.tileXY.y,
                stepX: Settings.tileXY.x
            }
        });

        this.fantasmaspregame.children.iterate((fant =>
        {
            fant.setAngle(0).setScale(1.15, 1.15).setFrame(0).setFlipX(false);
        }));

        this.fantasmaspregame.children.iterate((fant, index) =>
        {
            for (let i = 0; i < 4; i ++) {

                this.relatedScene.anims.create(
                {
                    key: `anim${index}${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim${index}${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            fant.anims.play(`anim${index}0`, true);

            const duracionTotal = 9000;

            this.relatedScene.tweens.add(
            {
                targets: fant,
                x: this.relatedScene.sys.game.config.width + Settings.tileXY.x * 2,
                yoyo: true,
                duration: duracionTotal,
                repeat: -1
            });

            setInterval(() => {fant.setFlipX(!fant.flipX)}, duracionTotal);
        });

        console.log(this.fantasmaspregame);
    }
}

// ================================================================================
export class OjosFantasma
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.ojosfantasma = this.relatedScene.physics.add.group(
        {
            key: ['fantanim5', 'fantanim5', 'fantanim5', 'fantanim5'],
            frameQuantity: 1,
            setXY: {
                x: (Settings.fantasmasIniXY.azul[0] - 12) * Settings.tileXY.x,
                y: (Settings.fantasmasIniXY.azul[1] - 7) * Settings.tileXY.y,
                stepX: Settings.tileXY.x
            }
        });

        this.ojosfantasma.children.iterate((ojos =>
        {
            ojos.setAngle(0).setScale(1.15, 1.15).setFrame(0).setFlipX(false).setVisible(false);
        }));

        this.ojosfantasma.children.iterate((ojos, index) =>
        {
            for (let i = 0; i < 4; i ++)
            {
                this.relatedScene.anims.create(
                {
                    key: `anim5${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim5${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            ojos.anims.play(`anim50`, true);
        });

        console.log(this.ojosfantasma);
    }

    update()
    {
        this.ojosfantasma.children.iterate((ojos, index) =>
        {
            const fantasma = this.relatedScene.fantasmas.get().getChildren()[index];

            this.set_flips(fantasma, ojos);

            ojos.setX(fantasma.x);
            ojos.setY(fantasma.y);
        });
    }

    set_flips(fantasma, ojos)
    {
        if (fantasma.getData('direccion') === 'left')
        {
            ojos.anims.play(`anim51`, true);
            
        } else if (fantasma.getData('direccion') === 'right')
        {
            ojos.anims.play(`anim50`, true);
            
        } else if (fantasma.getData('direccion') === 'up')
        {
            ojos.anims.play(`anim52`, true);

        } else if (fantasma.getData('direccion') === 'down')
        {
            ojos.anims.play(`anim53`, true);
        }
    }

    get()
    {
        return this.ojosfantasma;
    }
}
