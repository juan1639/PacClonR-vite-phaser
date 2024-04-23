import { Settings } from '../scenes/settings.js';
import { matrixLevels } from '../scenes/matrixLevels.js';
import { Laberinto } from "./laberinto.js";

export class Jugador
{
    static VEL = 2;

    // [velX, velY, addWidth, addHeight, angle]
    static INFO_DIRECCION = {
        left: [-1, 0, 0, 0, 180],
        right: [1, 0, 1, 0, 0],
        up: [0, -1, 0, 0, 270],
        down: [0, 1, 0, 1, 90]
    };

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create(x, y)
    {
        const scale = Settings.getScaleGame();

        this.jugador = this.relatedScene.physics.add.sprite(x, y, 'pacman');

        this.jugador.setCircle(
            Math.floor((Settings.tileXY.y * scale) / 2),
            Math.floor(Settings.tileXY.x / 6),
            Math.floor(Settings.tileXY.y / 6)
        );

        this.jugador.setDepth(Settings.depth.jugador).setAngle(0);
        this.jugador.setScale((Settings.tileXY.y * scale) / 64); // 64x64px pacman ssheet

        this.jugador.setData('intento-giro', 'right');

        this.intentoGiro = 'right';
        this.direccion = this.intentoGiro;

        this.relatedScene.anims.remove('le-ri-up-do');

        this.relatedScene.anims.create(
        {
            key: 'le-ri-up-do', 
            frames: this.relatedScene.anims.generateFrameNumbers('pacman', {start: 0, end: 6}),
            frameRate: 30,
            yoyo: true,
            repeat: -1
        });

        this.relatedScene.anims.create(
        {
            key: 'turn',
            frames: [{key: 'pacman', frame: 0}],
            frameRate: 20,
        });

        this.jugador.anims.play('le-ri-up-do', true);

        this.controles = this.relatedScene.input.keyboard.createCursorKeys();

        console.log(this.jugador);
    }

    update()
    {
        if (!this.jugador.body.enable || Settings.isPausaComeFantasma() || Settings.isNivelSuperado()) return;

        const configVel = Settings.getConfig().vel;
        const scale = Settings.getScaleGame();
        const direcc = Jugador.INFO_DIRECCION;

        Object.keys(Jugador.INFO_DIRECCION).forEach(tecla =>
        {
            
            if (this.controles[tecla].isDown) this.intentoGiro = tecla;

            if (Settings.controlElegido.mobile)
            {
                if (this.relatedScene.crucetaup.isDown)
                {
                    this.intentoGiro = 'up';

                } else if (this.relatedScene.crucetado.isDown)
                {
                    this.intentoGiro = 'down';

                } else if (this.relatedScene.crucetale.isDown)
                {
                    this.intentoGiro = 'left';

                } else if (this.relatedScene.crucetari.isDown)
                {
                    this.intentoGiro = 'right';
                }
            }
        });

        if (this.jugador.x % (Settings.tileXY.x * scale) === 0 && this.jugador.y % (Settings.tileXY.y * scale) === 0)
        {
            const x = Math.floor(this.jugador.x / (Settings.tileXY.x * scale)) + direcc[this.intentoGiro][0];
            const y = Math.floor(this.jugador.y / (Settings.tileXY.y * scale)) + direcc[this.intentoGiro][1];
            
            // *********** > 12 = No wall **********
            if (!Laberinto.check_colision(x, y))
            {
                this.direccion = this.intentoGiro;
                this.jugador.setAngle(direcc[this.direccion][4]);
            }
        }

        const ancho = direcc[this.direccion][2] * ((Settings.tileXY.x * scale) - (Jugador.VEL * configVel));
        const alto = direcc[this.direccion][3] * ((Settings.tileXY.y * scale) - (Jugador.VEL * configVel));
        const offsetX = direcc[this.direccion][0] * (Jugador.VEL * configVel);
        const offsetY = direcc[this.direccion][1] * (Jugador.VEL * configVel);
        
        const x = Math.floor((this.jugador.x + offsetX + ancho) / (Settings.tileXY.x * scale));
        const y = Math.floor((this.jugador.y + offsetY + alto) / (Settings.tileXY.y * scale));
        
        // *********** > 12 = No wall **********
        if (!Laberinto.check_colision(x, y))
        {
            this.jugador.x += direcc[this.direccion][0] * (Jugador.VEL * configVel);
            this.jugador.y += direcc[this.direccion][1] * (Jugador.VEL * configVel);

            // ******* Escapatorias *********
            const nivel = Settings.getNivel();

            if (this.jugador.x > matrixLevels.array_levels[nivel][0].length * (Settings.tileXY.x * scale) && direcc[this.direccion][0] > 0)
            {
                this.jugador.x = -(Settings.tileXY.x * scale);
            }

            if (this.jugador.x < -(Settings.tileXY.x * scale) && direcc[this.direccion][0] < 0)
            {
                this.jugador.x = (matrixLevels.array_levels[nivel][0].length - 1) * (Settings.tileXY.x * scale);
            }
        }

        // console.log(this.jugador.x, this.jugador.y);
    }

