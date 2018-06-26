import * as PIXI from 'pixi.js'
import { Emitter } from 'pixi-particles';

/*
    Czesc Erwin, sorry ze Ci tutaj tak namieszalem, ale nie moglem 
    zintegorwac tego z klasa klient. Juz Ci pisze co i jak:
    1. Na te chwile usunalem ten filtr blura, ale zostal na githubie wiec
    w przyslosci mozesz go latwo przywrocic - zrobilem to dlatego, ze zmienila sie
    troche logika tej klasy, ale o tym nizej
		
		2. SVG z kabelkami nie mozesz robic o rozmiarze calej bomby, tylko musisz 
		je zrobic w rozmiarze obszaru do klikniecia i ustawic ich pozycje za pomoca x/y  >>[DONE]
		3. Wiem ze wtedy bedzie troche inaczej odnosnie skalowania, ale na te chwile mamy sztywno okienko
		1200x900 wiec nie ma problemu >>[DONE]
    4. Tutaj nie implementujesz logiki gry samej w sobie, tylko odwzorowujesz wizualnie
    stan zapisany w obiekcie state

*/

export class Renderer {
    constructor(netClient) {
        this.netClient = netClient;

        /* ------------------------------------ CANVAS ------------------------------------ */
        this.app = new PIXI.Application({
            width: 1200,
            height: 900,
            antialias: false,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x57829c
        });

        document.getElementById("gamediv").appendChild(this.app.view);

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
                "images/circle.svg",
                "images/explosion.json"
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
        
        this.netClient.do('cutTheCable', {
            number: number
        })
    }

    applyState(state) {
        // reflect the state via image
        /*
        state object looks like

        state = {
            sapper: sapper,
            trainer: trainer,
            cut_cables: [],
            finished: false,
            defused: false
        }
        */

        for (let number = 1; number < this.cables.length; ++number) {
            if (state.cut_cables.indexOf(number) != -1) {
                this.app.stage.removeChild(this.cables[number].closed);
                this.app.stage.addChild(this.cables[number].opened);
            }
            else {
                this.app.stage.removeChild(this.cables[number].opened);
                this.app.stage.addChild(this.cables[number].closed);
            }
        }

        if (state.finished && !state.defused) {
            this.explosion();
        }
    }

    addCable(number, imageClosed, imageOpened, x, y) {
        let closedSprite = new PIXI.Sprite(PIXI.loader.resources[imageClosed].texture);
        let openedSprite = new PIXI.Sprite(PIXI.loader.resources[imageOpened].texture);

        closedSprite.x = x
        closedSprite.y = y
        openedSprite.x = x
        openedSprite.y = y
        closedSprite.scale.x = 0.75
        closedSprite.scale.y = 0.75
        openedSprite.scale.x = 0.75
        openedSprite.scale.y = 0.75

        closedSprite.interactive = true;
        closedSprite.on('pointerdown', () => {
            this.onCutCable(number);
        });

        this.app.stage.addChild(closedSprite);
        // this.app.stage.addChild(openedSprite);

        this.cables[number] = {
            closed: closedSprite,
            opened: openedSprite
        }
    }

    explosion() {
        let flame = new PIXI.Container();
        flame.x = 550;
        flame.y = 450;
        flame.scale.x = 2.2;
        flame.scale.y = 2.2;
        this.app.stage.addChild(flame);
        let json = PIXI.loader.resources["images/explosion.json"];
        console.log(json.data);
        var emitter = new PIXI.particles.Emitter(
            flame,
            [PIXI.Texture.fromImage('images/smokeparticle.png')],
            json.data
        );

        // Calculate the current time
        var elapsed = Date.now();

        // Update function every frame
        var update = function () {

            // Update the next frame
            requestAnimationFrame(update);

            var now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;

            // Should re-render the PIXI Stage
            // renderer.render(stage);
        };


        emitter.emit = true;

        update();
    }

    setup() {
        /* ------------------------------------ IMAGES - add to canvas ------------------------------------ */


        this.bomb = new PIXI.Sprite(PIXI.loader.resources["images/bombv2.svg"].texture);
        this.app.stage.addChild(this.bomb);

        this.clock_bg = new PIXI.Sprite(PIXI.loader.resources["images/clock.svg"].texture);
        this.app.stage.addChild(this.clock_bg);

        this.cables = [];
        this.addCable(1, "images/cables/closed/1.svg", "images/cables/opened/1.svg", 200, 100);
        this.addCable(2, "images/cables/closed/2.svg", "images/cables/opened/2.svg", 400, 100);
        this.addCable(3, "images/cables/closed/3.svg", "images/cables/opened/3.svg", 600, 100);
        this.addCable(4, "images/cables/closed/4.svg", "images/cables/opened/4.svg", 800, 100);

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