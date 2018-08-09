'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    darkDefaultColor: 'images/color-default-dark.jpg'
  };

  var colors = {
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
    }
  };

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

  var EditionModeController = function () {
    function EditionModeController(editionMode, allowedColors) {
      var maxSliceCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;

      _classCallCheck(this, EditionModeController);

      if (editionMode) {
        this._maxSliceCount = maxSliceCount;

        if (allowedColors) {
          this._allowedColors = allowedColors.map(function (_ref2) {
            var color = _ref2.color;
            return color;
          });
        } else {
          this._allowedColors = Object.keys(colors);
        }
      }
    }

    _createClass(EditionModeController, [{
      key: 'initEditionMode',
      value: function initEditionMode() {
        this._select = document.getElementById('select');
        this._select.addEventListener('change', this._onSelectionChange.bind(this));
        this._onSelectionChange();
      }
    }, {
      key: '_onSelectionChange',
      value: function _onSelectionChange() {
        var sections = Number(this._select.value);
        this.events.emit('edition:on');
        this.events.emit('section:change', sections);
      }
    }]);

    return EditionModeController;
  }();

  var Game = function (_EditionModeControlle) {
    _inherits(Game, _EditionModeControlle);

    function Game(size, parent) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Game);

      var _this2 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, config.editionMode, config.allowedColors, config.maxSliceCount));

      _this2.data = new DataManager(config.slices);
      _this2._size = size;
      _this2._baseSize = 450;
      _this2._config = config;
      _this2._container = null;
      _this2._objects = {};
      _this2._ready = false;

      if (!parent) _this2._parent = document.body;else if (utils.isElement(parent)) _this2._parent = parent;else _this2._parent = document.querySelector(parent);

      var seed = [(Date.now() * Math.random()).toString()];
      _this2.rnd = new RandomDataGenerator(seed);
      _this2.events = new EventEmitter();

      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      var _config$forceCanvas = config.forceCanvas,
          forceCanvas = _config$forceCanvas === undefined ? true : _config$forceCanvas;

      if (isSafari) forceCanvas = false;

      _this2._core = new PIXI.Application({
        forceCanvas: forceCanvas,
        width: _this2._size,
        height: _this2._size,
        antialias: true,
        transparent: true,
        autoResize: true,
        resolution: 1
      });

      _this2.canvas = _this2._core.view;
      _this2.renderer = _this2._core.renderer;
      _this2.stage = _this2._core.stage;

      _this2.init();
      return _this2;
    }

    _createClass(Game, [{
      key: 'init',
      value: function init() {
        var _this3 = this;

        this.preload(assets, function () {
          _this3.create();
          _this3.addGenericHandlers();
          _this3.show();

          if (_this3._config.editionMode) {
            _this3.events.on('edition:on', _this3.enableEditionMode.bind(_this3));
            _this3.events.on('edition:off', _this3.disableEditionMode.bind(_this3));
            _this3.events.on('section:change', _this3.changeSlices.bind(_this3));
            _this3.initEditionMode();
          }

          _this3._ready = true;
          _this3.events.emit('ready');
        });
      }
    }, {
      key: 'preload',
      value: function preload(assets, done) {
        var _this4 = this;

        var list = [];

        for (var name in assets) {
          if (assets.hasOwnProperty(name)) {
            list.push(assets[name]);
          }
        }

        PIXI.loader.add(list).load(function () {
          _this4.sources = PIXI.loader.resources;
          done();
        });
      }
    }, {
      key: 'addGenericHandlers',
      value: function addGenericHandlers() {
        var _this5 = this;

        if (this._config.editionMode) {
          this.stage.interactive = true;
          this.stage.click = function (e) {
            _this5.stage.__clicked = true;

            if (e.target !== _this5._objects.popup) {
              if (!_this5._objects.popup.__opening) {
                _this5.closePopupColors();
              } else {
                _this5._objects.popup.__opening = false;
              }

              if (_this5._objects.slices.children.indexOf(e.target) === -1) {
                _this5.deactivateSlices();
              }
            }
          };

          document.addEventListener('click', function (e) {
            if (e.target !== _this5.canvas || !_this5.stage.__clicked) {
              _this5.closePopupColors();
              _this5.deactivateSlices();
            }

            _this5.stage.__clicked = false;
          });
        }
      }
    }, {
      key: 'create',
      value: function create() {
        this.createShadow();
        this.createSlices();
        this.createNeedle();
        if (this._config.editionMode) this.createPopupColors();
        this.createContainer();
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
        var unit = this.getScaleUnit(0.55);
        shadow.anchor.set(0.5);
        shadow.scale.set(unit);
        shadow.alpha = 0.7;
        this._objects.shadow = shadow;
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
        var _this6 = this;

        TweenLite.to(this._container, 0.2, {
          ease: 'Cubic.easeOut',
          pixi: { scaleX: 0.87, scaleY: 0.87 },
          onComplete: function onComplete() {
            TweenLite.to(_this6._container, 0.2, {
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
      key: 'highlightAt',
      value: function highlightAt(index) {
        var child = this._objects.slices.getChildAt(index);
        this.fade(child.getChildAt(2), 0, 1);
        child.active = true;
      }
    }, {
      key: 'deactivateSlices',
      value: function deactivateSlices() {
        var _this7 = this;

        this._objects.slices.children.forEach(function (child, index) {
          if (child.active) {
            _this7.fade(child.getChildAt(2), 1, 0);
            child.active = false;
          }
        });
      }
    }, {
      key: 'highlightEmptySlices',
      value: function highlightEmptySlices() {
        var _this8 = this;

        this.data.getEmptySlices().forEach(function (_ref3) {
          var index = _ref3.index;

          var emptySlice = _this8._objects.slices.getChildAt(index);
          _this8.fade(emptySlice, 1, 0.7, 0.2, function () {
            _this8.fade(emptySlice, 0.7, 1, 0.2);
          });
        });
      }
    }, {
      key: 'addSliceHandlers',
      value: function addSliceHandlers(slice, index) {
        var _this9 = this;

        slice.click = function (e) {
          if (!slice.active) {
            _this9.deactivateSlices();
            _this9.fade(slice.getChildAt(2), 0, 1);
          }

          _this9.openPopupColors(e, index);
          slice.active = true;
        };

        // const isDefaultColor = () =>
        //   this.data.getSliceAt(index).color === colors.DEFAULT.color;

        slice.mouseover = function () {
          if (!slice.active) slice.alpha = 0.85;
        };

        slice.mouseout = function () {
          slice.alpha = 1;
        };
      }
    }, {
      key: 'createPopupColors',
      value: function createPopupColors() {
        var _this10 = this;

        var popup = new PIXI.Container();
        var background = new PIXI.Graphics();
        var border = new PIXI.Graphics();
        var text = new PIXI.Text('Choose color:', {
          fontSize: 18,
          fontFamily: 'Arial'
        });

        var length = this._allowedColors.length;
        var padding = 10;
        var colorSize = 50;
        var textSize = 21;
        var bgHeight = padding * 3 + textSize + colorSize;
        var bgWidth = padding * (length + 1) + length * colorSize;

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

        this._allowedColors.forEach(function (color, i) {
          var colorGroup = new PIXI.Container();
          var colorTexture = _this10.sources[colors[color].path].texture;
          var colorPattern = new PIXI.Sprite(colorTexture);
          var colorRect = new PIXI.Graphics();
          colorRect.beginFill(0xFFFFFF, 1);
          colorRect.drawRoundedRect(0, 0, colorSize, colorSize, 10);
          colorRect.endFill();
          colorPattern.mask = colorRect;
          colorGroup.addChild(colorRect);
          colorGroup.addChild(colorPattern);
          popup.addChild(colorGroup);
          var x = padding * (i + 1) + i * colorSize;
          var y = textSize + padding * 2;
          colorGroup.position.set(x, y);
          colorGroup.name = color;
          popup.__colors.push(colorGroup);
        });

        popup.alpha = 0;
        popup.scale.set(this.getScaleUnit(1));
        this._objects.popup = popup;
      }
    }, {
      key: 'openPopupColors',
      value: function openPopupColors(e, index) {
        var _this11 = this;

        var popup = this._objects.popup;

        popup.interactive = true;
        popup.__opening = true;

        popup.__colors.forEach(function (color) {
          color.interactive = true;
          color.buttonMode = true;
          color.click = function () {
            _this11.updateSlice(index, colors[color.name]);
            _this11.closePopupColors();
          };
        });

        var _e$data$getLocalPosit = e.data.getLocalPosition(popup.parent),
            x = _e$data$getLocalPosit.x,
            y = _e$data$getLocalPosit.y;

        popup.position.set(x, y);
        this.checkOffScreenPopup();
        this.fade(popup, 0, 1, 0.3);
      }
    }, {
      key: 'checkOffScreenPopup',
      value: function checkOffScreenPopup() {
        var popup = this._objects.popup;

        var size = this.canvas.width;
        var bounds = popup.getBounds();

        if (bounds.right > size) {
          popup.position.set(popup.x - (bounds.right - size + 20), popup.y);
        }

        if (bounds.bottom > size) {
          popup.position.set(popup.x, popup.y - (bounds.bottom - size + 20));
        }
      }
    }, {
      key: 'closePopupColors',
      value: function closePopupColors() {
        if (this._config.editionMode) {
          var popup = this._objects.popup;

          popup.__colors.forEach(function (_color) {
            _color.interactive = false;
            _color.buttonMode = false;
            _color.click = null;
          });

          popup.interactive = false;

          if (popup.alpha !== 0) this.fade(popup, 1, 0, 0.3);
        }
      }
    }, {
      key: 'createSlice',
      value: function createSlice(radius, start, end, data, index) {
        var slice = new PIXI.Container();
        var pattern = this.createColorPattern(data.path);
        var darker = this.createColorPattern(data.darker);
        var lighter = this.createColorPattern(data.lighter);
        var mask = this.createSliceGraphic(radius, start, end, 0);
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
    }, {
      key: 'createSlices',
      value: function createSlices() {
        var _this12 = this;

        var slices = new PIXI.Container();
        var radius = this._size * 0.49;

        if (this.data.hasSlices) {
          var sliceDeg = 360 / this.data.sliceCount;
          var sliceData = this.data.slices.map(function (data, index) {
            var start = index * sliceDeg;
            var end = (index + 1) * sliceDeg;
            var isDefault = data.color === colors.DEFAULT.color;
            var stroke = void 0;
            var opacity = void 0;

            if (isDefault) {
              stroke = 0x000000;
              opacity = 0.15;
            } else {
              stroke = 0xFFFFFF;
              opacity = 1;
            }

            var slice = _this12.createSlice(radius, start, end, data, index);
            var border = _this12.createSliceGraphic(radius, start, end, 1, stroke, opacity);
            slice.name = 'slice' + index;
            border.name = 'border' + index;
            slice.border = border;

            if (_this12._config.editionMode) {
              _this12.addSliceHandlers(slice, index);
            }

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

        slices.rotation = -Math.PI / 2;
        this._objects.slices = slices;
        this.setInteractivity();
      }
    }, {
      key: 'createNeedle',
      value: function createNeedle() {
        var texture = this.sources[assets.needle].texture;
        var needle = new PIXI.Sprite(texture);
        needle.anchor.set(0.5, 0.5);
        needle.scale.set(this.getScaleUnit(0.6));
        var angle = this.rnd.between(0, 360);
        needle.rotation = utils.degToRad(angle);
        this._objects.needle = needle;

        var blurTexture = this.sources[assets.blur].texture;
        var blur = new PIXI.Sprite(blurTexture);
        blur.anchor.set(0.5, 0.5);
        blur.scale.set(this.getScaleUnit(0.6));
        blur.alpha = 0;

        var centerTexture = this.sources[assets.center].texture;
        var center = new PIXI.Sprite(centerTexture);
        center.anchor.set(0.5, 0.5);
        center.scale.set(this.getScaleUnit(0.3));
        this._objects.blur = blur;
        this._objects.center = center;
      }
    }, {
      key: 'createContainer',
      value: function createContainer() {
        this._container = new PIXI.Container();
        this._container.name = 'spinner';

        for (var name in this._objects) {
          if (this._objects.hasOwnProperty(name)) {
            var sprite = this._objects[name];
            sprite.name = name;
            this._container.addChild(sprite);
          }
        }

        var x = this.renderer.width / 2;
        var y = this.renderer.height / 2;
        this._container.position.set(x, y);
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
      key: 'destroyOldSlices',
      value: function destroyOldSlices() {
        if (this._objects.slices) {
          this._container.removeChild(this._objects.slices);
          this._objects.slices.destroy();
          this._objects.slices = null;
        }
      }
    }, {
      key: 'appendNewSlices',
      value: function appendNewSlices() {
        this.createSlices();
        this._container.addChildAt(this._objects.slices, 1);
      }
    }, {
      key: 'addSlice',
      value: function addSlice(index, data) {
        this.destroyOldSlices();
        this.data.addSliceAt(index, data);
        this.appendNewSlices();
      }
    }, {
      key: 'removeSlice',
      value: function removeSlice(index) {
        this.destroyOldSlices();
        this.data.removeSliceAt(index);
        this.appendNewSlices();
      }
    }, {
      key: 'changeSlices',
      value: function changeSlices(quantity) {
        this.destroyOldSlices();
        this.data.emptySlices();
        for (var index = 0; index < quantity; index++) {
          this.data.addSliceAt(index, colors.DEFAULT);
        }this.appendNewSlices();
      }
    }, {
      key: 'updateSlice',
      value: function updateSlice(index, data) {
        if (data.color === this.data.getSliceAt(index).color) return;
        var newData = this.data.updateSliceAt(index, data);
        var oldSlice = this._objects.slices.getChildAt(index);
        var oldBorder = oldSlice.border;
        var bIndex = this._objects.slices.children.indexOf(oldBorder);

        this._objects.slices.removeChild(oldSlice);
        this._objects.slices.removeChild(oldBorder);

        oldSlice.destroy();
        oldBorder.destroy();

        var radius = this._size * 0.49;
        var sliceDeg = 360 / this.data.sliceCount;
        var start = index * sliceDeg;
        var end = (index + 1) * sliceDeg;
        var slice = this.createSlice(radius, start, end, data, index);
        slice.name = 'slice' + index;
        this.addSliceHandlers(slice, index);
        this._objects.slices.addChildAt(slice, index);

        var border = this.createSliceGraphic(radius, start, end, 1, 0xFFFFFF, 1);
        border.name = 'border' + index;
        slice.border = border;
        this._objects.slices.addChildAt(border, bIndex);

        slice.interactive = this._editing;
        slice.buttonMode = this._editing;
        slice.active = false;

        this.events.emit('edition:change', this.data.readyToSpin);
      }
    }, {
      key: 'setInteractivity',
      value: function setInteractivity() {
        var _this13 = this;

        this._objects.slices.children.forEach(function (child) {
          if (child.name === 'default' || /border\d/g.test(child.name)) return;
          child.interactive = _this13._editing;
          child.buttonMode = _this13._editing;
        });
      }
    }, {
      key: 'enableEditionMode',
      value: function enableEditionMode() {
        this._editing = true;
        this.scaleSpinner();
        this.setInteractivity();
        this.data.resetHistory();
        this.events.emit('history:update', this.data.history);
      }
    }, {
      key: 'disableEditionMode',
      value: function disableEditionMode() {
        this._editing = false;
        this.setInteractivity();
        this.data.save();
      }
    }, {
      key: 'onSpinStart',
      value: function onSpinStart() {
        var emit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var duration = arguments[1];

        this._spinning = true;
        this.data.updateSpinCount();
        if (emit) this.events.emit('spin:start', duration);
      }
    }, {
      key: 'onSpinComplete',
      value: function onSpinComplete(degrees) {
        var _this14 = this;

        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var sliceData = this.data.getLandedSliceData(degrees);
        this._spinning = false;

        if (animate) {
          this._objects.needle.rotation = utils.degToRad(degrees);

          var slice = this._objects.slices.getChildAt(sliceData.index);
          var lighter = slice.getChildAt(3);

          var alpha = 0.5;
          var blinkIn = this.fade.bind(this, lighter, 0, alpha, 0.3);
          var blinkOut = this.fade.bind(this, lighter, alpha, 0, 0.3);
          var blink = function blink(cb) {
            return blinkIn(blinkOut.bind(_this14, cb));
          };

          blink(blink.bind(this, blink.bind(this, function () {
            return _this14.events.emit('spin:end');
          })));
        }

        this.data.record(this.data.spinCount, sliceData.color);
      }
    }, {
      key: 'resetHistory',
      value: function resetHistory() {
        if (this.data.history.length) {
          this.data.resetHistory();
          this.events.emit('history:update', this.data.history);
        }
      }
    }, {
      key: 'spin',
      value: function spin(spinSimulationCount) {
        var _this15 = this;

        if (!this._ready) return;

        var _config = this._config,
            editionMode = _config.editionMode,
            _config$blurMotion = _config.blurMotion,
            blurMotion = _config$blurMotion === undefined ? {} : _config$blurMotion;


        if (editionMode) this.events.emit('edition:off');
        if (isNaN(spinSimulationCount)) spinSimulationCount = 1;

        this.deactivateSlices();

        if (spinSimulationCount > 1) {
          for (var i = 0; i < spinSimulationCount - 1; i++) {
            var degrees = this.rnd.between(0, 359);
            this.onSpinStart(false);
            this.onSpinComplete(degrees, false);
          }

          var fadeTime = this.spin(1);
          this.events.emit('simulations:end', this.data.history, fadeTime);
        } else {
          var _blurMotion$addRounds = blurMotion.addRounds,
              addRounds = _blurMotion$addRounds === undefined ? 0 : _blurMotion$addRounds,
              _blurMotion$fadeTimeU = blurMotion.fadeTimeUnit,
              fadeTimeUnit = _blurMotion$fadeTimeU === undefined ? 10 : _blurMotion$fadeTimeU,
              _blurMotion$fadeAlpha = blurMotion.fadeAlphaUnit,
              fadeAlphaUnit = _blurMotion$fadeAlpha === undefined ? 0.5 : _blurMotion$fadeAlpha,
              _blurMotion$enable = blurMotion.enable,
              enable = _blurMotion$enable === undefined ? false : _blurMotion$enable;

          var rounds = this.rnd.between(3 + addRounds, 5 + addRounds);
          var _degrees = this.rnd.between(0, 359);
          var angle = 360 * rounds + _degrees;
          var duration = 120 * Math.sqrt(angle) / 1000;
          var _fadeTime = fadeTimeUnit * Math.sqrt(angle) / 1000;
          var tween = new TweenLite(this._objects.needle, duration, {
            ease: 'Cubic.easeOut',
            pixi: { rotation: angle },
            onStart: function onStart() {
              if (enable) {
                _this15.fade(_this15._objects.needle, 1, 0, 1);
                _this15.fade(_this15._objects.blur, 0, fadeAlphaUnit, _fadeTime, function () {
                  _this15.fade(_this15._objects.needle, 0, 1, 1);
                  _this15.fade(_this15._objects.blur, fadeAlphaUnit, 0, _fadeTime);
                });
              }

              _this15.onSpinStart(true, _fadeTime);
            },
            onComplete: function onComplete() {
              tween.kill();
              _this15.onSpinComplete(_degrees);
              _this15.events.emit('history:update', _this15.data.history);
            }
          });

          return _fadeTime;
        }
      }
    }]);

    return Game;
  }(EditionModeController);

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

        var _ref4 = this._stack[event] || {},
            _ref4$on = _ref4.on,
            on = _ref4$on === undefined ? [] : _ref4$on,
            _ref4$once = _ref4.once,
            once = _ref4$once === undefined ? [] : _ref4$once;

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
