const Spinner = (() => {
  const utils = {
    isElement(obj) {
      try {
        return obj instanceof HTMLElement;
      } catch (e) {
        return (typeof obj === 'object') &&
          (obj.nodeType === 1) && (typeof obj.style === 'object') &&
          (typeof obj.ownerDocument === 'object');
      }
    },

    degToRad(degrees) {
      return (degrees * Math.PI) / 180;
    },
  }
  const assets = {
    shadow: 'images/tomatodo-shadow.png',
    needle: 'images/spinner-needle.png',
    yellowColor: 'images/color-yellow.jpg',
    redColor: 'images/color-red.jpg',
    blueColor: 'images/color-blue.jpg',
    purpleColor: 'images/color-purple.jpg',
    greenColor: 'images/color-green.jpg',
    orangeColor: 'images/color-orange.jpg',
    lightYellowColor: 'images/color-yellow-light.jpg',
    lightRedColor: 'images/color-red-light.jpg',
    lightBlueColor: 'images/color-blue-light.jpg',
    lightPurpleColor: 'images/color-purple-light.jpg',
    lightGreenColor: 'images/color-green-light.jpg',
    lightOrangeColor: 'images/color-orange-light.jpg',
  }

  const colors = {
    YELLOW: {
      color: 'YELLOW',
      path: assets.yellowColor,
      lighter: assets.lightYellowColor
    },
    BLUE: {
      color: 'BLUE',
      path: assets.blueColor,
      lighter: assets.lightBlueColor
    },
    RED: {
      color: 'RED',
      path: assets.redColor,
      lighter: assets.lightRedColor
    },
    PURPLE: {
      color: 'PURPLE',
      path: assets.purpleColor,
      lighter: assets.lightPurpleColor
    },
    GREEN: {
      color: 'GREEN',
      path: assets.greenColor,
      lighter: assets.lightGreenColor
    },
    ORANGE: {
      color: 'ORANGE',
      path: assets.orangeColor,
      lighter: assets.lightOrangeColor
    },
  };

  const texts = [
    'Pon uno',
    'Toma dos',
    'Todos ponen',
    'Toma uno',
    'Pon dos',
    'Toma todo',
  ];

  class DataManager {
    constructor(slices = []) {
      this._slices = slices.map(({ color }, index) =>
        this.__getSliceData(color, index));
      this._spinCount = 0;
      this._allowEmpty = false;
      this._history = [];
    }

    __getSliceData(data, index) {
      return Object.assign({}, data, { index });
    }

    updateSpinCount() {
      this._spinCount += 1;
    }

    emptySlices() {
      this._slices.length = 0;
    }

    save() {
      localStorage.setItem('spinner', JSON.stringify(this._slices));
    }

    addSliceAt(index, data) {
      const slice = this.__getSliceData(data, index);
      const prev = this._slices.slice(0, index);
      const next = this._slices.slice(index + 1);
      this._slices = [...prev, slice, ...next];
    }

    removeSliceAt(index) {
      const prev = this._slices.slice(0, index);
      const next = this._slices.slice(index + 1);
      this._slices = [...prev, ...next];
    }

    updateSliceAt(index, data) {
      this.addSliceAt(index, data);
      return this._slices[index];
    }

    getSliceAt(index) {
      return this._slices[index];
    }

    getEmptySlices() {
      return this._slices.filter(data =>
        data.color === colors.DEFAULT.color);
    }

    getLandedSliceData(degrees) {
      const index = Math.floor(degrees / (360 / this.sliceCount));
      return this._slices[index];
    }

    record(index, color) {
      this._history.push([index, color]);
    }

    resetHistory() {
      this._spinCount = 0;
      this._history.length = 0;
    }

    get slices() {
      return this._slices.map(data => Object.assign({}, data));
    }

    get hasSlices() {
      return !!this._slices.length;
    }

    get sliceCount() {
      return this._slices.length;
    }

    get spinCount() {
      return this._spinCount;
    }

    get readyToSpin() {
      let ready = true;
      let length = this.sliceCount;

      if (length < 2) return false;

      if (!this._allowEmpty) {
        do {
          const index = length - 1;
          ready = this._slices[index].color !== colors.DEFAULT.color;
        } while (ready && --length);
      }

      return ready;
    }

    get history() {
      return this._history;
    }

    set allowEmpty(allow) {
      this._allowEmpty = allow;
    }
  }

  class Game {
    constructor(size, parent, config = {}) {
      this.data = new DataManager(config.slices);
      this._size = size;
      this._baseSize = 450;
      this._config = config;
      this._container = null;
      this._objects = {};
      this._ready = false;

      if (!parent) this._parent = document.body;
      else if (utils.isElement(parent)) this._parent = parent;
      else this._parent = document.querySelector(parent);

      const seed = [(Date.now() * Math.random()).toString()];
      this.rnd = new RandomDataGenerator(seed);
      this.events = new EventEmitter();

      this._core = new PIXI.Application({
        width: this._size,
        height: this._size,
        antialias: true,
        transparent: true,
        autoResize: true,
        resolution: 1,
      });

      this.canvas = this._core.view;
      this.renderer = this._core.renderer;
      this.stage = this._core.stage;

      this.init();
    }

    init() {
      this.preload(assets, () => {
        this.create();
        this.show();
        this._ready = true;
        this.events.emit('ready');
      });
    }

    preload(assets, done) {
      const list = [];

      for (const name in assets) {
        if (assets.hasOwnProperty(name)) {
          list.push(assets[name]);
        }
      }

      PIXI.loader.add(list).load(() => {
        this.sources = PIXI.loader.resources;
        done();
      });
    }

    create() {
      this.createSlices();
      this.createNeedle();
      this.createContainer();
      this.createShadow();
    }

    getScaleUnit(unit) {
      return (this._size * unit) / this._baseSize;
    }

    createShadow() {
      const texture = this.sources[assets.shadow].texture;
      const shadow = new PIXI.Sprite(texture);
      const unit = this.getScaleUnit(0.56);
      shadow.anchor.set(0.5);
      shadow.scale.set(unit);
      shadow.alpha = 0.9;
      this._container.addChildAt(shadow, 0);
    }

    createSliceGraphic(radius, start, end, stroke, strokeColor, strokeOpacity) {
      const slice = new PIXI.Graphics();
      slice.lineStyle(stroke, strokeColor || 0x000000, strokeOpacity || 0.5);
      slice.beginFill(0x000000, 0);
      const startAngle = utils.degToRad(start);
      const endAngle = utils.degToRad(end);
      slice.moveTo(0, 0);
      slice.arc(0, 0, radius, startAngle, endAngle, false);
      slice.endFill();
      return slice;
    }

    createColorPattern(color) {
      const pattern = new PIXI.Sprite(this.sources[color].texture);
      const unit = this.getScaleUnit(0.6);
      pattern.anchor.set(0.5);
      pattern.scale.set(unit);
      return pattern;
    }

    scaleSpinner() {
      TweenLite.to(this._container, 0.2, {
        ease: 'Cubic.easeOut',
        pixi: { scaleX: 0.87, scaleY: 0.87 },
        onComplete: () => {
          TweenLite.to(this._container, 0.2, {
            ease: 'Cubic.easeOut',
            pixi: { scaleX: 0.85, scaleY: 0.85 },
          });
        },
      });
    }

    fade(obj, from, to, duration = 0.3, callback) {
      obj.alpha = from;
      TweenLite.to(obj, duration, {
        ease: 'Cubic.easeOut',
        pixi: { alpha: to },
        onComplete: callback,
      });
    }

    createSlice(radius, start, end, data, index, txt) {
      const slice = new PIXI.Container();
      const pattern = this.createColorPattern(data.path);
      const lighter = this.createColorPattern(data.lighter);
      const mask = this.createSliceGraphic(radius, start, end, 0);

      const text = new PIXI.Text(txt, {
        fontFamily: 'Poppins, Arial, sans-serif',
        lineHeight: 18,
        fontSize: 22,
        fill: 0x000000,
        align: 'center',
      });

      const radians = utils.degToRad(end - 30);
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const distance = radius - (radius * 0.35);
      const x = distance * cos - 0 * sin;
      const y = 0 * cos + distance * sin;

      text.anchor.set(0.5, 0);
      text.rotation = utils.degToRad(start - 60);
      text.position.set(x, y);

      pattern.mask = mask;
      lighter.mask = mask;
      lighter.alpha = 0;

      slice.addChild(mask);
      slice.addChild(pattern);
      slice.addChild(lighter);
      slice.addChild(text);
      return slice;
    }

    createSlices() {
      const slices = new PIXI.Container();
      const radius = this._size * 0.49;

      if (this.data.hasSlices) {
        const sliceDeg = 360 / this.data.sliceCount;
        const sliceData = this.data.slices.map((data, index) => {
          const start = index * sliceDeg;
          const end = (index + 1) * sliceDeg;
          const slice = this.createSlice(radius, start, end, data, index, texts[index]);
          const border = this.createSliceGraphic(radius, start, end, 3, 0x000000, 1);
          slice.name = `slice${index}`;
          return [slice, border];
        });

        sliceData.map((data) => slices.addChild(data[0]));
        sliceData.map((data) => slices.addChild(data[1]));
      } else {
        const circle = new PIXI.Graphics();
        circle.lineStyle(1, 0x000000, 0.3);
        circle.beginFill(0xFFFFFF, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.name = `default`;
        slices.addChild(circle);
      }

      this._objects.slices = slices;
    }

    createNeedle() {
      const texture = this.sources[assets.needle].texture;
      const needle = new PIXI.Sprite(texture);
      needle.anchor.set(0.5, 0.5);
      needle.scale.set(this.getScaleUnit(0.55));
      const angle = this.rnd.between(0, 360);
      needle.rotation = utils.degToRad(angle);
      this._objects.needle = needle;
    }

    createHexagon() {
      const polygon = new PIXI.Graphics();
      polygon.beginFill(0x000000, 0);
      polygon.lineStyle(3, 0x000000);

      // find hexagon points position:
      // x' = x cos(θ) − y sin(θ)
      // y'= y cos(θ) + x sin(θ)

      const radius = this._size * 0.49;
      const angles = [60, 120, 180, 240, 300, 360, 60];
      const point = [radius, 0];
      const points = Array.prototype.concat(...angles.map((deg) => {
        const radians = utils.degToRad(deg);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return [
          point[0] * cos - point[1] * sin,
          point[1] * cos + point[0] * sin,
        ];
      }));

      polygon.drawPolygon(points);
      polygon.endFill();
      return polygon;
    }

    createContainer() {
      this._container = new PIXI.Container();
      this._container.name = 'tomatodo';

      const spinner = new PIXI.Container();
      spinner.name = 'spinner';

      for (const name in this._objects) {
        if (this._objects.hasOwnProperty(name)) {
          const sprite = this._objects[name];
          sprite.name = name;
          spinner.addChild(sprite);
        }
      }

      const hexagon = this.createHexagon();
      const border = this.createHexagon();
      spinner.addChild(hexagon);
      spinner.addChild(border);
      spinner.mask = hexagon;

      const x = this.renderer.width / 2;
      const y = this.renderer.height / 2;
      this._container.position.set(x, y);
      this._container.addChild(spinner);
    }

    resize() {
      const width = this._parent.clientWidth;
      const height = this._parent.clientHeight;
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.stage.scale.x = this.stage.scale.y = height / this._size;
      this.renderer.resize(width, height);
    }

    show() {
      window.addEventListener('resize', this.resize.bind(this));
      window.addEventListener('deviceOrientation', this.resize.bind(this));
      this._parent.appendChild(this._core.view);
      this.resize();

      this._container.scale.set(0.4);
      this.stage.addChild(this._container);
      TweenLite.to(this._container, 0.4, {
        ease: 'Cubic.easeOut',
        pixi: {
          scaleX: 0.95,
          scaleY: 0.95
        }
      });
    }

    onSpinStart(emit = true) {
      this._spinning = true;
      this.data.updateSpinCount();
      if (emit) this.events.emit('spin:start', this.data.spinCount);
    }

    onSpinComplete(degrees, animate = true) {
      const sliceData = this.data.getLandedSliceData(degrees);
      this._spinning = false;

      if (animate) {
        this._objects.needle.rotation = utils.degToRad(degrees);

        const slice = this._objects.slices.getChildAt(sliceData.index);
        const lighter = slice.getChildAt(2);

        const alpha = 0.5;
        const blinkIn = this.fade.bind(this, lighter, 0, alpha, 0.3);
        const blinkOut = this.fade.bind(this, lighter, alpha, 0, 0.3);
        const blink = (cb) => blinkIn(blinkOut.bind(this, cb));

        blink(blink.bind(this, blink.bind(this, () =>
          this.events.emit('spin:end'))));
      }

      this.data.record(this.data.spinCount, sliceData.color);
    }

    spin(spinSimulationCount) {
      if (!this._ready) return;
      if (isNaN(spinSimulationCount)) spinSimulationCount = 1;

      if (spinSimulationCount > 1) {
        for (let i = 0; i < spinSimulationCount - 1; i++) {
          const degrees = this.rnd.between(0, 359);
          this.onSpinStart(false);
          this.onSpinComplete(degrees, false);
        }

        this.spin();
      } else {
        const rounds = this.rnd.between(3, 5);
        const degrees = this.rnd.between(0, 359);
        const angle = 360 * rounds + degrees;
        const duration = (120 * (Math.sqrt(angle))) / 1000;
        const tween = new TweenLite(this._objects.needle, duration, {
          ease: 'Cubic.easeOut',
          pixi: { rotation: angle },
          immediateRender: false,
          onStart: () => this.onSpinStart(),
          onComplete: () => {
            tween.kill();
            this.onSpinComplete(degrees);
            this.events.emit('history:update', this.data.history);
          },
        });
      }
    }
  }

  class EventEmitter {
    constructor() {
      this._stack = {};
    }

    on(event, callback) {
      if (!(typeof callback === 'function')) throw new Error('callback must be a function');
      if (!this._stack[event]) this._stack[event] = {};
      if (!this._stack[event].on) this._stack[event].on = [];
      this._stack[event].on.push(callback);
    }

    once(event, callback) {
      if (!(typeof callback === 'function')) throw new Error('callback must be a function');
      if (!this._stack[event]) this._stack[event] = {};
      if (!this._stack[event].once) this._stack[event].once = [];
      this._stack[event].once.push(callback);
    }

    off(event, callback = null) {
      if (event) {
        if (this._stack[event]) {
          if (callback !== null) {
            if (typeof callback === 'function') {
              const { on = [], once = [] } = this._stack[event];
              let index = on.indexOf(callback);
              this._stack[event].on = index > -1 ? [
                ...on.slice(0, index),
                ...on.slice(index + 1),
              ] : on;
              index = once.indexOf(callback);
              this._stack[event].once = index > -1 ? [
                ...once.slice(0, index),
                ...once.slice(index + 1),
              ] : once;
            } else {
              throw new Error('callback must be a function');
            }
          } else if (callback === null) {
            this._stack[event] = { on: [], once: [] };
          }
        }
      } else {
        this._stack = {};
      }
    }

    emit(...args) {
      const [event] = args;
      const { on = [], once = [] } = this._stack[event] || {};

      for (let i = 0; i < on.length; i += 1) {
        const callback = on[i];
        callback.apply(callback, args.slice(1));
      }

      while (once.length) {
        const callback = once.shift();
        callback.apply(callback, args.slice(1));
      }
    }

    getEventHandlers(event, type = 'on') {
      if (!event) return this._stack;
      if (!this._stack[event]) return [];
      const events = this._stack[event][type] || [];
      return [...events];
    }
  }

  return { Game, colors };
})();
