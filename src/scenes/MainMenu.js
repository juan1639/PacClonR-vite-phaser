import { Scene } from 'phaser';
import { JugadorPreGame } from '../components/jugador2.js';
import { FantasmaPreGame } from '../components/fantasma.js';
import { Textos } from '../components/textos.js';
import { fetchRecords, play_sonidos, particulas } from '../functions/functions.js';
import { BotonNuevaPartida } from '../components/boton-nuevapartida.js';
import { Settings } from './settings.js';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    init()
    {
        this.intermision = this.sound.add('pacman-intermision');

        this.jugador = new JugadorPreGame(this);

        this.botoninicio = new BotonNuevaPartida(this, {
            left: Math.floor(this.sys.game.config.width / 2),
            top: Math.floor(this.sys.game.config.height / 1.3),
            id: 'boton-nueva-partida',
            scX: 0.6, scY: 0.5, angle: 1, originX: 0.5, originY: 0.5,
            texto: ' New Game ', nextScene: 'PreGame'
        });

        this.txt = new Textos(this, {
            x: Math.floor(this.sys.game.config.width / 2),
            y: 0,
            txt: ' PacClon ',
            size: 120, color: '#ffa', style: 'bold',
            stroke: '#fa1', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111',
            bool1: false, bool2: true, origin: [0.5, 0.5],
            elastic: Math.floor(this.sys.game.config.height / 4), dura: 3000
        });

        this.txtRecords = new Textos(this, {
            x: Math.floor(this.sys.game.config.width / 2),
            y: 0,
            txt: ' Tabla records ',
            size: 20, color: '#ffa', style: 'bold',
            stroke: '#5e1', sizeStroke: 7,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111',
            bool1: false, bool2: true, origin: [0.5, 0.5],
            elastic: Math.floor(this.sys.game.config.height / 2), dura: 3000
        });

        this.fantasmaspregame = new FantasmaPreGame(this);
    }

    preload() {}

    create()
    {
        // this.hacerFetchRecords = async () => fetchRecords();
        // this.recordsTxtData = this.hacerFetchRecords();

        this.hacerFetchRecords = async () => fetchRecords()
        .then(result => this.recordsTxtData = result)
        .catch(error => console.warn(error));

        this.hacerFetchRecords();

        const aparecerBoton = 1800; // 1800

        this.add.image(0, 0, 'fondo-pacman').setOrigin(0, 0).setDepth(Settings.depth.fondo);

        this.jugador.create(-150, Math.floor(this.sys.game.config.height / 1.7));
        this.fantasmaspregame.create();

        this.txt.create();

        this.txtRecords.create();
        this.txtRecords.get().setVisible(false);
        console.log(this.txtRecords.get().visible);

        const basedOn = this.add.text(
            Math.floor(this.sys.game.config.width / 3.4),
            Math.floor(this.sys.game.config.height / 1.04),
            'Based on classic arcade game Pacman of 1980',
            {fontSize: '16px', color: '#9ff', align: 'justify', fontFamily: 'Arial'}
        );

        const coorXY = [
            Math.floor(this.sys.game.config.width / 2),
            Math.floor(this.sys.game.config.height / 20),
            Math.floor(this.sys.game.config.height / 5)
        ];

        const timeline = this.add.timeline([
            {
                at: aparecerBoton,
                run: () =>
                {
                    this.botoninicio.create('PreGame', false);

                    particulas(
                        coorXY[0], coorXY[2] + 50,
                        'particula1',
                        {min: 60, max: 120},
                        {min: 2500, max: 3000},
                        {start: 0.2, end: 0},
                        0xffcc11,
                        null, false, this
                    );    
                }
            }
        ]);

        timeline.play();

        const showRecordsClock = this.add.timeline([
            {
              at: 12000,
              run: () =>
              {
                if (this.txtRecords.get().visible)
                {
                    this.txtRecords.get().setVisible(false);
                }
                else
                {
                    this.txtRecords.get().setVisible(true);

                    // const recorreRecords = Array.from(this.recordsTxtData);
                    console.warn(this.recordsTxtData);
                    
                    let construirTxt = '    RECORDS\n';
                    let indice = 1;

                    for (let i = 0; i < this.recordsTxtData.length; i+= 2)
                    {
                        const nombre = this.recordsTxtData[i];
                        const puntos = this.recordsTxtData[i + 1];
                        console.log(nombre, puntos);
                        construirTxt += ` ${indice}. ${nombre}  ${puntos}\n`;
                        indice ++;
                    }

                    this.txtRecords.get().setText(construirTxt);
                }
              }
            }
        ]);

        showRecordsClock.repeat(-1).play();

        play_sonidos(this.intermision, false, 0.6);
        
        console.log(this.txt);
    }

    update()
    {
        // this.jugador.update();
    }
}
