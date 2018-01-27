var successMessage = $('#SuccessMessage').val();
var errorMessage = $('#ErrorMessage').val();
var isDirty = false;

$(document).ready(function () {

    //utils.ui.hideSpinner();
    $('.select').select2();

    $("input, select, textarea").on("change", function () {
        isDirty = true;
    });

    if (successMessage != "" && successMessage != undefined) {
        utils.notification.showSuccess(successMessage);
    }

    if (errorMessage != "" && errorMessage != undefined) {
        utils.notification.showError(errorMessage);
    }

    $('[data-toggle="tooltip"]').tooltip();

});

function saveData(controller, action) {
    utils.ui.showSpinner();
    if (isDirty) {
        $('#NextUrl').val(action);
        $("#createForm").submit();
    }
    else {
        if ($('#Id').val() != 0) {
            location.href = '/' + controller + '/' + action + '/' + $('#Id').val();
        }
    }

}

function deleteItem(id) {
    BootstrapDialog.show({
        title: 'Delete Item',
        message: 'Do you want to delete this Item?',
        buttons: [{
            label: 'Yes',
            cssClass: 'btn-success',
            action: function (dialog) {
                $('#Id').val(id);
                $("#deleteForm").submit();
                dialog.close();
            }
        }, {
            label: 'No',
            cssClass: 'btn-danger',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });
};

function showDetails(id, module) {
    $.ajax({ url: '/' + module + '/Details/' + id })
        .done(function (response) {
            if (response) {
                BootstrapDialog.show({
                    title: 'Details',
                    message: $('<div></div>').html(response),
                    buttons: [{
                        label: 'Close',
                        cssClass: 'btn-primary',
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        });
};
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 *
 * Example:
    var opts = {
      lines: 12             // The number of lines to draw
    , length: 7             // The length of each line
    , width: 5              // The line thickness
    , radius: 10            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000'         // #rgb or #rrggbb
    , opacity: 1/4          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 1              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    }
    var target = document.getElementById('foo')
    var spinner = new Spinner(opts).spin(target)
 */
; (function (root, factory) {

    /* CommonJS */
    if (typeof module == 'object' && module.exports) module.exports = factory()

    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

    /* Browser global */
    else root.Spinner = factory()
}(this, function () {
    "use strict"

    var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
        , animations = {} /* Animation rules keyed by their name */
        , useCssAnimations /* Whether to use CSS animations or setTimeout */
        , sheet /* A stylesheet to hold the @keyframe or VML rules. */

    /**
     * Utility function to create elements. If no tag name is given,
     * a DIV is created. Optionally properties can be passed.
     */
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div')
            , n

        for (n in prop) el[n] = prop[n]
        return el
    }

    /**
     * Appends children and returns the parent.
     */
    function ins(parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            parent.appendChild(arguments[i])
        }

        return parent
    }

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
            , start = 0.01 + i / lines * 100
            , z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha)
            , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
            , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
            sheet.insertRule(
                '@' + pre + 'keyframes ' + name + '{' +
                '0%{opacity:' + z + '}' +
                start + '%{opacity:' + alpha + '}' +
                (start + 0.01) + '%{opacity:1}' +
                (start + trail) % 100 + '%{opacity:' + alpha + '}' +
                '100%{opacity:' + z + '}' +
                '}', sheet.cssRules.length)

            animations[name] = 1
        }

        return name
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     */
    function vendor(el, prop) {
        var s = el.style
            , pp
            , i

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        if (s[prop] !== undefined) return prop
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop
            if (s[pp] !== undefined) return pp
        }
    }

    /**
     * Sets multiple style properties at once.
     */
    function css(el, prop) {
        for (var n in prop) {
            el.style[vendor(el, n) || n] = prop[n]
        }

        return el
    }

    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n]
            }
        }
        return obj
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    // Built-in defaults

    var defaults = {
        lines: 12             // The number of lines to draw
        , length: 7             // The length of each line
        , width: 5              // The line thickness
        , radius: 10            // The radius of the inner circle
        , scale: 1.0            // Scales overall size of the spinner
        , corners: 1            // Roundness (0..1)
        , color: '#000'         // #rgb or #rrggbb
        , opacity: 1 / 4          // Opacity of the lines
        , rotate: 0             // Rotation offset
        , direction: 1          // 1: clockwise, -1: counterclockwise
        , speed: 1              // Rounds per second
        , trail: 100            // Afterglow percentage
        , fps: 20               // Frames per second when using setTimeout()
        , zIndex: 2e9           // Use a high z-index by default
        , className: 'spinner'  // CSS class to assign to the element
        , top: '50%'            // center vertically
        , left: '50%'           // center horizontally
        , shadow: false         // Whether to render a shadow
        , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
        , position: 'absolute'  // Element positioning
    }

    /** The constructor */
    function Spinner(o) {
        this.opts = merge(o || {}, Spinner.defaults, defaults)
    }

    // Global defaults that override the built-ins:
    Spinner.defaults = {}

    merge(Spinner.prototype, {
        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function (target) {
            this.stop()

            var self = this
                , o = self.opts
                , el = self.el = createEl(null, { className: o.className })

            css(el, {
                position: o.position
                , width: 0
                , zIndex: o.zIndex
                , left: o.left
                , top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                    , start = (o.lines - 1) * (1 - o.direction) / 2
                    , alpha
                    , fps = o.fps
                    , f = fps / o.speed
                    , ostep = (1 - o.opacity) / (f * o.trail / 100)
                    , astep = f / o.lines

                    ; (function anim() {
                        i++
                        for (var j = 0; j < o.lines; j++) {
                            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                            self.opacity(el, j * o.direction + start, alpha, o)
                        }
                        self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                    })()
            }
            return self
        }

        /**
         * Stops and removes the Spinner.
         */
        , stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        }

        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        , lines: function (el, o) {
            var i = 0
                , start = (o.lines - 1) * (1 - o.direction) / 2
                , seg

            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute'
                    , width: o.scale * (o.length + o.width) + 'px'
                    , height: o.scale * o.width + 'px'
                    , background: color
                    , boxShadow: shadow
                    , transformOrigin: 'left'
                    , transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.scale * o.radius + 'px' + ',0)'
                    , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute'
                    , top: 1 + ~(o.scale * o.width / 2) + 'px'
                    , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
                    , opacity: o.opacity
                    , animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), { top: '2px' }))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        }

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        , opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        }

    })


    function initVML() {

        /* Utility function to create a VML tag */
        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        Spinner.prototype.lines = function (el, o) {
            var r = o.scale * (o.length + o.width)
                , s = o.scale * 2 * r

            function grp() {
                return css(
                    vml('group', {
                        coordsize: s + ' ' + s
                        , coordorigin: -r + ' ' + -r
                    })
                    , { width: s, height: s }
                )
            }

            var margin = -(o.width + o.length) * o.scale * 2 + 'px'
                , g = css(grp(), { position: 'absolute', top: margin, left: margin })
                , i

            function seg(i, dx, filter) {
                ins(
                    g
                    , ins(
                        css(grp(), { rotation: 360 / o.lines * i + 'deg', left: ~~dx })
                        , ins(
                            css(
                                vml('roundrect', { arcsize: o.corners })
                                , {
                                    width: r
                                    , height: o.scale * o.width
                                    , left: o.scale * o.radius
                                    , top: -o.scale * o.width >> 1
                                    , filter: filter
                                }
                            )
                            , vml('fill', { color: getColor(o.color, i), opacity: o.opacity })
                            , vml('stroke', { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
                        )
                    )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++) {
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
                }

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        Spinner.prototype.opacity = function (el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    if (typeof document !== 'undefined') {
        sheet = (function () {
            var el = createEl('style', { type: 'text/css' })
            ins(document.getElementsByTagName('head')[0], el)
            return el.sheet || el.styleSheet
        }())

        var probe = css(createEl('group'), { behavior: 'url(#default#VML)' })

        if (!vendor(probe, 'transform') && probe.adj) initVML()
        else useCssAnimations = vendor(probe, 'animation')
    }

    return Spinner

}));
(function ($, window) {
    'use strict';

    var utils = window.utils || {};

    var form = (function () {

        function saveEdit(controller, data) {
            saveData(controller, data, 'Edit');
        }

        function saveCreate(controller, data) {
            saveData(controller, data, 'Create');
        }

        function getFormData() {
            var formData = $("form").serialize({ checkboxesAsBools: true }).split("&");
            var obj = {};
            $.each(formData, function (index) { obj[formData[index].split("=")[0]] = formData[index].split("=")[1]; });
            return obj;
        }

        function saveData(controller, data, action) {
            var values = data || getFormData();
            var validator = $("form").validate();
            if (validator.form()) {
                utils.http.post({ url: '/' + controller + '/' + action, data: values }, function (response) {
                    if (response.data) {
                        for (var key in response.data) {
                            var elem = $('#' + key);
                            if (elem != null) {
                                $(elem).addClass('invalid-field').removeClass('valid-field');
                            }
                        }
                        notification.showWarning();
                    } else {
                        location.href = '/' + controller + '/index?SuccessMessage=Successful operation.' ;
                    }
                });
            } else {
                validator.invalidElements().each(function (index, element) {
                    $(element).addClass('invalid-field').removeClass('valid-field');
                });
                validator.validElements().each(function (index, element) {
                   // $(element).addClass('valid-field').removeClass('invalid-field');
                });
                notification.showWarning();
            }
        }

        return {
            saveCreate: saveCreate,
            saveEdit: saveEdit
        }

    })();

    var notification = (function () {
     
        function setSuccessMessage(message) {
            $('#SuccessMessage').val(message || 'Successful operation.')
        }

        function setErrorMessage(message) {
            $('#ErrorMessage').val(message || 'There was an error processing the operation.')
        }

        function showSuccess(message) {
            $.notify({
                title: 'Success',
                icon: 'fa fa-check',
                message: message || 'Successful operation.'
            }, { type: 'success', timer: 2000 });
        }

        function showError(message) {
            $.notify({
                title: 'Error',
                icon: 'fa fa-times',
                message: message || 'There was an error processing the operation.'
            }, { type: 'danger', timer: 2000 });
        }

        function showWarning(message) {
            $.notify({
                title: 'Warning',
                icon: 'fa fa-exclamation',
                message: message || 'There are invalid fields.'
            }, { type: 'warning', timer: 2000 });
        }

        return {
            showSuccess: showSuccess,
            showError: showError,
            showWarning: showWarning,
            setSuccessMessage: setSuccessMessage,
            setErrorMessage: setErrorMessage

        }

    })();

    var ui = (function () {

        var spinner = new Spinner();

        function showSpinner() {
            var target = document.getElementById('main');
            spinner.spin(target);
        }

        function hideSpinner() {
            spinner.stop();
        }

        return {
            showSpinner: showSpinner,
            hideSpinner: hideSpinner
        }

    })();

    var http = (function () {

        var successMessage = 'Successful operation.';
        var errorMessage = 'There was an error processing the operation.';

        function successCallbackFunction(response) {
            if (response) {
                notification.showSuccess();
            } else {
                notification.showError();
            }
        }

        function errorCallbackFunction() {
            notification.showError();
        }

        function post(options, successCallback, errorCallback) {
            var config = { headers: { 'Content-Type': 'application/json; charset=utf-8' } };
            var data = options.data || null;
            var successFunction = successCallback || successCallbackFunction;
            var errorFunction = errorCallback || errorCallbackFunction;

            ui.showSpinner();

            axios.post(options.url, data, config)
                .then(function (response) {
                    successFunction(response);
                    ui.hideSpinner();
                })
                .catch(function (error) {
                    errorFunction();
                    ui.hideSpinner();
                });
        }

        function get(options, successCallback, errorCallback) {
            var successFunction = successCallback || successCallbackFunction;
            var errorFunction = errorCallback || errorCallbackFunction;

            ui.showSpinner();

            axios.get(options.url)
                .then(function (response) {
                    successFunction(response);
                    ui.hideSpinner();
                })
                .catch(function (error) {
                    errorFunction();
                    ui.hideSpinner();
                });
        }

        return {
            post: post,
            get: get
        }

    })();

    utils = (function () {
        return {
            constructor: utils,
            form: form,
            http: http,
            ui: ui,
            notification: notification
        };
    })();

    window.utils = utils;


})($, window);
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();

    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = (this.type === 'checkbox') ? (this.checked ? 'true' : 'false') : this.value || '';
        }
    });

    return o;
};

(function ($) {

    $.fn.serialize = function (options) {
        return $.param(this.serializeArray(options));
    };

    $.fn.serializeArray = function (options) {
        var o = $.extend({
            checkboxesAsBools: false
        }, options || {});

        var rselectTextarea = /select|textarea/i;
        var rinput = /text|hidden|password|search/i;

        return this.map(function () {
            return this.elements ? $.makeArray(this.elements) : this;
        })
            .filter(function () {
                return this.name && !this.disabled &&
                    (this.checked
                        || (o.checkboxesAsBools && this.type === 'checkbox')
                        || rselectTextarea.test(this.nodeName)
                        || rinput.test(this.type));
            })
            .map(function (i, elem) {
                var val = $(this).val();
                return val == null ?
                    null :
                    $.isArray(val) ?
                        $.map(val, function (val, i) {
                            return { name: elem.name, value: val };
                        }) :
                        {
                            name: elem.name,
                            value: (o.checkboxesAsBools && this.type === 'checkbox') ? //moar ternaries!
                                (this.checked ? 'true' : 'false') :
                                val
                        };
            }).get();
    };

})(jQuery);