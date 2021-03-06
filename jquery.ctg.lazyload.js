/*global jQuery*/
/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, forin: true,
immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single,
undef: true, unused: true, strict: true, trailing: true, browser: true */

/*
 * jquery.lazyload.js v0.1.1
 *
 * Lazyloads images/background images below the fold
 *
 * depends:
 *     jquery.js
 *     jquery.ui.widget.js v1.8.*
 */

(function ($) {

    'use strict';

    var _super = $.Widget.prototype,

    // checks whether scrollbar has scrolled all the way down
        isBottom = function () {

            var win = $(window),
                docHeight = $(document).height(),
                winHeight = win.height(),
                scrollTop = win.scrollTop();

            return docHeight <= winHeight + scrollTop ? true : false;
        };

    $.widget('ctg.lazyload', {

        options: {
            selector: '.ctg-lazyload-img',
            offset: 200,
            transitionSpeed: 500,
            autoDestroy: true, // if window is scrolled to bottom, lazyload will be destroyed
            
            create: null,
            load: null
        },

        _create: function () {

            this.view = this.element.addClass('ctg-lazyload');
            this._objects();
            this._setOffsets();
            this._events();

            this._trigger('init');

            return;
        },

        _objects: function () {

            this.objects = {};
            this.objects.images = this.view.find(this.options.selector);

            return;
        },

        _setOffsets: function () {

            this.objects.images.each(function () {

                var el = $(this),
                    offset = el.offset();

                el.data('ctgLazyloadOffset', offset.top);

            });

            return;
        },

        _events: function () {

            var self = this,
                didScroll = true,
                didResize = true;

            // bind to resize
            $(window).bind('resize.ctg-lazyload', function () {
                didResize = true;
            });

            // determine if scrolled
            $(window).bind('scroll.ctg-lazyload', function () {
                didScroll = true;
            });

            // poll to avoid running scroll handler everytime scroll event fires
            this.interval = setInterval(function () {

                if (didScroll || didResize) {
                    didScroll = false;
                    didResize = false;

                    self._checkImages();

                    // if we're at the bottom destroy
                    if (self.options.autoDestroy && isBottom()) {
                        self.destroy();
                    }
                }

            }, 250);

            return;
        },

        _checkImages: function () {

            var self = this,
                viewportHeight = $(window).height(),
                scrollTop = $(window).scrollTop(),
                visibleArea = viewportHeight + scrollTop + self.options.offset;

            this.objects.images.each(function () {

                var el = $(this),
                    offset = el.data('ctgLazyloadOffset');

                if (el.data('ctgLazyloadImgIsLoaded')) {
                    return;
                }

                if (offset <= visibleArea) {
                    self._loadImage(el);
                }

            });

            return;
        },

        _loadImage: function (el) {

            var self = this;

            el.data('ctgLazyloadImgIsLoaded', true);

            // NOTE: IE6 requires load event to be bound before
            // src attribute is added (in case image is pulled
            // in from browser cache)
            $('<img/>')
                .bind('load.ctg-lazyload', function () {
                    
                    el.hide();
                    
                    if (el.is('img')) {
                        el.attr('src', el.data('src'));
                    } else {
                        el.css('background-image', 'url(' + el.data('src') + ')');
                    }

                    el.addClass('ctg-lazyload-img-is-loaded')
                        .fadeIn();

                    self._trigger('load', null, {
                        src: el.data('src')
                    });
                })
                .attr('src', el.data('src'));

            return;
        },

        // if live is true, we recache elements
        // (useful for when new images have been added with ajax)
        refresh: function (live) {

            if (live) {
                this._objects();
            }

            this._setOffsets();
            this._checkImages();

        },

        destroy: function () {

            clearInterval(this.interval);
            $(window).unbind('.ctg-lazyload');
            this.element.removeClass('ctg-lazyload');
            this.objects.images.removeData('ctgLazyloadOffset');

            _super.destroy.apply(this, arguments);

        }

    });

})(jQuery);
