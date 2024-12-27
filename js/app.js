(() => {
    "use strict";
    var Events = function() {
        function Events(eventType, eventFunctions) {
            if (eventFunctions === void 0) eventFunctions = [];
            this._eventType = eventType;
            this._eventFunctions = eventFunctions;
        }
        Events.prototype.init = function() {
            var _this = this;
            this._eventFunctions.forEach((function(eventFunction) {
                if (typeof window !== "undefined") window.addEventListener(_this._eventType, eventFunction);
            }));
        };
        return Events;
    }();
    const events = Events;
    var Instances = function() {
        function Instances() {
            this._instances = {
                Accordion: {},
                Carousel: {},
                Collapse: {},
                Dial: {},
                Dismiss: {},
                Drawer: {},
                Dropdown: {},
                Modal: {},
                Popover: {},
                Tabs: {},
                Tooltip: {},
                InputCounter: {},
                CopyClipboard: {},
                Datepicker: {}
            };
        }
        Instances.prototype.addInstance = function(component, instance, id, override) {
            if (override === void 0) override = false;
            if (!this._instances[component]) {
                console.warn("Flowbite: Component ".concat(component, " does not exist."));
                return false;
            }
            if (this._instances[component][id] && !override) {
                console.warn("Flowbite: Instance with ID ".concat(id, " already exists."));
                return;
            }
            if (override && this._instances[component][id]) this._instances[component][id].destroyAndRemoveInstance();
            this._instances[component][id ? id : this._generateRandomId()] = instance;
        };
        Instances.prototype.getAllInstances = function() {
            return this._instances;
        };
        Instances.prototype.getInstances = function(component) {
            if (!this._instances[component]) {
                console.warn("Flowbite: Component ".concat(component, " does not exist."));
                return false;
            }
            return this._instances[component];
        };
        Instances.prototype.getInstance = function(component, id) {
            if (!this._componentAndInstanceCheck(component, id)) return;
            if (!this._instances[component][id]) {
                console.warn("Flowbite: Instance with ID ".concat(id, " does not exist."));
                return;
            }
            return this._instances[component][id];
        };
        Instances.prototype.destroyAndRemoveInstance = function(component, id) {
            if (!this._componentAndInstanceCheck(component, id)) return;
            this.destroyInstanceObject(component, id);
            this.removeInstance(component, id);
        };
        Instances.prototype.removeInstance = function(component, id) {
            if (!this._componentAndInstanceCheck(component, id)) return;
            delete this._instances[component][id];
        };
        Instances.prototype.destroyInstanceObject = function(component, id) {
            if (!this._componentAndInstanceCheck(component, id)) return;
            this._instances[component][id].destroy();
        };
        Instances.prototype.instanceExists = function(component, id) {
            if (!this._instances[component]) return false;
            if (!this._instances[component][id]) return false;
            return true;
        };
        Instances.prototype._generateRandomId = function() {
            return Math.random().toString(36).substr(2, 9);
        };
        Instances.prototype._componentAndInstanceCheck = function(component, id) {
            if (!this._instances[component]) {
                console.warn("Flowbite: Component ".concat(component, " does not exist."));
                return false;
            }
            if (!this._instances[component][id]) {
                console.warn("Flowbite: Instance with ID ".concat(id, " does not exist."));
                return false;
            }
            return true;
        };
        return Instances;
    }();
    var instances = new Instances;
    const dom_instances = instances;
    if (typeof window !== "undefined") window.FlowbiteInstances = instances;
    var __assign = void 0 && (void 0).__assign || function() {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var Default = {
        alwaysOpen: false,
        activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
        inactiveClasses: "text-gray-500 dark:text-gray-400",
        onOpen: function() {},
        onClose: function() {},
        onToggle: function() {}
    };
    var DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Accordion = function() {
        function Accordion(accordionEl, items, options, instanceOptions) {
            if (accordionEl === void 0) accordionEl = null;
            if (items === void 0) items = [];
            if (options === void 0) options = Default;
            if (instanceOptions === void 0) instanceOptions = DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : accordionEl.id;
            this._accordionEl = accordionEl;
            this._items = items;
            this._options = __assign(__assign({}, Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Accordion", this, this._instanceId, instanceOptions.override);
        }
        Accordion.prototype.init = function() {
            var _this = this;
            if (this._items.length && !this._initialized) {
                this._items.forEach((function(item) {
                    if (item.active) _this.open(item.id);
                    var clickHandler = function() {
                        _this.toggle(item.id);
                    };
                    item.triggerEl.addEventListener("click", clickHandler);
                    item.clickHandler = clickHandler;
                }));
                this._initialized = true;
            }
        };
        Accordion.prototype.destroy = function() {
            if (this._items.length && this._initialized) {
                this._items.forEach((function(item) {
                    item.triggerEl.removeEventListener("click", item.clickHandler);
                    delete item.clickHandler;
                }));
                this._initialized = false;
            }
        };
        Accordion.prototype.removeInstance = function() {
            dom_instances.removeInstance("Accordion", this._instanceId);
        };
        Accordion.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Accordion.prototype.getItem = function(id) {
            return this._items.filter((function(item) {
                return item.id === id;
            }))[0];
        };
        Accordion.prototype.open = function(id) {
            var _a, _b;
            var _this = this;
            var item = this.getItem(id);
            if (!this._options.alwaysOpen) this._items.map((function(i) {
                var _a, _b;
                if (i !== item) {
                    (_a = i.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(" "));
                    (_b = i.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(" "));
                    i.targetEl.classList.add("hidden");
                    i.triggerEl.setAttribute("aria-expanded", "false");
                    i.active = false;
                    if (i.iconEl) i.iconEl.classList.add("rotate-180");
                }
            }));
            (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
            (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
            item.triggerEl.setAttribute("aria-expanded", "true");
            item.targetEl.classList.remove("hidden");
            item.active = true;
            if (item.iconEl) item.iconEl.classList.remove("rotate-180");
            this._options.onOpen(this, item);
        };
        Accordion.prototype.toggle = function(id) {
            var item = this.getItem(id);
            if (item.active) this.close(id); else this.open(id);
            this._options.onToggle(this, item);
        };
        Accordion.prototype.close = function(id) {
            var _a, _b;
            var item = this.getItem(id);
            (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(" "));
            (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(" "));
            item.targetEl.classList.add("hidden");
            item.triggerEl.setAttribute("aria-expanded", "false");
            item.active = false;
            if (item.iconEl) item.iconEl.classList.add("rotate-180");
            this._options.onClose(this, item);
        };
        Accordion.prototype.updateOnOpen = function(callback) {
            this._options.onOpen = callback;
        };
        Accordion.prototype.updateOnClose = function(callback) {
            this._options.onClose = callback;
        };
        Accordion.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Accordion;
    }();
    function initAccordions() {
        document.querySelectorAll("[data-accordion]").forEach((function($accordionEl) {
            var alwaysOpen = $accordionEl.getAttribute("data-accordion");
            var activeClasses = $accordionEl.getAttribute("data-active-classes");
            var inactiveClasses = $accordionEl.getAttribute("data-inactive-classes");
            var items = [];
            $accordionEl.querySelectorAll("[data-accordion-target]").forEach((function($triggerEl) {
                if ($triggerEl.closest("[data-accordion]") === $accordionEl) {
                    var item = {
                        id: $triggerEl.getAttribute("data-accordion-target"),
                        triggerEl: $triggerEl,
                        targetEl: document.querySelector($triggerEl.getAttribute("data-accordion-target")),
                        iconEl: $triggerEl.querySelector("[data-accordion-icon]"),
                        active: $triggerEl.getAttribute("aria-expanded") === "true" ? true : false
                    };
                    items.push(item);
                }
            }));
            new Accordion($accordionEl, items, {
                alwaysOpen: alwaysOpen === "open" ? true : false,
                activeClasses: activeClasses ? activeClasses : Default.activeClasses,
                inactiveClasses: inactiveClasses ? inactiveClasses : Default.inactiveClasses
            });
        }));
    }
    if (typeof window !== "undefined") {
        window.Accordion = Accordion;
        window.initAccordions = initAccordions;
    }
    var collapse_assign = void 0 && (void 0).__assign || function() {
        collapse_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return collapse_assign.apply(this, arguments);
    };
    var collapse_Default = {
        onCollapse: function() {},
        onExpand: function() {},
        onToggle: function() {}
    };
    var collapse_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Collapse = function() {
        function Collapse(targetEl, triggerEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (triggerEl === void 0) triggerEl = null;
            if (options === void 0) options = collapse_Default;
            if (instanceOptions === void 0) instanceOptions = collapse_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._triggerEl = triggerEl;
            this._options = collapse_assign(collapse_assign({}, collapse_Default), options);
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Collapse", this, this._instanceId, instanceOptions.override);
        }
        Collapse.prototype.init = function() {
            var _this = this;
            if (this._triggerEl && this._targetEl && !this._initialized) {
                if (this._triggerEl.hasAttribute("aria-expanded")) this._visible = this._triggerEl.getAttribute("aria-expanded") === "true"; else this._visible = !this._targetEl.classList.contains("hidden");
                this._clickHandler = function() {
                    _this.toggle();
                };
                this._triggerEl.addEventListener("click", this._clickHandler);
                this._initialized = true;
            }
        };
        Collapse.prototype.destroy = function() {
            if (this._triggerEl && this._initialized) {
                this._triggerEl.removeEventListener("click", this._clickHandler);
                this._initialized = false;
            }
        };
        Collapse.prototype.removeInstance = function() {
            dom_instances.removeInstance("Collapse", this._instanceId);
        };
        Collapse.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Collapse.prototype.collapse = function() {
            this._targetEl.classList.add("hidden");
            if (this._triggerEl) this._triggerEl.setAttribute("aria-expanded", "false");
            this._visible = false;
            this._options.onCollapse(this);
        };
        Collapse.prototype.expand = function() {
            this._targetEl.classList.remove("hidden");
            if (this._triggerEl) this._triggerEl.setAttribute("aria-expanded", "true");
            this._visible = true;
            this._options.onExpand(this);
        };
        Collapse.prototype.toggle = function() {
            if (this._visible) this.collapse(); else this.expand();
            this._options.onToggle(this);
        };
        Collapse.prototype.updateOnCollapse = function(callback) {
            this._options.onCollapse = callback;
        };
        Collapse.prototype.updateOnExpand = function(callback) {
            this._options.onExpand = callback;
        };
        Collapse.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Collapse;
    }();
    function initCollapses() {
        document.querySelectorAll("[data-collapse-toggle]").forEach((function($triggerEl) {
            var targetId = $triggerEl.getAttribute("data-collapse-toggle");
            var $targetEl = document.getElementById(targetId);
            if ($targetEl) if (!dom_instances.instanceExists("Collapse", $targetEl.getAttribute("id"))) new Collapse($targetEl, $triggerEl); else new Collapse($targetEl, $triggerEl, {}, {
                id: $targetEl.getAttribute("id") + "_" + dom_instances._generateRandomId()
            }); else console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-collapse-toggle attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.Collapse = Collapse;
        window.initCollapses = initCollapses;
    }
    var carousel_assign = void 0 && (void 0).__assign || function() {
        carousel_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return carousel_assign.apply(this, arguments);
    };
    var carousel_Default = {
        defaultPosition: 0,
        indicators: {
            items: [],
            activeClasses: "bg-white dark:bg-gray-800",
            inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
        },
        interval: 3e3,
        onNext: function() {},
        onPrev: function() {},
        onChange: function() {}
    };
    var carousel_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Carousel = function() {
        function Carousel(carouselEl, items, options, instanceOptions) {
            if (carouselEl === void 0) carouselEl = null;
            if (items === void 0) items = [];
            if (options === void 0) options = carousel_Default;
            if (instanceOptions === void 0) instanceOptions = carousel_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : carouselEl.id;
            this._carouselEl = carouselEl;
            this._items = items;
            this._options = carousel_assign(carousel_assign(carousel_assign({}, carousel_Default), options), {
                indicators: carousel_assign(carousel_assign({}, carousel_Default.indicators), options.indicators)
            });
            this._activeItem = this.getItem(this._options.defaultPosition);
            this._indicators = this._options.indicators.items;
            this._intervalDuration = this._options.interval;
            this._intervalInstance = null;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Carousel", this, this._instanceId, instanceOptions.override);
        }
        Carousel.prototype.init = function() {
            var _this = this;
            if (this._items.length && !this._initialized) {
                this._items.map((function(item) {
                    item.el.classList.add("absolute", "inset-0", "transition-transform", "transform");
                }));
                if (this.getActiveItem()) this.slideTo(this.getActiveItem().position); else this.slideTo(0);
                this._indicators.map((function(indicator, position) {
                    indicator.el.addEventListener("click", (function() {
                        _this.slideTo(position);
                    }));
                }));
                this._initialized = true;
            }
        };
        Carousel.prototype.destroy = function() {
            if (this._initialized) this._initialized = false;
        };
        Carousel.prototype.removeInstance = function() {
            dom_instances.removeInstance("Carousel", this._instanceId);
        };
        Carousel.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Carousel.prototype.getItem = function(position) {
            return this._items[position];
        };
        Carousel.prototype.slideTo = function(position) {
            var nextItem = this._items[position];
            var rotationItems = {
                left: nextItem.position === 0 ? this._items[this._items.length - 1] : this._items[nextItem.position - 1],
                middle: nextItem,
                right: nextItem.position === this._items.length - 1 ? this._items[0] : this._items[nextItem.position + 1]
            };
            this._rotate(rotationItems);
            this._setActiveItem(nextItem);
            if (this._intervalInstance) {
                this.pause();
                this.cycle();
            }
            this._options.onChange(this);
        };
        Carousel.prototype.next = function() {
            var activeItem = this.getActiveItem();
            var nextItem = null;
            if (activeItem.position === this._items.length - 1) nextItem = this._items[0]; else nextItem = this._items[activeItem.position + 1];
            this.slideTo(nextItem.position);
            this._options.onNext(this);
        };
        Carousel.prototype.prev = function() {
            var activeItem = this.getActiveItem();
            var prevItem = null;
            if (activeItem.position === 0) prevItem = this._items[this._items.length - 1]; else prevItem = this._items[activeItem.position - 1];
            this.slideTo(prevItem.position);
            this._options.onPrev(this);
        };
        Carousel.prototype._rotate = function(rotationItems) {
            this._items.map((function(item) {
                item.el.classList.add("hidden");
            }));
            if (this._items.length === 1) {
                rotationItems.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10");
                rotationItems.middle.el.classList.add("translate-x-0", "z-20");
                return;
            }
            rotationItems.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
            rotationItems.left.el.classList.add("-translate-x-full", "z-10");
            rotationItems.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10");
            rotationItems.middle.el.classList.add("translate-x-0", "z-30");
            rotationItems.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-30");
            rotationItems.right.el.classList.add("translate-x-full", "z-20");
        };
        Carousel.prototype.cycle = function() {
            var _this = this;
            if (typeof window !== "undefined") this._intervalInstance = window.setInterval((function() {
                _this.next();
            }), this._intervalDuration);
        };
        Carousel.prototype.pause = function() {
            clearInterval(this._intervalInstance);
        };
        Carousel.prototype.getActiveItem = function() {
            return this._activeItem;
        };
        Carousel.prototype._setActiveItem = function(item) {
            var _a, _b;
            var _this = this;
            this._activeItem = item;
            var position = item.position;
            if (this._indicators.length) {
                this._indicators.map((function(indicator) {
                    var _a, _b;
                    indicator.el.setAttribute("aria-current", "false");
                    (_a = indicator.el.classList).remove.apply(_a, _this._options.indicators.activeClasses.split(" "));
                    (_b = indicator.el.classList).add.apply(_b, _this._options.indicators.inactiveClasses.split(" "));
                }));
                (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(" "));
                (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(" "));
                this._indicators[position].el.setAttribute("aria-current", "true");
            }
        };
        Carousel.prototype.updateOnNext = function(callback) {
            this._options.onNext = callback;
        };
        Carousel.prototype.updateOnPrev = function(callback) {
            this._options.onPrev = callback;
        };
        Carousel.prototype.updateOnChange = function(callback) {
            this._options.onChange = callback;
        };
        return Carousel;
    }();
    function initCarousels() {
        document.querySelectorAll("[data-carousel]").forEach((function($carouselEl) {
            var interval = $carouselEl.getAttribute("data-carousel-interval");
            var slide = $carouselEl.getAttribute("data-carousel") === "slide" ? true : false;
            var items = [];
            var defaultPosition = 0;
            if ($carouselEl.querySelectorAll("[data-carousel-item]").length) Array.from($carouselEl.querySelectorAll("[data-carousel-item]")).map((function($carouselItemEl, position) {
                items.push({
                    position,
                    el: $carouselItemEl
                });
                if ($carouselItemEl.getAttribute("data-carousel-item") === "active") defaultPosition = position;
            }));
            var indicators = [];
            if ($carouselEl.querySelectorAll("[data-carousel-slide-to]").length) Array.from($carouselEl.querySelectorAll("[data-carousel-slide-to]")).map((function($indicatorEl) {
                indicators.push({
                    position: parseInt($indicatorEl.getAttribute("data-carousel-slide-to")),
                    el: $indicatorEl
                });
            }));
            var carousel = new Carousel($carouselEl, items, {
                defaultPosition,
                indicators: {
                    items: indicators
                },
                interval: interval ? interval : carousel_Default.interval
            });
            if (slide) carousel.cycle();
            var carouselNextEl = $carouselEl.querySelector("[data-carousel-next]");
            var carouselPrevEl = $carouselEl.querySelector("[data-carousel-prev]");
            if (carouselNextEl) carouselNextEl.addEventListener("click", (function() {
                carousel.next();
            }));
            if (carouselPrevEl) carouselPrevEl.addEventListener("click", (function() {
                carousel.prev();
            }));
        }));
    }
    if (typeof window !== "undefined") {
        window.Carousel = Carousel;
        window.initCarousels = initCarousels;
    }
    var dismiss_assign = void 0 && (void 0).__assign || function() {
        dismiss_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return dismiss_assign.apply(this, arguments);
    };
    var dismiss_Default = {
        transition: "transition-opacity",
        duration: 300,
        timing: "ease-out",
        onHide: function() {}
    };
    var dismiss_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Dismiss = function() {
        function Dismiss(targetEl, triggerEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (triggerEl === void 0) triggerEl = null;
            if (options === void 0) options = dismiss_Default;
            if (instanceOptions === void 0) instanceOptions = dismiss_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._triggerEl = triggerEl;
            this._options = dismiss_assign(dismiss_assign({}, dismiss_Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Dismiss", this, this._instanceId, instanceOptions.override);
        }
        Dismiss.prototype.init = function() {
            var _this = this;
            if (this._triggerEl && this._targetEl && !this._initialized) {
                this._clickHandler = function() {
                    _this.hide();
                };
                this._triggerEl.addEventListener("click", this._clickHandler);
                this._initialized = true;
            }
        };
        Dismiss.prototype.destroy = function() {
            if (this._triggerEl && this._initialized) {
                this._triggerEl.removeEventListener("click", this._clickHandler);
                this._initialized = false;
            }
        };
        Dismiss.prototype.removeInstance = function() {
            dom_instances.removeInstance("Dismiss", this._instanceId);
        };
        Dismiss.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Dismiss.prototype.hide = function() {
            var _this = this;
            this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, "opacity-0");
            setTimeout((function() {
                _this._targetEl.classList.add("hidden");
            }), this._options.duration);
            this._options.onHide(this, this._targetEl);
        };
        Dismiss.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        return Dismiss;
    }();
    function initDismisses() {
        document.querySelectorAll("[data-dismiss-target]").forEach((function($triggerEl) {
            var targetId = $triggerEl.getAttribute("data-dismiss-target");
            var $dismissEl = document.querySelector(targetId);
            if ($dismissEl) new Dismiss($dismissEl, $triggerEl); else console.error('The dismiss element with id "'.concat(targetId, '" does not exist. Please check the data-dismiss-target attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.Dismiss = Dismiss;
        window.initDismisses = initDismisses;
    }
    function getWindow(node) {
        if (node == null) return window;
        if (node.toString() !== "[object Window]") {
            var ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
    }
    function isElement(node) {
        var OwnElement = getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
    }
    function isHTMLElement(node) {
        var OwnElement = getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
    }
    function isShadowRoot(node) {
        if (typeof ShadowRoot === "undefined") return false;
        var OwnElement = getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    var math_max = Math.max;
    var math_min = Math.min;
    var round = Math.round;
    function getUAString() {
        var uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map((function(item) {
            return item.brand + "/" + item.version;
        })).join(" ");
        return navigator.userAgent;
    }
    function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        if (includeScale === void 0) includeScale = false;
        if (isFixedStrategy === void 0) isFixedStrategy = false;
        var clientRect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
            scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
            scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
        }
        var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
            width,
            height,
            top: y,
            right: x + width,
            bottom: y + height,
            left: x,
            x,
            y
        };
    }
    function getWindowScroll(node) {
        var win = getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
            scrollLeft,
            scrollTop
        };
    }
    function getHTMLElementScroll(element) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }
    function getNodeScroll(node) {
        if (node === getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node); else return getHTMLElementScroll(node);
    }
    function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
    }
    function getDocumentElement(element) {
        return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
    }
    function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }
    function getComputedStyle_getComputedStyle(element) {
        return getWindow(element).getComputedStyle(element);
    }
    function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle_getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return scaleX !== 1 || scaleY !== 1;
    }
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (isFixed === void 0) isFixed = false;
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
            scrollLeft: 0,
            scrollTop: 0
        };
        var offsets = {
            x: 0,
            y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
            if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
            if (isHTMLElement(offsetParent)) {
                offsets = getBoundingClientRect(offsetParent, true);
                offsets.x += offsetParent.clientLeft;
                offsets.y += offsetParent.clientTop;
            } else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }
    function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
        if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width,
            height
        };
    }
    function getParentNode(element) {
        if (getNodeName(element) === "html") return element;
        return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
    }
    function getScrollParent(node) {
        if ([ "html", "body", "#document" ].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
        if (isHTMLElement(node) && isScrollParent(node)) return node;
        return getScrollParent(getParentNode(node));
    }
    function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (list === void 0) list = [];
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
        var win = getWindow(scrollParent);
        var target = isBody ? [ win ].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
    }
    function isTableElement(element) {
        return [ "table", "td", "th" ].indexOf(getNodeName(element)) >= 0;
    }
    function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || getComputedStyle_getComputedStyle(element).position === "fixed") return null;
        return element.offsetParent;
    }
    function getContainingBlock(element) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element)) {
            var elementCss = getComputedStyle_getComputedStyle(element);
            if (elementCss.position === "fixed") return null;
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) currentNode = currentNode.host;
        while (isHTMLElement(currentNode) && [ "html", "body" ].indexOf(getNodeName(currentNode)) < 0) {
            var css = getComputedStyle_getComputedStyle(currentNode);
            if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || [ "transform", "perspective" ].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode; else currentNode = currentNode.parentNode;
        }
        return null;
    }
    function getOffsetParent(element) {
        var window = getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle_getComputedStyle(offsetParent).position === "static") offsetParent = getTrueOffsetParent(offsetParent);
        if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle_getComputedStyle(offsetParent).position === "static")) return window;
        return offsetParent || getContainingBlock(element) || window;
    }
    var enums_top = "top";
    var bottom = "bottom";
    var right = "right";
    var left = "left";
    var auto = "auto";
    var basePlacements = [ enums_top, bottom, right, left ];
    var start = "start";
    var end = "end";
    var clippingParents = "clippingParents";
    var viewport = "viewport";
    var popper = "popper";
    var reference = "reference";
    var variationPlacements = basePlacements.reduce((function(acc, placement) {
        return acc.concat([ placement + "-" + start, placement + "-" + end ]);
    }), []);
    var enums_placements = [].concat(basePlacements, [ auto ]).reduce((function(acc, placement) {
        return acc.concat([ placement, placement + "-" + start, placement + "-" + end ]);
    }), []);
    var beforeRead = "beforeRead";
    var read = "read";
    var afterRead = "afterRead";
    var beforeMain = "beforeMain";
    var main = "main";
    var afterMain = "afterMain";
    var beforeWrite = "beforeWrite";
    var write = "write";
    var afterWrite = "afterWrite";
    var modifierPhases = [ beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite ];
    function order(modifiers) {
        var map = new Map;
        var visited = new Set;
        var result = [];
        modifiers.forEach((function(modifier) {
            map.set(modifier.name, modifier);
        }));
        function sort(modifier) {
            visited.add(modifier.name);
            var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
            requires.forEach((function(dep) {
                if (!visited.has(dep)) {
                    var depModifier = map.get(dep);
                    if (depModifier) sort(depModifier);
                }
            }));
            result.push(modifier);
        }
        modifiers.forEach((function(modifier) {
            if (!visited.has(modifier.name)) sort(modifier);
        }));
        return result;
    }
    function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce((function(acc, phase) {
            return acc.concat(orderedModifiers.filter((function(modifier) {
                return modifier.phase === phase;
            })));
        }), []);
    }
    function debounce(fn) {
        var pending;
        return function() {
            if (!pending) pending = new Promise((function(resolve) {
                Promise.resolve().then((function() {
                    pending = void 0;
                    resolve(fn());
                }));
            }));
            return pending;
        };
    }
    function mergeByName(modifiers) {
        var merged = modifiers.reduce((function(merged, current) {
            var existing = merged[current.name];
            merged[current.name] = existing ? Object.assign({}, existing, current, {
                options: Object.assign({}, existing.options, current.options),
                data: Object.assign({}, existing.data, current.data)
            }) : current;
            return merged;
        }), {});
        return Object.keys(merged).map((function(key) {
            return merged[key];
        }));
    }
    var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
        return !args.some((function(element) {
            return !(element && typeof element.getBoundingClientRect === "function");
        }));
    }
    function popperGenerator(generatorOptions) {
        if (generatorOptions === void 0) generatorOptions = {};
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper(reference, popper, options) {
            if (options === void 0) options = defaultOptions;
            var state = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
                modifiersData: {},
                elements: {
                    reference,
                    popper
                },
                attributes: {},
                styles: {}
            };
            var effectCleanupFns = [];
            var isDestroyed = false;
            var instance = {
                state,
                setOptions: function setOptions(setOptionsAction) {
                    var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
                    cleanupModifierEffects();
                    state.options = Object.assign({}, defaultOptions, state.options, options);
                    state.scrollParents = {
                        reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
                        popper: listScrollParents(popper)
                    };
                    var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
                    state.orderedModifiers = orderedModifiers.filter((function(m) {
                        return m.enabled;
                    }));
                    runModifierEffects();
                    return instance.update();
                },
                forceUpdate: function forceUpdate() {
                    if (isDestroyed) return;
                    var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
                    if (!areValidElements(reference, popper)) return;
                    state.rects = {
                        reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === "fixed"),
                        popper: getLayoutRect(popper)
                    };
                    state.reset = false;
                    state.placement = state.options.placement;
                    state.orderedModifiers.forEach((function(modifier) {
                        return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                    }));
                    for (var index = 0; index < state.orderedModifiers.length; index++) {
                        if (state.reset === true) {
                            state.reset = false;
                            index = -1;
                            continue;
                        }
                        var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                        if (typeof fn === "function") state = fn({
                            state,
                            options: _options,
                            name,
                            instance
                        }) || state;
                    }
                },
                update: debounce((function() {
                    return new Promise((function(resolve) {
                        instance.forceUpdate();
                        resolve(state);
                    }));
                })),
                destroy: function destroy() {
                    cleanupModifierEffects();
                    isDestroyed = true;
                }
            };
            if (!areValidElements(reference, popper)) return instance;
            instance.setOptions(options).then((function(state) {
                if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
            }));
            function runModifierEffects() {
                state.orderedModifiers.forEach((function(_ref) {
                    var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
                    if (typeof effect === "function") {
                        var cleanupFn = effect({
                            state,
                            name,
                            instance,
                            options
                        });
                        var noopFn = function noopFn() {};
                        effectCleanupFns.push(cleanupFn || noopFn);
                    }
                }));
            }
            function cleanupModifierEffects() {
                effectCleanupFns.forEach((function(fn) {
                    return fn();
                }));
                effectCleanupFns = [];
            }
            return instance;
        };
    }
    null && popperGenerator();
    var passive = {
        passive: true
    };
    function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
        var window = getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) scrollParents.forEach((function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
        }));
        if (resize) window.addEventListener("resize", instance.update, passive);
        return function() {
            if (scroll) scrollParents.forEach((function(scrollParent) {
                scrollParent.removeEventListener("scroll", instance.update, passive);
            }));
            if (resize) window.removeEventListener("resize", instance.update, passive);
        };
    }
    const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {},
        effect,
        data: {}
    };
    function getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function getVariation(placement) {
        return placement.split("-")[1];
    }
    function getMainAxisFromPlacement(placement) {
        return [ "top", "bottom" ].indexOf(placement) >= 0 ? "x" : "y";
    }
    function computeOffsets(_ref) {
        var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference.x + reference.width / 2 - element.width / 2;
        var commonY = reference.y + reference.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case enums_top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;

          case bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;

          case right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;

          case left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;

          default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
            var len = mainAxis === "y" ? "height" : "width";
            switch (variation) {
              case start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;

              case end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;

              default:
            }
        }
        return offsets;
    }
    function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
            reference: state.rects.reference,
            element: state.rects.popper,
            strategy: "absolute",
            placement: state.placement
        });
    }
    const modifiers_popperOffsets = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
    };
    var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function roundOffsetsByDPR(_ref, win) {
        var x = _ref.x, y = _ref.y;
        var dpr = win.devicePixelRatio || 1;
        return {
            x: round(x * dpr) / dpr || 0,
            y: round(y * dpr) / dpr || 0
        };
    }
    function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
        var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = enums_top;
        var win = window;
        if (adaptive) {
            var offsetParent = getOffsetParent(popper);
            var heightProp = "clientHeight";
            var widthProp = "clientWidth";
            if (offsetParent === getWindow(popper)) {
                offsetParent = getDocumentElement(popper);
                if (getComputedStyle_getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
                    heightProp = "scrollHeight";
                    widthProp = "scrollWidth";
                }
            }
            offsetParent;
            if (placement === enums_top || (placement === left || placement === right) && variation === end) {
                sideY = bottom;
                var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
                y -= offsetY - popperRect.height;
                y *= gpuAcceleration ? 1 : -1;
            }
            if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
                sideX = right;
                var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
                x -= offsetX - popperRect.width;
                x *= gpuAcceleration ? 1 : -1;
            }
        }
        var commonStyles = Object.assign({
            position
        }, adaptive && unsetSides);
        var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
            x,
            y
        }, getWindow(popper)) : {
            x,
            y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
            var _Object$assign;
            return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", 
            _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", 
            _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", 
        _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
    }
    function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
        var commonStyles = {
            placement: getBasePlacement(state.placement),
            variation: getVariation(state.placement),
            popper: state.elements.popper,
            popperRect: state.rects.popper,
            gpuAcceleration,
            isFixed: state.options.strategy === "fixed"
        };
        if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
        })));
        if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
        })));
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-placement": state.placement
        });
    }
    const modifiers_computeStyles = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
    };
    function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach((function(name) {
            var style = state.styles[name] || {};
            var attributes = state.attributes[name] || {};
            var element = state.elements[name];
            if (!isHTMLElement(element) || !getNodeName(element)) return;
            Object.assign(element.style, style);
            Object.keys(attributes).forEach((function(name) {
                var value = attributes[name];
                if (value === false) element.removeAttribute(name); else element.setAttribute(name, value === true ? "" : value);
            }));
        }));
    }
    function applyStyles_effect(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
            popper: {
                position: state.options.strategy,
                left: "0",
                top: "0",
                margin: "0"
            },
            arrow: {
                position: "absolute"
            },
            reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        return function() {
            Object.keys(state.elements).forEach((function(name) {
                var element = state.elements[name];
                var attributes = state.attributes[name] || {};
                var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                var style = styleProperties.reduce((function(style, property) {
                    style[property] = "";
                    return style;
                }), {});
                if (!isHTMLElement(element) || !getNodeName(element)) return;
                Object.assign(element.style, style);
                Object.keys(attributes).forEach((function(attribute) {
                    element.removeAttribute(attribute);
                }));
            }));
        };
    }
    const modifiers_applyStyles = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: applyStyles_effect,
        requires: [ "computeStyles" ]
    };
    function distanceAndSkiddingToXY(placement, rects, offset) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [ left, enums_top ].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, {
            placement
        })) : offset, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [ left, right ].indexOf(basePlacement) >= 0 ? {
            x: distance,
            y: skidding
        } : {
            x: skidding,
            y: distance
        };
    }
    function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset = _options$offset === void 0 ? [ 0, 0 ] : _options$offset;
        var data = enums_placements.reduce((function(acc, placement) {
            acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
            return acc;
        }), {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (state.modifiersData.popperOffsets != null) {
            state.modifiersData.popperOffsets.x += x;
            state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_offset = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: [ "popperOffsets" ],
        fn: offset
    };
    var hash = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, (function(matched) {
            return hash[matched];
        }));
    }
    var getOppositeVariationPlacement_hash = {
        start: "end",
        end: "start"
    };
    function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, (function(matched) {
            return getOppositeVariationPlacement_hash[matched];
        }));
    }
    function getViewportRect(element, strategy) {
        var win = getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            var layoutViewport = isLayoutViewport();
            if (layoutViewport || !layoutViewport && strategy === "fixed") {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
        return {
            width,
            height,
            x: x + getWindowScrollBarX(element),
            y
        };
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
        var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if (getComputedStyle_getComputedStyle(body || html).direction === "rtl") x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
        return {
            width,
            height,
            x,
            y
        };
    }
    function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) return true; else if (rootNode && isShadowRoot(rootNode)) {
            var next = child;
            do {
                if (next && parent.isSameNode(next)) return true;
                next = next.parentNode || next.host;
            } while (next);
        }
        return false;
    }
    function rectToClientRect(rect) {
        return Object.assign({}, rect, {
            left: rect.x,
            top: rect.y,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height
        });
    }
    function getInnerBoundingClientRect(element, strategy) {
        var rect = getBoundingClientRect(element, false, strategy === "fixed");
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
    }
    function getClientRectFromMixedType(element, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingParents(element) {
        var clippingParents = listScrollParents(getParentNode(element));
        var canEscapeClipping = [ "absolute", "fixed" ].indexOf(getComputedStyle_getComputedStyle(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) return [];
        return clippingParents.filter((function(clippingParent) {
            return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
        }));
    }
    function getClippingRect(element, boundary, rootBoundary, strategy) {
        var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
        var clippingParents = [].concat(mainClippingParents, [ rootBoundary ]);
        var firstClippingParent = clippingParents[0];
        var clippingRect = clippingParents.reduce((function(accRect, clippingParent) {
            var rect = getClientRectFromMixedType(element, clippingParent, strategy);
            accRect.top = math_max(rect.top, accRect.top);
            accRect.right = math_min(rect.right, accRect.right);
            accRect.bottom = math_min(rect.bottom, accRect.bottom);
            accRect.left = math_max(rect.left, accRect.left);
            return accRect;
        }), getClientRectFromMixedType(element, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
    }
    function getFreshSideObject() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
    function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
    }
    function expandToHashMap(value, keys) {
        return keys.reduce((function(hashMap, key) {
            hashMap[key] = value;
            return hashMap;
        }), {});
    }
    function detectOverflow(state, options) {
        if (options === void 0) options = {};
        var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
        var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets = computeOffsets({
            reference: referenceClientRect,
            element: popperRect,
            strategy: "absolute",
            placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
            left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
            right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
            var offset = offsetData[placement];
            Object.keys(overflowOffsets).forEach((function(key) {
                var multiply = [ right, bottom ].indexOf(key) >= 0 ? 1 : -1;
                var axis = [ enums_top, bottom ].indexOf(key) >= 0 ? "y" : "x";
                overflowOffsets[key] += offset[axis] * multiply;
            }));
        }
        return overflowOffsets;
    }
    function computeAutoPlacement(state, options) {
        if (options === void 0) options = {};
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter((function(placement) {
            return getVariation(placement) === variation;
        })) : basePlacements;
        var allowedPlacements = placements.filter((function(placement) {
            return allowedAutoPlacements.indexOf(placement) >= 0;
        }));
        if (allowedPlacements.length === 0) allowedPlacements = placements;
        var overflows = allowedPlacements.reduce((function(acc, placement) {
            acc[placement] = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                padding
            })[getBasePlacement(placement)];
            return acc;
        }), {});
        return Object.keys(overflows).sort((function(a, b) {
            return overflows[a] - overflows[b];
        }));
    }
    function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) return [];
        var oppositePlacement = getOppositePlacement(placement);
        return [ getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement) ];
    }
    function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) return;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [ getOppositePlacement(preferredPlacement) ] : getExpandedFallbackPlacements(preferredPlacement));
        var placements = [ preferredPlacement ].concat(fallbackPlacements).reduce((function(acc, placement) {
            return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
                placement,
                boundary,
                rootBoundary,
                padding,
                flipVariations,
                allowedAutoPlacements
            }) : placement);
        }), []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = new Map;
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements[0];
        for (var i = 0; i < placements.length; i++) {
            var placement = placements[i];
            var _basePlacement = getBasePlacement(placement);
            var isStartVariation = getVariation(placement) === start;
            var isVertical = [ enums_top, bottom ].indexOf(_basePlacement) >= 0;
            var len = isVertical ? "width" : "height";
            var overflow = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                altBoundary,
                padding
            });
            var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;
            if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
            var altVariationSide = getOppositePlacement(mainVariationSide);
            var checks = [];
            if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
            if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
            if (checks.every((function(check) {
                return check;
            }))) {
                firstFittingPlacement = placement;
                makeFallbackChecks = false;
                break;
            }
            checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
            var numberOfChecks = flipVariations ? 3 : 1;
            var _loop = function _loop(_i) {
                var fittingPlacement = placements.find((function(placement) {
                    var checks = checksMap.get(placement);
                    if (checks) return checks.slice(0, _i).every((function(check) {
                        return check;
                    }));
                }));
                if (fittingPlacement) {
                    firstFittingPlacement = fittingPlacement;
                    return "break";
                }
            };
            for (var _i = numberOfChecks; _i > 0; _i--) {
                var _ret = _loop(_i);
                if (_ret === "break") break;
            }
        }
        if (state.placement !== firstFittingPlacement) {
            state.modifiersData[name]._skip = true;
            state.placement = firstFittingPlacement;
            state.reset = true;
        }
    }
    const modifiers_flip = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: [ "offset" ],
        data: {
            _skip: false
        }
    };
    function getAltAxis(axis) {
        return axis === "x" ? "y" : "x";
    }
    function within(min, value, max) {
        return math_max(min, math_min(value, max));
    }
    function withinMaxClamp(min, value, max) {
        var v = within(min, value, max);
        return v > max ? max : v;
    }
    function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
            boundary,
            rootBoundary,
            padding,
            altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
            placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
            mainAxis: tetherOffsetValue,
            altAxis: tetherOffsetValue
        } : Object.assign({
            mainAxis: 0,
            altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
            x: 0,
            y: 0
        };
        if (!popperOffsets) return;
        if (checkMainAxis) {
            var _offsetModifierState$;
            var mainSide = mainAxis === "y" ? enums_top : left;
            var altSide = mainAxis === "y" ? bottom : right;
            var len = mainAxis === "y" ? "height" : "width";
            var offset = popperOffsets[mainAxis];
            var min = offset + overflow[mainSide];
            var max = offset - overflow[altSide];
            var additive = tether ? -popperRect[len] / 2 : 0;
            var minLen = variation === start ? referenceRect[len] : popperRect[len];
            var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
            var arrowElement = state.elements.arrow;
            var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
                width: 0,
                height: 0
            };
            var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
            var arrowPaddingMin = arrowPaddingObject[mainSide];
            var arrowPaddingMax = arrowPaddingObject[altSide];
            var arrowLen = within(0, referenceRect[len], arrowRect[len]);
            var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
            var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
            var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
            var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
            var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
            var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
            var tetherMax = offset + maxOffset - offsetModifierValue;
            var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
            popperOffsets[mainAxis] = preventedOffset;
            data[mainAxis] = preventedOffset - offset;
        }
        if (checkAltAxis) {
            var _offsetModifierState$2;
            var _mainSide = mainAxis === "x" ? enums_top : left;
            var _altSide = mainAxis === "x" ? bottom : right;
            var _offset = popperOffsets[altAxis];
            var _len = altAxis === "y" ? "height" : "width";
            var _min = _offset + overflow[_mainSide];
            var _max = _offset - overflow[_altSide];
            var isOriginSide = [ enums_top, left ].indexOf(basePlacement) !== -1;
            var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
            var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
            var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
            var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
            popperOffsets[altAxis] = _preventedOffset;
            data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_preventOverflow = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: [ "offset" ]
    };
    var toPaddingObject = function toPaddingObject(padding, state) {
        padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
            placement: state.placement
        })) : padding;
        return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    };
    function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [ left, right ].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets) return;
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = axis === "y" ? enums_top : left;
        var maxProp = axis === "y" ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
        var startDiff = popperOffsets[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min = paddingObject[minProp];
        var max = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset = within(min, center, max);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, 
        _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }
    function arrow_effect(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
        if (arrowElement == null) return;
        if (typeof arrowElement === "string") {
            arrowElement = state.elements.popper.querySelector(arrowElement);
            if (!arrowElement) return;
        }
        if (!contains(state.elements.popper, arrowElement)) return;
        state.elements.arrow = arrowElement;
    }
    const modifiers_arrow = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: arrow_effect,
        requires: [ "popperOffsets" ],
        requiresIfExists: [ "preventOverflow" ]
    };
    function getSideOffsets(overflow, rect, preventedOffsets) {
        if (preventedOffsets === void 0) preventedOffsets = {
            x: 0,
            y: 0
        };
        return {
            top: overflow.top - rect.height - preventedOffsets.y,
            right: overflow.right - rect.width + preventedOffsets.x,
            bottom: overflow.bottom - rect.height + preventedOffsets.y,
            left: overflow.left - rect.width - preventedOffsets.x
        };
    }
    function isAnySideFullyClipped(overflow) {
        return [ enums_top, right, bottom, left ].some((function(side) {
            return overflow[side] >= 0;
        }));
    }
    function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
            elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
            altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
            referenceClippingOffsets,
            popperEscapeOffsets,
            isReferenceHidden,
            hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-reference-hidden": isReferenceHidden,
            "data-popper-escaped": hasPopperEscaped
        });
    }
    const modifiers_hide = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: [ "preventOverflow" ],
        fn: hide
    };
    var defaultModifiers = [ eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide ];
    var popper_createPopper = popperGenerator({
        defaultModifiers
    });
    var dropdown_assign = void 0 && (void 0).__assign || function() {
        dropdown_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return dropdown_assign.apply(this, arguments);
    };
    var __spreadArray = void 0 && (void 0).__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2) for (var ar, i = 0, l = from.length; i < l; i++) if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var dropdown_Default = {
        placement: "bottom",
        triggerType: "click",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        ignoreClickOutsideClass: false,
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    };
    var dropdown_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Dropdown = function() {
        function Dropdown(targetElement, triggerElement, options, instanceOptions) {
            if (targetElement === void 0) targetElement = null;
            if (triggerElement === void 0) triggerElement = null;
            if (options === void 0) options = dropdown_Default;
            if (instanceOptions === void 0) instanceOptions = dropdown_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetElement.id;
            this._targetEl = targetElement;
            this._triggerEl = triggerElement;
            this._options = dropdown_assign(dropdown_assign({}, dropdown_Default), options);
            this._popperInstance = null;
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Dropdown", this, this._instanceId, instanceOptions.override);
        }
        Dropdown.prototype.init = function() {
            if (this._triggerEl && this._targetEl && !this._initialized) {
                this._popperInstance = this._createPopperInstance();
                this._setupEventListeners();
                this._initialized = true;
            }
        };
        Dropdown.prototype.destroy = function() {
            var _this = this;
            var triggerEvents = this._getTriggerEvents();
            if (this._options.triggerType === "click") triggerEvents.showEvents.forEach((function(ev) {
                _this._triggerEl.removeEventListener(ev, _this._clickHandler);
            }));
            if (this._options.triggerType === "hover") {
                triggerEvents.showEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._hoverShowTriggerElHandler);
                    _this._targetEl.removeEventListener(ev, _this._hoverShowTargetElHandler);
                }));
                triggerEvents.hideEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._hoverHideHandler);
                    _this._targetEl.removeEventListener(ev, _this._hoverHideHandler);
                }));
            }
            this._popperInstance.destroy();
            this._initialized = false;
        };
        Dropdown.prototype.removeInstance = function() {
            dom_instances.removeInstance("Dropdown", this._instanceId);
        };
        Dropdown.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Dropdown.prototype._setupEventListeners = function() {
            var _this = this;
            var triggerEvents = this._getTriggerEvents();
            this._clickHandler = function() {
                _this.toggle();
            };
            if (this._options.triggerType === "click") triggerEvents.showEvents.forEach((function(ev) {
                _this._triggerEl.addEventListener(ev, _this._clickHandler);
            }));
            this._hoverShowTriggerElHandler = function(ev) {
                if (ev.type === "click") _this.toggle(); else setTimeout((function() {
                    _this.show();
                }), _this._options.delay);
            };
            this._hoverShowTargetElHandler = function() {
                _this.show();
            };
            this._hoverHideHandler = function() {
                setTimeout((function() {
                    if (!_this._targetEl.matches(":hover")) _this.hide();
                }), _this._options.delay);
            };
            if (this._options.triggerType === "hover") {
                triggerEvents.showEvents.forEach((function(ev) {
                    _this._triggerEl.addEventListener(ev, _this._hoverShowTriggerElHandler);
                    _this._targetEl.addEventListener(ev, _this._hoverShowTargetElHandler);
                }));
                triggerEvents.hideEvents.forEach((function(ev) {
                    _this._triggerEl.addEventListener(ev, _this._hoverHideHandler);
                    _this._targetEl.addEventListener(ev, _this._hoverHideHandler);
                }));
            }
        };
        Dropdown.prototype._createPopperInstance = function() {
            return popper_createPopper(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [ {
                    name: "offset",
                    options: {
                        offset: [ this._options.offsetSkidding, this._options.offsetDistance ]
                    }
                } ]
            });
        };
        Dropdown.prototype._setupClickOutsideListener = function() {
            var _this = this;
            this._clickOutsideEventListener = function(ev) {
                _this._handleClickOutside(ev, _this._targetEl);
            };
            document.body.addEventListener("click", this._clickOutsideEventListener, true);
        };
        Dropdown.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, true);
        };
        Dropdown.prototype._handleClickOutside = function(ev, targetEl) {
            var clickedEl = ev.target;
            var ignoreClickOutsideClass = this._options.ignoreClickOutsideClass;
            var isIgnored = false;
            if (ignoreClickOutsideClass) {
                var ignoredClickOutsideEls = document.querySelectorAll(".".concat(ignoreClickOutsideClass));
                ignoredClickOutsideEls.forEach((function(el) {
                    if (el.contains(clickedEl)) {
                        isIgnored = true;
                        return;
                    }
                }));
            }
            if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && !isIgnored && this.isVisible()) this.hide();
        };
        Dropdown.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
              case "hover":
                return {
                    showEvents: [ "mouseenter", "click" ],
                    hideEvents: [ "mouseleave" ]
                };

              case "click":
                return {
                    showEvents: [ "click" ],
                    hideEvents: []
                };

              case "none":
                return {
                    showEvents: [],
                    hideEvents: []
                };

              default:
                return {
                    showEvents: [ "click" ],
                    hideEvents: []
                };
            }
        };
        Dropdown.prototype.toggle = function() {
            if (this.isVisible()) this.hide(); else this.show();
            this._options.onToggle(this);
        };
        Dropdown.prototype.isVisible = function() {
            return this._visible;
        };
        Dropdown.prototype.show = function() {
            this._targetEl.classList.remove("hidden");
            this._targetEl.classList.add("block");
            this._targetEl.removeAttribute("aria-hidden");
            this._popperInstance.setOptions((function(options) {
                return dropdown_assign(dropdown_assign({}, options), {
                    modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: true
                    } ], false)
                });
            }));
            this._setupClickOutsideListener();
            this._popperInstance.update();
            this._visible = true;
            this._options.onShow(this);
        };
        Dropdown.prototype.hide = function() {
            this._targetEl.classList.remove("block");
            this._targetEl.classList.add("hidden");
            this._targetEl.setAttribute("aria-hidden", "true");
            this._popperInstance.setOptions((function(options) {
                return dropdown_assign(dropdown_assign({}, options), {
                    modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: false
                    } ], false)
                });
            }));
            this._visible = false;
            this._removeClickOutsideListener();
            this._options.onHide(this);
        };
        Dropdown.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Dropdown.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Dropdown.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Dropdown;
    }();
    function initDropdowns() {
        document.querySelectorAll("[data-dropdown-toggle]").forEach((function($triggerEl) {
            var dropdownId = $triggerEl.getAttribute("data-dropdown-toggle");
            var $dropdownEl = document.getElementById(dropdownId);
            if ($dropdownEl) {
                var placement = $triggerEl.getAttribute("data-dropdown-placement");
                var offsetSkidding = $triggerEl.getAttribute("data-dropdown-offset-skidding");
                var offsetDistance = $triggerEl.getAttribute("data-dropdown-offset-distance");
                var triggerType = $triggerEl.getAttribute("data-dropdown-trigger");
                var delay = $triggerEl.getAttribute("data-dropdown-delay");
                var ignoreClickOutsideClass = $triggerEl.getAttribute("data-dropdown-ignore-click-outside-class");
                new Dropdown($dropdownEl, $triggerEl, {
                    placement: placement ? placement : dropdown_Default.placement,
                    triggerType: triggerType ? triggerType : dropdown_Default.triggerType,
                    offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : dropdown_Default.offsetSkidding,
                    offsetDistance: offsetDistance ? parseInt(offsetDistance) : dropdown_Default.offsetDistance,
                    delay: delay ? parseInt(delay) : dropdown_Default.delay,
                    ignoreClickOutsideClass: ignoreClickOutsideClass ? ignoreClickOutsideClass : dropdown_Default.ignoreClickOutsideClass
                });
            } else console.error('The dropdown element with id "'.concat(dropdownId, '" does not exist. Please check the data-dropdown-toggle attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.Dropdown = Dropdown;
        window.initDropdowns = initDropdowns;
    }
    var modal_assign = void 0 && (void 0).__assign || function() {
        modal_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return modal_assign.apply(this, arguments);
    };
    var modal_Default = {
        placement: "center",
        backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
        backdrop: "dynamic",
        closable: true,
        onHide: function() {},
        onShow: function() {},
        onToggle: function() {}
    };
    var modal_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Modal = function() {
        function Modal(targetEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (options === void 0) options = modal_Default;
            if (instanceOptions === void 0) instanceOptions = modal_DefaultInstanceOptions;
            this._eventListenerInstances = [];
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._options = modal_assign(modal_assign({}, modal_Default), options);
            this._isHidden = true;
            this._backdropEl = null;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Modal", this, this._instanceId, instanceOptions.override);
        }
        Modal.prototype.init = function() {
            var _this = this;
            if (this._targetEl && !this._initialized) {
                this._getPlacementClasses().map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
                this._initialized = true;
            }
        };
        Modal.prototype.destroy = function() {
            if (this._initialized) {
                this.removeAllEventListenerInstances();
                this._destroyBackdropEl();
                this._initialized = false;
            }
        };
        Modal.prototype.removeInstance = function() {
            dom_instances.removeInstance("Modal", this._instanceId);
        };
        Modal.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Modal.prototype._createBackdrop = function() {
            var _a;
            if (this._isHidden) {
                var backdropEl = document.createElement("div");
                (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                document.querySelector("body").append(backdropEl);
                this._backdropEl = backdropEl;
            }
        };
        Modal.prototype._destroyBackdropEl = function() {
            if (!this._isHidden && this._backdropEl) {
                this._backdropEl.remove();
                this._backdropEl = null;
            }
        };
        Modal.prototype._setupModalCloseEventListeners = function() {
            var _this = this;
            if (this._options.backdrop === "dynamic") {
                this._clickOutsideEventListener = function(ev) {
                    _this._handleOutsideClick(ev.target);
                };
                this._targetEl.addEventListener("click", this._clickOutsideEventListener, true);
            }
            this._keydownEventListener = function(ev) {
                if (ev.key === "Escape") _this.hide();
            };
            document.body.addEventListener("keydown", this._keydownEventListener, true);
        };
        Modal.prototype._removeModalCloseEventListeners = function() {
            if (this._options.backdrop === "dynamic") this._targetEl.removeEventListener("click", this._clickOutsideEventListener, true);
            document.body.removeEventListener("keydown", this._keydownEventListener, true);
        };
        Modal.prototype._handleOutsideClick = function(target) {
            if (target === this._targetEl || target === this._backdropEl && this.isVisible()) this.hide();
        };
        Modal.prototype._getPlacementClasses = function() {
            switch (this._options.placement) {
              case "top-left":
                return [ "justify-start", "items-start" ];

              case "top-center":
                return [ "justify-center", "items-start" ];

              case "top-right":
                return [ "justify-end", "items-start" ];

              case "center-left":
                return [ "justify-start", "items-center" ];

              case "center":
                return [ "justify-center", "items-center" ];

              case "center-right":
                return [ "justify-end", "items-center" ];

              case "bottom-left":
                return [ "justify-start", "items-end" ];

              case "bottom-center":
                return [ "justify-center", "items-end" ];

              case "bottom-right":
                return [ "justify-end", "items-end" ];

              default:
                return [ "justify-center", "items-center" ];
            }
        };
        Modal.prototype.toggle = function() {
            if (this._isHidden) this.show(); else this.hide();
            this._options.onToggle(this);
        };
        Modal.prototype.show = function() {
            if (this.isHidden) {
                this._targetEl.classList.add("flex");
                this._targetEl.classList.remove("hidden");
                this._targetEl.setAttribute("aria-modal", "true");
                this._targetEl.setAttribute("role", "dialog");
                this._targetEl.removeAttribute("aria-hidden");
                this._createBackdrop();
                this._isHidden = false;
                if (this._options.closable) this._setupModalCloseEventListeners();
                document.body.classList.add("overflow-hidden");
                this._options.onShow(this);
            }
        };
        Modal.prototype.hide = function() {
            if (this.isVisible) {
                this._targetEl.classList.add("hidden");
                this._targetEl.classList.remove("flex");
                this._targetEl.setAttribute("aria-hidden", "true");
                this._targetEl.removeAttribute("aria-modal");
                this._targetEl.removeAttribute("role");
                this._destroyBackdropEl();
                this._isHidden = true;
                document.body.classList.remove("overflow-hidden");
                if (this._options.closable) this._removeModalCloseEventListeners();
                this._options.onHide(this);
            }
        };
        Modal.prototype.isVisible = function() {
            return !this._isHidden;
        };
        Modal.prototype.isHidden = function() {
            return this._isHidden;
        };
        Modal.prototype.addEventListenerInstance = function(element, type, handler) {
            this._eventListenerInstances.push({
                element,
                type,
                handler
            });
        };
        Modal.prototype.removeAllEventListenerInstances = function() {
            this._eventListenerInstances.map((function(eventListenerInstance) {
                eventListenerInstance.element.removeEventListener(eventListenerInstance.type, eventListenerInstance.handler);
            }));
            this._eventListenerInstances = [];
        };
        Modal.prototype.getAllEventListenerInstances = function() {
            return this._eventListenerInstances;
        };
        Modal.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Modal.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Modal.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Modal;
    }();
    function initModals() {
        document.querySelectorAll("[data-modal-target]").forEach((function($triggerEl) {
            var modalId = $triggerEl.getAttribute("data-modal-target");
            var $modalEl = document.getElementById(modalId);
            if ($modalEl) {
                var placement = $modalEl.getAttribute("data-modal-placement");
                var backdrop = $modalEl.getAttribute("data-modal-backdrop");
                new Modal($modalEl, {
                    placement: placement ? placement : modal_Default.placement,
                    backdrop: backdrop ? backdrop : modal_Default.backdrop
                });
            } else console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
        }));
        document.querySelectorAll("[data-modal-toggle]").forEach((function($triggerEl) {
            var modalId = $triggerEl.getAttribute("data-modal-toggle");
            var $modalEl = document.getElementById(modalId);
            if ($modalEl) {
                var modal_1 = dom_instances.getInstance("Modal", modalId);
                if (modal_1) {
                    var toggleModal = function() {
                        modal_1.toggle();
                    };
                    $triggerEl.addEventListener("click", toggleModal);
                    modal_1.addEventListenerInstance($triggerEl, "click", toggleModal);
                } else console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
            } else console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
        }));
        document.querySelectorAll("[data-modal-show]").forEach((function($triggerEl) {
            var modalId = $triggerEl.getAttribute("data-modal-show");
            var $modalEl = document.getElementById(modalId);
            if ($modalEl) {
                var modal_2 = dom_instances.getInstance("Modal", modalId);
                if (modal_2) {
                    var showModal = function() {
                        modal_2.show();
                    };
                    $triggerEl.addEventListener("click", showModal);
                    modal_2.addEventListenerInstance($triggerEl, "click", showModal);
                } else console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
            } else console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
        }));
        document.querySelectorAll("[data-modal-hide]").forEach((function($triggerEl) {
            var modalId = $triggerEl.getAttribute("data-modal-hide");
            var $modalEl = document.getElementById(modalId);
            if ($modalEl) {
                var modal_3 = dom_instances.getInstance("Modal", modalId);
                if (modal_3) {
                    var hideModal = function() {
                        modal_3.hide();
                    };
                    $triggerEl.addEventListener("click", hideModal);
                    modal_3.addEventListenerInstance($triggerEl, "click", hideModal);
                } else console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
            } else console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
        }));
    }
    if (typeof window !== "undefined") {
        window.Modal = Modal;
        window.initModals = initModals;
    }
    var drawer_assign = void 0 && (void 0).__assign || function() {
        drawer_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return drawer_assign.apply(this, arguments);
    };
    var drawer_Default = {
        placement: "left",
        bodyScrolling: false,
        backdrop: true,
        edge: false,
        edgeOffset: "bottom-[60px]",
        backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    };
    var drawer_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Drawer = function() {
        function Drawer(targetEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (options === void 0) options = drawer_Default;
            if (instanceOptions === void 0) instanceOptions = drawer_DefaultInstanceOptions;
            this._eventListenerInstances = [];
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._options = drawer_assign(drawer_assign({}, drawer_Default), options);
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Drawer", this, this._instanceId, instanceOptions.override);
        }
        Drawer.prototype.init = function() {
            var _this = this;
            if (this._targetEl && !this._initialized) {
                this._targetEl.setAttribute("aria-hidden", "true");
                this._targetEl.classList.add("transition-transform");
                this._getPlacementClasses(this._options.placement).base.map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
                this._handleEscapeKey = function(event) {
                    if (event.key === "Escape") if (_this.isVisible()) _this.hide();
                };
                document.addEventListener("keydown", this._handleEscapeKey);
                this._initialized = true;
            }
        };
        Drawer.prototype.destroy = function() {
            if (this._initialized) {
                this.removeAllEventListenerInstances();
                this._destroyBackdropEl();
                document.removeEventListener("keydown", this._handleEscapeKey);
                this._initialized = false;
            }
        };
        Drawer.prototype.removeInstance = function() {
            dom_instances.removeInstance("Drawer", this._instanceId);
        };
        Drawer.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Drawer.prototype.hide = function() {
            var _this = this;
            if (this._options.edge) {
                this._getPlacementClasses(this._options.placement + "-edge").active.map((function(c) {
                    _this._targetEl.classList.remove(c);
                }));
                this._getPlacementClasses(this._options.placement + "-edge").inactive.map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
            } else {
                this._getPlacementClasses(this._options.placement).active.map((function(c) {
                    _this._targetEl.classList.remove(c);
                }));
                this._getPlacementClasses(this._options.placement).inactive.map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
            }
            this._targetEl.setAttribute("aria-hidden", "true");
            this._targetEl.removeAttribute("aria-modal");
            this._targetEl.removeAttribute("role");
            if (!this._options.bodyScrolling) document.body.classList.remove("overflow-hidden");
            if (this._options.backdrop) this._destroyBackdropEl();
            this._visible = false;
            this._options.onHide(this);
        };
        Drawer.prototype.show = function() {
            var _this = this;
            if (this._options.edge) {
                this._getPlacementClasses(this._options.placement + "-edge").active.map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
                this._getPlacementClasses(this._options.placement + "-edge").inactive.map((function(c) {
                    _this._targetEl.classList.remove(c);
                }));
            } else {
                this._getPlacementClasses(this._options.placement).active.map((function(c) {
                    _this._targetEl.classList.add(c);
                }));
                this._getPlacementClasses(this._options.placement).inactive.map((function(c) {
                    _this._targetEl.classList.remove(c);
                }));
            }
            this._targetEl.setAttribute("aria-modal", "true");
            this._targetEl.setAttribute("role", "dialog");
            this._targetEl.removeAttribute("aria-hidden");
            if (!this._options.bodyScrolling) document.body.classList.add("overflow-hidden");
            if (this._options.backdrop) this._createBackdrop();
            this._visible = true;
            this._options.onShow(this);
        };
        Drawer.prototype.toggle = function() {
            if (this.isVisible()) this.hide(); else this.show();
        };
        Drawer.prototype._createBackdrop = function() {
            var _a;
            var _this = this;
            if (!this._visible) {
                var backdropEl = document.createElement("div");
                backdropEl.setAttribute("drawer-backdrop", "");
                (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                document.querySelector("body").append(backdropEl);
                backdropEl.addEventListener("click", (function() {
                    _this.hide();
                }));
            }
        };
        Drawer.prototype._destroyBackdropEl = function() {
            if (this._visible && document.querySelector("[drawer-backdrop]") !== null) document.querySelector("[drawer-backdrop]").remove();
        };
        Drawer.prototype._getPlacementClasses = function(placement) {
            switch (placement) {
              case "top":
                return {
                    base: [ "top-0", "left-0", "right-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "-translate-y-full" ]
                };

              case "right":
                return {
                    base: [ "right-0", "top-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "translate-x-full" ]
                };

              case "bottom":
                return {
                    base: [ "bottom-0", "left-0", "right-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "translate-y-full" ]
                };

              case "left":
                return {
                    base: [ "left-0", "top-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "-translate-x-full" ]
                };

              case "bottom-edge":
                return {
                    base: [ "left-0", "top-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "translate-y-full", this._options.edgeOffset ]
                };

              default:
                return {
                    base: [ "left-0", "top-0" ],
                    active: [ "transform-none" ],
                    inactive: [ "-translate-x-full" ]
                };
            }
        };
        Drawer.prototype.isHidden = function() {
            return !this._visible;
        };
        Drawer.prototype.isVisible = function() {
            return this._visible;
        };
        Drawer.prototype.addEventListenerInstance = function(element, type, handler) {
            this._eventListenerInstances.push({
                element,
                type,
                handler
            });
        };
        Drawer.prototype.removeAllEventListenerInstances = function() {
            this._eventListenerInstances.map((function(eventListenerInstance) {
                eventListenerInstance.element.removeEventListener(eventListenerInstance.type, eventListenerInstance.handler);
            }));
            this._eventListenerInstances = [];
        };
        Drawer.prototype.getAllEventListenerInstances = function() {
            return this._eventListenerInstances;
        };
        Drawer.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Drawer.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Drawer.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Drawer;
    }();
    function initDrawers() {
        document.querySelectorAll("[data-drawer-target]").forEach((function($triggerEl) {
            var drawerId = $triggerEl.getAttribute("data-drawer-target");
            var $drawerEl = document.getElementById(drawerId);
            if ($drawerEl) {
                var placement = $triggerEl.getAttribute("data-drawer-placement");
                var bodyScrolling = $triggerEl.getAttribute("data-drawer-body-scrolling");
                var backdrop = $triggerEl.getAttribute("data-drawer-backdrop");
                var edge = $triggerEl.getAttribute("data-drawer-edge");
                var edgeOffset = $triggerEl.getAttribute("data-drawer-edge-offset");
                new Drawer($drawerEl, {
                    placement: placement ? placement : drawer_Default.placement,
                    bodyScrolling: bodyScrolling ? bodyScrolling === "true" ? true : false : drawer_Default.bodyScrolling,
                    backdrop: backdrop ? backdrop === "true" ? true : false : drawer_Default.backdrop,
                    edge: edge ? edge === "true" ? true : false : drawer_Default.edge,
                    edgeOffset: edgeOffset ? edgeOffset : drawer_Default.edgeOffset
                });
            } else console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }));
        document.querySelectorAll("[data-drawer-toggle]").forEach((function($triggerEl) {
            var drawerId = $triggerEl.getAttribute("data-drawer-toggle");
            var $drawerEl = document.getElementById(drawerId);
            if ($drawerEl) {
                var drawer_1 = dom_instances.getInstance("Drawer", drawerId);
                if (drawer_1) {
                    var toggleDrawer = function() {
                        drawer_1.toggle();
                    };
                    $triggerEl.addEventListener("click", toggleDrawer);
                    drawer_1.addEventListenerInstance($triggerEl, "click", toggleDrawer);
                } else console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            } else console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }));
        document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach((function($triggerEl) {
            var drawerId = $triggerEl.getAttribute("data-drawer-dismiss") ? $triggerEl.getAttribute("data-drawer-dismiss") : $triggerEl.getAttribute("data-drawer-hide");
            var $drawerEl = document.getElementById(drawerId);
            if ($drawerEl) {
                var drawer_2 = dom_instances.getInstance("Drawer", drawerId);
                if (drawer_2) {
                    var hideDrawer = function() {
                        drawer_2.hide();
                    };
                    $triggerEl.addEventListener("click", hideDrawer);
                    drawer_2.addEventListenerInstance($triggerEl, "click", hideDrawer);
                } else console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            } else console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
        }));
        document.querySelectorAll("[data-drawer-show]").forEach((function($triggerEl) {
            var drawerId = $triggerEl.getAttribute("data-drawer-show");
            var $drawerEl = document.getElementById(drawerId);
            if ($drawerEl) {
                var drawer_3 = dom_instances.getInstance("Drawer", drawerId);
                if (drawer_3) {
                    var showDrawer = function() {
                        drawer_3.show();
                    };
                    $triggerEl.addEventListener("click", showDrawer);
                    drawer_3.addEventListenerInstance($triggerEl, "click", showDrawer);
                } else console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
            } else console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
        }));
    }
    if (typeof window !== "undefined") {
        window.Drawer = Drawer;
        window.initDrawers = initDrawers;
    }
    var tabs_assign = void 0 && (void 0).__assign || function() {
        tabs_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return tabs_assign.apply(this, arguments);
    };
    var tabs_Default = {
        defaultTabId: null,
        activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",
        inactiveClasses: "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
        onShow: function() {}
    };
    var tabs_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Tabs = function() {
        function Tabs(tabsEl, items, options, instanceOptions) {
            if (tabsEl === void 0) tabsEl = null;
            if (items === void 0) items = [];
            if (options === void 0) options = tabs_Default;
            if (instanceOptions === void 0) instanceOptions = tabs_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : tabsEl.id;
            this._tabsEl = tabsEl;
            this._items = items;
            this._activeTab = options ? this.getTab(options.defaultTabId) : null;
            this._options = tabs_assign(tabs_assign({}, tabs_Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Tabs", this, this._instanceId, instanceOptions.override);
        }
        Tabs.prototype.init = function() {
            var _this = this;
            if (this._items.length && !this._initialized) {
                if (!this._activeTab) this.setActiveTab(this._items[0]);
                this.show(this._activeTab.id, true);
                this._items.map((function(tab) {
                    tab.triggerEl.addEventListener("click", (function(event) {
                        event.preventDefault();
                        _this.show(tab.id);
                    }));
                }));
            }
        };
        Tabs.prototype.destroy = function() {
            if (this._initialized) this._initialized = false;
        };
        Tabs.prototype.removeInstance = function() {
            this.destroy();
            dom_instances.removeInstance("Tabs", this._instanceId);
        };
        Tabs.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Tabs.prototype.getActiveTab = function() {
            return this._activeTab;
        };
        Tabs.prototype.setActiveTab = function(tab) {
            this._activeTab = tab;
        };
        Tabs.prototype.getTab = function(id) {
            return this._items.filter((function(t) {
                return t.id === id;
            }))[0];
        };
        Tabs.prototype.show = function(id, forceShow) {
            var _a, _b;
            var _this = this;
            if (forceShow === void 0) forceShow = false;
            var tab = this.getTab(id);
            if (tab === this._activeTab && !forceShow) return;
            this._items.map((function(t) {
                var _a, _b;
                if (t !== tab) {
                    (_a = t.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(" "));
                    (_b = t.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(" "));
                    t.targetEl.classList.add("hidden");
                    t.triggerEl.setAttribute("aria-selected", "false");
                }
            }));
            (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
            (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
            tab.triggerEl.setAttribute("aria-selected", "true");
            tab.targetEl.classList.remove("hidden");
            this.setActiveTab(tab);
            this._options.onShow(this, tab);
        };
        Tabs.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        return Tabs;
    }();
    function initTabs() {
        document.querySelectorAll("[data-tabs-toggle]").forEach((function($parentEl) {
            var tabItems = [];
            var activeClasses = $parentEl.getAttribute("data-tabs-active-classes");
            var inactiveClasses = $parentEl.getAttribute("data-tabs-inactive-classes");
            var defaultTabId = null;
            $parentEl.querySelectorAll('[role="tab"]').forEach((function($triggerEl) {
                var isActive = $triggerEl.getAttribute("aria-selected") === "true";
                var tab = {
                    id: $triggerEl.getAttribute("data-tabs-target"),
                    triggerEl: $triggerEl,
                    targetEl: document.querySelector($triggerEl.getAttribute("data-tabs-target"))
                };
                tabItems.push(tab);
                if (isActive) defaultTabId = tab.id;
            }));
            new Tabs($parentEl, tabItems, {
                defaultTabId,
                activeClasses: activeClasses ? activeClasses : tabs_Default.activeClasses,
                inactiveClasses: inactiveClasses ? inactiveClasses : tabs_Default.inactiveClasses
            });
        }));
    }
    if (typeof window !== "undefined") {
        window.Tabs = Tabs;
        window.initTabs = initTabs;
    }
    var tooltip_assign = void 0 && (void 0).__assign || function() {
        tooltip_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return tooltip_assign.apply(this, arguments);
    };
    var tooltip_spreadArray = void 0 && (void 0).__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2) for (var ar, i = 0, l = from.length; i < l; i++) if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var tooltip_Default = {
        placement: "top",
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    };
    var tooltip_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Tooltip = function() {
        function Tooltip(targetEl, triggerEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (triggerEl === void 0) triggerEl = null;
            if (options === void 0) options = tooltip_Default;
            if (instanceOptions === void 0) instanceOptions = tooltip_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._triggerEl = triggerEl;
            this._options = tooltip_assign(tooltip_assign({}, tooltip_Default), options);
            this._popperInstance = null;
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Tooltip", this, this._instanceId, instanceOptions.override);
        }
        Tooltip.prototype.init = function() {
            if (this._triggerEl && this._targetEl && !this._initialized) {
                this._setupEventListeners();
                this._popperInstance = this._createPopperInstance();
                this._initialized = true;
            }
        };
        Tooltip.prototype.destroy = function() {
            var _this = this;
            if (this._initialized) {
                var triggerEvents = this._getTriggerEvents();
                triggerEvents.showEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._showHandler);
                }));
                triggerEvents.hideEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._hideHandler);
                }));
                this._removeKeydownListener();
                this._removeClickOutsideListener();
                if (this._popperInstance) this._popperInstance.destroy();
                this._initialized = false;
            }
        };
        Tooltip.prototype.removeInstance = function() {
            dom_instances.removeInstance("Tooltip", this._instanceId);
        };
        Tooltip.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Tooltip.prototype._setupEventListeners = function() {
            var _this = this;
            var triggerEvents = this._getTriggerEvents();
            this._showHandler = function() {
                _this.show();
            };
            this._hideHandler = function() {
                _this.hide();
            };
            triggerEvents.showEvents.forEach((function(ev) {
                _this._triggerEl.addEventListener(ev, _this._showHandler);
            }));
            triggerEvents.hideEvents.forEach((function(ev) {
                _this._triggerEl.addEventListener(ev, _this._hideHandler);
            }));
        };
        Tooltip.prototype._createPopperInstance = function() {
            return popper_createPopper(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [ {
                    name: "offset",
                    options: {
                        offset: [ 0, 8 ]
                    }
                } ]
            });
        };
        Tooltip.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
              case "hover":
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };

              case "click":
                return {
                    showEvents: [ "click", "focus" ],
                    hideEvents: [ "focusout", "blur" ]
                };

              case "none":
                return {
                    showEvents: [],
                    hideEvents: []
                };

              default:
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };
            }
        };
        Tooltip.prototype._setupKeydownListener = function() {
            var _this = this;
            this._keydownEventListener = function(ev) {
                if (ev.key === "Escape") _this.hide();
            };
            document.body.addEventListener("keydown", this._keydownEventListener, true);
        };
        Tooltip.prototype._removeKeydownListener = function() {
            document.body.removeEventListener("keydown", this._keydownEventListener, true);
        };
        Tooltip.prototype._setupClickOutsideListener = function() {
            var _this = this;
            this._clickOutsideEventListener = function(ev) {
                _this._handleClickOutside(ev, _this._targetEl);
            };
            document.body.addEventListener("click", this._clickOutsideEventListener, true);
        };
        Tooltip.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, true);
        };
        Tooltip.prototype._handleClickOutside = function(ev, targetEl) {
            var clickedEl = ev.target;
            if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) this.hide();
        };
        Tooltip.prototype.isVisible = function() {
            return this._visible;
        };
        Tooltip.prototype.toggle = function() {
            if (this.isVisible()) this.hide(); else this.show();
        };
        Tooltip.prototype.show = function() {
            this._targetEl.classList.remove("opacity-0", "invisible");
            this._targetEl.classList.add("opacity-100", "visible");
            this._popperInstance.setOptions((function(options) {
                return tooltip_assign(tooltip_assign({}, options), {
                    modifiers: tooltip_spreadArray(tooltip_spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: true
                    } ], false)
                });
            }));
            this._setupClickOutsideListener();
            this._setupKeydownListener();
            this._popperInstance.update();
            this._visible = true;
            this._options.onShow(this);
        };
        Tooltip.prototype.hide = function() {
            this._targetEl.classList.remove("opacity-100", "visible");
            this._targetEl.classList.add("opacity-0", "invisible");
            this._popperInstance.setOptions((function(options) {
                return tooltip_assign(tooltip_assign({}, options), {
                    modifiers: tooltip_spreadArray(tooltip_spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: false
                    } ], false)
                });
            }));
            this._removeClickOutsideListener();
            this._removeKeydownListener();
            this._visible = false;
            this._options.onHide(this);
        };
        Tooltip.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Tooltip.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Tooltip.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Tooltip;
    }();
    function initTooltips() {
        document.querySelectorAll("[data-tooltip-target]").forEach((function($triggerEl) {
            var tooltipId = $triggerEl.getAttribute("data-tooltip-target");
            var $tooltipEl = document.getElementById(tooltipId);
            if ($tooltipEl) {
                var triggerType = $triggerEl.getAttribute("data-tooltip-trigger");
                var placement = $triggerEl.getAttribute("data-tooltip-placement");
                new Tooltip($tooltipEl, $triggerEl, {
                    placement: placement ? placement : tooltip_Default.placement,
                    triggerType: triggerType ? triggerType : tooltip_Default.triggerType
                });
            } else console.error('The tooltip element with id "'.concat(tooltipId, '" does not exist. Please check the data-tooltip-target attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.Tooltip = Tooltip;
        window.initTooltips = initTooltips;
    }
    var popover_assign = void 0 && (void 0).__assign || function() {
        popover_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return popover_assign.apply(this, arguments);
    };
    var popover_spreadArray = void 0 && (void 0).__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2) for (var ar, i = 0, l = from.length; i < l; i++) if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var popover_Default = {
        placement: "top",
        offset: 10,
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    };
    var popover_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Popover = function() {
        function Popover(targetEl, triggerEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (triggerEl === void 0) triggerEl = null;
            if (options === void 0) options = popover_Default;
            if (instanceOptions === void 0) instanceOptions = popover_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._triggerEl = triggerEl;
            this._options = popover_assign(popover_assign({}, popover_Default), options);
            this._popperInstance = null;
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Popover", this, instanceOptions.id ? instanceOptions.id : this._targetEl.id, instanceOptions.override);
        }
        Popover.prototype.init = function() {
            if (this._triggerEl && this._targetEl && !this._initialized) {
                this._setupEventListeners();
                this._popperInstance = this._createPopperInstance();
                this._initialized = true;
            }
        };
        Popover.prototype.destroy = function() {
            var _this = this;
            if (this._initialized) {
                var triggerEvents = this._getTriggerEvents();
                triggerEvents.showEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._showHandler);
                    _this._targetEl.removeEventListener(ev, _this._showHandler);
                }));
                triggerEvents.hideEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._hideHandler);
                    _this._targetEl.removeEventListener(ev, _this._hideHandler);
                }));
                this._removeKeydownListener();
                this._removeClickOutsideListener();
                if (this._popperInstance) this._popperInstance.destroy();
                this._initialized = false;
            }
        };
        Popover.prototype.removeInstance = function() {
            dom_instances.removeInstance("Popover", this._instanceId);
        };
        Popover.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Popover.prototype._setupEventListeners = function() {
            var _this = this;
            var triggerEvents = this._getTriggerEvents();
            this._showHandler = function() {
                _this.show();
            };
            this._hideHandler = function() {
                setTimeout((function() {
                    if (!_this._targetEl.matches(":hover")) _this.hide();
                }), 100);
            };
            triggerEvents.showEvents.forEach((function(ev) {
                _this._triggerEl.addEventListener(ev, _this._showHandler);
                _this._targetEl.addEventListener(ev, _this._showHandler);
            }));
            triggerEvents.hideEvents.forEach((function(ev) {
                _this._triggerEl.addEventListener(ev, _this._hideHandler);
                _this._targetEl.addEventListener(ev, _this._hideHandler);
            }));
        };
        Popover.prototype._createPopperInstance = function() {
            return popper_createPopper(this._triggerEl, this._targetEl, {
                placement: this._options.placement,
                modifiers: [ {
                    name: "offset",
                    options: {
                        offset: [ 0, this._options.offset ]
                    }
                } ]
            });
        };
        Popover.prototype._getTriggerEvents = function() {
            switch (this._options.triggerType) {
              case "hover":
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };

              case "click":
                return {
                    showEvents: [ "click", "focus" ],
                    hideEvents: [ "focusout", "blur" ]
                };

              case "none":
                return {
                    showEvents: [],
                    hideEvents: []
                };

              default:
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };
            }
        };
        Popover.prototype._setupKeydownListener = function() {
            var _this = this;
            this._keydownEventListener = function(ev) {
                if (ev.key === "Escape") _this.hide();
            };
            document.body.addEventListener("keydown", this._keydownEventListener, true);
        };
        Popover.prototype._removeKeydownListener = function() {
            document.body.removeEventListener("keydown", this._keydownEventListener, true);
        };
        Popover.prototype._setupClickOutsideListener = function() {
            var _this = this;
            this._clickOutsideEventListener = function(ev) {
                _this._handleClickOutside(ev, _this._targetEl);
            };
            document.body.addEventListener("click", this._clickOutsideEventListener, true);
        };
        Popover.prototype._removeClickOutsideListener = function() {
            document.body.removeEventListener("click", this._clickOutsideEventListener, true);
        };
        Popover.prototype._handleClickOutside = function(ev, targetEl) {
            var clickedEl = ev.target;
            if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) this.hide();
        };
        Popover.prototype.isVisible = function() {
            return this._visible;
        };
        Popover.prototype.toggle = function() {
            if (this.isVisible()) this.hide(); else this.show();
            this._options.onToggle(this);
        };
        Popover.prototype.show = function() {
            this._targetEl.classList.remove("opacity-0", "invisible");
            this._targetEl.classList.add("opacity-100", "visible");
            this._popperInstance.setOptions((function(options) {
                return popover_assign(popover_assign({}, options), {
                    modifiers: popover_spreadArray(popover_spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: true
                    } ], false)
                });
            }));
            this._setupClickOutsideListener();
            this._setupKeydownListener();
            this._popperInstance.update();
            this._visible = true;
            this._options.onShow(this);
        };
        Popover.prototype.hide = function() {
            this._targetEl.classList.remove("opacity-100", "visible");
            this._targetEl.classList.add("opacity-0", "invisible");
            this._popperInstance.setOptions((function(options) {
                return popover_assign(popover_assign({}, options), {
                    modifiers: popover_spreadArray(popover_spreadArray([], options.modifiers, true), [ {
                        name: "eventListeners",
                        enabled: false
                    } ], false)
                });
            }));
            this._removeClickOutsideListener();
            this._removeKeydownListener();
            this._visible = false;
            this._options.onHide(this);
        };
        Popover.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Popover.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Popover.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Popover;
    }();
    function initPopovers() {
        document.querySelectorAll("[data-popover-target]").forEach((function($triggerEl) {
            var popoverID = $triggerEl.getAttribute("data-popover-target");
            var $popoverEl = document.getElementById(popoverID);
            if ($popoverEl) {
                var triggerType = $triggerEl.getAttribute("data-popover-trigger");
                var placement = $triggerEl.getAttribute("data-popover-placement");
                var offset = $triggerEl.getAttribute("data-popover-offset");
                new Popover($popoverEl, $triggerEl, {
                    placement: placement ? placement : popover_Default.placement,
                    offset: offset ? parseInt(offset) : popover_Default.offset,
                    triggerType: triggerType ? triggerType : popover_Default.triggerType
                });
            } else console.error('The popover element with id "'.concat(popoverID, '" does not exist. Please check the data-popover-target attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.Popover = Popover;
        window.initPopovers = initPopovers;
    }
    var dial_assign = void 0 && (void 0).__assign || function() {
        dial_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return dial_assign.apply(this, arguments);
    };
    var dial_Default = {
        triggerType: "hover",
        onShow: function() {},
        onHide: function() {},
        onToggle: function() {}
    };
    var dial_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Dial = function() {
        function Dial(parentEl, triggerEl, targetEl, options, instanceOptions) {
            if (parentEl === void 0) parentEl = null;
            if (triggerEl === void 0) triggerEl = null;
            if (targetEl === void 0) targetEl = null;
            if (options === void 0) options = dial_Default;
            if (instanceOptions === void 0) instanceOptions = dial_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._parentEl = parentEl;
            this._triggerEl = triggerEl;
            this._targetEl = targetEl;
            this._options = dial_assign(dial_assign({}, dial_Default), options);
            this._visible = false;
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Dial", this, this._instanceId, instanceOptions.override);
        }
        Dial.prototype.init = function() {
            var _this = this;
            if (this._triggerEl && this._targetEl && !this._initialized) {
                var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
                this._showEventHandler = function() {
                    _this.show();
                };
                triggerEventTypes.showEvents.forEach((function(ev) {
                    _this._triggerEl.addEventListener(ev, _this._showEventHandler);
                    _this._targetEl.addEventListener(ev, _this._showEventHandler);
                }));
                this._hideEventHandler = function() {
                    if (!_this._parentEl.matches(":hover")) _this.hide();
                };
                triggerEventTypes.hideEvents.forEach((function(ev) {
                    _this._parentEl.addEventListener(ev, _this._hideEventHandler);
                }));
                this._initialized = true;
            }
        };
        Dial.prototype.destroy = function() {
            var _this = this;
            if (this._initialized) {
                var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
                triggerEventTypes.showEvents.forEach((function(ev) {
                    _this._triggerEl.removeEventListener(ev, _this._showEventHandler);
                    _this._targetEl.removeEventListener(ev, _this._showEventHandler);
                }));
                triggerEventTypes.hideEvents.forEach((function(ev) {
                    _this._parentEl.removeEventListener(ev, _this._hideEventHandler);
                }));
                this._initialized = false;
            }
        };
        Dial.prototype.removeInstance = function() {
            dom_instances.removeInstance("Dial", this._instanceId);
        };
        Dial.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Dial.prototype.hide = function() {
            this._targetEl.classList.add("hidden");
            if (this._triggerEl) this._triggerEl.setAttribute("aria-expanded", "false");
            this._visible = false;
            this._options.onHide(this);
        };
        Dial.prototype.show = function() {
            this._targetEl.classList.remove("hidden");
            if (this._triggerEl) this._triggerEl.setAttribute("aria-expanded", "true");
            this._visible = true;
            this._options.onShow(this);
        };
        Dial.prototype.toggle = function() {
            if (this._visible) this.hide(); else this.show();
        };
        Dial.prototype.isHidden = function() {
            return !this._visible;
        };
        Dial.prototype.isVisible = function() {
            return this._visible;
        };
        Dial.prototype._getTriggerEventTypes = function(triggerType) {
            switch (triggerType) {
              case "hover":
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };

              case "click":
                return {
                    showEvents: [ "click", "focus" ],
                    hideEvents: [ "focusout", "blur" ]
                };

              case "none":
                return {
                    showEvents: [],
                    hideEvents: []
                };

              default:
                return {
                    showEvents: [ "mouseenter", "focus" ],
                    hideEvents: [ "mouseleave", "blur" ]
                };
            }
        };
        Dial.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Dial.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        Dial.prototype.updateOnToggle = function(callback) {
            this._options.onToggle = callback;
        };
        return Dial;
    }();
    function initDials() {
        document.querySelectorAll("[data-dial-init]").forEach((function($parentEl) {
            var $triggerEl = $parentEl.querySelector("[data-dial-toggle]");
            if ($triggerEl) {
                var dialId = $triggerEl.getAttribute("data-dial-toggle");
                var $dialEl = document.getElementById(dialId);
                if ($dialEl) {
                    var triggerType = $triggerEl.getAttribute("data-dial-trigger");
                    new Dial($parentEl, $triggerEl, $dialEl, {
                        triggerType: triggerType ? triggerType : dial_Default.triggerType
                    });
                } else console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
            } else console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
        }));
    }
    if (typeof window !== "undefined") {
        window.Dial = Dial;
        window.initDials = initDials;
    }
    var input_counter_assign = void 0 && (void 0).__assign || function() {
        input_counter_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return input_counter_assign.apply(this, arguments);
    };
    var input_counter_Default = {
        minValue: null,
        maxValue: null,
        onIncrement: function() {},
        onDecrement: function() {}
    };
    var input_counter_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var InputCounter = function() {
        function InputCounter(targetEl, incrementEl, decrementEl, options, instanceOptions) {
            if (targetEl === void 0) targetEl = null;
            if (incrementEl === void 0) incrementEl = null;
            if (decrementEl === void 0) decrementEl = null;
            if (options === void 0) options = input_counter_Default;
            if (instanceOptions === void 0) instanceOptions = input_counter_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._targetEl = targetEl;
            this._incrementEl = incrementEl;
            this._decrementEl = decrementEl;
            this._options = input_counter_assign(input_counter_assign({}, input_counter_Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("InputCounter", this, this._instanceId, instanceOptions.override);
        }
        InputCounter.prototype.init = function() {
            var _this = this;
            if (this._targetEl && !this._initialized) {
                this._inputHandler = function(event) {
                    var target = event.target;
                    if (!/^\d*$/.test(target.value)) target.value = target.value.replace(/[^\d]/g, "");
                    if (_this._options.maxValue !== null && parseInt(target.value) > _this._options.maxValue) target.value = _this._options.maxValue.toString();
                    if (_this._options.minValue !== null && parseInt(target.value) < _this._options.minValue) target.value = _this._options.minValue.toString();
                };
                this._incrementClickHandler = function() {
                    _this.increment();
                };
                this._decrementClickHandler = function() {
                    _this.decrement();
                };
                this._targetEl.addEventListener("input", this._inputHandler);
                if (this._incrementEl) this._incrementEl.addEventListener("click", this._incrementClickHandler);
                if (this._decrementEl) this._decrementEl.addEventListener("click", this._decrementClickHandler);
                this._initialized = true;
            }
        };
        InputCounter.prototype.destroy = function() {
            if (this._targetEl && this._initialized) {
                this._targetEl.removeEventListener("input", this._inputHandler);
                if (this._incrementEl) this._incrementEl.removeEventListener("click", this._incrementClickHandler);
                if (this._decrementEl) this._decrementEl.removeEventListener("click", this._decrementClickHandler);
                this._initialized = false;
            }
        };
        InputCounter.prototype.removeInstance = function() {
            dom_instances.removeInstance("InputCounter", this._instanceId);
        };
        InputCounter.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        InputCounter.prototype.getCurrentValue = function() {
            return parseInt(this._targetEl.value) || 0;
        };
        InputCounter.prototype.increment = function() {
            if (this._options.maxValue !== null && this.getCurrentValue() >= this._options.maxValue) return;
            this._targetEl.value = (this.getCurrentValue() + 1).toString();
            this._options.onIncrement(this);
        };
        InputCounter.prototype.decrement = function() {
            if (this._options.minValue !== null && this.getCurrentValue() <= this._options.minValue) return;
            this._targetEl.value = (this.getCurrentValue() - 1).toString();
            this._options.onDecrement(this);
        };
        InputCounter.prototype.updateOnIncrement = function(callback) {
            this._options.onIncrement = callback;
        };
        InputCounter.prototype.updateOnDecrement = function(callback) {
            this._options.onDecrement = callback;
        };
        return InputCounter;
    }();
    function initInputCounters() {
        document.querySelectorAll("[data-input-counter]").forEach((function($targetEl) {
            var targetId = $targetEl.id;
            var $incrementEl = document.querySelector('[data-input-counter-increment="' + targetId + '"]');
            var $decrementEl = document.querySelector('[data-input-counter-decrement="' + targetId + '"]');
            var minValue = $targetEl.getAttribute("data-input-counter-min");
            var maxValue = $targetEl.getAttribute("data-input-counter-max");
            if ($targetEl) {
                if (!dom_instances.instanceExists("InputCounter", $targetEl.getAttribute("id"))) new InputCounter($targetEl, $incrementEl ? $incrementEl : null, $decrementEl ? $decrementEl : null, {
                    minValue: minValue ? parseInt(minValue) : null,
                    maxValue: maxValue ? parseInt(maxValue) : null
                });
            } else console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-input-counter attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.InputCounter = InputCounter;
        window.initInputCounters = initInputCounters;
    }
    var clipboard_assign = void 0 && (void 0).__assign || function() {
        clipboard_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return clipboard_assign.apply(this, arguments);
    };
    var clipboard_Default = {
        htmlEntities: false,
        contentType: "input",
        onCopy: function() {}
    };
    var clipboard_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var CopyClipboard = function() {
        function CopyClipboard(triggerEl, targetEl, options, instanceOptions) {
            if (triggerEl === void 0) triggerEl = null;
            if (targetEl === void 0) targetEl = null;
            if (options === void 0) options = clipboard_Default;
            if (instanceOptions === void 0) instanceOptions = clipboard_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : targetEl.id;
            this._triggerEl = triggerEl;
            this._targetEl = targetEl;
            this._options = clipboard_assign(clipboard_assign({}, clipboard_Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("CopyClipboard", this, this._instanceId, instanceOptions.override);
        }
        CopyClipboard.prototype.init = function() {
            var _this = this;
            if (this._targetEl && this._triggerEl && !this._initialized) {
                this._triggerElClickHandler = function() {
                    _this.copy();
                };
                if (this._triggerEl) this._triggerEl.addEventListener("click", this._triggerElClickHandler);
                this._initialized = true;
            }
        };
        CopyClipboard.prototype.destroy = function() {
            if (this._triggerEl && this._targetEl && this._initialized) {
                if (this._triggerEl) this._triggerEl.removeEventListener("click", this._triggerElClickHandler);
                this._initialized = false;
            }
        };
        CopyClipboard.prototype.removeInstance = function() {
            dom_instances.removeInstance("CopyClipboard", this._instanceId);
        };
        CopyClipboard.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        CopyClipboard.prototype.getTargetValue = function() {
            if (this._options.contentType === "input") return this._targetEl.value;
            if (this._options.contentType === "innerHTML") return this._targetEl.innerHTML;
            if (this._options.contentType === "textContent") return this._targetEl.textContent.replace(/\s+/g, " ").trim();
        };
        CopyClipboard.prototype.copy = function() {
            var textToCopy = this.getTargetValue();
            if (this._options.htmlEntities) textToCopy = this.decodeHTML(textToCopy);
            var tempTextArea = document.createElement("textarea");
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);
            this._options.onCopy(this);
            return textToCopy;
        };
        CopyClipboard.prototype.decodeHTML = function(html) {
            var textarea = document.createElement("textarea");
            textarea.innerHTML = html;
            return textarea.textContent;
        };
        CopyClipboard.prototype.updateOnCopyCallback = function(callback) {
            this._options.onCopy = callback;
        };
        return CopyClipboard;
    }();
    function initCopyClipboards() {
        document.querySelectorAll("[data-copy-to-clipboard-target]").forEach((function($triggerEl) {
            var targetId = $triggerEl.getAttribute("data-copy-to-clipboard-target");
            var $targetEl = document.getElementById(targetId);
            var contentType = $triggerEl.getAttribute("data-copy-to-clipboard-content-type");
            var htmlEntities = $triggerEl.getAttribute("data-copy-to-clipboard-html-entities");
            if ($targetEl) {
                if (!dom_instances.instanceExists("CopyClipboard", $targetEl.getAttribute("id"))) new CopyClipboard($triggerEl, $targetEl, {
                    htmlEntities: htmlEntities && htmlEntities === "true" ? true : clipboard_Default.htmlEntities,
                    contentType: contentType ? contentType : clipboard_Default.contentType
                });
            } else console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-copy-to-clipboard-target attribute.'));
        }));
    }
    if (typeof window !== "undefined") {
        window.CopyClipboard = CopyClipboard;
        window.initClipboards = initCopyClipboards;
    }
    function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
    }
    function _arrayWithHoles(r) {
        if (Array.isArray(r)) return r;
    }
    function _arrayWithoutHoles(r) {
        if (Array.isArray(r)) return _arrayLikeToArray(r);
    }
    function _assertThisInitialized(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
    }
    function _callSuper(t, o, e) {
        return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
    }
    function _classCallCheck(a, n) {
        if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e, r) {
        for (var t = 0; t < r.length; t++) {
            var o = r[t];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
            Object.defineProperty(e, _toPropertyKey(o.key), o);
        }
    }
    function _createClass(e, r, t) {
        return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
            writable: !1
        }), e;
    }
    function _get() {
        return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
            var p = _superPropBase(e, t);
            if (p) {
                var n = Object.getOwnPropertyDescriptor(p, t);
                return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
            }
        }, _get.apply(null, arguments);
    }
    function _getPrototypeOf(t) {
        return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t);
        }, _getPrototypeOf(t);
    }
    function _inherits(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                writable: !0,
                configurable: !0
            }
        }), Object.defineProperty(t, "prototype", {
            writable: !1
        }), e && _setPrototypeOf(t, e);
    }
    function _isNativeReflectConstruct() {
        try {
            var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {})));
        } catch (t) {}
        return (_isNativeReflectConstruct = function() {
            return !!t;
        })();
    }
    function _iterableToArray(r) {
        if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
    }
    function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
            var e, n, i, u, a = [], f = !0, o = !1;
            try {
                if (i = (t = t.call(r)).next, 0 === l) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else for (;!(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) ;
            } catch (r) {
                o = !0, n = r;
            } finally {
                try {
                    if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
                } finally {
                    if (o) throw n;
                }
            }
            return a;
        }
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _possibleConstructorReturn(t, e) {
        if (e && ("object" == typeof e || "function" == typeof e)) return e;
        if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
        return _assertThisInitialized(t);
    }
    function _setPrototypeOf(t, e) {
        return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
            return t.__proto__ = e, t;
        }, _setPrototypeOf(t, e);
    }
    function _slicedToArray(r, e) {
        return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }
    function _superPropBase(t, o) {
        for (;!{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)); ) ;
        return t;
    }
    function _toConsumableArray(r) {
        return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
    }
    function _toPrimitive(t, r) {
        if ("object" != typeof t || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var i = e.call(t, r || "default");
            if ("object" != typeof i) return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == typeof i ? i : i + "";
    }
    function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
            return typeof o;
        } : function(o) {
            return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
        }, _typeof(o);
    }
    function _unsupportedIterableToArray(r, a) {
        if (r) {
            if ("string" == typeof r) return _arrayLikeToArray(r, a);
            var t = {}.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
    }
    function hasProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    function lastItemOf(arr) {
        return arr[arr.length - 1];
    }
    function pushUnique(arr) {
        for (var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) items[_key - 1] = arguments[_key];
        items.forEach((function(item) {
            if (arr.includes(item)) return;
            arr.push(item);
        }));
        return arr;
    }
    function stringToArray(str, separator) {
        return str ? str.split(separator) : [];
    }
    function isInRange(testVal, min, max) {
        var minOK = min === void 0 || testVal >= min;
        var maxOK = max === void 0 || testVal <= max;
        return minOK && maxOK;
    }
    function limitToRange(val, min, max) {
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }
    function createTagRepeat(tagName, repeat) {
        var attributes = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var index = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
        var html = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "";
        var openTagSrc = Object.keys(attributes).reduce((function(src, attr) {
            var val = attributes[attr];
            if (typeof val === "function") val = val(index);
            return "".concat(src, " ").concat(attr, '="').concat(val, '"');
        }), tagName);
        html += "<".concat(openTagSrc, "></").concat(tagName, ">");
        var next = index + 1;
        return next < repeat ? createTagRepeat(tagName, repeat, attributes, next, html) : html;
    }
    function optimizeTemplateHTML(html) {
        return html.replace(/>\s+/g, ">").replace(/\s+</, "<");
    }
    function stripTime(timeValue) {
        return new Date(timeValue).setHours(0, 0, 0, 0);
    }
    function today() {
        return (new Date).setHours(0, 0, 0, 0);
    }
    function dateValue() {
        switch (arguments.length) {
          case 0:
            return today();

          case 1:
            return stripTime(arguments.length <= 0 ? void 0 : arguments[0]);
        }
        var newDate = new Date(0);
        newDate.setFullYear.apply(newDate, arguments);
        return newDate.setHours(0, 0, 0, 0);
    }
    function addDays(date, amount) {
        var newDate = new Date(date);
        return newDate.setDate(newDate.getDate() + amount);
    }
    function addWeeks(date, amount) {
        return addDays(date, amount * 7);
    }
    function addMonths(date, amount) {
        var newDate = new Date(date);
        var monthsToSet = newDate.getMonth() + amount;
        var expectedMonth = monthsToSet % 12;
        if (expectedMonth < 0) expectedMonth += 12;
        var time = newDate.setMonth(monthsToSet);
        return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
    }
    function addYears(date, amount) {
        var newDate = new Date(date);
        var expectedMonth = newDate.getMonth();
        var time = newDate.setFullYear(newDate.getFullYear() + amount);
        return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
    }
    function dayDiff(day, from) {
        return (day - from + 7) % 7;
    }
    function dayOfTheWeekOf(baseDate, dayOfWeek) {
        var weekStart = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
        var baseDay = new Date(baseDate).getDay();
        return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
    }
    function getWeek(date) {
        var thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
        var firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
        return Math.round((thuOfTheWeek - firstThu) / 6048e5) + 1;
    }
    function startOfYearPeriod(date, years) {
        var year = new Date(date).getFullYear();
        return Math.floor(year / years) * years;
    }
    var reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
    var reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
    var knownFormats = {};
    var parseFns = {
        y: function y(date, year) {
            return new Date(date).setFullYear(parseInt(year, 10));
        },
        m: function m(date, month, locale) {
            var newDate = new Date(date);
            var monthIndex = parseInt(month, 10) - 1;
            if (isNaN(monthIndex)) {
                if (!month) return NaN;
                var monthName = month.toLowerCase();
                var compareNames = function compareNames(name) {
                    return name.toLowerCase().startsWith(monthName);
                };
                monthIndex = locale.monthsShort.findIndex(compareNames);
                if (monthIndex < 0) monthIndex = locale.months.findIndex(compareNames);
                if (monthIndex < 0) return NaN;
            }
            newDate.setMonth(monthIndex);
            return newDate.getMonth() !== normalizeMonth(monthIndex) ? newDate.setDate(0) : newDate.getTime();
        },
        d: function d(date, day) {
            return new Date(date).setDate(parseInt(day, 10));
        }
    };
    var formatFns = {
        d: function d(date) {
            return date.getDate();
        },
        dd: function dd(date) {
            return padZero(date.getDate(), 2);
        },
        D: function D(date, locale) {
            return locale.daysShort[date.getDay()];
        },
        DD: function DD(date, locale) {
            return locale.days[date.getDay()];
        },
        m: function m(date) {
            return date.getMonth() + 1;
        },
        mm: function mm(date) {
            return padZero(date.getMonth() + 1, 2);
        },
        M: function M(date, locale) {
            return locale.monthsShort[date.getMonth()];
        },
        MM: function MM(date, locale) {
            return locale.months[date.getMonth()];
        },
        y: function y(date) {
            return date.getFullYear();
        },
        yy: function yy(date) {
            return padZero(date.getFullYear(), 2).slice(-2);
        },
        yyyy: function yyyy(date) {
            return padZero(date.getFullYear(), 4);
        }
    };
    function normalizeMonth(monthIndex) {
        return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
    }
    function padZero(num, length) {
        return num.toString().padStart(length, "0");
    }
    function parseFormatString(format) {
        if (typeof format !== "string") throw new Error("Invalid date format.");
        if (format in knownFormats) return knownFormats[format];
        var separators = format.split(reFormatTokens);
        var parts = format.match(new RegExp(reFormatTokens, "g"));
        if (separators.length === 0 || !parts) throw new Error("Invalid date format.");
        var partFormatters = parts.map((function(token) {
            return formatFns[token];
        }));
        var partParserKeys = Object.keys(parseFns).reduce((function(keys, key) {
            var token = parts.find((function(part) {
                return part[0] !== "D" && part[0].toLowerCase() === key;
            }));
            if (token) keys.push(key);
            return keys;
        }), []);
        return knownFormats[format] = {
            parser: function parser(dateStr, locale) {
                var dateParts = dateStr.split(reNonDateParts).reduce((function(dtParts, part, index) {
                    if (part.length > 0 && parts[index]) {
                        var token = parts[index][0];
                        if (token === "M") dtParts.m = part; else if (token !== "D") dtParts[token] = part;
                    }
                    return dtParts;
                }), {});
                return partParserKeys.reduce((function(origDate, key) {
                    var newDate = parseFns[key](origDate, dateParts[key], locale);
                    return isNaN(newDate) ? origDate : newDate;
                }), today());
            },
            formatter: function formatter(date, locale) {
                var dateStr = partFormatters.reduce((function(str, fn, index) {
                    return str += "".concat(separators[index]).concat(fn(date, locale));
                }), "");
                return dateStr += lastItemOf(separators);
            }
        };
    }
    function parseDate(dateStr, format, locale) {
        if (dateStr instanceof Date || typeof dateStr === "number") {
            var date = stripTime(dateStr);
            return isNaN(date) ? void 0 : date;
        }
        if (!dateStr) return;
        if (dateStr === "today") return today();
        if (format && format.toValue) {
            var _date = format.toValue(dateStr, format, locale);
            return isNaN(_date) ? void 0 : stripTime(_date);
        }
        return parseFormatString(format).parser(dateStr, locale);
    }
    function formatDate(date, format, locale) {
        if (isNaN(date) || !date && date !== 0) return "";
        var dateObj = typeof date === "number" ? new Date(date) : date;
        if (format.toDisplay) return format.toDisplay(dateObj, format, locale);
        return parseFormatString(format).formatter(dateObj, locale);
    }
    var listenerRegistry = new WeakMap;
    var _EventTarget$prototyp = EventTarget.prototype, addEventListener = _EventTarget$prototyp.addEventListener, removeEventListener = _EventTarget$prototyp.removeEventListener;
    function registerListeners(keyObj, listeners) {
        var registered = listenerRegistry.get(keyObj);
        if (!registered) {
            registered = [];
            listenerRegistry.set(keyObj, registered);
        }
        listeners.forEach((function(listener) {
            addEventListener.call.apply(addEventListener, _toConsumableArray(listener));
            registered.push(listener);
        }));
    }
    function unregisterListeners(keyObj) {
        var listeners = listenerRegistry.get(keyObj);
        if (!listeners) return;
        listeners.forEach((function(listener) {
            removeEventListener.call.apply(removeEventListener, _toConsumableArray(listener));
        }));
        listenerRegistry["delete"](keyObj);
    }
    if (!Event.prototype.composedPath) {
        var getComposedPath = function getComposedPath(node) {
            var path = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
            path.push(node);
            var parent;
            if (node.parentNode) parent = node.parentNode; else if (node.host) parent = node.host; else if (node.defaultView) parent = node.defaultView;
            return parent ? getComposedPath(parent, path) : path;
        };
        Event.prototype.composedPath = function() {
            return getComposedPath(this.target);
        };
    }
    function findFromPath(path, criteria, currentTarget) {
        var index = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
        var el = path[index];
        if (criteria(el)) return el; else if (el === currentTarget || !el.parentElement) return;
        return findFromPath(path, criteria, currentTarget, index + 1);
    }
    function findElementInEventPath(ev, selector) {
        var criteria = typeof selector === "function" ? selector : function(el) {
            return el.matches(selector);
        };
        return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
    }
    var locales = {
        en: {
            days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            daysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            daysMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
            months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            today: "Today",
            clear: "Clear",
            titleFormat: "MM y"
        }
    };
    var defaultOptions = {
        autohide: false,
        beforeShowDay: null,
        beforeShowDecade: null,
        beforeShowMonth: null,
        beforeShowYear: null,
        calendarWeeks: false,
        clearBtn: false,
        dateDelimiter: ",",
        datesDisabled: [],
        daysOfWeekDisabled: [],
        daysOfWeekHighlighted: [],
        defaultViewDate: void 0,
        disableTouchKeyboard: false,
        format: "mm/dd/yyyy",
        language: "en",
        maxDate: null,
        maxNumberOfDates: 1,
        maxView: 3,
        minDate: null,
        nextArrow: '<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>',
        orientation: "auto",
        pickLevel: 0,
        prevArrow: '<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/></svg>',
        showDaysOfWeek: true,
        showOnClick: true,
        showOnFocus: true,
        startView: 0,
        title: "",
        todayBtn: false,
        todayBtnMode: 0,
        todayHighlight: false,
        updateOnBlur: true,
        weekStart: 0
    };
    var range = null;
    function parseHTML(html) {
        if (range == null) range = document.createRange();
        return range.createContextualFragment(html);
    }
    function hideElement(el) {
        if (el.style.display === "none") return;
        if (el.style.display) el.dataset.styleDisplay = el.style.display;
        el.style.display = "none";
    }
    function showElement(el) {
        if (el.style.display !== "none") return;
        if (el.dataset.styleDisplay) {
            el.style.display = el.dataset.styleDisplay;
            delete el.dataset.styleDisplay;
        } else el.style.display = "";
    }
    function emptyChildNodes(el) {
        if (el.firstChild) {
            el.removeChild(el.firstChild);
            emptyChildNodes(el);
        }
    }
    function replaceChildNodes(el, newChildNodes) {
        emptyChildNodes(el);
        if (newChildNodes instanceof DocumentFragment) el.appendChild(newChildNodes); else if (typeof newChildNodes === "string") el.appendChild(parseHTML(newChildNodes)); else if (typeof newChildNodes.forEach === "function") newChildNodes.forEach((function(node) {
            el.appendChild(node);
        }));
    }
    var defaultLang = defaultOptions.language, defaultFormat = defaultOptions.format, defaultWeekStart = defaultOptions.weekStart;
    function sanitizeDOW(dow, day) {
        return dow.length < 6 && day >= 0 && day < 7 ? pushUnique(dow, day) : dow;
    }
    function calcEndOfWeek(startOfWeek) {
        return (startOfWeek + 6) % 7;
    }
    function validateDate(value, format, locale, origValue) {
        var date = parseDate(value, format, locale);
        return date !== void 0 ? date : origValue;
    }
    function validateViewId(value, origValue) {
        var max = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 3;
        var viewId = parseInt(value, 10);
        return viewId >= 0 && viewId <= max ? viewId : origValue;
    }
    function processOptions(options, datepicker) {
        var inOpts = Object.assign({}, options);
        var config = {};
        var locales = datepicker.constructor.locales;
        var _ref = datepicker.config || {}, format = _ref.format, language = _ref.language, locale = _ref.locale, maxDate = _ref.maxDate, maxView = _ref.maxView, minDate = _ref.minDate, pickLevel = _ref.pickLevel, startView = _ref.startView, weekStart = _ref.weekStart;
        if (inOpts.language) {
            var lang;
            if (inOpts.language !== language) if (locales[inOpts.language]) lang = inOpts.language; else {
                lang = inOpts.language.split("-")[0];
                if (locales[lang] === void 0) lang = false;
            }
            delete inOpts.language;
            if (lang) {
                language = config.language = lang;
                var origLocale = locale || locales[defaultLang];
                locale = Object.assign({
                    format: defaultFormat,
                    weekStart: defaultWeekStart
                }, locales[defaultLang]);
                if (language !== defaultLang) Object.assign(locale, locales[language]);
                config.locale = locale;
                if (format === origLocale.format) format = config.format = locale.format;
                if (weekStart === origLocale.weekStart) {
                    weekStart = config.weekStart = locale.weekStart;
                    config.weekEnd = calcEndOfWeek(locale.weekStart);
                }
            }
        }
        if (inOpts.format) {
            var hasToDisplay = typeof inOpts.format.toDisplay === "function";
            var hasToValue = typeof inOpts.format.toValue === "function";
            var validFormatString = reFormatTokens.test(inOpts.format);
            if (hasToDisplay && hasToValue || validFormatString) format = config.format = inOpts.format;
            delete inOpts.format;
        }
        var minDt = minDate;
        var maxDt = maxDate;
        if (inOpts.minDate !== void 0) {
            minDt = inOpts.minDate === null ? dateValue(0, 0, 1) : validateDate(inOpts.minDate, format, locale, minDt);
            delete inOpts.minDate;
        }
        if (inOpts.maxDate !== void 0) {
            maxDt = inOpts.maxDate === null ? void 0 : validateDate(inOpts.maxDate, format, locale, maxDt);
            delete inOpts.maxDate;
        }
        if (maxDt < minDt) {
            minDate = config.minDate = maxDt;
            maxDate = config.maxDate = minDt;
        } else {
            if (minDate !== minDt) minDate = config.minDate = minDt;
            if (maxDate !== maxDt) maxDate = config.maxDate = maxDt;
        }
        if (inOpts.datesDisabled) {
            config.datesDisabled = inOpts.datesDisabled.reduce((function(dates, dt) {
                var date = parseDate(dt, format, locale);
                return date !== void 0 ? pushUnique(dates, date) : dates;
            }), []);
            delete inOpts.datesDisabled;
        }
        if (inOpts.defaultViewDate !== void 0) {
            var viewDate = parseDate(inOpts.defaultViewDate, format, locale);
            if (viewDate !== void 0) config.defaultViewDate = viewDate;
            delete inOpts.defaultViewDate;
        }
        if (inOpts.weekStart !== void 0) {
            var wkStart = Number(inOpts.weekStart) % 7;
            if (!isNaN(wkStart)) {
                weekStart = config.weekStart = wkStart;
                config.weekEnd = calcEndOfWeek(wkStart);
            }
            delete inOpts.weekStart;
        }
        if (inOpts.daysOfWeekDisabled) {
            config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
            delete inOpts.daysOfWeekDisabled;
        }
        if (inOpts.daysOfWeekHighlighted) {
            config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
            delete inOpts.daysOfWeekHighlighted;
        }
        if (inOpts.maxNumberOfDates !== void 0) {
            var maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
            if (maxNumberOfDates >= 0) {
                config.maxNumberOfDates = maxNumberOfDates;
                config.multidate = maxNumberOfDates !== 1;
            }
            delete inOpts.maxNumberOfDates;
        }
        if (inOpts.dateDelimiter) {
            config.dateDelimiter = String(inOpts.dateDelimiter);
            delete inOpts.dateDelimiter;
        }
        var newPickLevel = pickLevel;
        if (inOpts.pickLevel !== void 0) {
            newPickLevel = validateViewId(inOpts.pickLevel, 2);
            delete inOpts.pickLevel;
        }
        if (newPickLevel !== pickLevel) pickLevel = config.pickLevel = newPickLevel;
        var newMaxView = maxView;
        if (inOpts.maxView !== void 0) {
            newMaxView = validateViewId(inOpts.maxView, maxView);
            delete inOpts.maxView;
        }
        newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
        if (newMaxView !== maxView) maxView = config.maxView = newMaxView;
        var newStartView = startView;
        if (inOpts.startView !== void 0) {
            newStartView = validateViewId(inOpts.startView, newStartView);
            delete inOpts.startView;
        }
        if (newStartView < pickLevel) newStartView = pickLevel; else if (newStartView > maxView) newStartView = maxView;
        if (newStartView !== startView) config.startView = newStartView;
        if (inOpts.prevArrow) {
            var prevArrow = parseHTML(inOpts.prevArrow);
            if (prevArrow.childNodes.length > 0) config.prevArrow = prevArrow.childNodes;
            delete inOpts.prevArrow;
        }
        if (inOpts.nextArrow) {
            var nextArrow = parseHTML(inOpts.nextArrow);
            if (nextArrow.childNodes.length > 0) config.nextArrow = nextArrow.childNodes;
            delete inOpts.nextArrow;
        }
        if (inOpts.disableTouchKeyboard !== void 0) {
            config.disableTouchKeyboard = "ontouchstart" in document && !!inOpts.disableTouchKeyboard;
            delete inOpts.disableTouchKeyboard;
        }
        if (inOpts.orientation) {
            var orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
            config.orientation = {
                x: orientation.find((function(x) {
                    return x === "left" || x === "right";
                })) || "auto",
                y: orientation.find((function(y) {
                    return y === "top" || y === "bottom";
                })) || "auto"
            };
            delete inOpts.orientation;
        }
        if (inOpts.todayBtnMode !== void 0) {
            switch (inOpts.todayBtnMode) {
              case 0:
              case 1:
                config.todayBtnMode = inOpts.todayBtnMode;
            }
            delete inOpts.todayBtnMode;
        }
        Object.keys(inOpts).forEach((function(key) {
            if (inOpts[key] !== void 0 && hasProperty(defaultOptions, key)) config[key] = inOpts[key];
        }));
        return config;
    }
    var pickerTemplate = optimizeTemplateHTML('<div class="datepicker hidden">\n  <div class="datepicker-picker inline-block rounded-lg bg-white dark:bg-gray-700 shadow-lg p-4">\n    <div class="datepicker-header">\n      <div class="datepicker-title bg-white dark:bg-gray-700 dark:text-white px-2 py-3 text-center font-semibold"></div>\n      <div class="datepicker-controls flex justify-between mb-2">\n        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn"></button>\n        <button type="button" class="text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch"></button>\n        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 next-btn"></button>\n      </div>\n    </div>\n    <div class="datepicker-main p-1"></div>\n    <div class="datepicker-footer">\n      <div class="datepicker-controls flex space-x-2 rtl:space-x-reverse mt-2">\n        <button type="button" class="%buttonClass% today-btn text-white bg-blue-700 !bg-primary-700 dark:bg-blue-600 dark:!bg-primary-600 hover:bg-blue-800 hover:!bg-primary-800 dark:hover:bg-blue-700 dark:hover:!bg-primary-700 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>\n        <button type="button" class="%buttonClass% clear-btn text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>\n      </div>\n    </div>\n  </div>\n</div>');
    var daysTemplate = optimizeTemplateHTML('<div class="days">\n  <div class="days-of-week grid grid-cols-7 mb-1">'.concat(createTagRepeat("span", 7, {
        class: "dow block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"
    }), '</div>\n  <div class="datepicker-grid w-64 grid grid-cols-7">').concat(createTagRepeat("span", 42, {
        class: "block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"
    }), "</div>\n</div>"));
    var calendarWeeksTemplate = optimizeTemplateHTML('<div class="calendar-weeks">\n  <div class="days-of-week flex"><span class="dow h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"></span></div>\n  <div class="weeks">'.concat(createTagRepeat("span", 6, {
        class: "week block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"
    }), "</div>\n</div>"));
    var View = function() {
        function View(picker, config) {
            _classCallCheck(this, View);
            Object.assign(this, config, {
                picker,
                element: parseHTML('<div class="datepicker-view flex"></div>').firstChild,
                selected: []
            });
            this.init(this.picker.datepicker.config);
        }
        return _createClass(View, [ {
            key: "init",
            value: function init(options) {
                if (options.pickLevel !== void 0) this.isMinView = this.id === options.pickLevel;
                this.setOptions(options);
                this.updateFocus();
                this.updateSelection();
            }
        }, {
            key: "performBeforeHook",
            value: function performBeforeHook(el, current, timeValue) {
                var result = this.beforeShow(new Date(timeValue));
                switch (_typeof(result)) {
                  case "boolean":
                    result = {
                        enabled: result
                    };
                    break;

                  case "string":
                    result = {
                        classes: result
                    };
                }
                if (result) {
                    if (result.enabled === false) {
                        el.classList.add("disabled");
                        pushUnique(this.disabled, current);
                    }
                    if (result.classes) {
                        var _el$classList;
                        var extraClasses = result.classes.split(/\s+/);
                        (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(extraClasses));
                        if (extraClasses.includes("disabled")) pushUnique(this.disabled, current);
                    }
                    if (result.content) replaceChildNodes(el, result.content);
                }
            }
        } ]);
    }();
    var DaysView = function(_View) {
        function DaysView(picker) {
            _classCallCheck(this, DaysView);
            return _callSuper(this, DaysView, [ picker, {
                id: 0,
                name: "days",
                cellClass: "day"
            } ]);
        }
        _inherits(DaysView, _View);
        return _createClass(DaysView, [ {
            key: "init",
            value: function init(options) {
                var onConstruction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                if (onConstruction) {
                    var inner = parseHTML(daysTemplate).firstChild;
                    this.dow = inner.firstChild;
                    this.grid = inner.lastChild;
                    this.element.appendChild(inner);
                }
                _get(_getPrototypeOf(DaysView.prototype), "init", this).call(this, options);
            }
        }, {
            key: "setOptions",
            value: function setOptions(options) {
                var _this = this;
                var updateDOW;
                if (hasProperty(options, "minDate")) this.minDate = options.minDate;
                if (hasProperty(options, "maxDate")) this.maxDate = options.maxDate;
                if (options.datesDisabled) this.datesDisabled = options.datesDisabled;
                if (options.daysOfWeekDisabled) {
                    this.daysOfWeekDisabled = options.daysOfWeekDisabled;
                    updateDOW = true;
                }
                if (options.daysOfWeekHighlighted) this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
                if (options.todayHighlight !== void 0) this.todayHighlight = options.todayHighlight;
                if (options.weekStart !== void 0) {
                    this.weekStart = options.weekStart;
                    this.weekEnd = options.weekEnd;
                    updateDOW = true;
                }
                if (options.locale) {
                    var locale = this.locale = options.locale;
                    this.dayNames = locale.daysMin;
                    this.switchLabelFormat = locale.titleFormat;
                    updateDOW = true;
                }
                if (options.beforeShowDay !== void 0) this.beforeShow = typeof options.beforeShowDay === "function" ? options.beforeShowDay : void 0;
                if (options.calendarWeeks !== void 0) if (options.calendarWeeks && !this.calendarWeeks) {
                    var weeksElem = parseHTML(calendarWeeksTemplate).firstChild;
                    this.calendarWeeks = {
                        element: weeksElem,
                        dow: weeksElem.firstChild,
                        weeks: weeksElem.lastChild
                    };
                    this.element.insertBefore(weeksElem, this.element.firstChild);
                } else if (this.calendarWeeks && !options.calendarWeeks) {
                    this.element.removeChild(this.calendarWeeks.element);
                    this.calendarWeeks = null;
                }
                if (options.showDaysOfWeek !== void 0) if (options.showDaysOfWeek) {
                    showElement(this.dow);
                    if (this.calendarWeeks) showElement(this.calendarWeeks.dow);
                } else {
                    hideElement(this.dow);
                    if (this.calendarWeeks) hideElement(this.calendarWeeks.dow);
                }
                if (updateDOW) Array.from(this.dow.children).forEach((function(el, index) {
                    var dow = (_this.weekStart + index) % 7;
                    el.textContent = _this.dayNames[dow];
                    el.className = _this.daysOfWeekDisabled.includes(dow) ? "dow disabled text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed" : "dow text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400";
                }));
            }
        }, {
            key: "updateFocus",
            value: function updateFocus() {
                var viewDate = new Date(this.picker.viewDate);
                var viewYear = viewDate.getFullYear();
                var viewMonth = viewDate.getMonth();
                var firstOfMonth = dateValue(viewYear, viewMonth, 1);
                var start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);
                this.first = firstOfMonth;
                this.last = dateValue(viewYear, viewMonth + 1, 0);
                this.start = start;
                this.focused = this.picker.viewDate;
            }
        }, {
            key: "updateSelection",
            value: function updateSelection() {
                var _this$picker$datepick = this.picker.datepicker, dates = _this$picker$datepick.dates, rangepicker = _this$picker$datepick.rangepicker;
                this.selected = dates;
                if (rangepicker) this.range = rangepicker.dates;
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;
                this.today = this.todayHighlight ? today() : void 0;
                this.disabled = _toConsumableArray(this.datesDisabled);
                var switchLabel = formatDate(this.focused, this.switchLabelFormat, this.locale);
                this.picker.setViewSwitchLabel(switchLabel);
                this.picker.setPrevBtnDisabled(this.first <= this.minDate);
                this.picker.setNextBtnDisabled(this.last >= this.maxDate);
                if (this.calendarWeeks) {
                    var startOfWeek = dayOfTheWeekOf(this.first, 1, 1);
                    Array.from(this.calendarWeeks.weeks.children).forEach((function(el, index) {
                        el.textContent = getWeek(addWeeks(startOfWeek, index));
                    }));
                }
                Array.from(this.grid.children).forEach((function(el, index) {
                    var classList = el.classList;
                    var current = addDays(_this2.start, index);
                    var date = new Date(current);
                    var day = date.getDay();
                    el.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(_this2.cellClass);
                    el.dataset.date = current;
                    el.textContent = date.getDate();
                    if (current < _this2.first) classList.add("prev", "text-gray-500", "dark:text-white"); else if (current > _this2.last) classList.add("next", "text-gray-500", "dark:text-white");
                    if (_this2.today === current) classList.add("today", "bg-gray-100", "dark:bg-gray-600");
                    if (current < _this2.minDate || current > _this2.maxDate || _this2.disabled.includes(current)) {
                        classList.add("disabled", "cursor-not-allowed", "text-gray-400", "dark:text-gray-500");
                        classList.remove("hover:bg-gray-100", "dark:hover:bg-gray-600", "text-gray-900", "dark:text-white", "cursor-pointer");
                    }
                    if (_this2.daysOfWeekDisabled.includes(day)) {
                        classList.add("disabled", "cursor-not-allowed", "text-gray-400", "dark:text-gray-500");
                        classList.remove("hover:bg-gray-100", "dark:hover:bg-gray-600", "text-gray-900", "dark:text-white", "cursor-pointer");
                        pushUnique(_this2.disabled, current);
                    }
                    if (_this2.daysOfWeekHighlighted.includes(day)) classList.add("highlighted");
                    if (_this2.range) {
                        var _this2$range = _slicedToArray(_this2.range, 2), rangeStart = _this2$range[0], rangeEnd = _this2$range[1];
                        if (current > rangeStart && current < rangeEnd) {
                            classList.add("range", "bg-gray-200", "dark:bg-gray-600");
                            classList.remove("rounded-lg", "rounded-l-lg", "rounded-r-lg");
                        }
                        if (current === rangeStart) {
                            classList.add("range-start", "bg-gray-100", "dark:bg-gray-600", "rounded-l-lg");
                            classList.remove("rounded-lg", "rounded-r-lg");
                        }
                        if (current === rangeEnd) {
                            classList.add("range-end", "bg-gray-100", "dark:bg-gray-600", "rounded-r-lg");
                            classList.remove("rounded-lg", "rounded-l-lg");
                        }
                    }
                    if (_this2.selected.includes(current)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "text-gray-500", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600", "dark:bg-gray-600", "bg-gray-100", "bg-gray-200");
                    }
                    if (current === _this2.focused) classList.add("focused");
                    if (_this2.beforeShow) _this2.performBeforeHook(el, current, current);
                }));
            }
        }, {
            key: "refresh",
            value: function refresh() {
                var _this3 = this;
                var _ref = this.range || [], _ref2 = _slicedToArray(_ref, 2), rangeStart = _ref2[0], rangeEnd = _ref2[1];
                this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(el) {
                    el.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white", "focused");
                    el.classList.add("text-gray-900", "rounded-lg", "dark:text-white");
                }));
                Array.from(this.grid.children).forEach((function(el) {
                    var current = Number(el.dataset.date);
                    var classList = el.classList;
                    classList.remove("bg-gray-200", "dark:bg-gray-600", "rounded-l-lg", "rounded-r-lg");
                    if (current > rangeStart && current < rangeEnd) {
                        classList.add("range", "bg-gray-200", "dark:bg-gray-600");
                        classList.remove("rounded-lg");
                    }
                    if (current === rangeStart) {
                        classList.add("range-start", "bg-gray-200", "dark:bg-gray-600", "rounded-l-lg");
                        classList.remove("rounded-lg");
                    }
                    if (current === rangeEnd) {
                        classList.add("range-end", "bg-gray-200", "dark:bg-gray-600", "rounded-r-lg");
                        classList.remove("rounded-lg");
                    }
                    if (_this3.selected.includes(current)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600", "bg-gray-100", "bg-gray-200", "dark:bg-gray-600");
                    }
                    if (current === _this3.focused) classList.add("focused");
                }));
            }
        }, {
            key: "refreshFocus",
            value: function refreshFocus() {
                var index = Math.round((this.focused - this.start) / 864e5);
                this.grid.querySelectorAll(".focused").forEach((function(el) {
                    el.classList.remove("focused");
                }));
                this.grid.children[index].classList.add("focused");
            }
        } ]);
    }(View);
    function computeMonthRange(range, thisYear) {
        if (!range || !range[0] || !range[1]) return;
        var _range = _slicedToArray(range, 2), _range$ = _slicedToArray(_range[0], 2), startY = _range$[0], startM = _range$[1], _range$2 = _slicedToArray(_range[1], 2), endY = _range$2[0], endM = _range$2[1];
        if (startY > thisYear || endY < thisYear) return;
        return [ startY === thisYear ? startM : -1, endY === thisYear ? endM : 12 ];
    }
    var MonthsView = function(_View) {
        function MonthsView(picker) {
            _classCallCheck(this, MonthsView);
            return _callSuper(this, MonthsView, [ picker, {
                id: 1,
                name: "months",
                cellClass: "month"
            } ]);
        }
        _inherits(MonthsView, _View);
        return _createClass(MonthsView, [ {
            key: "init",
            value: function init(options) {
                var onConstruction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                if (onConstruction) {
                    this.grid = this.element;
                    this.element.classList.add("months", "datepicker-grid", "w-64", "grid", "grid-cols-4");
                    this.grid.appendChild(parseHTML(createTagRepeat("span", 12, {
                        "data-month": function dataMonth(ix) {
                            return ix;
                        }
                    })));
                }
                _get(_getPrototypeOf(MonthsView.prototype), "init", this).call(this, options);
            }
        }, {
            key: "setOptions",
            value: function setOptions(options) {
                if (options.locale) this.monthNames = options.locale.monthsShort;
                if (hasProperty(options, "minDate")) if (options.minDate === void 0) this.minYear = this.minMonth = this.minDate = void 0; else {
                    var minDateObj = new Date(options.minDate);
                    this.minYear = minDateObj.getFullYear();
                    this.minMonth = minDateObj.getMonth();
                    this.minDate = minDateObj.setDate(1);
                }
                if (hasProperty(options, "maxDate")) if (options.maxDate === void 0) this.maxYear = this.maxMonth = this.maxDate = void 0; else {
                    var maxDateObj = new Date(options.maxDate);
                    this.maxYear = maxDateObj.getFullYear();
                    this.maxMonth = maxDateObj.getMonth();
                    this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
                }
                if (options.beforeShowMonth !== void 0) this.beforeShow = typeof options.beforeShowMonth === "function" ? options.beforeShowMonth : void 0;
            }
        }, {
            key: "updateFocus",
            value: function updateFocus() {
                var viewDate = new Date(this.picker.viewDate);
                this.year = viewDate.getFullYear();
                this.focused = viewDate.getMonth();
            }
        }, {
            key: "updateSelection",
            value: function updateSelection() {
                var _this$picker$datepick = this.picker.datepicker, dates = _this$picker$datepick.dates, rangepicker = _this$picker$datepick.rangepicker;
                this.selected = dates.reduce((function(selected, timeValue) {
                    var date = new Date(timeValue);
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    if (selected[year] === void 0) selected[year] = [ month ]; else pushUnique(selected[year], month);
                    return selected;
                }), {});
                if (rangepicker && rangepicker.dates) this.range = rangepicker.dates.map((function(timeValue) {
                    var date = new Date(timeValue);
                    return isNaN(date) ? void 0 : [ date.getFullYear(), date.getMonth() ];
                }));
            }
        }, {
            key: "render",
            value: function render() {
                var _this = this;
                this.disabled = [];
                this.picker.setViewSwitchLabel(this.year);
                this.picker.setPrevBtnDisabled(this.year <= this.minYear);
                this.picker.setNextBtnDisabled(this.year >= this.maxYear);
                var selected = this.selected[this.year] || [];
                var yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
                var isMinYear = this.year === this.minYear;
                var isMaxYear = this.year === this.maxYear;
                var range = computeMonthRange(this.range, this.year);
                Array.from(this.grid.children).forEach((function(el, index) {
                    var classList = el.classList;
                    var date = dateValue(_this.year, index, 1);
                    el.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(_this.cellClass);
                    if (_this.isMinView) el.dataset.date = date;
                    el.textContent = _this.monthNames[index];
                    if (yrOutOfRange || isMinYear && index < _this.minMonth || isMaxYear && index > _this.maxMonth) classList.add("disabled");
                    if (range) {
                        var _range2 = _slicedToArray(range, 2), rangeStart = _range2[0], rangeEnd = _range2[1];
                        if (index > rangeStart && index < rangeEnd) classList.add("range");
                        if (index === rangeStart) classList.add("range-start");
                        if (index === rangeEnd) classList.add("range-end");
                    }
                    if (selected.includes(index)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600");
                    }
                    if (index === _this.focused) classList.add("focused");
                    if (_this.beforeShow) _this.performBeforeHook(el, index, date);
                }));
            }
        }, {
            key: "refresh",
            value: function refresh() {
                var _this2 = this;
                var selected = this.selected[this.year] || [];
                var _ref = computeMonthRange(this.range, this.year) || [], _ref2 = _slicedToArray(_ref, 2), rangeStart = _ref2[0], rangeEnd = _ref2[1];
                this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(el) {
                    el.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "dark:bg-blue-600", "dark:!bg-primary-700", "dark:text-white", "text-white", "focused");
                    el.classList.add("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600");
                }));
                Array.from(this.grid.children).forEach((function(el, index) {
                    var classList = el.classList;
                    if (index > rangeStart && index < rangeEnd) classList.add("range");
                    if (index === rangeStart) classList.add("range-start");
                    if (index === rangeEnd) classList.add("range-end");
                    if (selected.includes(index)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600");
                    }
                    if (index === _this2.focused) classList.add("focused");
                }));
            }
        }, {
            key: "refreshFocus",
            value: function refreshFocus() {
                this.grid.querySelectorAll(".focused").forEach((function(el) {
                    el.classList.remove("focused");
                }));
                this.grid.children[this.focused].classList.add("focused");
            }
        } ]);
    }(View);
    function toTitleCase(word) {
        return _toConsumableArray(word).reduce((function(str, ch, ix) {
            return str += ix ? ch : ch.toUpperCase();
        }), "");
    }
    var YearsView = function(_View) {
        function YearsView(picker, config) {
            _classCallCheck(this, YearsView);
            return _callSuper(this, YearsView, [ picker, config ]);
        }
        _inherits(YearsView, _View);
        return _createClass(YearsView, [ {
            key: "init",
            value: function init(options) {
                var onConstruction = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                if (onConstruction) {
                    this.navStep = this.step * 10;
                    this.beforeShowOption = "beforeShow".concat(toTitleCase(this.cellClass));
                    this.grid = this.element;
                    this.element.classList.add(this.name, "datepicker-grid", "w-64", "grid", "grid-cols-4");
                    this.grid.appendChild(parseHTML(createTagRepeat("span", 12)));
                }
                _get(_getPrototypeOf(YearsView.prototype), "init", this).call(this, options);
            }
        }, {
            key: "setOptions",
            value: function setOptions(options) {
                if (hasProperty(options, "minDate")) if (options.minDate === void 0) this.minYear = this.minDate = void 0; else {
                    this.minYear = startOfYearPeriod(options.minDate, this.step);
                    this.minDate = dateValue(this.minYear, 0, 1);
                }
                if (hasProperty(options, "maxDate")) if (options.maxDate === void 0) this.maxYear = this.maxDate = void 0; else {
                    this.maxYear = startOfYearPeriod(options.maxDate, this.step);
                    this.maxDate = dateValue(this.maxYear, 11, 31);
                }
                if (options[this.beforeShowOption] !== void 0) {
                    var beforeShow = options[this.beforeShowOption];
                    this.beforeShow = typeof beforeShow === "function" ? beforeShow : void 0;
                }
            }
        }, {
            key: "updateFocus",
            value: function updateFocus() {
                var viewDate = new Date(this.picker.viewDate);
                var first = startOfYearPeriod(viewDate, this.navStep);
                var last = first + 9 * this.step;
                this.first = first;
                this.last = last;
                this.start = first - this.step;
                this.focused = startOfYearPeriod(viewDate, this.step);
            }
        }, {
            key: "updateSelection",
            value: function updateSelection() {
                var _this = this;
                var _this$picker$datepick = this.picker.datepicker, dates = _this$picker$datepick.dates, rangepicker = _this$picker$datepick.rangepicker;
                this.selected = dates.reduce((function(years, timeValue) {
                    return pushUnique(years, startOfYearPeriod(timeValue, _this.step));
                }), []);
                if (rangepicker && rangepicker.dates) this.range = rangepicker.dates.map((function(timeValue) {
                    if (timeValue !== void 0) return startOfYearPeriod(timeValue, _this.step);
                }));
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;
                this.disabled = [];
                this.picker.setViewSwitchLabel("".concat(this.first, "-").concat(this.last));
                this.picker.setPrevBtnDisabled(this.first <= this.minYear);
                this.picker.setNextBtnDisabled(this.last >= this.maxYear);
                Array.from(this.grid.children).forEach((function(el, index) {
                    var classList = el.classList;
                    var current = _this2.start + index * _this2.step;
                    var date = dateValue(current, 0, 1);
                    el.className = "datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(_this2.cellClass);
                    if (_this2.isMinView) el.dataset.date = date;
                    el.textContent = el.dataset.year = current;
                    if (index === 0) classList.add("prev"); else if (index === 11) classList.add("next");
                    if (current < _this2.minYear || current > _this2.maxYear) classList.add("disabled");
                    if (_this2.range) {
                        var _this2$range = _slicedToArray(_this2.range, 2), rangeStart = _this2$range[0], rangeEnd = _this2$range[1];
                        if (current > rangeStart && current < rangeEnd) classList.add("range");
                        if (current === rangeStart) classList.add("range-start");
                        if (current === rangeEnd) classList.add("range-end");
                    }
                    if (_this2.selected.includes(current)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600");
                    }
                    if (current === _this2.focused) classList.add("focused");
                    if (_this2.beforeShow) _this2.performBeforeHook(el, current, date);
                }));
            }
        }, {
            key: "refresh",
            value: function refresh() {
                var _this3 = this;
                var _ref = this.range || [], _ref2 = _slicedToArray(_ref, 2), rangeStart = _ref2[0], rangeEnd = _ref2[1];
                this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((function(el) {
                    el.classList.remove("range", "range-start", "range-end", "selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark!bg-primary-600", "dark:text-white", "focused");
                }));
                Array.from(this.grid.children).forEach((function(el) {
                    var current = Number(el.textContent);
                    var classList = el.classList;
                    if (current > rangeStart && current < rangeEnd) classList.add("range");
                    if (current === rangeStart) classList.add("range-start");
                    if (current === rangeEnd) classList.add("range-end");
                    if (_this3.selected.includes(current)) {
                        classList.add("selected", "bg-blue-700", "!bg-primary-700", "text-white", "dark:bg-blue-600", "dark:!bg-primary-600", "dark:text-white");
                        classList.remove("text-gray-900", "hover:bg-gray-100", "dark:text-white", "dark:hover:bg-gray-600");
                    }
                    if (current === _this3.focused) classList.add("focused");
                }));
            }
        }, {
            key: "refreshFocus",
            value: function refreshFocus() {
                var index = Math.round((this.focused - this.start) / this.step);
                this.grid.querySelectorAll(".focused").forEach((function(el) {
                    el.classList.remove("focused");
                }));
                this.grid.children[index].classList.add("focused");
            }
        } ]);
    }(View);
    function triggerDatepickerEvent(datepicker, type) {
        var detail = {
            date: datepicker.getDate(),
            viewDate: new Date(datepicker.picker.viewDate),
            viewId: datepicker.picker.currentView.id,
            datepicker
        };
        datepicker.element.dispatchEvent(new CustomEvent(type, {
            detail
        }));
    }
    function goToPrevOrNext(datepicker, direction) {
        var _datepicker$config = datepicker.config, minDate = _datepicker$config.minDate, maxDate = _datepicker$config.maxDate;
        var _datepicker$picker = datepicker.picker, currentView = _datepicker$picker.currentView, viewDate = _datepicker$picker.viewDate;
        var newViewDate;
        switch (currentView.id) {
          case 0:
            newViewDate = addMonths(viewDate, direction);
            break;

          case 1:
            newViewDate = addYears(viewDate, direction);
            break;

          default:
            newViewDate = addYears(viewDate, direction * currentView.navStep);
        }
        newViewDate = limitToRange(newViewDate, minDate, maxDate);
        datepicker.picker.changeFocus(newViewDate).render();
    }
    function switchView(datepicker) {
        var viewId = datepicker.picker.currentView.id;
        if (viewId === datepicker.config.maxView) return;
        datepicker.picker.changeView(viewId + 1).render();
    }
    function unfocus(datepicker) {
        if (datepicker.config.updateOnBlur) datepicker.update({
            autohide: true
        }); else {
            datepicker.refresh("input");
            datepicker.hide();
        }
    }
    function goToSelectedMonthOrYear(datepicker, selection) {
        var picker = datepicker.picker;
        var viewDate = new Date(picker.viewDate);
        var viewId = picker.currentView.id;
        var newDate = viewId === 1 ? addMonths(viewDate, selection - viewDate.getMonth()) : addYears(viewDate, selection - viewDate.getFullYear());
        picker.changeFocus(newDate).changeView(viewId - 1).render();
    }
    function onClickTodayBtn(datepicker) {
        var picker = datepicker.picker;
        var currentDate = today();
        if (datepicker.config.todayBtnMode === 1) {
            if (datepicker.config.autohide) {
                datepicker.setDate(currentDate);
                return;
            }
            datepicker.setDate(currentDate, {
                render: false
            });
            picker.update();
        }
        if (picker.viewDate !== currentDate) picker.changeFocus(currentDate);
        picker.changeView(0).render();
    }
    function onClickClearBtn(datepicker) {
        datepicker.setDate({
            clear: true
        });
    }
    function onClickViewSwitch(datepicker) {
        switchView(datepicker);
    }
    function onClickPrevBtn(datepicker) {
        goToPrevOrNext(datepicker, -1);
    }
    function onClickNextBtn(datepicker) {
        goToPrevOrNext(datepicker, 1);
    }
    function onClickView(datepicker, ev) {
        var target = findElementInEventPath(ev, ".datepicker-cell");
        if (!target || target.classList.contains("disabled")) return;
        var _datepicker$picker$cu = datepicker.picker.currentView, id = _datepicker$picker$cu.id, isMinView = _datepicker$picker$cu.isMinView;
        if (isMinView) datepicker.setDate(Number(target.dataset.date)); else if (id === 1) goToSelectedMonthOrYear(datepicker, Number(target.dataset.month)); else goToSelectedMonthOrYear(datepicker, Number(target.dataset.year));
    }
    function onClickPicker(datepicker) {
        if (!datepicker.inline && !datepicker.config.disableTouchKeyboard) datepicker.inputField.focus();
    }
    function processPickerOptions(picker, options) {
        if (options.title !== void 0) if (options.title) {
            picker.controls.title.textContent = options.title;
            showElement(picker.controls.title);
        } else {
            picker.controls.title.textContent = "";
            hideElement(picker.controls.title);
        }
        if (options.prevArrow) {
            var prevBtn = picker.controls.prevBtn;
            emptyChildNodes(prevBtn);
            options.prevArrow.forEach((function(node) {
                prevBtn.appendChild(node.cloneNode(true));
            }));
        }
        if (options.nextArrow) {
            var nextBtn = picker.controls.nextBtn;
            emptyChildNodes(nextBtn);
            options.nextArrow.forEach((function(node) {
                nextBtn.appendChild(node.cloneNode(true));
            }));
        }
        if (options.locale) {
            picker.controls.todayBtn.textContent = options.locale.today;
            picker.controls.clearBtn.textContent = options.locale.clear;
        }
        if (options.todayBtn !== void 0) if (options.todayBtn) showElement(picker.controls.todayBtn); else hideElement(picker.controls.todayBtn);
        if (hasProperty(options, "minDate") || hasProperty(options, "maxDate")) {
            var _picker$datepicker$co = picker.datepicker.config, minDate = _picker$datepicker$co.minDate, maxDate = _picker$datepicker$co.maxDate;
            picker.controls.todayBtn.disabled = !isInRange(today(), minDate, maxDate);
        }
        if (options.clearBtn !== void 0) if (options.clearBtn) showElement(picker.controls.clearBtn); else hideElement(picker.controls.clearBtn);
    }
    function computeResetViewDate(datepicker) {
        var dates = datepicker.dates, config = datepicker.config;
        var viewDate = dates.length > 0 ? lastItemOf(dates) : config.defaultViewDate;
        return limitToRange(viewDate, config.minDate, config.maxDate);
    }
    function setViewDate(picker, newDate) {
        var oldViewDate = new Date(picker.viewDate);
        var newViewDate = new Date(newDate);
        var _picker$currentView = picker.currentView, id = _picker$currentView.id, year = _picker$currentView.year, first = _picker$currentView.first, last = _picker$currentView.last;
        var viewYear = newViewDate.getFullYear();
        picker.viewDate = newDate;
        if (viewYear !== oldViewDate.getFullYear()) triggerDatepickerEvent(picker.datepicker, "changeYear");
        if (newViewDate.getMonth() !== oldViewDate.getMonth()) triggerDatepickerEvent(picker.datepicker, "changeMonth");
        switch (id) {
          case 0:
            return newDate < first || newDate > last;

          case 1:
            return viewYear !== year;

          default:
            return viewYear < first || viewYear > last;
        }
    }
    function getTextDirection(el) {
        return window.getComputedStyle(el).direction;
    }
    var Picker = function() {
        function Picker(datepicker) {
            _classCallCheck(this, Picker);
            this.datepicker = datepicker;
            var template = pickerTemplate.replace(/%buttonClass%/g, datepicker.config.buttonClass);
            var element = this.element = parseHTML(template).firstChild;
            var _element$firstChild$c = _slicedToArray(element.firstChild.children, 3), header = _element$firstChild$c[0], main = _element$firstChild$c[1], footer = _element$firstChild$c[2];
            var title = header.firstElementChild;
            var _header$lastElementCh = _slicedToArray(header.lastElementChild.children, 3), prevBtn = _header$lastElementCh[0], viewSwitch = _header$lastElementCh[1], nextBtn = _header$lastElementCh[2];
            var _footer$firstChild$ch = _slicedToArray(footer.firstChild.children, 2), todayBtn = _footer$firstChild$ch[0], clearBtn = _footer$firstChild$ch[1];
            var controls = {
                title,
                prevBtn,
                viewSwitch,
                nextBtn,
                todayBtn,
                clearBtn
            };
            this.main = main;
            this.controls = controls;
            var elementClass = datepicker.inline ? "inline" : "dropdown";
            element.classList.add("datepicker-".concat(elementClass));
            elementClass === "dropdown" ? element.classList.add("dropdown", "absolute", "top-0", "left-0", "z-50", "pt-2") : null;
            processPickerOptions(this, datepicker.config);
            this.viewDate = computeResetViewDate(datepicker);
            registerListeners(datepicker, [ [ element, "click", onClickPicker.bind(null, datepicker), {
                capture: true
            } ], [ main, "click", onClickView.bind(null, datepicker) ], [ controls.viewSwitch, "click", onClickViewSwitch.bind(null, datepicker) ], [ controls.prevBtn, "click", onClickPrevBtn.bind(null, datepicker) ], [ controls.nextBtn, "click", onClickNextBtn.bind(null, datepicker) ], [ controls.todayBtn, "click", onClickTodayBtn.bind(null, datepicker) ], [ controls.clearBtn, "click", onClickClearBtn.bind(null, datepicker) ] ]);
            this.views = [ new DaysView(this), new MonthsView(this), new YearsView(this, {
                id: 2,
                name: "years",
                cellClass: "year",
                step: 1
            }), new YearsView(this, {
                id: 3,
                name: "decades",
                cellClass: "decade",
                step: 10
            }) ];
            this.currentView = this.views[datepicker.config.startView];
            this.currentView.render();
            this.main.appendChild(this.currentView.element);
            datepicker.config.container.appendChild(this.element);
        }
        return _createClass(Picker, [ {
            key: "setOptions",
            value: function setOptions(options) {
                processPickerOptions(this, options);
                this.views.forEach((function(view) {
                    view.init(options, false);
                }));
                this.currentView.render();
            }
        }, {
            key: "detach",
            value: function detach() {
                this.datepicker.config.container.removeChild(this.element);
            }
        }, {
            key: "show",
            value: function show() {
                if (this.active) return;
                this.element.classList.add("active", "block");
                this.element.classList.remove("hidden");
                this.active = true;
                var datepicker = this.datepicker;
                if (!datepicker.inline) {
                    var inputDirection = getTextDirection(datepicker.inputField);
                    if (inputDirection !== getTextDirection(datepicker.config.container)) this.element.dir = inputDirection; else if (this.element.dir) this.element.removeAttribute("dir");
                    this.place();
                    if (datepicker.config.disableTouchKeyboard) datepicker.inputField.blur();
                }
                triggerDatepickerEvent(datepicker, "show");
            }
        }, {
            key: "hide",
            value: function hide() {
                if (!this.active) return;
                this.datepicker.exitEditMode();
                this.element.classList.remove("active", "block");
                this.element.classList.add("active", "block", "hidden");
                this.active = false;
                triggerDatepickerEvent(this.datepicker, "hide");
            }
        }, {
            key: "place",
            value: function place() {
                var _this$element = this.element, classList = _this$element.classList, style = _this$element.style;
                var _this$datepicker = this.datepicker, config = _this$datepicker.config, inputField = _this$datepicker.inputField;
                var container = config.container;
                var _this$element$getBoun = this.element.getBoundingClientRect(), calendarWidth = _this$element$getBoun.width, calendarHeight = _this$element$getBoun.height;
                var _container$getBoundin = container.getBoundingClientRect(), containerLeft = _container$getBoundin.left, containerTop = _container$getBoundin.top, containerWidth = _container$getBoundin.width;
                var _inputField$getBoundi = inputField.getBoundingClientRect(), inputLeft = _inputField$getBoundi.left, inputTop = _inputField$getBoundi.top, inputWidth = _inputField$getBoundi.width, inputHeight = _inputField$getBoundi.height;
                var _config$orientation = config.orientation, orientX = _config$orientation.x, orientY = _config$orientation.y;
                var scrollTop;
                var left;
                var top;
                if (container === document.body) {
                    scrollTop = window.scrollY;
                    left = inputLeft + window.scrollX;
                    top = inputTop + scrollTop;
                } else {
                    scrollTop = container.scrollTop;
                    left = inputLeft - containerLeft;
                    top = inputTop - containerTop + scrollTop;
                }
                if (orientX === "auto") if (left < 0) {
                    orientX = "left";
                    left = 10;
                } else if (left + calendarWidth > containerWidth) orientX = "right"; else orientX = getTextDirection(inputField) === "rtl" ? "right" : "left";
                if (orientX === "right") left -= calendarWidth - inputWidth;
                if (orientY === "auto") orientY = top - calendarHeight < scrollTop ? "bottom" : "top";
                if (orientY === "top") top -= calendarHeight; else top += inputHeight;
                classList.remove("datepicker-orient-top", "datepicker-orient-bottom", "datepicker-orient-right", "datepicker-orient-left");
                classList.add("datepicker-orient-".concat(orientY), "datepicker-orient-".concat(orientX));
                style.top = top ? "".concat(top, "px") : top;
                style.left = left ? "".concat(left, "px") : left;
            }
        }, {
            key: "setViewSwitchLabel",
            value: function setViewSwitchLabel(labelText) {
                this.controls.viewSwitch.textContent = labelText;
            }
        }, {
            key: "setPrevBtnDisabled",
            value: function setPrevBtnDisabled(disabled) {
                this.controls.prevBtn.disabled = disabled;
            }
        }, {
            key: "setNextBtnDisabled",
            value: function setNextBtnDisabled(disabled) {
                this.controls.nextBtn.disabled = disabled;
            }
        }, {
            key: "changeView",
            value: function changeView(viewId) {
                var oldView = this.currentView;
                var newView = this.views[viewId];
                if (newView.id !== oldView.id) {
                    this.currentView = newView;
                    this._renderMethod = "render";
                    triggerDatepickerEvent(this.datepicker, "changeView");
                    this.main.replaceChild(newView.element, oldView.element);
                }
                return this;
            }
        }, {
            key: "changeFocus",
            value: function changeFocus(newViewDate) {
                this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refreshFocus";
                this.views.forEach((function(view) {
                    view.updateFocus();
                }));
                return this;
            }
        }, {
            key: "update",
            value: function update() {
                var newViewDate = computeResetViewDate(this.datepicker);
                this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refresh";
                this.views.forEach((function(view) {
                    view.updateFocus();
                    view.updateSelection();
                }));
                return this;
            }
        }, {
            key: "render",
            value: function render() {
                var quickRender = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                var renderMethod = quickRender && this._renderMethod || "render";
                delete this._renderMethod;
                this.currentView[renderMethod]();
            }
        } ]);
    }();
    function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
        if (!isInRange(date, min, max)) return;
        if (testFn(date)) {
            var newDate = addFn(date, increase);
            return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
        }
        return date;
    }
    function moveByArrowKey(datepicker, ev, direction, vertical) {
        var picker = datepicker.picker;
        var currentView = picker.currentView;
        var step = currentView.step || 1;
        var viewDate = picker.viewDate;
        var addFn;
        var testFn;
        switch (currentView.id) {
          case 0:
            if (vertical) viewDate = addDays(viewDate, direction * 7); else if (ev.ctrlKey || ev.metaKey) viewDate = addYears(viewDate, direction); else viewDate = addDays(viewDate, direction);
            addFn = addDays;
            testFn = function testFn(date) {
                return currentView.disabled.includes(date);
            };
            break;

          case 1:
            viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
            addFn = addMonths;
            testFn = function testFn(date) {
                var dt = new Date(date);
                var year = currentView.year, disabled = currentView.disabled;
                return dt.getFullYear() === year && disabled.includes(dt.getMonth());
            };
            break;

          default:
            viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
            addFn = addYears;
            testFn = function testFn(date) {
                return currentView.disabled.includes(startOfYearPeriod(date, step));
            };
        }
        viewDate = findNextAvailableOne(viewDate, addFn, direction < 0 ? -step : step, testFn, currentView.minDate, currentView.maxDate);
        if (viewDate !== void 0) picker.changeFocus(viewDate).render();
    }
    function onKeydown(datepicker, ev) {
        if (ev.key === "Tab") {
            unfocus(datepicker);
            return;
        }
        var picker = datepicker.picker;
        var _picker$currentView = picker.currentView, id = _picker$currentView.id, isMinView = _picker$currentView.isMinView;
        if (!picker.active) switch (ev.key) {
          case "ArrowDown":
          case "Escape":
            picker.show();
            break;

          case "Enter":
            datepicker.update();
            break;

          default:
            return;
        } else if (datepicker.editMode) switch (ev.key) {
          case "Escape":
            picker.hide();
            break;

          case "Enter":
            datepicker.exitEditMode({
                update: true,
                autohide: datepicker.config.autohide
            });
            break;

          default:
            return;
        } else switch (ev.key) {
          case "Escape":
            picker.hide();
            break;

          case "ArrowLeft":
            if (ev.ctrlKey || ev.metaKey) goToPrevOrNext(datepicker, -1); else if (ev.shiftKey) {
                datepicker.enterEditMode();
                return;
            } else moveByArrowKey(datepicker, ev, -1, false);
            break;

          case "ArrowRight":
            if (ev.ctrlKey || ev.metaKey) goToPrevOrNext(datepicker, 1); else if (ev.shiftKey) {
                datepicker.enterEditMode();
                return;
            } else moveByArrowKey(datepicker, ev, 1, false);
            break;

          case "ArrowUp":
            if (ev.ctrlKey || ev.metaKey) switchView(datepicker); else if (ev.shiftKey) {
                datepicker.enterEditMode();
                return;
            } else moveByArrowKey(datepicker, ev, -1, true);
            break;

          case "ArrowDown":
            if (ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
                datepicker.enterEditMode();
                return;
            }
            moveByArrowKey(datepicker, ev, 1, true);
            break;

          case "Enter":
            if (isMinView) datepicker.setDate(picker.viewDate); else picker.changeView(id - 1).render();
            break;

          case "Backspace":
          case "Delete":
            datepicker.enterEditMode();
            return;

          default:
            if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) datepicker.enterEditMode();
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }
    function onFocus(datepicker) {
        if (datepicker.config.showOnFocus && !datepicker._showing) datepicker.show();
    }
    function onMousedown(datepicker, ev) {
        var el = ev.target;
        if (datepicker.picker.active || datepicker.config.showOnClick) {
            el._active = el === document.activeElement;
            el._clicking = setTimeout((function() {
                delete el._active;
                delete el._clicking;
            }), 2e3);
        }
    }
    function onClickInput(datepicker, ev) {
        var el = ev.target;
        if (!el._clicking) return;
        clearTimeout(el._clicking);
        delete el._clicking;
        if (el._active) datepicker.enterEditMode();
        delete el._active;
        if (datepicker.config.showOnClick) datepicker.show();
    }
    function onPaste(datepicker, ev) {
        if (ev.clipboardData.types.includes("text/plain")) datepicker.enterEditMode();
    }
    function onClickOutside(datepicker, ev) {
        var element = datepicker.element;
        if (element !== document.activeElement) return;
        var pickerElem = datepicker.picker.element;
        if (findElementInEventPath(ev, (function(el) {
            return el === element || el === pickerElem;
        }))) return;
        unfocus(datepicker);
    }
    function stringifyDates(dates, config) {
        return dates.map((function(dt) {
            return formatDate(dt, config.format, config.locale);
        })).join(config.dateDelimiter);
    }
    function processInputDates(datepicker, inputDates) {
        var clear = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        var config = datepicker.config, origDates = datepicker.dates, rangepicker = datepicker.rangepicker;
        if (inputDates.length === 0) return clear ? [] : void 0;
        var rangeEnd = rangepicker && datepicker === rangepicker.datepickers[1];
        var newDates = inputDates.reduce((function(dates, dt) {
            var date = parseDate(dt, config.format, config.locale);
            if (date === void 0) return dates;
            if (config.pickLevel > 0) {
                var _dt = new Date(date);
                if (config.pickLevel === 1) date = rangeEnd ? _dt.setMonth(_dt.getMonth() + 1, 0) : _dt.setDate(1); else date = rangeEnd ? _dt.setFullYear(_dt.getFullYear() + 1, 0, 0) : _dt.setMonth(0, 1);
            }
            if (isInRange(date, config.minDate, config.maxDate) && !dates.includes(date) && !config.datesDisabled.includes(date) && !config.daysOfWeekDisabled.includes(new Date(date).getDay())) dates.push(date);
            return dates;
        }), []);
        if (newDates.length === 0) return;
        if (config.multidate && !clear) newDates = newDates.reduce((function(dates, date) {
            if (!origDates.includes(date)) dates.push(date);
            return dates;
        }), origDates.filter((function(date) {
            return !newDates.includes(date);
        })));
        return config.maxNumberOfDates && newDates.length > config.maxNumberOfDates ? newDates.slice(config.maxNumberOfDates * -1) : newDates;
    }
    function refreshUI(datepicker) {
        var mode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3;
        var quickRender = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        var config = datepicker.config, picker = datepicker.picker, inputField = datepicker.inputField;
        if (mode & 2) {
            var newView = picker.active ? config.pickLevel : config.startView;
            picker.update().changeView(newView).render(quickRender);
        }
        if (mode & 1 && inputField) inputField.value = stringifyDates(datepicker.dates, config);
    }
    function _setDate(datepicker, inputDates, options) {
        var clear = options.clear, render = options.render, autohide = options.autohide;
        if (render === void 0) render = true;
        if (!render) autohide = false; else if (autohide === void 0) autohide = datepicker.config.autohide;
        var newDates = processInputDates(datepicker, inputDates, clear);
        if (!newDates) return;
        if (newDates.toString() !== datepicker.dates.toString()) {
            datepicker.dates = newDates;
            refreshUI(datepicker, render ? 3 : 1);
            triggerDatepickerEvent(datepicker, "changeDate");
        } else refreshUI(datepicker, 1);
        if (autohide) datepicker.hide();
    }
    var main_esm_Datepicker = function() {
        function Datepicker(element) {
            var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var rangepicker = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
            _classCallCheck(this, Datepicker);
            element.datepicker = this;
            this.element = element;
            var config = this.config = Object.assign({
                buttonClass: options.buttonClass && String(options.buttonClass) || "button",
                container: document.body,
                defaultViewDate: today(),
                maxDate: void 0,
                minDate: void 0
            }, processOptions(defaultOptions, this));
            this._options = options;
            Object.assign(config, processOptions(options, this));
            var inline = this.inline = element.tagName !== "INPUT";
            var inputField;
            var initialDates;
            if (inline) {
                config.container = element;
                initialDates = stringToArray(element.dataset.date, config.dateDelimiter);
                delete element.dataset.date;
            } else {
                var container = options.container ? document.querySelector(options.container) : null;
                if (container) config.container = container;
                inputField = this.inputField = element;
                inputField.classList.add("datepicker-input");
                initialDates = stringToArray(inputField.value, config.dateDelimiter);
            }
            if (rangepicker) {
                var index = rangepicker.inputs.indexOf(inputField);
                var datepickers = rangepicker.datepickers;
                if (index < 0 || index > 1 || !Array.isArray(datepickers)) throw Error("Invalid rangepicker object.");
                datepickers[index] = this;
                Object.defineProperty(this, "rangepicker", {
                    get: function get() {
                        return rangepicker;
                    }
                });
            }
            this.dates = [];
            var inputDateValues = processInputDates(this, initialDates);
            if (inputDateValues && inputDateValues.length > 0) this.dates = inputDateValues;
            if (inputField) inputField.value = stringifyDates(this.dates, config);
            var picker = this.picker = new Picker(this);
            if (inline) this.show(); else {
                var onMousedownDocument = onClickOutside.bind(null, this);
                var listeners = [ [ inputField, "keydown", onKeydown.bind(null, this) ], [ inputField, "focus", onFocus.bind(null, this) ], [ inputField, "mousedown", onMousedown.bind(null, this) ], [ inputField, "click", onClickInput.bind(null, this) ], [ inputField, "paste", onPaste.bind(null, this) ], [ document, "mousedown", onMousedownDocument ], [ document, "touchstart", onMousedownDocument ], [ window, "resize", picker.place.bind(picker) ] ];
                registerListeners(this, listeners);
            }
        }
        return _createClass(Datepicker, [ {
            key: "active",
            get: function get() {
                return !!(this.picker && this.picker.active);
            }
        }, {
            key: "pickerElement",
            get: function get() {
                return this.picker ? this.picker.element : void 0;
            }
        }, {
            key: "setOptions",
            value: function setOptions(options) {
                var picker = this.picker;
                var newOptions = processOptions(options, this);
                Object.assign(this._options, options);
                Object.assign(this.config, newOptions);
                picker.setOptions(newOptions);
                refreshUI(this, 3);
            }
        }, {
            key: "show",
            value: function show() {
                if (this.inputField) {
                    if (this.inputField.disabled) return;
                    if (this.inputField !== document.activeElement) {
                        this._showing = true;
                        this.inputField.focus();
                        delete this._showing;
                    }
                }
                this.picker.show();
            }
        }, {
            key: "hide",
            value: function hide() {
                if (this.inline) return;
                this.picker.hide();
                this.picker.update().changeView(this.config.startView).render();
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.hide();
                unregisterListeners(this);
                this.picker.detach();
                if (!this.inline) this.inputField.classList.remove("datepicker-input");
                delete this.element.datepicker;
                return this;
            }
        }, {
            key: "getDate",
            value: function getDate() {
                var _this = this;
                var format = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
                var callback = format ? function(date) {
                    return formatDate(date, format, _this.config.locale);
                } : function(date) {
                    return new Date(date);
                };
                if (this.config.multidate) return this.dates.map(callback);
                if (this.dates.length > 0) return callback(this.dates[0]);
            }
        }, {
            key: "setDate",
            value: function setDate() {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                var dates = [].concat(args);
                var opts = {};
                var lastArg = lastItemOf(args);
                if (_typeof(lastArg) === "object" && !Array.isArray(lastArg) && !(lastArg instanceof Date) && lastArg) Object.assign(opts, dates.pop());
                var inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
                _setDate(this, inputDates, opts);
            }
        }, {
            key: "update",
            value: function update() {
                var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
                if (this.inline) return;
                var opts = {
                    clear: true,
                    autohide: !!(options && options.autohide)
                };
                var inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
                _setDate(this, inputDates, opts);
            }
        }, {
            key: "refresh",
            value: function refresh() {
                var target = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
                var forceRender = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                if (target && typeof target !== "string") {
                    forceRender = target;
                    target = void 0;
                }
                var mode;
                if (target === "picker") mode = 2; else if (target === "input") mode = 1; else mode = 3;
                refreshUI(this, mode, !forceRender);
            }
        }, {
            key: "enterEditMode",
            value: function enterEditMode() {
                if (this.inline || !this.picker.active || this.editMode) return;
                this.editMode = true;
                this.inputField.classList.add("in-edit", "border-blue-700", "!border-primary-700");
            }
        }, {
            key: "exitEditMode",
            value: function exitEditMode() {
                var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
                if (this.inline || !this.editMode) return;
                var opts = Object.assign({
                    update: false
                }, options);
                delete this.editMode;
                this.inputField.classList.remove("in-edit", "border-blue-700", "!border-primary-700");
                if (opts.update) this.update(opts);
            }
        } ], [ {
            key: "formatDate",
            value: function formatDate$1(date, format, lang) {
                return formatDate(date, format, lang && locales[lang] || locales.en);
            }
        }, {
            key: "parseDate",
            value: function parseDate$1(dateStr, format, lang) {
                return parseDate(dateStr, format, lang && locales[lang] || locales.en);
            }
        }, {
            key: "locales",
            get: function get() {
                return locales;
            }
        } ]);
    }();
    function filterOptions(options) {
        var newOpts = Object.assign({}, options);
        delete newOpts.inputs;
        delete newOpts.allowOneSidedRange;
        delete newOpts.maxNumberOfDates;
        return newOpts;
    }
    function setupDatepicker(rangepicker, changeDateListener, el, options) {
        registerListeners(rangepicker, [ [ el, "changeDate", changeDateListener ] ]);
        new main_esm_Datepicker(el, options, rangepicker);
    }
    function onChangeDate(rangepicker, ev) {
        if (rangepicker._updating) return;
        rangepicker._updating = true;
        var target = ev.target;
        if (target.datepicker === void 0) return;
        var datepickers = rangepicker.datepickers;
        var setDateOptions = {
            render: false
        };
        var changedSide = rangepicker.inputs.indexOf(target);
        var otherSide = changedSide === 0 ? 1 : 0;
        var changedDate = datepickers[changedSide].dates[0];
        var otherDate = datepickers[otherSide].dates[0];
        if (changedDate !== void 0 && otherDate !== void 0) {
            if (changedSide === 0 && changedDate > otherDate) {
                datepickers[0].setDate(otherDate, setDateOptions);
                datepickers[1].setDate(changedDate, setDateOptions);
            } else if (changedSide === 1 && changedDate < otherDate) {
                datepickers[0].setDate(changedDate, setDateOptions);
                datepickers[1].setDate(otherDate, setDateOptions);
            }
        } else if (!rangepicker.allowOneSidedRange) if (changedDate !== void 0 || otherDate !== void 0) {
            setDateOptions.clear = true;
            datepickers[otherSide].setDate(datepickers[changedSide].dates, setDateOptions);
        }
        datepickers[0].picker.update().render();
        datepickers[1].picker.update().render();
        delete rangepicker._updating;
    }
    var DateRangePicker = function() {
        function DateRangePicker(element) {
            var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            _classCallCheck(this, DateRangePicker);
            var inputs = Array.isArray(options.inputs) ? options.inputs : Array.from(element.querySelectorAll("input"));
            if (inputs.length < 2) return;
            element.rangepicker = this;
            this.element = element;
            this.inputs = inputs.slice(0, 2);
            this.allowOneSidedRange = !!options.allowOneSidedRange;
            var changeDateListener = onChangeDate.bind(null, this);
            var cleanOptions = filterOptions(options);
            var datepickers = [];
            Object.defineProperty(this, "datepickers", {
                get: function get() {
                    return datepickers;
                }
            });
            setupDatepicker(this, changeDateListener, this.inputs[0], cleanOptions);
            setupDatepicker(this, changeDateListener, this.inputs[1], cleanOptions);
            Object.freeze(datepickers);
            if (datepickers[0].dates.length > 0) onChangeDate(this, {
                target: this.inputs[0]
            }); else if (datepickers[1].dates.length > 0) onChangeDate(this, {
                target: this.inputs[1]
            });
        }
        return _createClass(DateRangePicker, [ {
            key: "dates",
            get: function get() {
                return this.datepickers.length === 2 ? [ this.datepickers[0].dates[0], this.datepickers[1].dates[0] ] : void 0;
            }
        }, {
            key: "setOptions",
            value: function setOptions(options) {
                this.allowOneSidedRange = !!options.allowOneSidedRange;
                var cleanOptions = filterOptions(options);
                this.datepickers[0].setOptions(cleanOptions);
                this.datepickers[1].setOptions(cleanOptions);
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.datepickers[0].destroy();
                this.datepickers[1].destroy();
                unregisterListeners(this);
                delete this.element.rangepicker;
            }
        }, {
            key: "getDates",
            value: function getDates() {
                var _this = this;
                var format = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
                var callback = format ? function(date) {
                    return formatDate(date, format, _this.datepickers[0].config.locale);
                } : function(date) {
                    return new Date(date);
                };
                return this.dates.map((function(date) {
                    return date === void 0 ? date : callback(date);
                }));
            }
        }, {
            key: "setDates",
            value: function setDates(rangeStart, rangeEnd) {
                var _this$datepickers = _slicedToArray(this.datepickers, 2), datepicker0 = _this$datepickers[0], datepicker1 = _this$datepickers[1];
                var origDates = this.dates;
                this._updating = true;
                datepicker0.setDate(rangeStart);
                datepicker1.setDate(rangeEnd);
                delete this._updating;
                if (datepicker1.dates[0] !== origDates[1]) onChangeDate(this, {
                    target: this.inputs[1]
                }); else if (datepicker0.dates[0] !== origDates[0]) onChangeDate(this, {
                    target: this.inputs[0]
                });
            }
        } ]);
    }();
    var datepicker_assign = void 0 && (void 0).__assign || function() {
        datepicker_assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return datepicker_assign.apply(this, arguments);
    };
    var datepicker_Default = {
        defaultDatepickerId: null,
        autohide: false,
        format: "mm/dd/yyyy",
        maxDate: null,
        minDate: null,
        orientation: "bottom",
        buttons: false,
        autoSelectToday: 0,
        title: null,
        language: "en",
        rangePicker: false,
        onShow: function() {},
        onHide: function() {}
    };
    var datepicker_DefaultInstanceOptions = {
        id: null,
        override: true
    };
    var Datepicker = function() {
        function Datepicker(datepickerEl, options, instanceOptions) {
            if (datepickerEl === void 0) datepickerEl = null;
            if (options === void 0) options = datepicker_Default;
            if (instanceOptions === void 0) instanceOptions = datepicker_DefaultInstanceOptions;
            this._instanceId = instanceOptions.id ? instanceOptions.id : datepickerEl.id;
            this._datepickerEl = datepickerEl;
            this._datepickerInstance = null;
            this._options = datepicker_assign(datepicker_assign({}, datepicker_Default), options);
            this._initialized = false;
            this.init();
            dom_instances.addInstance("Datepicker", this, this._instanceId, instanceOptions.override);
        }
        Datepicker.prototype.init = function() {
            if (this._datepickerEl && !this._initialized) {
                if (this._options.rangePicker) this._datepickerInstance = new DateRangePicker(this._datepickerEl, this._getDatepickerOptions(this._options)); else this._datepickerInstance = new main_esm_Datepicker(this._datepickerEl, this._getDatepickerOptions(this._options));
                this._initialized = true;
            }
        };
        Datepicker.prototype.destroy = function() {
            if (this._initialized) {
                this._initialized = false;
                this._datepickerInstance.destroy();
            }
        };
        Datepicker.prototype.removeInstance = function() {
            this.destroy();
            dom_instances.removeInstance("Datepicker", this._instanceId);
        };
        Datepicker.prototype.destroyAndRemoveInstance = function() {
            this.destroy();
            this.removeInstance();
        };
        Datepicker.prototype.getDatepickerInstance = function() {
            return this._datepickerInstance;
        };
        Datepicker.prototype.getDate = function() {
            if (this._options.rangePicker && this._datepickerInstance instanceof DateRangePicker) return this._datepickerInstance.getDates();
            if (!this._options.rangePicker && this._datepickerInstance instanceof main_esm_Datepicker) return this._datepickerInstance.getDate();
        };
        Datepicker.prototype.setDate = function(date) {
            if (this._options.rangePicker && this._datepickerInstance instanceof DateRangePicker) return this._datepickerInstance.setDates(date);
            if (!this._options.rangePicker && this._datepickerInstance instanceof main_esm_Datepicker) return this._datepickerInstance.setDate(date);
        };
        Datepicker.prototype.show = function() {
            this._datepickerInstance.show();
            this._options.onShow(this);
        };
        Datepicker.prototype.hide = function() {
            this._datepickerInstance.hide();
            this._options.onHide(this);
        };
        Datepicker.prototype._getDatepickerOptions = function(options) {
            var datepickerOptions = {};
            if (options.buttons) {
                datepickerOptions.todayBtn = true;
                datepickerOptions.clearBtn = true;
                if (options.autoSelectToday) datepickerOptions.todayBtnMode = 1;
            }
            if (options.autohide) datepickerOptions.autohide = true;
            if (options.format) datepickerOptions.format = options.format;
            if (options.maxDate) datepickerOptions.maxDate = options.maxDate;
            if (options.minDate) datepickerOptions.minDate = options.minDate;
            if (options.orientation) datepickerOptions.orientation = options.orientation;
            if (options.title) datepickerOptions.title = options.title;
            if (options.language) datepickerOptions.language = options.language;
            return datepickerOptions;
        };
        Datepicker.prototype.updateOnShow = function(callback) {
            this._options.onShow = callback;
        };
        Datepicker.prototype.updateOnHide = function(callback) {
            this._options.onHide = callback;
        };
        return Datepicker;
    }();
    function initDatepickers() {
        document.querySelectorAll("[datepicker], [inline-datepicker], [date-rangepicker]").forEach((function($datepickerEl) {
            if ($datepickerEl) {
                var buttons = $datepickerEl.hasAttribute("datepicker-buttons");
                var autoselectToday = $datepickerEl.hasAttribute("datepicker-autoselect-today");
                var autohide = $datepickerEl.hasAttribute("datepicker-autohide");
                var format = $datepickerEl.getAttribute("datepicker-format");
                var maxDate = $datepickerEl.getAttribute("datepicker-max-date");
                var minDate = $datepickerEl.getAttribute("datepicker-min-date");
                var orientation_1 = $datepickerEl.getAttribute("datepicker-orientation");
                var title = $datepickerEl.getAttribute("datepicker-title");
                var language = $datepickerEl.getAttribute("datepicker-language");
                var rangePicker = $datepickerEl.hasAttribute("date-rangepicker");
                new Datepicker($datepickerEl, {
                    buttons: buttons ? buttons : datepicker_Default.buttons,
                    autoSelectToday: autoselectToday ? autoselectToday : datepicker_Default.autoSelectToday,
                    autohide: autohide ? autohide : datepicker_Default.autohide,
                    format: format ? format : datepicker_Default.format,
                    maxDate: maxDate ? maxDate : datepicker_Default.maxDate,
                    minDate: minDate ? minDate : datepicker_Default.minDate,
                    orientation: orientation_1 ? orientation_1 : datepicker_Default.orientation,
                    title: title ? title : datepicker_Default.title,
                    language: language ? language : datepicker_Default.language,
                    rangePicker: rangePicker ? rangePicker : datepicker_Default.rangePicker
                });
            } else console.error("The datepicker element does not exist. Please check the datepicker attribute.");
        }));
    }
    if (typeof window !== "undefined") {
        window.Datepicker = Datepicker;
        window.initDatepickers = initDatepickers;
    }
    function initFlowbite() {
        initAccordions();
        initCollapses();
        initCarousels();
        initDismisses();
        initDropdowns();
        initModals();
        initDrawers();
        initTabs();
        initTooltips();
        initPopovers();
        initDials();
        initInputCounters();
        initCopyClipboards();
        initDatepickers();
    }
    if (typeof window !== "undefined") window.initFlowbite = initFlowbite;
    var esm_events = new events("load", [ initAccordions, initCollapses, initCarousels, initDismisses, initDropdowns, initModals, initDrawers, initTabs, initTooltips, initPopovers, initDials, initInputCounters, initCopyClipboards, initDatepickers ]);
    esm_events.init();
    document.querySelectorAll(".accordion").forEach((accordion => {
        accordion.querySelectorAll(".accordion-item").forEach(((item, index) => {
            const targetButton = item.querySelector("[data-accordion-target]");
            const body = item.querySelector("[data-accordion-body]");
            targetButton.addEventListener("click", (e => {
                e.preventDefault();
                const isOpen = !body.classList.contains("hidden");
                accordion.querySelectorAll(".accordion-item").forEach(((otherItem, otherIndex) => {
                    const otherBody = otherItem.querySelector("[data-accordion-body]");
                    if (otherIndex !== index) {
                        otherItem.classList.remove("show");
                        otherBody.classList.add("hidden");
                    }
                }));
                if (!isOpen) {
                    item.classList.add("show");
                    body.classList.remove("hidden");
                } else {
                    item.classList.remove("show");
                    body.classList.add("hidden");
                }
            }));
        }));
    }));
    if (localStorage.getItem("color-theme") === "dark" || !("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark");
    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
    if (localStorage.getItem("color-theme") === "dark" || !("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) themeToggleLightIcon?.classList?.remove("hidden"); else themeToggleDarkIcon?.classList?.remove("hidden");
    var themeToggleBtn = document.getElementById("theme-toggle");
    themeToggleBtn?.addEventListener("click", (function() {
        themeToggleDarkIcon.classList.toggle("hidden");
        themeToggleLightIcon.classList.toggle("hidden");
        if (localStorage.getItem("color-theme")) if (localStorage.getItem("color-theme") === "light") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        } else if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        }
    }));
    moment.locale("fr");
    const toggleButton = document.getElementById("toggle-filter");
    const sidebar = document.getElementById("sidebar");
    const closeButton = document.querySelector("#sidebar .sidebar-close");
    if (toggleButton && sidebar && closeButton) {
        toggleButton.addEventListener("click", (() => {
            sidebar.classList.add("!block");
        }));
        closeButton.addEventListener("click", (() => {
            sidebar.classList.remove("!block");
        }));
    } else console.warn("Некоторые элементы не найдены на странице. Проверьте, что все ID и классы указаны верно.");
    moment.locale("uk");
    const disabledDates = [ moment("2024-11-05"), moment("2024-11-10"), moment("2024-11-15") ];
    $("#datepicker").daterangepicker({
        parentEl: ".modal-container-date",
        startDate: moment(),
        opens: "center",
        locale: {
            format: "DD MMMM YYYY",
            applyLabel: "Застосувати",
            cancelLabel: "Скасувати",
            fromLabel: "З",
            toLabel: "По",
            customRangeLabel: "Вибрати період",
            daysOfWeek: moment.weekdaysShort(),
            monthNames: moment.months(),
            previousMonth: "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' class='flex-grow-0 flex-shrink-0 w-4 h-4 relative' preserveAspectRatio='xMidYMid meet'><path d='M12.6667 8H3.33337' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path><path d='M8.00004 12.6673L3.33337 8.00065L8.00004 3.33398' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path></svg>",
            nextMonth: "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' class='flex-grow-0 flex-shrink-0 w-4 h-4 relative' preserveAspectRatio='xMidYMid meet'><path d='M3.33337 8H12.6667' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path><path d='M8 3.33398L12.6667 8.00065L8 12.6673' stroke='#020617' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'></path></svg>"
        },
        autoUpdateInput: false,
        isInvalidDate: function(date) {
            for (let i = 0; i < disabledDates.length; i++) if (date.isSame(disabledDates[i], "day")) return true;
            return date.isBefore(moment().subtract(2, "days"), "day");
        }
    }, (function(start, end, label) {
        if (start.isSame(end)) $("#datepicker").val(start.format("DD MMMM YYYY")); else $("#datepicker").val(start.format("DD MMMM YYYY") + " - " + end.format("DD MMMM YYYY"));
        console.log("New date range selected: " + start.format("DD MMMM YYYY") + " to " + end.format("DD MMMM YYYY") + " (selected range: " + label + ")");
    }));
    const buttons = document.querySelectorAll(".applyBtn, .cancelBtn");
    if (buttons) buttons.forEach((button => {
        button.setAttribute("data-modal-hide", "modal");
    }));
    const secondarySidebarBtn = document.getElementById("sidebar-btn");
    const secondarySidebarBurgerBtn = document.getElementById("burger");
    const secondarySidebar = document.getElementById("sidebar");
    secondarySidebarBtn?.addEventListener("click", (() => {
        if (window.innerWidth >= 992) secondarySidebar?.classList.toggle("closed"); else secondarySidebar?.classList.toggle("!left-0");
    }));
    secondarySidebarBurgerBtn?.addEventListener("click", (() => {
        if (window.innerWidth >= 992) secondarySidebar?.classList.toggle("closed"); else secondarySidebar?.classList.toggle("!left-0");
    }));
    window["FLS"] = true;
})();