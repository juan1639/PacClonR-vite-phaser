import { Settings } from "../scenes/settings";
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

function colliderJugadorPuntitosGordos(jugador, puntitogordo)
{
  console.log(jugador, puntitogordo);

  suma_puntos(puntitogordo, this);
  this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

  puntitogordo.disableBody(true, true);
  Settings.setFantasmasScary(true);

  const nivel = Settings.getNivel();

  this.time.delayedCall(Settings.getFantasmasScaryDuracion()[nivel], () =>
  {
    Settings.setFantasmasScary(false);
    Settings.setFantasmasIntermitente(false);
    this.fantasmas.clear_tint();
    this.fantasmas.get().setBlendMode('ERASE');
    this.sonido_fantasmasScary.pause();
    Settings.setFantasmasBonusInc(0);
  });

  const timeIntermitente = Math.floor(Settings.getFantasmasScaryDuracion()[nivel] / 1.5);
  this.time.delayedCall(timeIntermitente, () => Settings.setFantasmasIntermitente(true));

  play_sonidos(this.sonido_eatingGhost, false, 0.9);

  this.time.delayedCall(500, () => play_sonidos(this.sonido_fantasmasScary, true, 0.9));
}

function exceptoScary()
{
  if (Settings.isFantasmasScary()) return false;
  return true;
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
        else
        {
          this.jugadorshowvidas.get().children.iterate((vida, index) =>
          {
            if (index === Settings.getVidas()) vida.setVisible(false);
          });
        }

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

    const contador = Settings.getFantasmasBonusInc().contador;
    const puntos = Settings.getFantasmasBonusInc().puntos[contador];
    const color = Settings.getFantasmasBonusInc().color[contador];
    const duracion = Settings.getFantasmasBonusInc().duracion;

    this.txt_bonusfantasmas = new Textos(this,
    {
      x: jugador.x, y: jugador.y,
      txt: puntos,
      size: 40, color: '#ff7', style: 'bold',
      stroke: color, sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: jugador.y - (Settings.tileXY.y * scale), dura: 2000
    });
    
    this.txt_bonusfantasmas.create();
    this.txt_bonusfantasmas.get().setDepth(Settings.depth.textos).setAlpha(1);

    this.tweens.add({
      targets: this.txt_bonusfantasmas.get(), alpha: 0, duration: duracion
    });

    const bonus = Settings.getPuntos() + puntos;
    Settings.setPuntos(bonus);
    this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

    Settings.setFantasmasBonusInc(contador + 1);
    if (contador >= 4) Settings.setFantasmasBonusInc(0);
  }
}

function exceptoNotVisible(jugador, fantasma)
{
  if (!fantasma.visible || Settings.isInvisible()) return false;
  return true;
}

function colliderJugadorFruta(jugador, cerezas)
{
  console.log(jugador, cerezas);

  suma_puntos(cerezas, this);
  this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
  cerezas.disableBody(true, true);
  play_sonidos(this.sonido_eatingCherry, false, 0.9);

  this.txt_bonuscerezas = new Textos(this, {
      x: jugador.x, y: jugador.y,
      txt: cerezas.getData('puntos').toString(),
      size: 40, color: '#ffa', style: 'bold',
      stroke: '#f51', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: jugador.y - Settings.tileXY.y, dura: 2000
  });
    
  this.txt_bonuscerezas.create();
  this.txt_bonuscerezas.get().setDepth(Settings.depth.textos).setAlpha(1);

  this.tweens.add({
    targets: this.txt_bonuscerezas.get(),
    alpha: 0,
    duration: Settings.getFantasmasBonusInc().duracion
  });

  this.time.delayedCall(Settings.getIntervaloCerezas(), () =>
  {
    this.cerezas.get().enableBody(
      true,
      Settings.getCerezasIniXY()[0] * (Settings.tileXY.x * Settings.getScaleGame()),
      Settings.getCerezasIniXY()[1] * (Settings.tileXY.y * Settings.getScaleGame()),
      true, true
    );
  });
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

async function fetchRecords(resolve, reject)
{
  const response = await fetch('https://ejemplo-node-railway-production.up.railway.app/all');

  const data = await response.json();
  const dataJson = JSON.stringify(data);

  console.log(data);
  console.log(dataJson);

  let recordsTxtData = [];

  data.forEach((record, index) =>
  {
    const {name, puntuacion} = record;

    recordsTxtData.push(name);
    recordsTxtData.push(puntuacion.toString());
  });

  console.log(recordsTxtData);

  resolve(recordsTxtData);
  reject(new Error('Error! reject fetching'));
  
  /* try
  {
    const response = await fetch('https://ejemplo-node-railway-production.up.railway.app/all');

    const data = await response.json();
    const dataJson = JSON.stringify(data);

    console.log(data);
    console.log(dataJson);

    let recordsTxtData = [];

    data.forEach((record, index) =>
    {
      const {name, puntuacion} = record;

      recordsTxtData.push(name);
      recordsTxtData.push(puntuacion.toString());
    });

    console.log(recordsTxtData);

    return recordsTxtData;
  }
  catch(error)
  {
    console.error('Error fetching data:', error);
  } */
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
  colliderJugadorPuntitosGordos,
  exceptoScary,
  overlapJugadorFantasmas,
  exceptoNotVisible,
  colliderJugadorFruta,
  particulas,
  fetchRecords,
  play_sonidos
};
