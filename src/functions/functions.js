import { Settings } from "../scenes/settings";
import { matrixLevels } from "../scenes/matrixLevels";
import { Textos } from "../components/textos";

function colliderJugadorLaberinto(jugador, laberinto)
{
  // console.log(jugador, laberinto);

  console.log(
    jugador.body.touching.up,
    jugador.body.touching.right,
    jugador.body.touching.down,
    jugador.body.touching.left
  );

  if (jugador.body.velocity.x === 0 && jugador.body.velocity.y === 0)
  {
    const direcc = Settings.pacman.direccion;
    const acumuladas = Settings.pacman.arrayAcumDir;

    for (let i = 0; i < acumuladas.length; i ++)
    {
      const velX = direcc[acumuladas[i]][0] * Settings.pacman.velocity;
      const velY = direcc[acumuladas[i]][1] * Settings.pacman.velocity;

      if (!jugador.body.touching[acumuladas[i]])
      {
        jugador.setAngle(direcc[acumuladas[i]][2]);
        jugador.setVelocityX(velX);
        jugador.setVelocityY(velY);
      }
    }
  }
}

function colliderJugadorPuntitos(jugador, puntito)
{
  // console.log(jugador, puntitos);

  suma_puntos(puntito, this);
  this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
  puntito.disableBody(true, true);
  play_sonidos(this.sonido_waka, false, 0.9);
}

function overlapJugadorFantasmas(jugador, fantasma)
{
  console.log('colision...jugador-enemigo');
  console.log(jugador, fantasma);
  
  const scale = Settings.getScaleGame();

  if (!Settings.isFantasmasScary())
  {
    play_sonidos(this.sonido_jugadorDies, false, 0.7);

    this.jugadordies.create(jugador.x, jugador.y);
    jugador.disableBody(true, true);

    const timeline = this.add.timeline([
    {
      at: Settings.pausa.pacmanDies.duracion,
      run: () =>
      {
        this.jugadordies.get().disableBody(true, true);
        
        this.jugador.get().enableBody(
            true,
            Settings.pacman.iniX * (Settings.tileXY.x * scale),
            Settings.pacman.iniY * (Settings.tileXY.x * scale),
            true, true
        );

        this.jugador.intentoGiro = 'right';
        this.jugador.direccion = 'right';

        restar_vida();

        if (Settings.getVidas() < 0)
        {
          Settings.setGameOver(true);
          this.jugador.get().setVisible(false);
          this.gameover.create(this.jugador.get().x, this.jugador.get().y);
          // this.cameras.main.startFollow(this.gameover.get());
        }

        this.jugadorshowvidas.get().children.iterate((vida, index) =>
        {
          if (index === Settings.getVidas()) vida.setVisible(false);
        });

        this.fantasmas.get().children.iterate((fant, index) =>
        {
          if (Settings.isGameOver())
          {
              fant.setVisible(false);

          } else
          {
            fant.setX(Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]][0] * (Settings.tileXY.x * scale));
            fant.setY(Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]][1] * (Settings.tileXY.y * scale));
          }
        });
      }
    }]);

    timeline.play();
  }
  else
  {
    play_sonidos(this.sonido_eatingGhost, false, 0.9);

    fantasma.setVisible(false);
    this.ojos.get().getChildren()[fantasma.getData('id')].setVisible(true);
    Settings.setPausaComeFantasma(true);

    this.time.delayedCall(Settings.pausa.comeFantasma.duracion, () =>
    {
      Settings.setPausaComeFantasma(false);
    });

    const puntos = Settings.getFantasmasBonusInc().puntos;
    const color = Settings.getFantasmasBonusInc().color;
    const contador = Settings.getFantasmasBonusInc().contador;
    const duracion = Settings.getFantasmasBonusInc().duracion;

    this.txt_bonusfantasmas = new Textos(this,
    {
      x: jugador.x, y: jugador.y,
      txt: puntos[contador].toString(),
      size: 40, color: '#ff7', style: 'bold',
      stroke: color[contador], sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: jugador.y - (Settings.tileXY.y * scale), dura: 2000
    });
    
    this.txt_bonusfantasmas.create();
    this.txt_bonusfantasmas.get().setDepth(Settings.depth.textos).setAlpha(1);

    const bonus = Settings.getPuntos() + puntos[contador];
    Settings.setPuntos(bonus);
    this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

    Settings.setFantasmasBonusInc(contador + 1);
    if (contador >= 4) Settings.setFantasmasBonusInc(0);
  }
}

function exceptoNotVisible(jugador, fantasma)
{
  if (!jugador.visible || Settings.isInvisible()) return false;
  return true;
}

function particulas(x, y, particula, vel, span, size, color, sprite, bool, scene)
{
  const partis = scene.add.particles(x, y, particula, {
    speed: vel,
    lifespan: span,
    scale: size,
    tint: color,
    // gravityY: 200
    blendMode: 'ADD'
  });

  partis.setDepth(Settings.depth.efectos);

  if (bool) partis.startFollow(sprite);
}

function suma_puntos(puntos, scene)
{
  const bonus = Settings.getPuntos() + puntos.getData('puntos');
  Settings.setPuntos(bonus);
  scene.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
  // console.log(bonus, Settings.getPuntos());
}

function restar_vida()
{
  const actualizar = Settings.getVidas() - 1;
  Settings.setVidas(actualizar);
}

function showBonus(scene, enemigo)
{
  Settings.showBonus = new Textos(scene, {
    x: enemigo.x,
    y: enemigo.y + 25,
    txt: enemigo.getData('puntos').toString(),
    size: 55, color: '#ffa', style: 'bold',
    stroke: '#f21', sizeStroke: 16,
    shadowOsx: 2, shadowOsy: 2, shadowColor: '#111',
    bool1: false, bool2: true, origin: [0.5, 0.5],
    elastic: false, dura: 0
  });
  
  Settings.showBonus.create();
  Settings.showBonus.get().setScale(1.2).setAlpha(1);

  scene.tweens.add(
  {
    targets: Settings.showBonus.get(),
    alpha: 0,
    scale: 0,
    duration: Settings.pausas.showBonus
  });
}

function play_sonidos(id, loop, volumen)
{
  id.volume = volumen;
  id.loop = loop;
  id.play();
}

export {
  colliderJugadorLaberinto,
  colliderJugadorPuntitos,
  overlapJugadorFantasmas,
  exceptoNotVisible,
  particulas,
  play_sonidos
};
