"use strict";
var BubbleRange = function() {

    function BubbleRange(dataRange) {
        this.dataRange = dataRange;
        initValidateBubble(this.dataRange, validateBubble);
        this.size = this.dataRange.size.split('px')[0];
        this.init();
    }

    BubbleRange.prototype.init = function () {
        var wrapperElement = document.querySelector(this.dataRange.wrapper);
        var bobbleRange = document.createElement('div');
        bobbleRange.classList.add('bubble-range');
        bobbleRange.style.width = this.dataRange.size;
        bobbleRange.style.height = this.dataRange.size;
        bobbleRange.style.backgroundColor = this.dataRange.backgroundColor;
        wrapperElement.appendChild(bobbleRange);
        this.initRange();
    };

    BubbleRange.prototype.initRange = function () {
        var bubbleRange = document.querySelector('.bubble-range');
        var bobbleRangeControl = document.createElement('div');
        bobbleRangeControl.classList.add('bubble-range__control');
        bobbleRangeControl.style.width = setSizeControl(this.size) + 'px';
        bobbleRangeControl.style.height = setSizeControl(this.size)+ 'px';
        bobbleRangeControl.style.backgroundColor = this.dataRange.backgroundColorControl;
        bubbleRange.appendChild(bobbleRangeControl);
        this.addEvents(bobbleRangeControl, bubbleRange);
    };

    BubbleRange.prototype.addEvents = function (element, parentElement) {
        var heightElement = element.clientHeight;
        var startPoint = 0;
        var isDown = false;
        var self = this;

        function mouseDown() {
            isDown = true;
        }
        function mouseUpLeave() {
            isDown = false;
        }
        function mouseMove(event) {
            console.log('isDown', isDown);
            if (isDown) {
                console.log('startPoint', startPoint);
                if (!startPoint) {
                    startPoint = event.clientY;
                }
                if (startPoint >= event.clientY) {
                    var currentHeight = startPoint - event.clientY + heightElement;
                    if (validateHeight(currentHeight)) {
                        element.style.width = currentHeight + 'px';
                        element.style.height = currentHeight + 'px';
                    }
                }
            }
        }
        function validateHeight(height) {
            if (height <= self.size - 10) {
                return true;
            }
        }

        element.addEventListener('mousedown', mouseDown);
        element.addEventListener('mouseup', mouseUpLeave);
        element.addEventListener('mousemove', mouseMove);
        parentElement.addEventListener('mousemove', mouseMove);
        parentElement.addEventListener('mouseleave', mouseUpLeave);
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
        }
    };

    function initValidateBubble(data, obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                obj[prop](data);
            }
        }
    }

    function setSizeControl (size) {
        return size * 20 / 100;
    }

    function addClassElement() {

    }

    
    return BubbleRange;
}();