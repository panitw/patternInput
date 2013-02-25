(function ($) {

    function hitTest(state, x, y) {
        var columnHit = -1;
        var rowHit = -1;
        if (((x - state.border) % state.dotHSpace) <= state.dotSize) {
            columnHit = Math.floor((x - state.border) / state.dotHSpace);
            if (columnHit > state.horizontalDots - 1) {
                columnHit = -1;
            }
        }
        if (((y - state.border) % state.dotVSpace) <= state.dotSize) {
            rowHit = Math.floor((y - state.border) / state.dotVSpace);
            if (rowHit > state.verticalDots - 1) {
                rowHit = -1;
            }
        }
        if (columnHit > -1 && rowHit > -1) {
            return ((rowHit * state.horizontalDots) + columnHit);
        } else {
            return -1;
        }
    }

    function getPosition(state, index) {
        var row = Math.floor(index / state.horizontalDots);
        var col = index - (row * state.horizontalDots);
        var x = (col * state.dotHSpace) + state.border + (state.dotSize / 2);
        var y = (row * state.dotVSpace) + state.border + (state.dotSize / 2);
        return [x, y];
    }

    function clearSelection(state) {
        var canvas = state.canvas[0];
        canvas.width = canvas.width;
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = state.pathColor;
        ctx.lineWidth = state.pathSize;
        for (var i = 0; i < state.dots.length; i++) {
            state.dots[i].removeClass("selected");
        }
    }

    function renderPath(state) {
        if (state.value && state.value.length > 1) {
            var ctx = state.canvas[0].getContext("2d");
            for (var i = 0; i < (state.value.length - 1); i++) {
                var pos1 = getPosition(state, state.value[i]);
                var pos2 = getPosition(state, state.value[i + 1]);
                ctx.moveTo(pos1[0], pos1[1]);
                ctx.lineTo(pos2[0], pos2[1]);
                ctx.stroke();
            }
        }
    }

    function processTouchStart(state, x, y) {
        state.value = [];
        clearSelection(state);
        var hitAt = hitTest(state, x, y);
        if (hitAt > -1) {
            state.value.push(hitAt);
            state.lastHit = hitAt;
            state.dots[hitAt].addClass("selected");
            state.onChange(state.value);
            state.logger("onChange: SEQ=" + state.value.join(","));
        }
    }

    function processTouchMove(state, x, y) {
        var hitAt = hitTest(state, x, y);
        if (hitAt > -1) {
            if (state.lastHit != hitAt) {
                state.value.push(hitAt);
                state.lastHit = hitAt;
                state.dots[hitAt].addClass("selected");
                state.logger("onChange: SEQ=" + state.value.join(","));
                renderPath(state);
                setTimeout(function() {
                    state.onChange(state.value);
                },10);
            }
        }
    }

    function processTouchEnd(state) {
        if (state.value && state.value.length > 0) {
            state.lastSequence = state.value;
            setTimeout(function() {
                state.onFinish(state.value);
            },10);
            if (state.autoClear) {
                clearSelection(state);
            }
            state.logger("onFinish: SEQ=" + state.value.join(","));
        }
    }

    var methods = {
        init: function (options) {
            var newOptions = $.extend({
                width: 300,
                height: 300,
                border: 20,
                verticalDots: 3,
                horizontalDots: 3,
                dotSize: 60,
                innerDotSize: 20,
                pathSize: 20,
                autoClear: true,
                pathColor: "#AAAAAA",
                onChange: function () { },
                onFinish: function () { },
                logger: function () { }
            }, options);

            return this.each(function () {
                var $this = $(this);
                if (this.tagName == "DIV") {

                    //Fix CSS stuffs to correct the display and dragging.
                    $this.attr('unselectable', 'on').css('user-select', 'none');                    
                    if ($this.css("position") == "static") {
                        $this.css("position", "relative");
                    }

                    var state = $this.data("patternInput");
                    if (!state) {
                        //Save all options as the state of this plug-in to each DOM element
                        state = newOptions;
                        $this.data("patternInput", state);
                        $this.empty();
                        $this.addClass("patternInput");
                        $this.width(state.width)
                             .height(state.height);

                        //Create a new canvas for Path drawing
                        state.canvas = $('<canvas width="' + state.width + '" height="' + state.height + '" style="position:absolute;left:0px;top:0px;"></canvas>');
                        $this.append(state.canvas);
                        var ctx = state.canvas[0].getContext("2d");
                        ctx.strokeStyle = state.pathColor;
                        ctx.lineWidth = state.pathSize;

                        //Create new DIVs for each dot and also hook the event
                        state.dots = [];
                        var divStart = state.border;
                        var runnerX = divStart;
                        var runnerY = divStart;
                        state.dotHSpace = ((state.width - state.dotSize) - (state.border * 2)) / (state.horizontalDots - 1);
                        state.dotVSpace = ((state.height - state.dotSize) - (state.border * 2)) / (state.verticalDots - 1);
                        for (var j = 0; j < state.verticalDots; j++) {
                            for (var i = 0; i < state.horizontalDots; i++) {
                                var newDiv = $('<div class="dot" style="width:' + state.dotSize + 'px;' +
                                                                                   'height:' + state.dotSize + 'px;' +
                                                                                   'position: absolute; ' +
                                                                                   'left:' + runnerX + 'px; ' +
                                                                                   'top:' + runnerY + 'px;">' +
                                                                                   '<div class="innerDot" style="position:absolute;' +
                                                                                                                'width:' + state.innerDotSize + 'px;' +
                                                                                                                'height:' + state.innerDotSize + 'px;' +
                                                                                                                'left:' + (state.dotSize - state.innerDotSize) / 2 + 'px; ' +
                                                                                                                'top:' + (state.dotSize - state.innerDotSize) / 2 + 'px;">' +
                                                                                   '</div>' +
                                                                                   '</div>');
                                $this.append(newDiv);
                                state.dots.push(newDiv);
                                runnerX += state.dotHSpace;
                            }
                            runnerX = divStart;
                            runnerY += state.dotVSpace;
                        }

                        $this.on("mousedown", function (event) {
                            var relativeX = event.pageX - this.offsetLeft;
                            var relativeY = event.pageY - this.offsetTop;
                            state.mouseDown = true;
                            processTouchStart(state, relativeX, relativeY);
                        });
                        $this.on("mousemove", function (event) {
                            if (state.mouseDown == true) {
                                var relativeX = event.pageX - this.offsetLeft;
                                var relativeY = event.pageY - this.offsetTop;
                                processTouchMove(state, relativeX, relativeY);
                            }
                        });
                        $this.on("mouseup", function (event) {
                            if (state.mouseDown == true) {
                                state.mouseDown = false;
                                processTouchEnd(state);
                            }
                        });
                        $(document).on("mouseup", function (event) {
                            if (state.mouseDown == true) {
                                state.mouseDown = false;
                                processTouchEnd(state);
                            }
                        });
                        $this.on("touchstart", function (event) {
                            var relativeX = event.originalEvent.targetTouches[0].pageX - this.offsetLeft;
                            var relativeY = event.originalEvent.targetTouches[0].pageY - this.offsetTop;
                            processTouchStart(state, relativeX, relativeY);
                            state.touchDown = true;
                        });
                        $this.on("touchmove", function (event) {
                            var relativeX = event.originalEvent.targetTouches[0].pageX - this.offsetLeft;
                            var relativeY = event.originalEvent.targetTouches[0].pageY - this.offsetTop;
                            processTouchMove(state, relativeX, relativeY);
                        });
                        $this.on("touchend", function (event) {
                            processTouchEnd(state);
                        });
                    }
                }
            });
        },
        clear: function() {
            var state = this.data("patternInput");
            clearSelection(state);
            return this;
        },
        getLastSequence: function() {
            var state = this.data("patternInput");
            return state.lastSequence;
        }
    }

    $.fn.patternInput = function (arg) {

        if (methods[arg]) {
            return methods[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        } else
            if (typeof arg === 'object' || !arg) {
                return methods.init.apply(this, arguments);
            } else {
                $.error("Invalid method call. Method '" + arg + "' does not exist on jQuery.patternInput");
            }
    };

})(jQuery);