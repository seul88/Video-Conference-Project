import './assets/scss/styles.scss';

export class Template {
  constructor() {
    this.initBGAnimation();
    this.onJoin = null;
    this.onReady = null;
    this.onAbandon = null;

    this.initLoginSplash();
    this.initWaitingSplash();
    this.initPartnerSplash();
    this.initGameSplash();
  }

  initLoginSplash() {
    this.login_splash = document.getElementById('loginSplash');
    this.btn_join = document.getElementById('btn-join');
    this.input_username = document.getElementById('input-username');

    this.btn_join.addEventListener('click', () => {
      this.onJoin(this.input_username.value);
    });
  }

  initWaitingSplash() {
    this.waiting_splash = document.getElementById('waitingSplash');
  }

  initGameSplash() {
    this.game_splash = document.getElementById('gameSplash');
  }

  initPartnerSplash() {
    this.partner_splash = document.getElementById('partnerSplash');
    this.btn_ready = document.getElementById('btn-ready');
    this.btn_abandon = document.getElementById('btn-abandon');

    this.btn_ready.addEventListener('click', () => {
      this.onReady();
      let rdy_button = document.getElementById('btn-ready');
      rdy_button.firstChild.data = "Waiting...";
      rdy_button.disabled = true;
    });

    this.btn_abandon.addEventListener('click', () => {
      this.onAbandon();
      let rdy_button = document.getElementById('btn-ready');
      rdy_button.firstChild.data = "I am ready";
      rdy_button.disabled = false;
    });
  }

  showGameSplash() {
    this._show(this.game_splash);

    let placeInGame = document.getElementById('videoInGame');
    placeInGame.className = 'video-on';

    /*
    let videoWrapper = document.getElementById('videoWrapper');
    let placeInSplash = document.getElementById('videoInSplash');
    let placeInGame = document.getElementById('videoInGame');

    placeInGame.innerHTML = '';
    placeInSplash.innerHTML = '';

    placeInGame.appendChild(videoWrapper);
    */
  }

  hideGameSplash() {
    this._hide(this.game_splash);

    let placeInGame = document.getElementById('videoInGame');
    placeInGame.className = 'video-off';
  }

  showPartnerSplash() {
    this._show(this.partner_splash);

    let placeInGame = document.getElementById('videoInGame');
    placeInGame.className = 'video-on';

    /*

    let videoWrapper = document.getElementById('videoWrapper');
    let placeInSplash = document.getElementById('videoInSplash');
    let placeInGame = document.getElementById('videoInGame');

    placeInGame.innerHTML = '';
    placeInSplash.innerHTML = '';

    placeInSplash.appendChild(videoWrapper);

    */
  }

  hidePartnerSplash() {
    this._hide(this.partner_splash);

    let placeInGame = document.getElementById('videoInGame');
    placeInGame.className = 'video-off';
  }

  showWaitingSplash() {
    this._show(this.waiting_splash);
  }

  hideWaitingSplash() {
    this._hide(this.waiting_splash);
  }

  showLoginSplash() {
    this._show(this.login_splash);
  }

  hideLoginSplash() {
    this._hide(this.login_splash);
  }

  _show(div) {
    div.style.setProperty("display", "");
  }

  _hide(div) {
    div.style.setProperty("display", "none", "important");
  }

  initBGAnimation() {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame

    const OPTIONS = {
      AMOUNT: 100,
      UPPER_LIMIT: 40,
      LOWER_LIMIT: 1,
    }

    const UPPER_SIZE = 10
    const LOWER_SIZE = 4

    const doIt = () => Math.random() > 0.5
    const update = p =>
      doIt()
        ? Math.max(OPTIONS.LOWER_LIMIT, p - 1)
        : Math.min(p + 1, OPTIONS.UPPER_LIMIT)
    const reset = p => {
      p.x = p.startX
      p.y = p.startY
    }
    const floored = r => Math.floor(Math.random() * r)
    const genParticles = () =>
      new Array(OPTIONS.AMOUNT).fill().map(p => {
        const size = floored(UPPER_SIZE) + LOWER_SIZE
        const c = document.createElement('canvas')
        const ctx = c.getContext('2d')
        const r = (Math.PI / 180) * floored(360)
        const color = `rgba(83, 83, ${180 +
          Math.floor(Math.random() * 100)}, ${Math.random()})`
        const xDelayed = doIt()
        const startX = xDelayed
          ? -(size + floored(canvas.width))
          : floored(canvas.width * 0.25)
        const startY = xDelayed
          ? size + floored(canvas.height * 0.25) + Math.floor(canvas.height * 0.75)
          : canvas.height + size + floored(canvas.height)
        c.height = size
        c.width = size
        context.globalCompositeOperation = 'multiply'
        // ctx.filter = `blur(${Math.random() * size}px)`
        ctx.translate(size / 2, size / 2)
        ctx.rotate(r)
        ctx.translate(-(size / 2), -(size / 2))
        ctx.fillStyle = color
        ctx.fillRect(0, 0, size, size)
        return {
          x: startX,
          y: startY,
          startY,
          startX,
          c,
          r,
          vx: floored(OPTIONS.UPPER_LIMIT / 4),
          vy: floored(OPTIONS.UPPER_LIMIT / 4),
          size,
        }
      })

    let particles = genParticles()
    let FRAME_COUNT = 0

    const draw = () => {
      if (
        canvas.width !== window.innerWidth ||
        canvas.height !== window.innerHeight
      ) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        particles = genParticles()
      }
      // context.restore()
      for (const particle of particles) {
        context.clearRect(particle.x, particle.y, particle.size, particle.size)
        FRAME_COUNT++
        if (particle.y < canvas.height || particle.startX < 0)
          particle.x += particle.vx
        if (particle.x > 0 || particle.startY > canvas.height)
          particle.y -= particle.vy
        if (FRAME_COUNT % 11 === 0 && doIt()) particle.vx = update(particle.vx)
        if (FRAME_COUNT % 13 === 0 && doIt()) particle.vy = update(particle.vy)
        context.drawImage(particle.c, particle.x, particle.y)
        if (particle.x > canvas.width || particle.y < -particle.size)
          reset(particle)
      }
      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)


  }

}