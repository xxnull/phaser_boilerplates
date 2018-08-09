'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spinner = function () {
  var utils = {
    isElement: function isElement(obj) {
      try {
        return obj instanceof HTMLElement;
      } catch (e) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object';
      }
    },
    degToRad: function degToRad(degrees) {
      return degrees * Math.PI / 180;
    }
  };

  var assets = {
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
    lightOrangeColor: 'images/color-orange-light.jpg'
  };

  var colors = {
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
    }
  };

  var texts = ['Pon uno', 'Toma dos', 'Todos ponen', 'Toma uno', 'Pon dos', 'Toma todo'];

  var DataManager = function () {
    function DataManager() {
      var _this = this;

      var slices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, DataManager);

      this._slices = slices.map(function (_ref, index) {
        var color = _ref.color;
        return _this.__getSliceData(color, index);
      });
      this._spinCount = 0;
      this._allowEmpty = false;
      this._history = [];
    }

    _createClass(DataManager, [{
      key: '__getSliceData',
      value: function __getSliceData(data, index) {
        return Object.assign({}, data, { index: index });
      }
    }, {
      key: 'updateSpinCount',
      value: function updateSpinCount() {
        this._spinCount += 1;
      }
    }, {
      key: 'emptySlices',
      value: function emptySlices() {
        this._slices.length = 0;
      }
    }, {
      key: 'save',
      value: function save() {
        localStorage.setItem('spinner', JSON.stringify(this._slices));
      }
    }, {
      key: 'addSliceAt',
      value: function addSliceAt(index, data) {
        var slice = this.__getSliceData(data, index);
        var prev = this._slices.slice(0, index);
        var next = this._slices.slice(index + 1);
        this._slices = [].concat(_toConsumableArray(prev), [slice], _toConsumableArray(next));
      }
    }, {
      key: 'removeSliceAt',
      value: function removeSliceAt(index) {
        var prev = this._slices.slice(0, index);
        var next = this._slices.slice(index + 1);
        this._slices = [].concat(_toConsumableArray(prev), _toConsumableArray(next));
      }
    }, {
      key: 'updateSliceAt',
      value: function updateSliceAt(index, data) {
        this.addSliceAt(index, data);
        return this._slices[index];
      }
    }, {
      key: 'getSliceAt',
      value: function getSliceAt(index) {
        return this._slices[index];
      }
    }, {
      key: 'getEmptySlices',
      value: function getEmptySlices() {
        return this._slices.filter(function (data) {
          return data.color === colors.DEFAULT.color;
        });
      }
    }, {
      key: 'getLandedSliceData',
      value: function getLandedSliceData(degrees) {
        var index = Math.floor(degrees / (360 / this.sliceCount));
        return this._slices[index];
      }
    }, {
      key: 'record',
      value: function record(index, color) {
        this._history.push([index, color]);
      }
    }, {
      key: 'resetHistory',
      value: function resetHistory() {
        this._spinCount = 0;
        this._history.length = 0;
      }
    }, {
      key: 'slices',
      get: function get() {
        return this._slices.map(function (data) {
          return Object.assign({}, data);
        });
      }
    }, {
      key: 'hasSlices',
      get: function get() {
        return !!this._slices.length;
      }
    }, {
      key: 'sliceCount',
      get: function get() {
        return this._slices.length;
      }
    }, {
      key: 'spinCount',
      get: function get() {
        return this._spinCount;
      }
    }, {
      key: 'readyToSpin',
      get: function get() {
        var ready = true;
        var length = this.sliceCount;

        if (length < 2) return false;

        if (!this._allowEmpty) {
          do {
            var index = length - 1;
            ready = this._slices[index].color !== colors.DEFAULT.color;
          } while (ready && --length);
        }

        return ready;
      }
    }, {
      key: 'history',
      get: function get() {
        return this._history;
      }
    }, {
      key: 'allowEmpty',
      set: function set(allow) {
        this._allowEmpty = allow;
      }
    }]);

    return DataManager;
  }();

  var Game = function () {
    function Game(size, parent) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Game);

      this.data = new DataManager(config.slices);
      this._size = size;
      this._baseSize = 450;
      this._config = config;
      this._container = null;
      this._objects = {};
      this._ready = false;

      if (!parent) this._parent = document.body;else if (utils.isElement(parent)) this._parent = parent;else this._parent = document.querySelector(parent);

      var seed = [(Date.now() * Math.random()).toString()];
      this.rnd = new RandomDataGenerator(seed);
      this.events = new EventEmitter();

      this._core = new PIXI.Application({
        width: this._size,
        height: this._size,
        antialias: true,
        transparent: true,
        autoResize: true,
        resolution: 1
      });

      this.canvas = this._core.view;
      this.renderer = this._core.renderer;
      this.stage = this._core.stage;

      this.init();
    }

    _createClass(Game, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.preload(assets, function () {
          _this2.create();
          _this2.show();
          _this2._ready = true;
          _this2.events.emit('ready');
        });
      }
    }, {
      key: 'preload',
      value: function preload(assets, done) {
        var _this3 = this;

        var list = [];

        for (var name in assets) {
          if (assets.hasOwnProperty(name)) {
            list.push(assets[name]);
          }
        }

        PIXI.loader.add(list).load(function () {
          _this3.sources = PIXI.loader.resources;
          done();
        });
      }
    }, {
      key: 'create',
      value: function create() {
        this.createSlices();
        this.createNeedle();
        this.createContainer();
        this.createShadow();
      }
    }, {
      key: 'getScaleUnit',
      value: function getScaleUnit(unit) {
        return this._size * unit / this._baseSize;
      }
    }, {
      key: 'createShadow',
      value: function createShadow() {
        var texture = this.sources[assets.shadow].texture;
        var shadow = new PIXI.Sprite(texture);
        var unit = this.getScaleUnit(0.56);
        shadow.anchor.set(0.5);
        shadow.scale.set(unit);
        shadow.alpha = 0.9;
        this._container.addChildAt(shadow, 0);
      }
    }, {
      key: 'createSliceGraphic',
      value: function createSliceGraphic(radius, start, end, stroke, strokeColor, strokeOpacity) {
        var slice = new PIXI.Graphics();
        slice.lineStyle(stroke, strokeColor || 0x000000, strokeOpacity || 0.5);
        slice.beginFill(0x000000, 0);
        var startAngle = utils.degToRad(start);
        var endAngle = utils.degToRad(end);
        slice.moveTo(0, 0);
        slice.arc(0, 0, radius, startAngle, endAngle, false);
        slice.endFill();
        return slice;
      }
    }, {
      key: 'createColorPattern',
      value: function createColorPattern(color) {
        var pattern = new PIXI.Sprite(this.sources[color].texture);
        var unit = this.getScaleUnit(0.6);
        pattern.anchor.set(0.5);
        pattern.scale.set(unit);
        return pattern;
      }
    }, {
      key: 'scaleSpinner',
      value: function scaleSpinner() {
        var _this4 = this;

        TweenLite.to(this._container, 0.2, {
          ease: 'Cubic.easeOut',
          pixi: { scaleX: 0.87, scaleY: 0.87 },
          onComplete: function onComplete() {
            TweenLite.to(_this4._container, 0.2, {
              ease: 'Cubic.easeOut',
              pixi: { scaleX: 0.85, scaleY: 0.85 }
            });
          }
        });
      }
    }, {
      key: 'fade',
      value: function fade(obj, from, to) {
        var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.3;
        var callback = arguments[4];

        obj.alpha = from;
        TweenLite.to(obj, duration, {
          ease: 'Cubic.easeOut',
          pixi: { alpha: to },
          onComplete: callback
        });
      }
    }, {
      key: 'createSlice',
      value: function createSlice(radius, start, end, data, index, txt) {
        var slice = new PIXI.Container();
        var pattern = this.createColorPattern(data.path);
        var lighter = this.createColorPattern(data.lighter);
        var mask = this.createSliceGraphic(radius, start, end, 0);

        var text = new PIXI.Text(txt, {
          fontFamily: 'Poppins, Arial, sans-serif',
          lineHeight: 18,
          fontSize: 22,
          fill: 0x000000,
          align: 'center'
        });

        var radians = utils.degToRad(end - 30);
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var distance = radius - radius * 0.35;
        var x = distance * cos - 0 * sin;
        var y = 0 * cos + distance * sin;

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
    }, {
      key: 'createSlices',
      value: function createSlices() {
        var _this5 = this;

        var slices = new PIXI.Container();
        var radius = this._size * 0.49;

        if (this.data.hasSlices) {
          var sliceDeg = 360 / this.data.sliceCount;
          var sliceData = this.data.slices.map(function (data, index) {
            var start = index * sliceDeg;
            var end = (index + 1) * sliceDeg;
            var slice = _this5.createSlice(radius, start, end, data, index, texts[index]);
            var border = _this5.createSliceGraphic(radius, start, end, 3, 0x000000, 1);
            slice.name = 'slice' + index;
            return [slice, border];
          });

          sliceData.map(function (data) {
            return slices.addChild(data[0]);
          });
          sliceData.map(function (data) {
            return slices.addChild(data[1]);
          });
        } else {
          var circle = new PIXI.Graphics();
          circle.lineStyle(1, 0x000000, 0.3);
          circle.beginFill(0xFFFFFF, 1);
          circle.drawCircle(0, 0, radius);
          circle.endFill();
          circle.name = 'default';
          slices.addChild(circle);
        }

        this._objects.slices = slices;
      }
    }, {
      key: 'createNeedle',
      value: function createNeedle() {
        var texture = this.sources[assets.needle].texture;
        var needle = new PIXI.Sprite(texture);
        needle.anchor.set(0.5, 0.5);
        needle.scale.set(this.getScaleUnit(0.55));
        var angle = this.rnd.between(0, 360);
        needle.rotation = utils.degToRad(angle);
        this._objects.needle = needle;
      }
    }, {
      key: 'createHexagon',
      value: function createHexagon() {
        var _Array$prototype;

        var polygon = new PIXI.Graphics();
        polygon.beginFill(0x000000, 0);
        polygon.lineStyle(3, 0x000000);

        // find hexagon points position:
        // x' = x cos(θ) − y sin(θ)
        // y'= y cos(θ) + x sin(θ)

        var radius = this._size * 0.49;
        var angles = [60, 120, 180, 240, 300, 360, 60];
        var point = [radius, 0];
        var points = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, _toConsumableArray(angles.map(function (deg) {
          var radians = utils.degToRad(deg);
          var cos = Math.cos(radians);
          var sin = Math.sin(radians);
          return [point[0] * cos - point[1] * sin, point[1] * cos + point[0] * sin];
        })));

        polygon.drawPolygon(points);
        polygon.endFill();
        return polygon;
      }
    }, {
      key: 'createContainer',
      value: function createContainer() {
        this._container = new PIXI.Container();
        this._container.name = 'tomatodo';

        var spinner = new PIXI.Container();
        spinner.name = 'spinner';

        for (var name in this._objects) {
          if (this._objects.hasOwnProperty(name)) {
            var sprite = this._objects[name];
            sprite.name = name;
            spinner.addChild(sprite);
          }
        }

        var hexagon = this.createHexagon();
        var border = this.createHexagon();
        spinner.addChild(hexagon);
        spinner.addChild(border);
        spinner.mask = hexagon;

        var x = this.renderer.width / 2;
        var y = this.renderer.height / 2;
        this._container.position.set(x, y);
        this._container.addChild(spinner);
      }
    }, {
      key: 'resize',
      value: function resize() {
        var width = this._parent.clientWidth;
        var height = this._parent.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.stage.scale.x = this.stage.scale.y = height / this._size;
        this.renderer.resize(width, height);
      }
    }, {
      key: 'show',
      value: function show() {
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
    }, {
      key: 'onSpinStart',
      value: function onSpinStart() {
        var emit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        this._spinning = true;
        this.data.updateSpinCount();
        if (emit) this.events.emit('spin:start', this.data.spinCount);
      }
    }, {
      key: 'onSpinComplete',
      value: function onSpinComplete(degrees) {
        var _this6 = this;

        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var sliceData = this.data.getLandedSliceData(degrees);
        this._spinning = false;

        if (animate) {
          this._objects.needle.rotation = utils.degToRad(degrees);

          var slice = this._objects.slices.getChildAt(sliceData.index);
          var lighter = slice.getChildAt(2);

          var alpha = 0.5;
          var blinkIn = this.fade.bind(this, lighter, 0, alpha, 0.3);
          var blinkOut = this.fade.bind(this, lighter, alpha, 0, 0.3);
          var blink = function blink(cb) {
            return blinkIn(blinkOut.bind(_this6, cb));
          };

          blink(blink.bind(this, blink.bind(this, function () {
            return _this6.events.emit('spin:end');
          })));
        }

        this.data.record(this.data.spinCount, sliceData.color);
      }
    }, {
      key: 'spin',
      value: function spin(spinSimulationCount) {
        var _this7 = this;

        if (!this._ready) return;
        if (isNaN(spinSimulationCount)) spinSimulationCount = 1;

        if (spinSimulationCount > 1) {
          for (var i = 0; i < spinSimulationCount - 1; i++) {
            var degrees = this.rnd.between(0, 359);
            this.onSpinStart(false);
            this.onSpinComplete(degrees, false);
          }

          this.spin();
        } else {
          var rounds = this.rnd.between(3, 5);
          var _degrees = this.rnd.between(0, 359);
          var angle = 360 * rounds + _degrees;
          var duration = 120 * Math.sqrt(angle) / 1000;
          var tween = new TweenLite(this._objects.needle, duration, {
            ease: 'Cubic.easeOut',
            pixi: { rotation: angle },
            immediateRender: false,
            onStart: function onStart() {
              return _this7.onSpinStart();
            },
            onComplete: function onComplete() {
              tween.kill();
              _this7.onSpinComplete(_degrees);
              _this7.events.emit('history:update', _this7.data.history);
            }
          });
        }
      }
    }]);

    return Game;
  }();

  var EventEmitter = function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this._stack = {};
    }

    _createClass(EventEmitter, [{
      key: 'on',
      value: function on(event, callback) {
        if (!(typeof callback === 'function')) throw new Error('callback must be a function');
        if (!this._stack[event]) this._stack[event] = {};
        if (!this._stack[event].on) this._stack[event].on = [];
        this._stack[event].on.push(callback);
      }
    }, {
      key: 'once',
      value: function once(event, callback) {
        if (!(typeof callback === 'function')) throw new Error('callback must be a function');
        if (!this._stack[event]) this._stack[event] = {};
        if (!this._stack[event].once) this._stack[event].once = [];
        this._stack[event].once.push(callback);
      }
    }, {
      key: 'off',
      value: function off(event) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (event) {
          if (this._stack[event]) {
            if (callback !== null) {
              if (typeof callback === 'function') {
                var _stack$event = this._stack[event],
                    _stack$event$on = _stack$event.on,
                    on = _stack$event$on === undefined ? [] : _stack$event$on,
                    _stack$event$once = _stack$event.once,
                    once = _stack$event$once === undefined ? [] : _stack$event$once;

                var index = on.indexOf(callback);
                this._stack[event].on = index > -1 ? [].concat(_toConsumableArray(on.slice(0, index)), _toConsumableArray(on.slice(index + 1))) : on;
                index = once.indexOf(callback);
                this._stack[event].once = index > -1 ? [].concat(_toConsumableArray(once.slice(0, index)), _toConsumableArray(once.slice(index + 1))) : once;
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
    }, {
      key: 'emit',
      value: function emit() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var event = args[0];

        var _ref2 = this._stack[event] || {},
            _ref2$on = _ref2.on,
            on = _ref2$on === undefined ? [] : _ref2$on,
            _ref2$once = _ref2.once,
            once = _ref2$once === undefined ? [] : _ref2$once;

        for (var i = 0; i < on.length; i += 1) {
          var callback = on[i];
          callback.apply(callback, args.slice(1));
        }

        while (once.length) {
          var _callback = once.shift();
          _callback.apply(_callback, args.slice(1));
        }
      }
    }, {
      key: 'getEventHandlers',
      value: function getEventHandlers(event) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'on';

        if (!event) return this._stack;
        if (!this._stack[event]) return [];
        var events = this._stack[event][type] || [];
        return [].concat(_toConsumableArray(events));
      }
    }]);

    return EventEmitter;
  }();

  return { Game: Game, colors: colors };
}();
