import { Scene } from 'phaser';
import { Textos } from '../components/textos.js';

export class Preloader extends Scene
{
    constructor()
    {
        super('Preloader');
    }

    init()
    {
        const widthScreen = this.sys.game.config.width;
        const heightScreen = this.sys.game.config.height;

        this.load.image('fondo', 'assets/img/bg.png');
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        this.txt = new Textos(this, {
            x: Math.floor(widthScreen / 2),
            y: Math.floor(heightScreen / 3.5),
            txt: ' Loading...',
            size: 55, color: '#ffa', style: 'bold',
            stroke: '#f91', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111',
            bool1: false, bool2: true, origin: [0.5, 0.5],
            elastic: false, dura: 0
        });

        this.txt.create();

        this.add.rectangle(
            Math.floor(widthScreen / 2), Math.floor(heightScreen / 2),
            Math.floor(widthScreen / 1.5), Math.floor(heightScreen / 12)
        ).setStrokeStyle(1, 0xffee88);

        const bar = this.add.rectangle(
            Math.floor(widthScreen / 2) - Math.floor(widthScreen / 3) + 4,
            Math.floor(heightScreen / 2),
            4,
            Math.floor(heightScreen / 14),
            0xff9911
        );

        this.load.on('progress', (progress) => {
            bar.width = (Math.floor(widthScreen / 1.52) * progress);
        });
    } 
    
    preload()
    {
        this.load.setPath('assets');

        this.load.image('fondo-pacman', './img/fondo_pacmanPh.png');

        this.load.image('boton-nueva-partida', './img/ui-newgame.png');
        this.load.image('boton-more-settings', './img/ui-newgame.png');
        this.load.image('boton-fire-joystick', './img/ui-1.png');
        this.load.image('cruceta', './img/cruceta-up.png');
        this.load.spritesheet('radio-buttons', './img/radio-buttons-ssheet.png', {frameWidth: 50, frameHeight: 50});
        this.load.spritesheet('boton-fullscreen', './img/boton-fullscreen.png', {frameWidth: 64, frameHeight: 64});

        this.load.image('particula1', './img/particula1.png');

        this.load.spritesheet('laberinto-1', './img/atlas-pacman.png', {frameWidth: 228, frameHeight: 248});
        this.load.spritesheet('tile-map-ssheet', './img/tilemap-pacman.png', {frameWidth: 16, frameHeight: 16});

        this.load.image('puntito', './img/puntito.png');

        this.load.image('tile-pacman-marron', './img/tile_pacmanMarron.png');

        this.load.spritesheet('pacman', './img/pac-animasPh.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('pacman-dies', './img/pacmanDies-ssheet.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('frutas', './img/frutas-ssheet.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('fantasmas', './img/fantasmas-ssheet.png', {frameWidth: 16, frameHeight: 16});

        for (let i = 0; i < 4; i ++)
        {
            this.load.spritesheet(`fantanim0${i}`, `./img/fantanim0${i}.png`, {frameWidth: 16, frameHeight: 16});
            this.load.spritesheet(`fantanim1${i}`, `./img/fantanim1${i}.png`, {frameWidth: 16, frameHeight: 16});
            this.load.spritesheet(`fantanim2${i}`, `./img/fantanim2${i}.png`, {frameWidth: 16, frameHeight: 16});
            this.load.spritesheet(`fantanim3${i}`, `./img/fantanim3${i}.png`, {frameWidth: 16, frameHeight: 16});
            this.load.spritesheet(`fantanim5${i}`, `./img/fantanim5${i}.png`, {frameWidth: 50, frameHeight: 50});

            this.load.spritesheet(`fantasmon${i}`, `./img/fantasmon${i}.png`, {frameWidth: 640, frameHeight: 640});
        }
        
        this.load.bitmapFont('font-fire', '/img/azo-fire.png', '/img/azo-fire.xml');

        //  Archivos de audio
        this.load.audio('gameover-retro', './audio/gameoveretro.ogg');
        this.load.audio('you-win', './audio/you-win.mp3');
        this.load.audio('key', './audio/key.wav');
        this.load.audio('numkey', './audio/numkey.wav');

        this.load.audio('pacman-azules', './audio/pacmanazules.ogg');
        this.load.audio('pacman-dies', './audio/pacmandies.ogg');
        this.load.audio('pacman-eating-cherry', './audio/pacmaneatingcherry.mp3');

        this.load.audio('pacman-eating-ghost', './audio/pacmaneatinghost.ogg');
        this.load.audio('pacman-inicio-nivel', './audio/pacmaninicionivel.ogg');
        this.load.audio('pacman-intermision', './audio/pacmanintermision.ogg');

        this.load.audio('pacman-sirena', './audio/pacmansirena.ogg');
        this.load.audio('pacman-waka', './audio/pacmanwakawaka.mp3');
    }

    create()
    {
        this.scene.start('MainMenu');
    }
}
