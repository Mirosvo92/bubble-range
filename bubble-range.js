"use strict";
var BubbleRange = function() {

    function BubbleRange(dataRange) {
        this.dataRange = dataRange;
        initValidateBubble(this.dataRange, validateBubble);
        initValidateBubble(this.dataRange, validateBubble);
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
        bobbleRangeControl.style.width = setSizeControl(this.dataRange.size) + 'px';
        bobbleRangeControl.style.height = setSizeControl(this.dataRange.size)+ 'px';
        bobbleRangeControl.style.backgroundColor = this.dataRange.backgroundColorControl;
        bubbleRange.appendChild(bobbleRangeControl);
    };

    var validateBubble = {
        size: function (data) {
            if ( !data.size || data.size < 150) {
                data.size = '150px';
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
        var size = size.split('px')[0];
        return size * 20 / 100;
    }

    
    return BubbleRange;
}();