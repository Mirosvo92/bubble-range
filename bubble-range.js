var BubbleRange = function() {
    "use strict";

    function BubbleRange(dataRange) {
        this.dataRange = dataRange;
        initValidateBubble(this.dataRange, validateBubble);
        this.size = this.dataRange.size.split('px')[0];
        this.init();
        dataRange.parent = this.bubble;
        dataRange.size = this.size;
        // create range
        return new Range(dataRange);
    }

    BubbleRange.prototype.init = function () {
        var container = document.querySelector(this.dataRange.wrapper);
        this.bubble = document.createElement('div');
        this.bubble.classList.add('bubble-range');
        this.bubble.style.width = this.dataRange.size;
        this.bubble.style.height = this.dataRange.size;
        this.bubble.style.backgroundColor = this.dataRange.backgroundColorBubble;
        this.bubble.style.opacity = this.dataRange.opacity;
        container.appendChild(this.bubble);
    };

    function Range(data) {
         this.data = data;
         this.value = 0;
         this.init();
    }

    Range.prototype.init = function () {
        this.bobbleRangeControl = document.createElement('div');
        this.bobbleRangeControl.classList.add('bubble-range__control');
        this.bobbleRangeControl.style.width = setSizeControl(this.data.size) + 'px';
        this.bobbleRangeControl.style.height = setSizeControl(this.data.size)+ 'px';
        this.bobbleRangeControl.style.backgroundColor = this.data.backgroundColorControl;
        this.data.parent.appendChild(this.bobbleRangeControl);
        if (this.data.icon) {
            this.addIcon();
        }
        this.addEvents();
        if (this.data.description) {
            this.addDescription();
        }
        if (this.data.wrapperValue) {
            this.showValue(0);
        }
    };

    Range.prototype.addIcon = function () {
        this.icon = document.createElement('div');
        this.icon.classList.add('icon');
        this.data.parent.appendChild(this.icon);
    };

    Range.prototype.changeIconSize = function (current) {
        var dataScale = 1 + (current * 0.2 / 100);
        this.icon.style.transform = 'scale(' +  dataScale + ')';
    };

    Range.prototype.addDescription = function () {
        var description = document.createElement('div');
        description.classList.add('bubble-range__description');
        description.innerHTML = this.data.description;
        this.data.parent.appendChild(description);

    };

    Range.prototype.addEvents = function () {
        var heightElement = setSizeControl(this.data.size),
            startPoint = 0,
            isDown = false,
            self = this,
            differentOpacity = 1 - this.data.opacity;

        function mouseDown(event) {
           if (validateCoordinates(event.clientX, event.clientY, self.bobbleRangeControl)) {
               addClassElement(this.bobbleRangeControl, 'bubble-range__control--active');
               addClassElement(this.bobbleRangeControl.parentNode, 'bubble-range--active');
               isDown = true;
           }
        }

        function mouseUpLeave() {
            deleteClassElement(this.bobbleRangeControl, 'bubble-range__control--active');
            deleteClassElement(this.bobbleRangeControl.parentNode, 'bubble-range--active');
            isDown = false;
        }

        function mouseMove(event) {
            if (isDown) {
                if (!startPoint) {
                    startPoint = event.clientY;
                }
                if (startPoint >= event.clientY) {
                    var currentHeight = startPoint - event.clientY + heightElement;
                    if (validateHeight(currentHeight, this.data.size, this.data.indent)) {
                        setProperties.call(this, currentHeight, differentOpacity);
                    }
                }
            }
        }

        function touchMove(event) {
            if (!startPoint) {
                startPoint = event.targetTouches[0].pageY;
            }
            if (startPoint >= event.targetTouches[0].pageY) {
                var currentHeight = startPoint - event.targetTouches[0].pageY + heightElement;
                if (validateHeight(currentHeight, this.data.size, this.data.indent)) {
                    setProperties.call(this, currentHeight, differentOpacity);
                }
            }
        }

        function setProperties(currentHeight, differentOpacity) {
            this.bobbleRangeControl.style.width = currentHeight + 'px';
            this.bobbleRangeControl.style.height = currentHeight + 'px';
            this.changeIconSize(currentHeight);
            this.changeOpacity(this.showRangeValue(Number(currentHeight)), differentOpacity);
            this.showRangeValue(currentHeight);
            this.value = this.showRangeValue(Number(currentHeight));
            if (this.data.wrapperValue) {
                this.showValue(this.showRangeValue(Number(currentHeight)));
            }
        }

        this.data.parent.addEventListener('mousedown', mouseDown.bind(this));
        this.data.parent.addEventListener('mouseup', mouseUpLeave.bind(this));
        this.data.parent.addEventListener('mousemove', mouseMove.bind(this));
        this.data.parent.addEventListener('mouseleave', mouseUpLeave.bind(this));
        // mobile
        this.data.parent.addEventListener('touchmove', touchMove.bind(this));
    };

    Range.prototype.showRangeValue = function (currentSize) {
       return (currentSize - setSizeControl(this.data.size)) * 100 / (this.data.size - setSizeControl(this.data.size) - this.data.indent);
    };

    Range.prototype.changeOpacity = function (currentValue, differentOpacity) {
        var opacityValue = differentOpacity * currentValue / 100;
        this.data.parent.style.opacity = this.data.opacity + opacityValue + '';
    };

    Range.prototype.showValue = function (value) {
        if (!this.wrapperValue) {
            this.wrapperValue = document.querySelector(this.data.wrapperValue);
        }
        this.wrapperValue.innerHTML = Math.round(value) + '%';
    };


    var validateBubble = {
        size: function (data) {
            if ( !data.size || data.size < 150 || data.size > 500) {
                data.size = '400px';
            }
        },
        backgroundColor: function (data) {
            if ( !data.backgroundColorBubble) {
                data.backgroundColorBubble = '#4314FF';
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

    function validateCoordinates(xData, yData, element) {
        var currentCoordinates = element.getBoundingClientRect();
        if (xData >= currentCoordinates.x && yData >= currentCoordinates.y) {
            return true;
        }
    }

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