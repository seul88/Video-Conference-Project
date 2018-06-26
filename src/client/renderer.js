import * as PIXI from 'pixi.js'
import { Emitter } from 'pixi-particles';

export class Renderer {
    constructor(netClient, onInit) {
        this.netClient = netClient;
        this.onInit = onInit;

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

        console.log(state);
        if (state.role == 'trainer') {
            let pattern = '';
            for (let cable of state.cables_order)
                pattern += cable + ' ';

            this.updateText('Bomb defusing pattern: ' + pattern);
        }

        this.updateTimer(state.end_timestamp);

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

    updateText(newText) {
        this.text.text = newText;
        this.text.x = this.app.screen.width / 2 - this.text.width / 2;
    }

    updateTimer(timerDataEnd) {
        this.timerAllTime = timerDataEnd - this.timerDataStart; // e.g. 30sec
        this.timerRotationSpeed = Math.PI * 2 / this.timerAllTime;
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
            [PIXI.Texture.fromImage('images/CartoonSmoke.png')],
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


        this.timer = new PIXI.Sprite(PIXI.loader.resources["images/timer.svg"].texture);
        this.timer.anchor.set(0.5);
        this.timer.x = 435;
        this.timer.y = 480;
        this.app.stage.addChild(this.timer);


        this.clockwheel = new PIXI.Sprite(PIXI.loader.resources["images/circle.svg"].texture);
        this.clockwheel.x = 435;
        this.clockwheel.y = 478;
        this.clockwheel.height = 28;
        this.clockwheel.width = 28;
        this.clockwheel.anchor.set(0.5);
        this.app.stage.addChild(this.clockwheel);


        this.timerDataStart = Date.now();
        this.timerRotationSpeed = .0;
        this.timerSet = false;

        this.app.ticker.add(() => {
            if (this.timer.rotation < Math.PI * 3) {
                let delayed = Date.now() - this.timerDataStart;   // delayed from start, e.g. 10sec (1/3)
                let rotation = this.timerRotationSpeed * delayed;

                this.timer.rotation = Math.PI + rotation;
                this.clockwheel.rotation = Math.PI + rotation;
            }
        });

        /* ------------------------------------ TEXT ------------------------------------ */


        this.text = new PIXI.Text("", {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: 'white'
        });
        this.text.y = this.app.screen.height - 135;
        this.text.x = this.app.screen.width / 2 - this.text.width / 2;

        this.app.stage.addChild(this.text);

        //
        this.onInit();
    }
}
