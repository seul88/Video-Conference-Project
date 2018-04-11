import * as PIXI from 'pixi.js'

export class Renderer {
    constructor() {

        this.app = new PIXI.Application({
            width: 1200,
            height: 900,
            antialias: false,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x57829c
        });

        document.body.appendChild(this.app.view);

        PIXI.loader
            .add([
                "images/bomb_.svg",
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
                "images/cables/opened/cable_open.svg"
            ])
            .load(this.setup.bind(this));
    }

    showText(tekst) {
        let text = new PIXI.Text(tekst, {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: 'white'
        });
        text.y = this.app.screen.height - 175;
        text.x = 300;

        this.app.stage.addChild(text);
    }

    generateRandomNumber() {
        let x = Math.floor((Math.random() * 4) + 1);
        return x;
    }

    setup() {
        let button = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button2 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button3 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button4 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);

        let bomb = new PIXI.Sprite(PIXI.loader.resources["images/bomb_.svg"].texture);
        this.app.stage.addChild(bomb);

        let cable_closed_1 = new PIXI.Sprite(PIXI.loader.resources["images/cables/closed/1.svg"].texture);
        let cable_closed_2 = new PIXI.Sprite(PIXI.loader.resources["images/cables/closed/2.svg"].texture);
        let cable_closed_3 = new PIXI.Sprite(PIXI.loader.resources["images/cables/closed/3.svg"].texture);
        let cable_closed_4 = new PIXI.Sprite(PIXI.loader.resources["images/cables/closed/4.svg"].texture);

        let cable_opened_1 = new PIXI.Sprite(PIXI.loader.resources["images/cables/opened/1.svg"].texture);
        let cable_opened_2 = new PIXI.Sprite(PIXI.loader.resources["images/cables/opened/2.svg"].texture);
        let cable_opened_3 = new PIXI.Sprite(PIXI.loader.resources["images/cables/opened/3.svg"].texture);
        let cable_opened_4 = new PIXI.Sprite(PIXI.loader.resources["images/cables/opened/4.svg"].texture);

        this.app.stage.addChild(cable_closed_1);
        this.app.stage.addChild(cable_closed_2);
        this.app.stage.addChild(cable_closed_3);
        this.app.stage.addChild(cable_closed_4);

        var but1down = false;
        var but2down = false;
        var but3down = false;
        var but4down = false;

        let x = this.generateRandomNumber();

        button.visible = true;
        button.tint = 0x57829c;
        button.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        button.x = 170;
        button.y = 65;
        button.interactive = true;
        button.buttonMode = true;
        button.on('pointerdown', (event) => {
            if (but1down === false) {
                this.app.stage.removeChild(cable_closed_1);
                this.app.stage.addChild(cable_opened_1);
                but1down = true;

                if (x == 1) this.showText('Bomba rozbrojona :)')
                else this.showText('Niestety, BuuUUUM ;(');
            }
        });

        this.app.stage.addChild(button);

        button2.visible = true;
        button2.hitArea = new PIXI.Rectangle(0, 0, 100, 150);
        button2.tint = 0x57829c;
        button2.x = 370;
        button2.y = 45;
        button2.interactive = true;
        button2.buttonMode = true;
        button2.on('pointerdown', (event) => {
            if (but2down === false) {
                this.app.stage.removeChild(cable_closed_2);
                this.app.stage.addChild(cable_opened_2);
                but2down = true;

                if (x == 2) this.showText('Bomba rozbrojona :)')
                else this.showText('Niestety, BuuUUUM ;(');
            }
        });

        this.app.stage.addChild(button2);

        button3.visible = true;
        button3.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        button3.tint = 0x57829c;
        button3.x = 530;
        button3.y = 85;
        button3.interactive = true;
        button3.buttonMode = true;
        button3.on('pointerdown', (event) => {
            if (but3down === false) {
                this.app.stage.removeChild(cable_closed_3);
                this.app.stage.addChild(cable_opened_3);
                but3down = true;

                if (x == 3) this.showText('Bomba rozbrojona :)')
                else this.showText('Niestety, BuuUUUM ;(');
            }
        });

        this.app.stage.addChild(button3);

        button4.visible = true;
        button4.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        button4.tint = 0x57829c;
        button4.x = 690;
        button4.y = 85;
        button4.interactive = true;
        button4.buttonMode = true;
        button4.on('pointerdown', (event) => {
            if (but4down === false) {
                this.app.stage.removeChild(cable_closed_4);
                this.app.stage.addChild(cable_opened_4);
                but4down = true;

                if (x == 4) this.showText('Bomba rozbrojona :)')
                else this.showText('Niestety, BuuUUUM ;(');
            }
        });

        this.app.stage.addChild(button4);
    }
    
}