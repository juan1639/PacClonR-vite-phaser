import { Textos } from './textos.js';
import { Settings } from '../scenes/settings.js';
import { particulas, play_sonidos } from '../functions/functions.js';

export class GameOver
{
  constructor(scene)
  {
    this.relatedScene = scene;
  }
  
  create(jugadorX, jugadorY)
  {
    this.sonidoGameOver = this.relatedScene.sound.add('gameover-retro');
    this.sonido_numkey = this.relatedScene.sound.add('numkey');
    this.sonido_key = this.relatedScene.sound.add('key');

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
    this.txt.get().setAlpha(0).setDepth(Settings.depth.textos + 20);

    this.relatedScene.tweens.add({
      targets: this.txt.get(),
      alpha: 1,
      duration: Math.floor(duracionThisScene / 2),
      // repeat: 1
    });

    this.txtCongrats = new Textos(this.relatedScene, {
      x: left,
      y: top + 200,
      txt: ' Congratulations! Put your Initials!',
      size: 40, color: '#dd9', style: 'bold',
      stroke: '#1e1', sizeStroke: 6,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: Math.floor(top * 0.23), dura: 3500
    });

    this.txtCongrats.create();
    this.txtCongrats.get().setAlpha(0).setDepth(Settings.depth.textos + 20);

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

    this.putInitialsToSend(left, top);

    if (!this.checkNewRecordOrTop()) this.send_score('IMI');
  }

  update() {}

  putInitialsToSend(pacX, pacY)
  {
    if (!this.checkNewRecordOrTop()) return;

    const {id, arrayLetras, size, osX, osY, oriX, oriY, color, alpha} = Settings.fontSettings;
    const letras = arrayLetras;
    this.letraEvent = new Array(letras.length).fill(null);
    
    let nameToSend = '';
    this.makeTxtNameToSend(pacX, pacY, size, osX, osY, oriX, oriY, color, alpha);
    this.bandera_send = false;

    const x = pacX - Math.floor(this.relatedScene.sys.game.config.width / 2.3);
    let columna = 0;

    for (let i = 0; i < letras.length; i ++)
    {
      const letra = letras[i];

      let fila = this.select_filaLetra(i, letra, size);
      if (this.select_columnaLetra(letra)) columna = 0;

      this.letraEvent[i] = this.relatedScene.add.bitmapText(
        (columna * (size * 1.25)) + x, pacY + fila, 'font-fire', letra, size
      );

      columna ++;

      this.letraEvent[i].setDropShadow(osX, osY, color, alpha);
      this.letraEvent[i].setInteractive().setOrigin(oriX, oriY).setDepth(Settings.depth.textos + 20);

      this.letraEvent[i].on('pointerover', () =>
      {
        this.letraEvent[i].setScale(1.2);
        play_sonidos(this.sonido_numkey, false, 0.8);
      });

      this.letraEvent[i].on('pointerout', () =>
      {
        this.letraEvent[i].setScale(1);
      });

      this.letraEvent[i].on('pointerdown', () =>
      {
        if (this.bandera_send) return;

        console.log(letra);
        nameToSend += letra;

        if (nameToSend.length <= 3)
        {
          this.makeInitials.setText(nameToSend);
        }

        if (nameToSend.length === 3)
        {
          this.bandera_send = true;
          this.send_score(nameToSend);
        }

        play_sonidos(this.sonido_key, false, 0.7);
      });
    }
  }

  send_score(nameToSend)
  {
    console.warn('checking records...');

    async function addScore()
    {
      try
      {
        const scoreToSend = Settings.getPuntos();

        const info =
        {
          name: nameToSend,
          puntuacion: scoreToSend
        };

        const args =
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        };

        console.log(args.body);

        const response = await fetch(Settings.RECORDS.URL_POST, args);

        const data = await response.json();

        console.log(data);
        console.log(JSON.stringify(data));
      }
      catch(error)
      {
        console.error('Error fetching data:', error);
      }
    }

    addScore(); 
  }

  select_filaLetra(i, letra, size)
  {
    let fila = 70;

    if (i > 12 && i < 26)
    {
      fila += size * 1.25;
    }
    else if (i >= 26)
    {
      fila += size * 2 * 1.25;
    }

    return fila;
  }

  select_columnaLetra(letra)
  {
    if (letra === 'N' || letra === '0')
    {
      return true;
    }

    return false;
  }

  makeTxtNameToSend(pacX, pacY, size, osX, osY, oriX, oriY, color, alpha)
  {
    particulas(
      pacX, pacY,
      'particula1',
      {min: 60, max: 120},
      {min: 2500, max: 3000},
      {start: 0.2, end: 0},
      0xffcc11,
      null, false, this.relatedScene
    );

    this.txtCongrats.get().setAlpha(1);

    this.makeInitials = this.relatedScene.add.bitmapText(
      pacX, Math.floor(pacY * 0.6), 'font-fire', '', size * 3
    );

    this.makeInitials.setDropShadow(osX, osY, color, alpha);
    this.makeInitials.setOrigin(oriX, oriY).setDepth(Settings.depth.textos + 20);
  }

  checkNewRecordOrTop()
  {
    const lenghtOfTopToEntry = 5;
    console.log(Settings.getTop()[lenghtOfTopToEntry - 1]);

    if (Settings.getPuntos() >= Settings.getTop()[lenghtOfTopToEntry - 1]) return true;
    return false;
  }

  get()
  {
    return this.txt;
  }
}
