import * as PIXI from 'pixi.js'

/*
    Czesc Erwin, sorry ze Ci tutaj tak namieszalem, ale nie moglem 
    zintegorwac tego z klasa klient. Juz Ci pisze co i jak:
    1. Na te chwile usunalem ten filtr blura, ale zostal na githubie wiec
    w przyslosci mozesz go latwo przywrocic - zrobilem to dlatego, ze zmienila sie
    troche logika tej klasy, ale o tym nizej
    2. SVG z kabelkami nie mozesz robic o rozmiarze calej bomby, tylko musisz 
    je zrobic w rozmiarze obszaru do klikniecia i ustawic ich pozycje za pomoca x/y
    3. Wiem ze wtedy bedzie troche inaczej odnosnie skalowania, ale na te chwile mamy sztywno okienko
    1200x900 wiec nie ma problemu
    4. Tutaj nie implementujesz logiki gry samej w sobie, tylko odwzorowujesz wizualnie
    stan zapisany w obiekcie state

*/

export class Renderer {
    constructor() {

        /* ------------------------------------ CANVAS ------------------------------------ */
        this.app = new PIXI.Application({
            width: 1200,
            height: 900,
            antialias: false,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x57829c
        });

        document.body.appendChild(this.app.view);

        /* ------------------------------------ IMAGES - load from directory ------------------------------------ */
        PIXI.loader
            .add([
                "images/bombv2.svg",
                "images/clock.svg",
                "images/cables/closed/1.svg",
                "images/cables/closed/2.svg",
                "images/cables/closed/3.svg",
                "images/cables/closed/4.svg",
                "images/cables/opened/1.svg",
                "images/cables/opened/2.svg",
                "images/cables/opened/3.svg",
                "images/cables/opened/4.svg",
                "images/blank.png",
                "images/blank.jpg",
                "images/cables/closed/cable_closed.svg",
                "images/cables/opened/cable_open.svg",
                "images/timer.svg",
                "images/circle.svg"
            ])
            .load(this.setup.bind(this));
    }

    showText(tekst, x) {
        let text = new PIXI.Text(tekst, {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: 'white'
        });
        text.y = this.app.screen.height - 175;
        text.x = x;

        this.app.stage.addChild(text);
    }

    generateRandomNumber() {
        return Math.floor((Math.random() * 4) + 1)
    }

    onCutCable(number) {
        // turn off sprite with opened state
        // turn on sprite with opened state

        this.app.stage.removeChild(this.cables[number].closed);
        this.app.stage.addChild(this.cables[number].opened);
    }

    applyState(state) {
        // reflect the state via image
        /*
        state object looks like

        this.state = {
            sapper: sapper,
            trainer: trainer,
            cut_cables: [],
            finished: false,
            defused: false
        }
        */
    }

    addCable(number, imageOpened, imageClosed, x, y) {
        let closedSprite = new PIXI.Sprite(PIXI.loader.resources[imageClosed].texture);
        let openedSprite = new PIXI.Sprite(PIXI.loader.resources[imageOpened].texture);

        this.closedSprite.interactive = true;
        this.closedSprite.on('pointerdown', () => {
            this.onCutCable(number);
        });

        this.app.stage.addChild(closedSprite);
        //this.app.stage.addChild(openedSprite);

        this.cables[number] = {
            closed: closedSprite,
            opened: openedSprite
        }
    }

    setup() {

        // Click listener
        this.app.view.addEventListener("click", this.onClickCanvas.bind(this));

        /* ------------------------------------ IMAGES - add to canvas ------------------------------------ */


        this.bomb = new PIXI.Sprite(PIXI.loader.resources["images/bombv2.svg"].texture);
        this.app.stage.addChild(bomb);

        this.clock_bg = new PIXI.Sprite(PIXI.loader.resources["images/clock.svg"].texture);
        this.app.stage.addChild(clock_bg);

        this.cables = [];
        this.addCable(1, "images/cables/closed/1.svg", "images/cables/opened/1.svg", 0, 0);
        this.addCable(2, "images/cables/closed/2.svg", "images/cables/opened/2.svg", 0, 0);
        this.addCable(3, "images/cables/closed/3.svg", "images/cables/opened/3.svg", 0, 0);
        this.addCable(4, "images/cables/closed/4.svg", "images/cables/opened/4.svg", 0, 0);

        /* ------------------------------------ TIMER ------------------------------------ */


        let timer = new PIXI.Sprite(PIXI.loader.resources["images/timer.svg"].texture);
        timer.anchor.set(0.5);
        timer.x = 435;
        timer.y = 480;
        this.app.stage.addChild(timer);


        let clockwheel = new PIXI.Sprite(PIXI.loader.resources["images/circle.svg"].texture);
        clockwheel.x = 435;
        clockwheel.y = 478;
        clockwheel.height = 28;
        clockwheel.width = 28;
        clockwheel.anchor.set(0.5);
        this.app.stage.addChild(clockwheel);

        var timerRotationSpeed = 0.005;
        this.app.ticker.add(() => {
            timer.rotation += timerRotationSpeed;
            clockwheel.rotation += timerRotationSpeed;
        });

    }
}