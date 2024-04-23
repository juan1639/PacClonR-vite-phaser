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

function colisionJugadorVsEnemigo(enemigo, jugador)
{
  console.log('colision...jugador-enemigo');
  console.log(jugador);

  draw_explosionTimeout(this, jugador);

  particulas(
    jugador.x, jugador.y, 'particula-tint',
    {min: 120, max: 180},
    {min: Settings.pausas.duracionExplosion.enemigo, max: Settings.pausas.duracionExplosion.enemigo + 300},
    {start: 0.6, end: 0},
    // 0xffffff,
    // new Phaser.Display.Color(255, Phaser.Math.Between(50, 240), 0).color,
    jugador.tint,
    null, false, this
  );

  particulas(
    enemigo.x, enemigo.y, 'particula-tint',
    {min: 120, max: 200},
    {min: 1500, max: 2000},
    {start: 0.8, end: 0},
    // 0xffffff,
    new Phaser.Display.Color(Phaser.Math.Between(0, 125), Phaser.Math.Between(125, 255), 0).color,
    null, false, this
  );

  if (Settings.getVidas() > 0)
  {
    setTimeout(() =>
    {
      enemigo.setActive(true).setVisible(true).setAlpha(0.1);
      enemigo.enableBody(true, Settings.jugador.posIniX, Settings.jugador.posIniY, true, true);

      this.tweens.add(
      {
        targets: enemigo,
        alpha: 1,
        duration: Settings.pausas.invisible
      });
    }, Settings.pausas.revivir);
  }

  // restar_vida();
  // if (Settings.getVidas() >= 0) this.jugadorSV.get().getChildren()[Settings.getVidas()].setVisible(false);
  
  suma_puntos(jugador);
  this.marcador.update(0, Settings.getPuntos());
  
  jugador.setActive(false).setVisible(false).disableBody(true, true);
  enemigo.setActive(false).setVisible(false).disableBody(true, true);
}

function excepcionJugadorVsEnemigo(enemigo, jugador)
{
  if (enemigo.alpha < 1) return false;
  return true;
}

function countDownBonus(scene)
{
  const txtbonus = new Textos(scene, {
    x: scene.jugador.get().x,
    y: scene.jugador.get().y + 90,
    txt: Settings.getBonus3JewelsBonus(),
    size: 70, color: '#ffa', style: 'bold',
    stroke: '#af1', sizeStroke: 16,
    shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
    bool1: false, bool2: true, origin: [0.5, 0.5],
    elastic: false, dura: 0
  });
  
  txtbonus.create();
  txtbonus.get().setDepth(Settings.depth.textos);

  scene.time.delayedCall(Settings.pausas.bonus3Jewels.duracion, () => txtbonus.get().setVisible(false));

  const decBonus = Settings.pausas.bonus3Jewels.decBonusCountDown;
  const repetir = Math.floor(Settings.getBonus3JewelsBonus() / decBonus) - 1;

  const playerClock = scene.add.timeline([
    {
      at: 100, // 0.1sg --> dec time
      run: () =>
      {
        // console.log('sg');
        const decBonus = Settings.pausas.bonus3Jewels.decBonusCountDown;
        Settings.setBonus3JewelsBonus(Settings.getBonus3JewelsBonus() - decBonus);

        txtbonus.get().setText(Settings.getBonus3JewelsBonus());

        Settings.setPuntos(Settings.getPuntos() + decBonus);
        scene.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
        play_sonidos(scene.sonido_numkey, false, 0.8);
      }
    }
  ]);

  playerClock.repeat(repetir).play();
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
  particulas,
  countDownBonus,
  play_sonidos
};
