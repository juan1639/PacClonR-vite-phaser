import { matrixLevels } from '../scenes/matrixLevels.js';
import { Settings } from '../scenes/settings.js';

export class Jugador
{
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
        this.jugador.setScale(((Settings.tileXY.y * scale) / 64) * 0.9); // 64x64px pacman ssheet
        
        this.jugador.setData('intento-giro', 'right');
        this.establecer_velocidad(true);

        // this.relatedScene.anims.remove('le-ri-up-do');

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

        const scale = Settings.getScaleGame();

        const direcc = Settings.pacman.direccion;

        Object.keys(direcc).forEach(tecla =>
        {
            if (this.controles[tecla].isDown) this.jugador.setData('intento-giro', tecla);

            if (Settings.controlElegido.mobile)
            {
                if (this.relatedScene.crucetaup.isDown)
                {
                    this.jugador.setData('intento-giro', 'up');

                } else if (this.relatedScene.crucetado.isDown)
                {
                    this.jugador.setData('intento-giro', 'down');

                } else if (this.relatedScene.crucetale.isDown)
                {
                    this.jugador.setData('intento-giro', 'left');

                } else if (this.relatedScene.crucetari.isDown)
                {
                    this.jugador.setData('intento-giro', 'right');
                }
            }
        });

        const intentoGiro = Settings.pacman.direccion[this.jugador.getData('intento-giro')][3];

        if (!this.jugador.body.touching[intentoGiro])
        {
            this.establecer_velocidad(false);
        }

        // Escapatorias
        const nivel = Settings.getNivel();

        if (this.jugador.x > matrixLevels.array_levels[nivel][0].length * (Settings.tileXY.x * scale) && direcc[this.jugador.getData('direccion')][0] > 0)
        {
            this.jugador.x = -(Settings.tileXY.x * scale);
        }

        if (this.jugador.x < -Settings.tileXY.x && direcc[this.jugador.getData('direccion')][0] < 0)
        {
            this.jugador.x = (matrixLevels.array_levels[nivel][0].length - 1) * (Settings.tileXY.x * scale);
        }

        // console.log(Settings.pacman.arrayAcumDir.length);
        // console.log(this.jugador.getData('direccion'));
        // console.log(this.jugador.x, this.jugador.y);
    }

    establecer_velocidad(firstTime)
    {
        const direcc = Settings.pacman.direccion;

        this.jugador.setData('direccion', this.jugador.getData('intento-giro'));
        this.jugador.setAngle(direcc[this.jugador.getData('direccion')][2]);
        Settings.pacman.arrayAcumDir.unshift(this.jugador.getData('direccion'));

        if (!firstTime) this.arrayNoMore50();

        if (!firstTime)
        {
            const velX = direcc[this.jugador.getData('direccion')][0] * Settings.pacman.velocity;
            const velY = direcc[this.jugador.getData('direccion')][1] * Settings.pacman.velocity;
            this.jugador.setVelocityX(velX);
            this.jugador.setVelocityY(velY);
        }
        else
        {
            this.relatedScene.time.delayedCall(Settings.getPausaInicialDuracion(), () =>
            {
                const velX = direcc[this.jugador.getData('direccion')][0] * Settings.pacman.velocity;
                const velY = direcc[this.jugador.getData('direccion')][1] * Settings.pacman.velocity;
                this.jugador.setVelocityX(velX);
                this.jugador.setVelocityY(velY);
            });
        }
    }

    arrayNoMore50()
    {
        const max = Settings.pacman.maxArrayAcumDir;

        if (Settings.pacman.arrayAcumDir.length > max + 2)
        {
            const borrar = Settings.pacman.arrayAcumDir.length - max;
            Settings.pacman.arrayAcumDir.splice(max, borrar);
        }
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
            x: this.relatedScene.sys.game.config.width + Settings.tileXY.x * 2,
            yoyo: true,
            duration: duracionTotal,
            repeat: -1
        });

        setInterval(() => {this.jugadorpregame.setFlipX(!this.jugadorpregame.flipX)}, duracionTotal);

        console.log(this.jugadorpregame);
    }

    get()
    {
        return this.jugadorpregame;
    }
}