    get()
    {
        return this.jugador;
    }
}

// ================================================================================
export class JugadorDies
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create(x, y)
    {
        this.jugadordies = this.relatedScene.physics.add.sprite(x, y, 'pacman');

        this.jugadordies.setFrame(4);

        this.relatedScene.tweens.add(
        {
            targets: this.jugadordies,
            angle: 359,
            duration: 1000,
            repeat: 2
        });

        console.log(this.jugadordies);
    }

    get()
    {
        return this.jugadordies;
    }
}

// ================================================================================
export class JugadorShowVidas
{
    constructor(scene, args)
    {
        this.relatedScene = scene;
        this.args = args;
    }

    create()
    {
        const { left, top } = this.args;

        this.jugadorshowvidas = this.relatedScene.physics.add.group(
        {
            key: ['pacman'],
            frameQuantity: Settings.getVidas(),
            setXY: {
                x: left,
                y: top,
                stepX: Settings.tileXY.x * Settings.getScaleGame()
            },
            frame: 4
        });

        this.jugadorshowvidas.children.iterate(vida =>
        {
            vida.setOrigin(0.5, 0).setScale(1, 0.7).setBlendMode(Phaser.BlendModes.ADD);
        });

        console.log(this.jugadorshowvidas);
    }

    get()
    {
        return this.jugadorshowvidas;
    }
}

// ================================================================================
export class JugadorPreGame
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create(x, y)
    {
        this.jugadorpregame = this.relatedScene.physics.add.sprite(x, y, 'pacman');

        this.jugadorpregame.setAngle(0);

        this.relatedScene.anims.create(
        {
            key: 'le-ri-up-do', 
            frames: this.relatedScene.anims.generateFrameNumbers('pacman', {start: 0, end: 6}),
            frameRate: 30,
            yoyo: true,
            repeat: -1
        });

        this.jugadorpregame.anims.play('le-ri-up-do', true);

        const duracionTotal = 8000;

        this.relatedScene.tweens.add(
        {
            targets: this.jugadorpregame,
            x: this.relatedScene.sys.game.config.width + 150,
            yoyo: true,
            duration: duracionTotal,
            repeat: -1
        });

        const infiniteLoop = this.add.timeline([
            {
                at: duracionTotal,
                run: () =>
                {
                    this.jugadorpregame.setFlipX(!this.jugadorpregame.flipX);
                }
            }
        ]);
        
        infiniteLoop.repeat(-1).play();

        // setInterval(() => {this.jugadorpregame.setFlipX(!this.jugadorpregame.flipX)}, duracionTotal);

        console.log(this.jugadorpregame);
    }
}
