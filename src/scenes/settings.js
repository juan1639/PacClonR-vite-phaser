
export class Settings
{
    static controlElegido =
    {
        mobile: false,
        keyboard: true
    };

    static screen =
    {
        width: 864,
        height: 704,
        escBoundsX: 1.45,
        escBoundsY: 1.6
    };

    static tileXY =
    {
        x: 16,
        y: 16
    };

    static scaleGame = 4;

    static fps =
    {
        fps60: true,
        allowUpdate: true
    };

    static puntos = 0;
    static nivel = 1;
    static hi = 12000;
    static vidas = 3;
    static gameOver = false;

    static txtScore = 'Score: ';

    static pausa =
    {
        inicial: {
            activa: false,
            duracion: 4300
        },
        pacmanDies: {
            activa: false,
            duracion: 3100
        },
        comeFantasma: {
            activa: false,
            duracion: 500,
        },
        nivelSuperado: {
            activa: false,
            duracion: 3000
        }
    };

    static pacman =
    {
        iniX: 9,
        iniY: 4,
        vel: 4,
        invisible: false
    };

    static pacmanPregame =
    {
        iniX: -4,
        iniY: 2,
        vel: 4
    };

    static fantasmasIniXY =
    {
        azul: [4, 8],
        rojo: [8, 8],
        verde: [12, 8],
        pink: [16, 8],
    };

    static fantasmasScary =
    {
        activo: false,
        duracion: 9000,
        intermitente: false
    };

    static fantasmasBonusInc =
    {
        puntos: [200, 400, 800, 1600],
        color: ['#f91', '#f61', '#f41', '#f21'],
        contador: 0,
        duracion: 3200
    };

    static cerezasIniXY = [9, 8];

    static bonusCerezas = [
        300, 300, 500, 800, 1000, 2000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000
    ];

    static coorCruceta =
    {
        xx: 60,
        yy: 1400,
        sizeX: 2.5,
        sizeY: 2.1
    };

    static cameraControles =
    {
        x: 0,
        y: 300,
        ancho: 800,
        alto: 290,
        scrollX: 0,
        scrollY: 1250
    };

    static cameraScores =
    {
        x: 0,
        y: 0,
        ancho: Settings.screen.width,
        alto: 34,
        scrollX: 0,
        scrollY: -90
    };

    static depth =
    {
        fondo: 0,
        puntitos: 100,
        pared: 200,
        item: 300,
        jugador: 400,
        fantasmas: 500,
        efectos: 600,
        marcadores: 700,
        controles: 800,
        textos: 900
    };
    
    static audio =
    {
        numKey: null,
        key: null
    };

    // ------- Getters ---------
    static isFps60()
    {
        return Settings.fps.fps60;
    }
    
    static isAllowUpdate()
    {
        return Settings.fps.allowUpdate;
    }

    static isGameOver()
    {
        return Settings.gameOver;
    }

    static getScaleGame()
    {
        return Settings.scaleGame;
    }

    static isPausaInicial()
    {
        return Settings.pausa.inicial;
    }

    static isPacmanDies()
    {
        return Settings.pausa.pacmanDies;
    }

    static isPausaComeFantasma()
    {
        return Settings.pausa.comeFantasma;
    }

    static isNivelSuperado()
    {
        return Settings.pausa.nivelSuperado;
    }

    static getPuntos()
    {
        return Settings.puntos;
    }

    static getNivel()
    {
        return Settings.nivel;
    }

    static getRecord()
    {
        return Settings.hi;
    }

    static getVidas()
    {
        return Settings.vidas;
    }

    static getTxtScore()
    {
        return Settings.txtScore;
    }

    static getInvisible()
    {
        return Settings.pacman.invisible;
    }

    static isFantasmasScary()
    {
        return Settings.fantasmasScary.activo;
    }

    static isFantasmasIntermitente()
    {
        return Settings.fantasmasScary.intermitente;
    }

    static getFantasmasScaryDuracion()
    {
        return Settings.fantasmasScary.duracion;
    }

    static getFantasmasBonusInc()
    {
        return Settings.fantasmasBonusInc;
    }

    static getCerezasIniXY()
    {
        return Settings.cerezasIniXY;
    }

    static getBonusCerezas()
    {
        return Settings.bonusCerezas;
    }

    static getCameraControles()
    {
        return Settings.cameraControles;
    }

    static getCameraScores()
    {
        return Settings.cameraScores;
    }

    // ------- Setters ---------
    static setFps60(bool)
    {
        Settings.fps.fps60 = bool;
    }
    static setAllowUpdate(bool)
    {
        Settings.fps.allowUpdate = bool;
    }

    static setNivelSuperado(bool)
    {
        Settings.pausa.nivelSuperado = bool;
    }

    static setGameOver(bool)
    {
        Settings.gameOver = bool;
    }

    static setScaleGame(scale)
    {
        Settings.scaleGame = scale;
    }

    static setPausaInicial(bool)
    {
        Settings.pausa.inicial = bool;
    }

    static isPacmanDies(bool)
    {
        Settings.pausa.pacmanDies = bool;
    }

    static isPausaComeFantasma(bool)
    {
        Settings.pausa.comeFantasma = bool;
    }

    static isNivelSuperado(bool)
    {
        Settings.pausa.nivelSuperado = bool;
    }

    static setPuntos(ptos)
    {
        Settings.puntos = ptos;
    }

    static setNivel(level)
    {
        Settings.nivel = level;
    }

    static setRecord(hiScore)
    {
        Settings.hi = hiScore;
    }

    static setVidas(lifes)
    {
        Settings.vidas = lifes;
    }
    
    static setFantasmasScary(bool)
    {
        Settings.fantasmasScary.activo = bool;
    }

    static setFantasmasIntermitente(bool)
    {
        Settings.fantasmasScary.intermitente = bool;
    }

    static setFantasmasScaryDuracion(tiempo)
    {
        Settings.fantasmasScary.duracion = tiempo;
    }

    static setFantasmasBonusInc(valor)
    {
        Settings.fantasmasBonusInc.contador = valor;
    }
}
