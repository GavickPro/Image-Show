"use strict";

var _temporalUndefined = {};

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + " is not defined - temporal dead zone"); } return true; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var GKHotelTabs = _temporalUndefined;

    $(document).ready(function () {
        $(".gkIsWrapper-gk_hotel_tabs").each(function (i, wrapper) {
            return new (_temporalAssertDefined(GKHotelTabs, "GKHotelTabs", _temporalUndefined) && GKHotelTabs)($(wrapper));
        });
    });

    GKHotelTabs = (function () {
        function GKHotelTabs(wrapper) {
            _classCallCheck(this, _temporalAssertDefined(GKHotelTabs, "GKHotelTabs", _temporalUndefined) && GKHotelTabs);

            // configure instance
            this.wrapper = wrapper;
            this.ID = wrapper.attr("id");
            this.config = $Gavick[this.ID];
            this.config.animationTimer = false;
            this.config.blank = false;
            this.slides = [];
            this.links = [];
            this.imagesToLoad = [];
            this.currentSlide = 0;
            this.mode = wrapper.attr("data-mode");
            // load instance
            this.loadImages();
            this.initUI();
        }

        _createClass(_temporalAssertDefined(GKHotelTabs, "GKHotelTabs", _temporalUndefined) && GKHotelTabs, [{
            key: "initUI",

            // Add events to UI
            value: function initUI() {
                var _this = this;

                if (this.wrapper.find(".gkIsPrev").length) {
                    this.wrapper.find(".gkIsPrev").click(function (e) {
                        e.preventDefault();
                        _this.prev(true);
                    });
                    this.wrapper.find(".gkIsNext").click(function (e) {
                        e.preventDefault();
                        _this.next(true);
                    });
                }

                if (this.wrapper.find(".gkIsPagination").length) {
                    this.wrapper.find(".gkIsPagination li").each(function (i, li) {
                        $(li).click(function (e) {
                            e.preventDefault();
                            _this.rewind(i);
                        });
                    });
                }
            }
        }, {
            key: "loadImages",

            // Load images
            value: function loadImages() {
                var _this2 = this;

                if (this.mode !== "testimonial") {
                    // prepare images for the load
                    this.wrapper.find("figure").each(function (i, figure) {
                        var newImg = _temporalUndefined;

                        figure = $(figure);newImg = new jQuery("<img />");
                        (_temporalAssertDefined(newImg, "newImg", _temporalUndefined) && newImg).attr({
                            "title": figure.attr("data-title"),
                            "class": "gkIsSlide",
                            "style": "z-index: " + figure.attr("data-zindex") + ";",
                            "src": figure.attr("data-url")
                        });
                        _this2.links[i] = figure.attr("data-link");
                        _this2.imagesToLoad.push(_temporalAssertDefined(newImg, "newImg", _temporalUndefined) && newImg);
                        figure.append(_temporalAssertDefined(newImg, "newImg", _temporalUndefined) && newImg);
                    });
                    //
                    var time = setInterval(function () {
                        return _this2.waitForImages(time);
                    }, 1000);
                } else {
                    this.wrapper.find(".gkIsPreloader").remove();
                    this.prepareImages();
                }
            }
        }, {
            key: "waitForImages",

            // Wait for loaded images
            value: function waitForImages(time) {
                var process = _temporalUndefined;

                process = 0;
                $(this.imagesToLoad).each(function (i, el) {
                    if (el[0].complete) _temporalAssertDefined(process, "process", _temporalUndefined), process++;
                });

                if ((_temporalAssertDefined(process, "process", _temporalUndefined) && process) == this.imagesToLoad.length) {
                    clearInterval(time);
                    this.prepareImages();
                }
            }
        }, {
            key: "prepareImages",

            // Prepare slides based on the loaded images
            value: function prepareImages() {
                var _this3 = this;

                if (this.mode === "testimonial") {
                    var imgUrl = _temporalUndefined;
                    imgUrl = this.wrapper.find("figure").attr("data-url");
                    this.wrapper.css("background-image", "url(\"" + (_temporalAssertDefined(imgUrl, "imgUrl", _temporalUndefined) && imgUrl) + "\")");
                    this.wrapper.find("figure").each(function (i, figure) {
                        return $(figure).css("opacity", 1);
                    });
                    this.wrapper.find("figure").css("opacity", 1);
                    this.wrapper.find("figure").first().addClass("active");
                    this.wrapper.find("figure").each(function (i, el) {
                        return _this3.slides[i] = $(el);
                    });
                    this.animate(0, false);
                } else {
                    var initfig = _temporalUndefined;

                    this.wrapper.find("figure").each(function (i, figure) {
                        var img = _temporalUndefined;
                        var newDiv = _temporalUndefined;

                        figure = $(figure);img = figure.find("img");
                        newDiv = jQuery("<div>");
                        (_temporalAssertDefined(newDiv, "newDiv", _temporalUndefined) && newDiv).attr({
                            "class": "gkIsSlide",
                            "style": (_temporalAssertDefined(img, "img", _temporalUndefined) && img).attr("style"),
                            "title": (_temporalAssertDefined(img, "img", _temporalUndefined) && img).attr("title")
                        });
                        (_temporalAssertDefined(newDiv, "newDiv", _temporalUndefined) && newDiv).css("background-image", "url('" + (_temporalAssertDefined(img, "img", _temporalUndefined) && img).attr("src") + "')");
                        (_temporalAssertDefined(newDiv, "newDiv", _temporalUndefined) && newDiv).insertBefore(_temporalAssertDefined(img, "img", _temporalUndefined) && img);
                        figure.css("opacity", 0);
                        (_temporalAssertDefined(img, "img", _temporalUndefined) && img).remove();
                    });

                    setTimeout(function () {
                        _this3.wrapper.addClass("loaded").find(".gkIsPreloader").fadeOut();
                        _this3.wrapper.find("figure").each(function (i, figure) {
                            return $(figure).css("opacity", 1);
                        });
                        setTimeout(function () {
                            return _this3.wrapper.find(".gkIsPreloader").remove();
                        }, 1000);
                        _this3.wrapper.find("figure").css("opacity", 1);
                        _this3.wrapper.find("figure").first().addClass("active");
                    }, 400);

                    this.wrapper.find(".gkIsSlide").each(function (i, el) {
                        return _this3.slides[i] = $(el);
                    });initfig = $(this.slides[0]).parent().find("figcaption");
                    if (_temporalAssertDefined(initfig, "initfig", _temporalUndefined) && initfig) {
                        (_temporalAssertDefined(initfig, "initfig", _temporalUndefined) && initfig).delay(250).animate({ "opacity": 1 });
                    }
                }

                this.enableSlideLinks();
                this.enableAutoAnimation();
            }
        }, {
            key: "enableSlideLinks",

            // Enable slide links
            value: function enableSlideLinks() {
                var _this4 = this;

                var slides = _temporalUndefined;

                if (!this.config.slideLinks) {
                    return false;
                }slides = this.wrapper.find(".gkIsSlide");
                (_temporalAssertDefined(slides, "slides", _temporalUndefined) && slides).click(function (e) {
                    return window.location = _this4.links[_this4.currentSlide];
                });
                (_temporalAssertDefined(slides, "slides", _temporalUndefined) && slides).css("cursor", "pointer");
            }
        }, {
            key: "enableAutoAnimation",

            // Enable auto animation
            value: function enableAutoAnimation() {
                var _this5 = this;

                if (this.wrapper.attr("data-one-slide") != "true") {
                    this.config.animationTimer = setTimeout(function () {
                        return _this5.next();
                    }, this.config.animInterval);
                }
            }
        }, {
            key: "prev",

            // Show previous slide
            value: function prev() {
                var blank = _temporalUndefined;
                blank = arguments[0] === undefined ? false : arguments[0];

                this.animate(this.getNext("prev"), _temporalAssertDefined(blank, "blank", _temporalUndefined) && blank);
            }
        }, {
            key: "next",

            // Show next slide
            value: function next() {
                var blank = _temporalUndefined;
                blank = arguments[0] === undefined ? false : arguments[0];

                this.animate(this.getNext("next"), _temporalAssertDefined(blank, "blank", _temporalUndefined) && blank);
            }
        }, {
            key: "rewind",

            // Show nth slide
            value: function rewind(n) {
                this.animate(n, true);
            }
        }, {
            key: "animate",

            // Animate slides to the nextNum
            value: function animate(nextNum, setBlank) {
                var _this6 = this;

                var prev = _temporalUndefined;
                var next = _temporalUndefined;
                var prevfig = _temporalUndefined;

                prev = $(this.wrapper.find("figure").get(this.currentSlide));
                next = $(this.wrapper.find("figure").get(nextNum));
                prevfig = (_temporalAssertDefined(prev, "prev", _temporalUndefined) && prev).find("figcaption");
                if (_temporalAssertDefined(prevfig, "prevfig", _temporalUndefined) && prevfig) {
                    (_temporalAssertDefined(prevfig, "prevfig", _temporalUndefined) && prevfig).animate({ "opacity": 0 });
                }

                (_temporalAssertDefined(next, "next", _temporalUndefined) && next).attr("class", "animated");

                (_temporalAssertDefined(prev, "prev", _temporalUndefined) && prev).delay(this.config.animSpeed / 2).animate({ opacity: 0 }, this.config.animSpeed, function () {
                    return (_temporalAssertDefined(prev, "prev", _temporalUndefined) && prev).attr("class", "");
                });

                (_temporalAssertDefined(next, "next", _temporalUndefined) && next).animate({ opacity: 1 }, this.config.animSpeed, function () {
                    var nextfig = _temporalUndefined;
                    var pagination = _temporalUndefined;
                    nextfig = (_temporalAssertDefined(next, "next", _temporalUndefined) && next).find("figcaption");
                    pagination = _this6.wrapper.find(".gkIsPagination li");
                    (_temporalAssertDefined(next, "next", _temporalUndefined) && next).attr("class", "active");

                    if (_temporalAssertDefined(nextfig, "nextfig", _temporalUndefined) && nextfig) {
                        (_temporalAssertDefined(nextfig, "nextfig", _temporalUndefined) && nextfig).animate({ "opacity": 1 });
                    }

                    clearTimeout(_this6.config.animationTimer);

                    if (!_this6.oneLoop()) {
                        _this6.config.animationTimer = setTimeout(function () {
                            if (_this6.config.blank) {
                                _this6.config.blank = false;
                                clearTimeout(_this6.config.animationTimer);
                                _this6.config.animationTimer = setTimeout(function () {
                                    return _this6.next();
                                }, _this6.config.animInterval);
                            } else {
                                _this6.next();
                            }
                        }, _this6.config.animInterval);
                    }

                    _this6.currentSlide = nextNum;

                    if ((_temporalAssertDefined(pagination, "pagination", _temporalUndefined) && pagination).length) {
                        (_temporalAssertDefined(pagination, "pagination", _temporalUndefined) && pagination).removeClass("active");
                        $((_temporalAssertDefined(pagination, "pagination", _temporalUndefined) && pagination).get(_this6.currentSlide)).addClass("active");
                    }

                    if (setBlank) {
                        _this6.config.blank = true;
                    }
                });
            }
        }, {
            key: "getNext",

            // Get next slide number in a specific direction
            value: function getNext(dir) {
                var total = _temporalUndefined;
                var current = _temporalUndefined;
                var next = _temporalUndefined;

                total = this.slides.length;
                current = this.currentSlide;
                next = this.currentSlide === 0 ? (_temporalAssertDefined(total, "total", _temporalUndefined) && total) - 1 : (_temporalAssertDefined(current, "current", _temporalUndefined) && current) - 1;
                if (dir === "next") {
                    _temporalAssertDefined(_temporalAssertDefined(next, "next", _temporalUndefined) && next, "next", _temporalUndefined);

                    next = (_temporalAssertDefined(_temporalAssertDefined(current, "current", _temporalUndefined) && current, "current", _temporalUndefined) && (_temporalAssertDefined(current, "current", _temporalUndefined) && current)) < (_temporalAssertDefined(_temporalAssertDefined(total, "total", _temporalUndefined) && total, "total", _temporalUndefined) && (_temporalAssertDefined(total, "total", _temporalUndefined) && total)) - 1 ? (_temporalAssertDefined(_temporalAssertDefined(current, "current", _temporalUndefined) && current, "current", _temporalUndefined) && (_temporalAssertDefined(current, "current", _temporalUndefined) && current)) + 1 : 0;
                }

                return _temporalAssertDefined(next, "next", _temporalUndefined) && next;
            }
        }, {
            key: "oneLoop",

            // One loop mode
            value: function oneLoop() {
                var total = _temporalUndefined;
                var current = _temporalUndefined;
                var noLoop = _temporalUndefined;

                total = this.wrapper.find("figure").length;
                current = this.currentSlide;
                noLoop = this.wrapper.attr("data-no-loop");
                return (_temporalAssertDefined(noLoop, "noLoop", _temporalUndefined) && noLoop) == "true" && (_temporalAssertDefined(current, "current", _temporalUndefined) && current) == (_temporalAssertDefined(total, "total", _temporalUndefined) && total) - 1;
            }
        }]);

        return _temporalAssertDefined(GKHotelTabs, "GKHotelTabs", _temporalUndefined) && GKHotelTabs;
    })();
})(jQuery);