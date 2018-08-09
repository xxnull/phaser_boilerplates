/*This module is for Fillable Grid functionality
 *Developed by Lapiz
 *
 * V 0.8
 *
*/

window.FillableGrid = function(canvas, options){
    this.canvas = canvas;
    if (this.canvas) {
        this.options = options ? options : {};
        this.options.xCount = this.options.xCount ? this.options.xCount : 10;
        this.options.yCount = this.options.yCount ? this.options.yCount : 10;
        this.options.strokeThickness = this.options.strokeThickness?this.options.strokeThickness:2;
        this.options.strokeColor = this.options.strokeColor?this.options.strokeColor:"#000";
        this.options.fillColor = this.options.fillColor?this.options.fillColor:"#f00";
        this.options.totalCount = this.options.xCount*this.options.yCount;
        this.options.padding = this.options.padding ? this.options.padding:10;
        this.currentPosition = 1;
        this.context = null;
        this.isDown = false;
        this.init();
    }
}

FillableGrid.prototype={
    init:function(){
        this.context = this.canvas[0].getContext("2d");
        this.setHiDPICanvas(this.canvas[0], this.canvas.width(), this.canvas.height(), 2);
        var _this = this;
        if (this.isTouchDevice()) {
            this.canvas.bind("touchstart", function(event){ _this.onStart(event); });
            $(window).bind("touchmove", function(event){ _this.onMove(event); });
            $(window).bind("touchend", function(event){ _this.onEnd(event); });
        }
        else {
            this.canvas.bind("mousedown", function(event){ _this.onStart(event); });
            $(window).bind("mousemove", function(event){ _this.onMove(event); });
            $(window).bind("mouseup", function(event){ _this.onEnd(event); });
        }
        this.drawGrid();
    },
    drawGrid:function(){
        var initX = this.options.strokeThickness/2 + this.options.padding;
        var x = initX, y = this.options.strokeThickness/2 + this.options.padding;
        var canvasW = this.canvas.width()-this.options.strokeThickness - this.options.padding*2;
        var canvasH = this.canvas.height()-this.options.strokeThickness - this.options.padding*2;
        var w = canvasW/this.options.xCount;
        var h = canvasH/this.options.yCount;
        y += canvasH - h;
        this.context.clearRect(0,0,this.canvas.width(),this.canvas.height());
        this.context.strokeStyle = this.options.strokeColor;
        this.context.fillStyle = this.options.fillColor;
        this.context.lineWidth = this.options.strokeThickness;
        for(var b=0; b<this.options.totalCount; b++) {
            if (b%this.options.xCount == 0 && b) {
                x = initX;
                y -= h;
            }
            this.context.beginPath();
            this.context.rect(x, y, w, h);
            if (b < this.currentPosition) {
                this.context.fill();
            }
            this.context.stroke();
            x += w;
        }
    },
    onStart:function(event){
        this.isDown = true;
        var touches = this.touchCoordsFromEvent(event, true);
        this.onClick(touches[0]);
    },
    onMove:function(event){
        if (this.isDown) {
            var touches = this.touchCoordsFromEvent(event, false);
            this.onClick(touches[0]);
        }
    },
    onEnd:function(event){
        this.isDown = false;
    },
    onClick:function(point){
        point.x -= this.canvas.offset().left+this.options.strokeThickness/2+this.options.padding;
        point.y -= this.canvas.offset().top+this.options.strokeThickness/2+this.options.padding;
        var canvasW = this.canvas.width()-this.options.strokeThickness-this.options.padding*2;
        var canvasH = this.canvas.height()-this.options.strokeThickness-this.options.padding*2;
        var w = canvasW/this.options.xCount;
        var h = canvasH/this.options.yCount;
        var xIndex = Math.ceil((point.x/canvasW)*this.options.xCount)/this.options.xCount*10;
        var yIndex = Math.ceil((point.y/canvasW)*this.options.yCount)/this.options.yCount*10;
        
        if (xIndex < 0) xIndex = 0;
        else if (xIndex > this.options.xCount) xIndex = this.options.xCount;
        
        if (yIndex < 0) yIndex = 0;
        else if (yIndex > this.options.yIndex) yIndex = this.options.yIndex;
        yIndex = this.options.yCount - yIndex;
        var totalValue = yIndex*this.options.xCount+xIndex;
        this.currentPosition = totalValue;
        this.drawGrid();
    },
    touchCoordsFromEvent:function(event, isDown){
        var touches = [];
        if (isDown) {
            if (this.isTouchDevice())
                for (var tInd = 0; tInd < event.originalEvent.touches.length; tInd++)
                    touches[tInd] = { x: event.originalEvent.touches[tInd].pageX, y: event.originalEvent.touches[tInd].pageY };
            else touches[0] = { x: event.pageX, y: event.pageY };
        }
        else{
            if (this.isTouchDevice())
                for (var tInd = 0; tInd < event.originalEvent.changedTouches.length; tInd++)
                    touches[tInd] = { x: event.originalEvent.changedTouches[tInd].pageX, y: event.originalEvent.changedTouches[tInd].pageY };
            else touches[0] = { x: event.pageX, y: event.pageY };
        }
        return touches;
    },
    isTouchDevice: function () {
        return "ontouchstart" in document;
    },
    PixelRatio: function () {
        var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    },
    setHiDPICanvas: function (can, w, h, ratio) {
        if (!ratio) { ratio = this.PixelRatio(); }
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    },
}