import { Textos } from './textos.js';
import { Settings } from '../scenes/settings.js';

export class GameOver
{
  constructor(scene)
  {
    this.relatedScene = scene;
  }
  
  create(jugadorX, jugadorY)
  {
    this.sonidoGameOver = this.relatedScene.sound.add('gameover-retro');

    const duracionThisScene = 7000;
    const left = jugadorX;
    const top = jugadorY;

    this.txt = new Textos(this.relatedScene, {
      x: left,
      y: top,
      txt: ' Game Over ',
      size: 99, color: '#dd9', style: 'bold',
      stroke: '#f41', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: false, dura: 0
    });

    this.txt.create();
    this.txt.get().setAlpha(0);

    this.relatedScene.tweens.add({
      targets: this.txt.get(),
      alpha: 1,
      duration: Math.floor(duracionThisScene / 2),
      // repeat: 1
    });

    const timeline = this.relatedScene.add.timeline([
      {
        at: duracionThisScene,
        run: () =>
        {
          this.relatedScene.botonrejugar.create();
          
          this.relatedScene.botonrejugar.get().setX(left).setY(
            top + (Settings.tileXY.y * Settings.getScaleGame()) * 4
          );

          this.relatedScene.botonrejugar.txt.get().setX(left).setY(
            top + (Settings.tileXY.y * Settings.getScaleGame()) * 4
          );
        }
      }
    ]);

    timeline.play();
    this.sonidoGameOver.play();
    this.sonidoGameOver.volume = 0.5;

    this.check_newRecord();
  }

  update() {}

  check_newRecord()
  {
    console.warn('iniciando check-records');

    async function fetchRecords()
    {
      try
      {
        const response = await fetch('https://ejemplo-node-railway-production.up.railway.app/all');

        const data = await response.json();

        const {name, puntuacion} = data; 
        console.log(name, puntuacion);
        console.log(data);
        console.log(JSON.stringify(data));
      }
      catch(error)
      {
        console.error('Error fetching data:', error);
      }
    }

    fetchRecords();

    /* fetch('https://ejemplo-node-railway-production.up.railway.app/all')
      .then(response =>
      {
        console.log(response);
        return response.json();
      })
      .then(data =>
      {
        const {name, puntuacion} = data;
        console.log(name, puntuacion);
        console.log(data);
        console.log(JSON.stringify(data));
      })
      .catch(error => 
      {
        console.error('Error fetching data:', error);
      }); */

    /* if (Settings.getPuntos() >= Settings.getRecord()) {

      Settings.setRecord(Settings.getPuntos());

      this.txtnewrecord = new Textos(this.relatedScene, {
        x: Math.floor(this.relatedScene.sys.game.config.width / 2),
        y: Math.floor(this.relatedScene.sys.game.config.height / 3),
        txt: ' Enhorabuena! \n Nuevo Record! ',
        size: 50, color: '#ff9', style: 'bold',
        stroke: '#5f1', sizeStroke: 16,
        shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
        bool1: false, bool2: true, origin: [0.5, 0.5],
        elastic: false, dura: 0
      });
  
      this.txtnewrecord.create();

      this.relatedScene.tweens.add({
        targets: this.txtnewrecord.get(),
        scale: 2.1,
        ease: 'sine.out',
        duration: 1000,
        yoyo: true,
        delay: 500,
        repeat: -1,
        repeatDelay: 3000
      });
    } */ 
  }

  get()
  {
    return this.txt;
  }
}
