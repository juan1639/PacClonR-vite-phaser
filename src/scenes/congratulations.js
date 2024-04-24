import { Settings } from './settings.js';
import { Textos } from '../components/textos.js';
import { BotonNuevaPartida } from "../components/boton-nuevapartida.js";
import { particulas, play_sonidos } from '../functions/functions.js';

export class Congratulations extends Phaser.Scene
{
  constructor()
  {
    super({ key: 'Congratulations' });
  }

  init()
  {
    this.botoninicio = new BotonNuevaPartida(this, {
      left: Math.floor(this.sys.game.config.width / 2),
      top: Math.floor(this.sys.game.config.height / 1.3),
      id: 'boton-nueva-partida',
      scX: 0.6, scY: 0.5, angle: 1, originX: 0.5, originY: 0.5,
      texto: ' Continue ', nextScene: 'Game'
    });
  }

  create()
  {
    this.intermision = this.sound.add('pacman-intermision');

    const boundsXY = [Settings.screen.escBoundsX, Settings.screen.escBoundsY];
    
    const aparecerBoton = 3200;
    this.incremento_nivel = Settings.getNivel() + 1;
    
    this.add.image(0, 0, 'fondo-pacman').setScale(boundsXY[0], boundsXY[1]).setDepth(Settings.depth.fondo).setOrigin(0, 0);

    const fantRnd = Phaser.Math.Between(0, 3);

    this.fantasmon = this.add.sprite(
      -400, Math.floor(this.sys.game.config.height / 1.8),
      `fantasmon${fantRnd}`
    );

    this.fantasmon.setDepth(Settings.depth.fantasmon).setOrigin(0.5, 0.5).setScale(0.35).setFlipX(false);
    this.fantasmon.setData('vel', 2);

    if (this.incremento_nivel <= 2)
    {
      for (let i = 0; i < 4; i ++)
      {
        this.anims.create({
          key: `anim-fantasmon${i}`, 
          frames: this.anims.generateFrameNumbers(`fantasmon${i}`, {start: 0, end: 1}),
          frameRate: 15,
          yoyo: true,
          repeat: -1
        });
      }
    }

    this.fantasmon.anims.play(`anim-fantasmon${fantRnd}`);

    this.txt = new Textos(this, {
      x: Math.floor(this.sys.game.config.width / 2),
      y: Math.floor(this.sys.game.config.height / 3.5),
      txt: ' Level Up! ',
      size: 99, color: '#ffa', style: 'bold',
      stroke: '#f91', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: false, dura: 0
    });

    this.txt.create();
    this.txt.get().setDepth(Settings.depth.textos).setAlpha(1).setScale(0.1);

    this.tweens.add({targets: this.txt.get(), scale: 1, duration: 3000});

    particulas(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      'particula1',
      {min: 90, max: 320},
      {min: 5500, max: 6000},
      {start: 0, end: 0.4},
      0xffcc11,
      null, false, this
    );

    const timeline = this.add.timeline([
      {
        at: aparecerBoton,
        run: () => {
          Settings.setNivel(this.incremento_nivel);
          this.botoninicio.create();
        }
      }
    ]);
    
    timeline.play();

    play_sonidos(this.intermision, false, 0.8);

    console.log(this.txt);
  }

  update()
  {    
    this.fantasmon.x += this.fantasmon.getData('vel');

    if (
      (this.fantasmon.x > this.sys.game.config.width + 400 && this.fantasmon.getData('vel') > 0) ||
      (this.fantasmon.x < -400 && this.fantasmon.getData('vel') < 0)
    )
    {
      this.fantasmon.setData('vel', -this.fantasmon.getData('vel'));

      if (!this.fantasmon.flipX)
      {
        this.fantasmon.setFlipX(true);
      }
      else
      {
        this.fantasmon.setFlipX(false);
      }
    }
  }
}
