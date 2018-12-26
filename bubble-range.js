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
            indent: self.dataRange.indent,
            opacity: self.dataRange.opacity
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
        this.bubble.style.opacity = this.dataRange.opacity;
        container.appendChild(this.bubble);
    };

     function Range(data) {
         this.data = data;
         this.bobbleRangeControl;
         this.init();
     }

    Range.prototype.init = function () {
        this.bobbleRangeControl = document.createElement('div');
        this.bobbleRangeControl.classList.add('bubble-range__control');
        this.bobbleRangeControl.style.width = setSizeControl(this.data.size) + 'px';
        this.bobbleRangeControl.style.height = setSizeControl(this.data.size)+ 'px';
        this.bobbleRangeControl.style.backgroundColor = this.data.backgroundColorControl;
        this.data.parent.appendChild(this.bobbleRangeControl);
        this.addEvents();
        this.addEventsMobile();
    };

    Range.prototype.addEvents = function () {
        var heightElement = setSizeControl(this.data.size);
        var startPoint = 0;
        var isDown = false;
        var self = this;
        var differentOpacity = 1 - this.data.opacity;

        function mouseDown() {
            addClassElement(self.bobbleRangeControl, 'bubble-range__control--active');
            isDown = true;
        }
        function mouseUpLeave() {
            deleteClassElement(self.bobbleRangeControl, 'bubble-range__control--active');
            isDown = false;
        }
        function mouseMove(event) {
            if (isDown) {
                if (!startPoint) {
                    startPoint = event.clientY;
                }
                if (startPoint >= event.clientY) {
                    var currentHeight = startPoint - event.clientY + heightElement;
                    if (validateHeight(currentHeight, self.data.size, self.data.indent)) {
                        self.bobbleRangeControl.style.width = currentHeight + 'px';
                        self.bobbleRangeControl.style.height = currentHeight + 'px';
                        self.changeOpacity(self.showRangeValue(Number(currentHeight)), differentOpacity);
                        self.showRangeValue(currentHeight);
                        BubbleRange.test = self.showRangeValue(currentHeight);
                        // console.log('showRangeValue', self.showRangeValue(Number(currentHeight)));
                    }
                }
            }
        }

        this.bobbleRangeControl.addEventListener('mousedown', mouseDown);
        this.bobbleRangeControl.addEventListener('mouseup', mouseUpLeave);
        this.bobbleRangeControl.addEventListener('mousemove', mouseMove);
        this.data.parent.addEventListener('mousemove', mouseMove);
        this.data.parent.addEventListener('mouseleave', mouseUpLeave);
    };

    Range.prototype.addEventsMobile = function() {
        var heightElement = setSizeControl(this.data.size);
        var startPoint = 0;
        var self = this;
        var differentOpacity = 1 - this.data.opacity;

        function touchMove(event) {
            // console.log('event', event);
            if (!startPoint) {
                startPoint = event.targetTouches[0].pageY;
            }
            if (startPoint >= event.targetTouches[0].pageY) {
                var currentHeight = startPoint - event.targetTouches[0].pageY + heightElement;
                console.log('currentHeight', currentHeight);
                if (validateHeight(currentHeight, self.data.size, self.data.indent)) {
                    self.bobbleRangeControl.style.width = currentHeight + 'px';
                    self.bobbleRangeControl.style.height = currentHeight + 'px';
                    self.showRangeValue(currentHeight);
                    // console.log('showRangeValue', self.showRangeValue(Number(currentHeight)));
                }
            }
        }

        this.bobbleRangeControl.addEventListener('touchmove', touchMove);
    };

    Range.prototype.showRangeValue = function (currentSize) {
       return (currentSize - setSizeControl(this.data.size)) * 100 / (this.data.size - setSizeControl(this.data.size) - this.data.indent);
    };

    Range.prototype.changeOpacity = function (currentValue, differentOpacity) {
        console.log('currentValue', currentValue);
        var opacityValue = differentOpacity * currentValue / 100;
        console.log('opacityValue', opacityValue);
        this.data.parent.style.opacity = this.data.opacity + opacityValue;
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
        },
        opacity: function (data) {
            if ( !data.opacity) {
                data.opacity = 0.9;
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

    function validateHeight(height, sizeElement, indent) {
        if (height <= sizeElement - indent) {
            return true;
        }
    }

    return BubbleRange;
}();