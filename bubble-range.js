"use strict";
var BubbleRange = function() {

    function BubbleRange(dataRange) {
        var self = this;
        this.dataRange = dataRange;
        initValidateBubble(this.dataRange, validateBubble);
        this.size = this.dataRange.size.split('px')[0];
        this.bubble = undefined;
        this.init();
        var dataRange = {
            backgroundColorControl: this.dataRange.backgroundColorControl,
            parent: self.bubble,
            size: self.size,
            indent: self.dataRange.indent
        };
        // create range
        var range = new Range(dataRange);
    }

    BubbleRange.prototype.init = function () {
        var container = document.querySelector(this.dataRange.wrapper);
        this.bubble = document.createElement('div');
        this.bubble.classList.add('bubble-range');
        this.bubble.style.width = this.dataRange.size;
        this.bubble.style.height = this.dataRange.size;
        this.bubble.style.backgroundColor = this.dataRange.backgroundColor;
        container.appendChild(this.bubble);
    };

     function Range(data) {
         this.data = data;
         this.container = data.parent;
         this.containerSize = data.size;
         this.indent = data.indent;
         this.bobbleRangeControl = undefined;
         this.init();
     }

    Range.prototype.init = function () {
        this.bobbleRangeControl = document.createElement('div');
        this.bobbleRangeControl.classList.add('bubble-range__control');
        this.bobbleRangeControl.style.width = setSizeControl(this.containerSize) + 'px';
        this.bobbleRangeControl.style.height = setSizeControl(this.containerSize)+ 'px';
        this.bobbleRangeControl.style.backgroundColor = this.data.backgroundColorControl;
        this.container.appendChild(this.bobbleRangeControl);
        this.addEvents();
    };

    Range.prototype.addEvents = function () {
        var heightElement = this.bobbleRangeControl.clientHeight;
        var startPoint = 0;
        var isDown = false;
        var self = this;

        function mouseDown() {
            // addClassElement(self.bobbleRangeControl, 'bubble-range__control--active');
            isDown = true;
        }
        function mouseUpLeave() {
            deleteClassElement(self.bobbleRangeControl, 'bubble-range__control--active');
            isDown = false;
        }
        function mouseMove(event) {
            if (isDown) {
                addClassElement(self.bobbleRangeControl, 'bubble-range__control--active');
                if (!startPoint) {
                    startPoint = event.clientY;
                }
                if (startPoint >= event.clientY) {
                    var currentHeight = startPoint - event.clientY + heightElement;
                    if (validateHeight(currentHeight)) {
                        self.bobbleRangeControl.style.width = currentHeight + 'px';
                        self.bobbleRangeControl.style.height = currentHeight + 'px';
                        self.showRangeValue(currentHeight);
                        console.log('showRangeValue', self.showRangeValue(Number(currentHeight)));
                    }
                }
            }
        }
        function validateHeight(height) {
            if (height <= self.containerSize - self.indent) {
                return true;
            }
        }

        this.bobbleRangeControl.addEventListener('mousedown', mouseDown);
        this.bobbleRangeControl.addEventListener('mouseup', mouseUpLeave);
        this.bobbleRangeControl.addEventListener('mousemove', mouseMove);
        this.container.addEventListener('mousemove', mouseMove);
        this.container.addEventListener('mouseleave', mouseUpLeave);
    };

    Range.prototype.showRangeValue = function (currentSize) {
       return (currentSize - setSizeControl(this.containerSize)) * 100 / (this.containerSize - setSizeControl(this.containerSize) - this.indent);
    };

    var validateBubble = {
        size: function (data) {
            if ( !data.size || data.size < 150) {
                data.size = '300px';
            }
        },
        backgroundColor: function (data) {
            if ( !data.backgroundColorBubble) {
                data.backgroundColor = '#4314FF';
            }
        },
        backgroundColorControl: function (data) {
            if ( !data.backgroundColorControl) {
                data.backgroundColorControl = '#C75C84';
            }
        },
        indent: function (data) {
            if ( !data.indent) {
                data.indent = 10;
            }
        }
    };

    function initValidateBubble(data, obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                obj[prop](data);
            }
        }
    }

    function addClassElement(element, name) {
        element.classList.add(name);
    }

    function deleteClassElement(element, name) {
        element.classList.remove(name);
    }

    function setSizeControl (size) {
        return size * 20 / 100;
    }


    return BubbleRange;
}();