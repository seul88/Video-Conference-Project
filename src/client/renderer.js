import * as PIXI from 'pixi.js'

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
        let x = Math.floor((Math.random() * 4) + 1);
        return x;
    }
	
	
	
	// 
	
    EndWin(blurFilter1){
		blurFilter1.enabled = true; 	
        }
	
	/*
	 EndWin(blurFilter1, timer, bomb, cable_closed_1, cable_closed_2, cable_closed_3, cable_closed_4, cable_opened_1, cable_opened_2, cable_opened_3, cable_opened_4 ) {
	    blurFilter1.enabled = true;     
        blurFilter1.blur = 8;
		bomb.filters = [blurFilter1];	
		cable_closed_1.filters = [blurFilter1];
		cable_closed_2.filters = [blurFilter1];
		cable_closed_3.filters = [blurFilter1];
		cable_closed_4.filters = [blurFilter1];
		cable_opened_1.filters = [blurFilter1];
		cable_opened_2.filters = [blurFilter1];
		cable_opened_3.filters = [blurFilter1];
		cable_opened_4.filters = [blurFilter1];
	
	 }
	*/
	
    setup() {
		
		/* ------------------------------------ IMAGES - add to canvas ------------------------------------ */
		
		
        let button = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button2 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button3 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);
        let button4 = new PIXI.Sprite(PIXI.loader.resources["images/blank.png"].texture);

        let bomb = new PIXI.Sprite(PIXI.loader.resources["images/bombv2.svg"].texture);
        this.app.stage.addChild(bomb);

		let clock_bg = new PIXI.Sprite(PIXI.loader.resources["images/clock.svg"].texture);
		this.app.stage.addChild(clock_bg);
		
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



		/* ------------------------------------ NUM and TEXT vars and consts ------------------------------------ */
		
		let x = this.generateRandomNumber();
		
        var textFail = "Kruci, skucha :(";
        var textWin = "Bomba rozbrojona ;)";
		
		
		
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
		
        this.app.ticker.add(function () {
            timer.rotation += timerRotationSpeed;
            clockwheel.rotation += timerRotationSpeed;
        });


        /* ------------------------------------ BUTTONS ------------------------------------ */
		
		var but1down = false;
        var but2down = false;
        var but3down = false;
        var but4down = false;
		
		
        button.visible = true;
        button.tint = 0x57829c;
        button.hitArea = new PIXI.Rectangle(0, 0, 100, 100);
        button.interactive = true;
        button.buttonMode = true;
		
        button.x = 170;
        button.y = 65;

		var blurFilter1 = new PIXI.filters.BlurFilter();    		      
        blurFilter1.blur = 8;
		blurFilter1.enabled = false;  
		
        button.on('pointerdown', (event) => {
            if (but1down === false) {
                this.app.stage.removeChild(cable_closed_1);
                this.app.stage.addChild(cable_opened_1);
                but1down = true;

                if (x == 1) {        
					this.showText(textWin, 50);
			        blurFilter1.enabled = true;
			         //EndWin(blurFilter1);
				  //  tutaj zamiast blurFiler1.enabled chciałem wywoływać : EndWin(blurFilter1) 
      				this.app.ticker.add(function () {
                    timer.rotation -= timerRotationSpeed;
                    clockwheel.rotation -= timerRotationSpeed;
                    });
				
				
				}
                else this.showText(textFail, 700);
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

                if (x == 2) {this.showText(textWin, 50);
				               blurFilter1.enabled = true;
							       this.app.ticker.add(function () {
            timer.rotation -= timerRotationSpeed;
            clockwheel.rotation -= timerRotationSpeed;
        });
							}
                else this.showText(textFail, 700);
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

                if (x == 3) {this.showText(textWin, 50);
					          blurFilter1.enabled = true;
							    this.app.ticker.add(function () {
            timer.rotation -= timerRotationSpeed;
            clockwheel.rotation -= timerRotationSpeed;
        });}
                else this.showText(textFail, 700);
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

                if (x == 4) {this.showText(textWin, 50);
					           blurFilter1.enabled = true;
							       this.app.ticker.add(function () {
            timer.rotation -= timerRotationSpeed;
            clockwheel.rotation -= timerRotationSpeed;
        });
							 }
                else this.showText(textFail, 700);
            }
        });
        this.app.stage.addChild(button4);
		
		
		/* ------------------------------------ GRAPHICAL FILTERS ------------------------------------ */
		
		
		bomb.filters = [blurFilter1];	
		cable_closed_1.filters = [blurFilter1];
		cable_closed_2.filters = [blurFilter1];
		cable_closed_3.filters = [blurFilter1];
		cable_closed_4.filters = [blurFilter1];
		cable_opened_1.filters = [blurFilter1];
		cable_opened_2.filters = [blurFilter1];
		cable_opened_3.filters = [blurFilter1];
		cable_opened_4.filters = [blurFilter1];	
		
	
		

    }
}