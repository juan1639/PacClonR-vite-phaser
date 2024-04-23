import { Scene } from 'phaser';
import { Settings } from './settings.js';
import { Textos } from '../components/textos.js';
import { BotonNuevaPartida } from '../components/boton-nuevapartida';
import { ElegirControles } from '../components/elegirControles.js';

export class MoreSettings extends Scene
{
    constructor ()
    {
        super('More-Settings');
    }

    init()
    {
        this.txt = new Textos(this, {
            x: Math.floor(this.sys.game.config.width / 2),
            y: 0,
            txt: ' Choose Pacman velocity: ',
            size: 36, color: '#ff1', style: 'bold',
            stroke: '#1bd', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
            bool1: false, bool2: true, origin: [0.5, 0],
            elastic: false, dura: 0
        });
        
        this.txt.create();
        this.txt.get().setDepth(Settings.depth.textos).setAlpha(1).setScale(1);

        this.botoninicio = new BotonNuevaPartida(this, {
            left: Math.floor(this.sys.game.config.width / 1.4),
            top: Math.floor(this.sys.game.config.height / 1.25),
            id: 'boton-nueva-partida',
            scX: 0.6, scY: 0.5, angle: 1, originX: 0.5, originY: 0.5,
            texto: ' Start ', nextScene: 'Game'
        });

        this.radioSpeed = [];

        this.radioSpeed.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 15),
            top: Math.floor(this.sys.game.config.height / 6),
            addLeft: 0, orX: 0, orY: 0.5, frame: 0, scale: 1,
            txtSize: 50, texto: ' Slow ', id: '1slow-velocity'
        }));

        this.radioSpeed.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 15),
            top: Math.floor(this.sys.game.config.height / 3.4),
            addLeft: 0, orX: 0, orY: 0.5, frame: 1, scale: 1,
            txtSize: 50, texto: ' Normal ', id: '2Normal-velocity'
        }));

        this.radioSpeed.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 15),
            top: Math.floor(this.sys.game.config.height / 2.4),
            addLeft: 0, orX: 0, orY: 0.5, frame: 0, scale: 1,
            txtSize: 50, texto: ' Fast ', id: '4Fast-velocity'
        }));

        this.radioSpeed.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 15),
            top: Math.floor(this.sys.game.config.height / 1.8),
            addLeft: 0, orX: 0, orY: 0.5, frame: 0, scale: 1,
            txtSize: 50, texto: ' Turbo ', id: '8Turbo-velocity'
        }));

        this.radioInvulnerability = [];

        this.radioInvulnerability.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 10),
            top: Math.floor(this.sys.game.config.height / 1.4),
            addLeft: 99, orX: 0.5, orY: 0.5, frame: 1, scale: 0.9,
            txtSize: 30, texto: 'Normal Game', id: 'normal-mode'
        }));

        this.radioInvulnerability.push(new ElegirControles(this, {
            left: Math.floor(this.sys.game.config.width / 10),
            top: Math.floor(this.sys.game.config.height / 1.2),
            addLeft: 99, orX: 0.5, orY: 0.5, frame: 0, scale: 0.9,
            txtSize: 30, texto: 'Invulnerability', id: 'invulnerability-mode'
        }));
    }

    create ()
    {
        this.add.image(0, 0, 'fondo-pacman').setDepth(Settings.depth.fondo).setOrigin(0, 0);
        
        this.radioSpeed.forEach(speed => speed.create());
        this.radioInvulnerability.forEach(inv => inv.create());

        this.botoninicio.create();
    }
}
