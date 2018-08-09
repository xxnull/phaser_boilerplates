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
    shadow: 'images/spinner-shadow.png',
    needle: 'images/spinner-needle.png',
    blur: 'images/blur.png',
    center: 'images/center.png',
    yellowColor: 'images/color-yellow.jpg',
    redColor: 'images/color-red.jpg',
    blueColor: 'images/color-blue.jpg',
    darkYellowColor: 'images/color-yellow-dark.jpg',
    darkRedColor: 'images/color-red-dark.jpg',
    darkBlueColor: 'images/color-blue-dark.jpg',
    lightYellowColor: 'images/color-yellow-light.jpg',
    lightRedColor: 'images/color-red-light.jpg',
    lightBlueColor: 'images/color-blue-light.jpg',
    defaultColor: 'images/color-default.jpg',
    darkDefaultColor: 'images/color-default-dark.jpg',
  }
  const colors = {
    YELLOW: {
      color: 'YELLOW',
      path: assets.yellowColor,
      darker: assets.darkYellowColor,
      lighter: assets.lightYellowColor
    },
    BLUE: {
      color: 'BLUE',
      path: assets.blueColor,
      darker: assets.darkBlueColor,
      lighter: assets.lightBlueColor
    },
    RED: {
      color: 'RED',
      path: assets.redColor,
      darker: assets.darkRedColor,
      lighter: assets.lightRedColor
    },
    DEFAULT: {
      color: 'DEFAULT',
      path: assets.defaultColor,
      darker: assets.darkDefaultColor,
      lighter: assets.defaultColor
    },
  };
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

  class EditionModeController {
    constructor(editionMode, allowedColors, maxSliceCount = 12) {
      if (editionMode) {
        this._maxSliceCount = maxSliceCount;

        if (allowedColors) {
          this._allowedColors = allowedColors.map(({ color }) => color);
        } else {
          this._allowedColors = Object.keys(colors);
        }
      }
    }

    initEditionMode() {
      this._select = document.getElementById('select');
      this._select.addEventListener('change', this._onSelectionChange.bind(this));
      this._onSelectionChange();
    }

    _onSelectionChange() {
      const sections = Number(this._select.value);
      this.events.emit('edition:on');
      this.events.emit('section:change', sections);
    }
  }

  class Game extends EditionModeController {
    constructor(size, parent, config = {}) {
      super(config.editionMode, config.allowedColors, config.maxSliceCount);
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

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let { forceCanvas = true } = config;
      if (isSafari) forceCanvas = false;

      this._core = new PIXI.Application({
        forceCanvas,
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
        this.addGenericHandlers();
        this.show();

        if (this._config.editionMode) {
          this.events.on('edition:on', this.enableEditionMode.bind(this));
          this.events.on('edition:off', this.disableEditionMode.bind(this));
          this.events.on('section:change', this.changeSlices.bind(this));
          this.initEditionMode();
        }

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

    addGenericHandlers() {
      if (this._config.editionMode) {
        this.stage.interactive = true;
        this.stage.click = (e) => {
          this.stage.__clicked = true;

          if (e.target !== this._objects.popup) {
            if (!this._objects.popup.__opening) {
              this.closePopupColors();
            } else {
              this._objects.popup.__opening = false;
            }

            if (this._objects.slices.children.indexOf(e.target) === -1) {
              this.deactivateSlices();
            }
          }
        };

        document.addEventListener('click', (e) => {
          if (e.target !== this.canvas || !this.stage.__clicked) {
            this.closePopupColors();
            this.deactivateSlices();
          }

          this.stage.__clicked = false;
        });
      }
    }

    create() {
      this.createShadow();
      this.createSlices();
      this.createNeedle();
      if (this._config.editionMode)
        this.createPopupColors();
      this.createContainer();
    }

    getScaleUnit(unit) {
      return (this._size * unit) / this._baseSize;
    }

    createShadow() {
      const texture = this.sources[assets.shadow].texture;
      const shadow = new PIXI.Sprite(texture);
      const unit = this.getScaleUnit(0.55);
      shadow.anchor.set(0.5);
      shadow.scale.set(unit);
      shadow.alpha = 0.7;
      this._objects.shadow = shadow;
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

    highlightAt(index) {
      const child = this._objects.slices.getChildAt(index);
      this.fade(child.getChildAt(2), 0, 1);
      child.active = true;
    }

    deactivateSlices() {
      this._objects.slices.children.forEach((child, index) => {
        if (child.active) {
          this.fade(child.getChildAt(2), 1, 0);
          child.active = false;
        }
      });
    }

    highlightEmptySlices() {
      this.data.getEmptySlices().forEach(({ index }) => {
        const emptySlice = this._objects.slices.getChildAt(index);
        this.fade(emptySlice, 1, 0.7, 0.2, () => {
          this.fade(emptySlice, 0.7, 1, 0.2);
        });
      });
    }

    addSliceHandlers(slice, index) {
      slice.click = (e) => {
        if (!slice.active) {
          this.deactivateSlices();
          this.fade(slice.getChildAt(2), 0, 1);
        }

        this.openPopupColors(e, index);
        slice.active = true;
      };

      // const isDefaultColor = () =>
      //   this.data.getSliceAt(index).color === colors.DEFAULT.color;

      slice.mouseover = () => {
        if (!slice.active) slice.alpha = 0.85;
      };

      slice.mouseout = () => {
        slice.alpha = 1;
      };
    }

    createPopupColors() {
      const popup = new PIXI.Container();
      const background = new PIXI.Graphics();
      const border = new PIXI.Graphics();
      const text = new PIXI.Text('Choose color:', {
        fontSize: 18,
        fontFamily: 'Arial'
      });

      const length = this._allowedColors.length;
      const padding = 10;
      const colorSize = 50;
      const textSize = 21;
      const bgHeight = (padding * 3) + textSize + colorSize;
      const bgWidth = (padding * (length + 1)) + (length * colorSize);

      text.name = 'text';
      text.position.set(10, 10);
      background.beginFill(0xFFFFFF, 0.8);
      background.drawRoundedRect(0, 0, bgWidth, bgHeight, 10);
      background.endFill();
      border.lineStyle(1, 0xBBBBBB);
      border.beginFill(0xFFFFFF, 0);
      border.drawRoundedRect(0, 0, bgWidth, bgHeight, 10);
      border.endFill();
      popup.addChild(background);
      popup.addChild(border);
      popup.addChild(text);
      popup.__colors = [];

      this._allowedColors.forEach((color, i) => {
        const colorGroup = new PIXI.Container();
        const colorTexture = this.sources[colors[color].path].texture;
        const colorPattern = new PIXI.Sprite(colorTexture);
        const colorRect = new PIXI.Graphics();
        colorRect.beginFill(0xFFFFFF, 1);
        colorRect.drawRoundedRect(0, 0, colorSize, colorSize, 10);
        colorRect.endFill();
        colorPattern.mask = colorRect;
        colorGroup.addChild(colorRect);
        colorGroup.addChild(colorPattern);
        popup.addChild(colorGroup);
        const x = (padding * (i + 1)) + (i * colorSize);
        const y = textSize + (padding * 2);
        colorGroup.position.set(x, y);
        colorGroup.name = color;
        popup.__colors.push(colorGroup);
      });

      popup.alpha = 0;
      popup.scale.set(this.getScaleUnit(1));
      this._objects.popup = popup;
    }

    openPopupColors(e, index) {
      const { popup } = this._objects;
      popup.interactive = true;
      popup.__opening = true;

      popup.__colors.forEach((color) => {
        color.interactive = true;
        color.buttonMode = true;
        color.click = () => {
          this.updateSlice(index, colors[color.name]);
          this.closePopupColors();
        };
      });

      const { x, y } = e.data.getLocalPosition(popup.parent);
      popup.position.set(x, y);
      this.checkOffScreenPopup();
      this.fade(popup, 0, 1, 0.3);
    }

    checkOffScreenPopup() {
      const { popup } = this._objects;
      const size = this.canvas.width;
      const bounds = popup.getBounds();

      if (bounds.right > size) {
        popup.position.set(popup.x - (bounds.right - size + 20), popup.y);
      }

      if (bounds.bottom > size) {
        popup.position.set(popup.x, popup.y - (bounds.bottom - size + 20));
      }
    }

    closePopupColors() {
      if (this._config.editionMode) {
        const { popup } = this._objects;
        popup.__colors.forEach((_color) => {
          _color.interactive = false;
          _color.buttonMode = false;
          _color.click = null;
        });

        popup.interactive = false;

        if (popup.alpha !== 0)
          this.fade(popup, 1, 0, 0.3);
      }
    }

    createSlice(radius, start, end, data, index) {
      const slice = new PIXI.Container();
      const pattern = this.createColorPattern(data.path);
      const darker = this.createColorPattern(data.darker);
      const lighter = this.createColorPattern(data.lighter);
      const mask = this.createSliceGraphic(radius, start, end, 0);
      pattern.mask = mask;
      darker.mask = mask;
      lighter.mask = mask;
      darker.alpha = 0;
      lighter.alpha = 0;
      slice.addChild(mask);
      slice.addChild(pattern);
      slice.addChild(darker);
      slice.addChild(lighter);
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
          const isDefault = data.color === colors.DEFAULT.color;
          let stroke;
          let opacity;

          if (isDefault) {
            stroke = 0x000000;
            opacity = 0.15;
          } else {
            stroke = 0xFFFFFF;
            opacity = 1;
          }

          const slice = this.createSlice(radius, start, end, data, index);
          const border = this.createSliceGraphic(radius, start, end, 1, stroke, opacity);
          slice.name = `slice${index}`;
          border.name = `border${index}`;
          slice.border = border;

          if (this._config.editionMode) {
            this.addSliceHandlers(slice, index);
          }

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

      slices.rotation = - Math.PI / 2;
      this._objects.slices = slices;
      this.setInteractivity();
    }

    createNeedle() {
      const texture = this.sources[assets.needle].texture;
      const needle = new PIXI.Sprite(texture);
      needle.anchor.set(0.5, 0.5);
      needle.scale.set(this.getScaleUnit(0.6));
      const angle = this.rnd.between(0, 360);
      needle.rotation = utils.degToRad(angle);
      this._objects.needle = needle;

      const blurTexture = this.sources[assets.blur].texture;
      const blur = new PIXI.Sprite(blurTexture);
      blur.anchor.set(0.5, 0.5);
      blur.scale.set(this.getScaleUnit(0.6));
      blur.alpha = 0;

      const centerTexture = this.sources[assets.center].texture;
      const center = new PIXI.Sprite(centerTexture);
      center.anchor.set(0.5, 0.5);
      center.scale.set(this.getScaleUnit(0.3));
      this._objects.blur = blur;
      this._objects.center = center;
    }

    createContainer() {
      this._container = new PIXI.Container();
      this._container.name = 'spinner';

      for (const name in this._objects) {
        if (this._objects.hasOwnProperty(name)) {
          const sprite = this._objects[name];
          sprite.name = name;
          this._container.addChild(sprite);
        }
      }

      const x = this.renderer.width / 2;
      const y = this.renderer.height / 2;
      this._container.position.set(x, y);
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
        },
      });
    }

    destroyOldSlices() {
      if (this._objects.slices) {
        this._container.removeChild(this._objects.slices);
        this._objects.slices.destroy();
        this._objects.slices = null;
      }
    }

    appendNewSlices() {
      this.createSlices();
      this._container.addChildAt(this._objects.slices, 1);
    }

    addSlice(index, data) {
      this.destroyOldSlices();
      this.data.addSliceAt(index, data);
      this.appendNewSlices();
    }

    removeSlice(index) {
      this.destroyOldSlices();
      this.data.removeSliceAt(index);
      this.appendNewSlices();
    }

    changeSlices(quantity) {
      this.destroyOldSlices();
      this.data.emptySlices();
      for (let index = 0; index < quantity; index++)
        this.data.addSliceAt(index, colors.DEFAULT);
      this.appendNewSlices();
    }

    updateSlice(index, data) {
      if (data.color === this.data.getSliceAt(index).color) return;
      const newData = this.data.updateSliceAt(index, data);
      const oldSlice = this._objects.slices.getChildAt(index);
      const oldBorder = oldSlice.border;
      const bIndex = this._objects.slices.children.indexOf(oldBorder);

      this._objects.slices.removeChild(oldSlice);
      this._objects.slices.removeChild(oldBorder);

      oldSlice.destroy();
      oldBorder.destroy();

      const radius = this._size * 0.49;
      const sliceDeg = 360 / this.data.sliceCount;
      const start = index * sliceDeg;
      const end = (index + 1) * sliceDeg;
      const slice = this.createSlice(radius, start, end, data, index);
      slice.name = `slice${index}`;
      this.addSliceHandlers(slice, index);
      this._objects.slices.addChildAt(slice, index);

      const border = this.createSliceGraphic(radius, start, end, 1, 0xFFFFFF, 1);
      border.name = `border${index}`;
      slice.border = border;
      this._objects.slices.addChildAt(border, bIndex);

      slice.interactive = this._editing;
      slice.buttonMode = this._editing;
      slice.active = false;

      this.events.emit('edition:change', this.data.readyToSpin);
    }

    setInteractivity() {
      this._objects.slices.children.forEach((child) => {
        if (child.name === 'default' || /border\d/g.test(child.name)) return;
        child.interactive = this._editing;
        child.buttonMode = this._editing;
      });
    }

    enableEditionMode() {
      this._editing = true;
      this.scaleSpinner();
      this.setInteractivity();
      this.data.resetHistory();
      this.events.emit('history:update', this.data.history);
    }

    disableEditionMode() {
      this._editing = false;
      this.setInteractivity();
      this.data.save();
    }

    onSpinStart(emit = true, duration) {
      this._spinning = true;
      this.data.updateSpinCount();
      if (emit) this.events.emit('spin:start', duration);
    }

    onSpinComplete(degrees, animate = true) {
      const sliceData = this.data.getLandedSliceData(degrees);
      this._spinning = false;

      if (animate) {
        const { enableFlashingAnimation = true } = this._config;
        this._objects.needle.rotation = utils.degToRad(degrees);

        if (enableFlashingAnimation) {
          const slice = this._objects.slices.getChildAt(sliceData.index);
          const lighter = slice.getChildAt(3);
          const alpha = 0.5;
          const blinkIn = this.fade.bind(this, lighter, 0, alpha, 0.3);
          const blinkOut = this.fade.bind(this, lighter, alpha, 0, 0.3);
          const blink = (cb) => blinkIn(blinkOut.bind(this, cb));
          blink(blink.bind(this, blink.bind(this, () =>
            this.events.emit('spin:end'))));
        } else {
          this.events.emit('spin:end');
        }
      }

      this.data.record(this.data.spinCount, sliceData.color);
    }

    resetHistory() {
      if (this.data.history.length) {
        this.data.resetHistory();
        this.events.emit('history:update', this.data.history);
      }
    }

    spin(spinSimulationCount) {
      if (!this._ready) return;

      const {
        editionMode,
        blurMotion = {},
      } = this._config;

      if (editionMode) this.events.emit('edition:off');
      if (isNaN(spinSimulationCount)) spinSimulationCount = 1;

      this.deactivateSlices();

      if (spinSimulationCount > 1) {
        for (let i = 0; i < spinSimulationCount - 1; i++) {
          const degrees = this.rnd.between(0, 359);
          this.onSpinStart(false);
          this.onSpinComplete(degrees, false);
        }

        const fadeTime = this.spin(1);
        this.events.emit('simulations:end', this.data.history, fadeTime);
      } else {
        const {
          addRounds = 0,
          fadeTimeUnit = 10,
          fadeAlphaUnit = 0.5,
          enable = false,
        } = blurMotion;
        const rounds = this.rnd.between(3 + addRounds, 5 + addRounds);
        const degrees = this.rnd.between(0, 359);
        const angle = 360 * rounds + degrees;
        const duration = (120 * (Math.sqrt(angle))) / 1000;
        const fadeTime = (fadeTimeUnit * Math.sqrt(angle)) / 1000;
        const tween = new TweenLite(this._objects.needle, duration, {
          ease: 'Cubic.easeOut',
          pixi: { rotation: angle },
          onStart: () => {
            if (enable) {
              this.fade(this._objects.needle, 1, 0, 1);
              this.fade(this._objects.blur, 0, fadeAlphaUnit, fadeTime, () => {
                this.fade(this._objects.needle, 0, 1, 1);
                this.fade(this._objects.blur, fadeAlphaUnit, 0, fadeTime);
              });
            }

            this.onSpinStart(true, fadeTime);
          },
          onComplete: () => {
            tween.kill();
            this.onSpinComplete(degrees);
            this.events.emit('history:update', this.data.history);
          },
        });

        return fadeTime;
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
