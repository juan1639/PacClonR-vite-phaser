import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { PreGame } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { MoreSettings } from './scenes/MoreSettings';
import { Congratulations } from './scenes/congratulations';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 864,
    height: 704,
    parent: 'game-container',
    backgroundColor: '#870',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
    },
    pixelArt: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        PreGame,
        MoreSettings,
        Game,
        Congratulations
    ]
};

export default new Phaser.Game(config);
