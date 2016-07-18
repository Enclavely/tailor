(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * A frontend carousel module for managing Slick Slider elements.
 *
 * @class
 */
var $ = window.jQuery,
    Carousel;

/**
 * The Carousel object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Carousel = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
	this.$wrap = this.$el.find( '.tailor-carousel__wrap' ).first();

    this.options = $.extend( this.defaults, options, this.$el.data() );
    if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
        this.options.rtl = true;
    }
    
    this.callbacks = $.extend( this.callbacks, callbacks );

    this.initialize();
};

Carousel.prototype = {

    defaults : {
        items : '> .tailor-carousel__item',
        speed : 250,
        slidesToShow : 1,
        slidesToScroll : 1,
        autoplay : false,
        arrows : false,
        dots : false,
        fade : false,
	    adaptiveHeight : true,
	    draggable : true,
        infinite : false,
	    prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
	    nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>'
    },

    callbacks : {

        /**
         * Callback function to be run when the object is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the object is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the object.
     *
     * @since 1.0.0
     */
    initialize : function() {

        this.$items = this.$wrap.find( this.options.items );

        this.slick();

        if ( 'function' == typeof this.callbacks.onInitialize ) {
            this.callbacks.onInitialize.call( this );
        }
    },

    /**
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    slick : function() {
	    this.$wrap.slick( this.options );
    },

    /**
     * Destroys the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        this.$wrap.slick( 'unslick' );
    },

    /**
     * Destroys the object.
     *
     * @since 1.0.0
     *
     * @param e
     */
    destroy : function( e ) {
        this.unSlick();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Carousel jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorCarousel = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorCarousel' );
        if ( ! instance ) {
            $.data( this, 'tailorCarousel', new Carousel( this, options, callbacks ) );
        }
    } );
};
},{}],2:[function(require,module,exports){
/**
 * Tailor.Objects.Lightbox
 *
 * A lightbox module.
 *
 * @class
 */
var $ = window.jQuery,
    Lightbox;

/**
 * The Lightbox object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Lightbox = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Lightbox.prototype = {

    defaults : {
        type : 'image',
        delegate : '.is-lightbox-image',
        closeMarkup : '<button title="%title%" type="button" class="not-a-button mfp-close">&#215;</button>',
        gallery : {
            enabled : true,
            arrowMarkup: '<button title="%title%" type="button" class="not-a-button mfp-arrow mfp-arrow-%dir%"></button>'
        },
        image : {
            titleSrc: function( item ) {
                return item.el.find( 'figcaption' ).text();
            }
        }
        //zoom: {
        //    enabled: true,
        //    duration: 300
        //}
    },

    callbacks : {

        /**
         * Callback function to be run when the object is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the object is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the Carousel instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.magnificPopup();
        this.addEventListeners();

        if ( 'function' == typeof this.callbacks.onInitialize ) {
            this.callbacks.onInitialize.call( this );
        }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el.on( 'before:element:destroy', $.proxy( this.destroy, this ) );
    },

    /**
     * Initializes the Magnific Popup plugin.
     *
     * @since 1.0.0
     */
    magnificPopup : function() {
        this.$el.magnificPopup( this.options );
    },

    /**
     * Destroys the object.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        if ( e.target != this.el ) {
            return;
        }

        this.$el.off();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Lightbox jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorLightbox = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorLightbox' );
        if ( ! instance ) {
            $.data( this, 'tailorLightbox', new Lightbox( this, options, callbacks ) );
        }
    } );
};
},{}],3:[function(require,module,exports){
/**
 * Tailor.Objects.Map
 *
 * A map module.
 *
 * @class
 */
var $ = window.jQuery,
    Map;

/**
 * The Map object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Map = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$win = $( window );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
	this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Map.prototype = {

    defaults : {
        height : 450,
        address : '',
        latitude : '',
        longitude : '',
        zoom : 12,
        draggable : 1,
        scrollwheel : 0,
        controls : 0,
        hue : null,
        saturation : 0
    },

	callbacks : {

		/**
		 * Callback function to be run when the object is initialized.
		 *
		 * @since 1.0.0
		 */
		onInitialize : function () {},

		/**
		 * Callback function to be run when the object is destroyed.
		 *
		 * @since 1.0.0
		 */
		onDestroy : function () {}
	},

    getStyles : function( saturation, hue ) {

        return  [
            {
                featureType : 'all',
                elementType : 'all',
                stylers     : [
                    { saturation : ( saturation ) ? saturation : null },
                    { hue : ( hue ) ? hue : null }
                ]
            },
            {
                featureType : 'water',
                elementType : 'all',
                stylers     : [
                    { hue : ( hue ) ? hue : null },
                    { saturation : ( saturation ) ? saturation : null },
                    { lightness  : 50 }
                ]
            },
            {
                featureType : 'poi',
                elementType : 'all',
                stylers     : [
                    { visibility : 'simplified' } // off
                ]
            }
        ]
    },

    /**
     * Initializes the Map instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        var map = this;

        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options ).then( function( coordinates ) {
            map.center = coordinates;

            var controls = map.options.controls;
            var settings = {
                zoom : map.options.zoom,
                draggable : map.options.draggable,
                scrollwheel : map.options.scrollwheel,
                center : coordinates,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: ! controls,
                panControl: controls,
                rotateControl : controls,
                scaleControl: controls,
                zoomControl: controls,
                mapTypeControl: controls,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER
                }
            };
            var styles = map.getStyles( map.options.saturation, map.options.hue );

            map.map = new google.maps.Map( map.$canvas[0], settings );
            map.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
            map.map.setMapTypeId( 'map_style' );

            map.setupMarkers( map.$el, map.map );
            map.addEventListeners();

	        if ( 'function' == typeof map.callbacks.onInitialize ) {
		        map.callbacks.onInitialize.call( map );
	        }
        } );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

	        // Fires before the element is destroyed
	        //.on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.refresh, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.refresh, this ) );

	    this.$win.on( 'resize', $.proxy( this.refresh, this ) );
    },

    /**
     * Refreshes the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefresh : function( e ) {
        if ( e.target == this.el ) {
            this.refresh();
        }
    },

    /**
     * Refreshes the map.
     *
     * @since 1.0.0
     */
    refresh : function() {
        google.maps.event.trigger( this.map, 'resize' );
        this.map.setCenter( this.center );
    },

    /**
     * Destroys the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy();
        }
    },

    /**
     * Returns the map coordinates.
     *
     * @since 1.0.0
     * 
     * @param options
     * @returns {*}
     */
    getCoordinates : function( options ) {
        return $.Deferred( function( deferred ) {

            if ( 'undefined' == typeof google ) {
                deferred.reject( new Error( 'The Google Maps API is currently unavailable' ) );
            }

            else if ( '' != options.address ) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { address : options.address }, function( results, status ) {
                    if ( google.maps.GeocoderStatus.OK == status ) {
                        deferred.resolve( results[0].geometry.location );
                    }
                    else if ( options.latitude && options.longitude ) {
                        deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
                    }
                    else {
                        deferred.reject( new Error( status ) );
                    }
                } );

            }
            else if ( options.latitude && options.longitude ) {
                deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
            }
            else {
                deferred.reject( new Error( 'No address or map coordinates provided'  ) );
            }
        } ).promise();
    },

    /**
     * Sets up the map markers.
     *
     * @since 1.0.0
     *
     * @param $el
     * @param googleMap
     */
    setupMarkers : function( $el, googleMap ) {
        var map = this;

        this.$el.find( '.tailor-map__marker' ).each( function( index, el ) {

            var defaults = {
                address : '',
                latitude : '',
                longitude : '',
                image : ''
            };

            var settings = _.extend( {}, defaults, $( el ).data() );

            map.getCoordinates( settings ).then( function( coordinates ) {
                map.markers[ index ] = new google.maps.Marker( {
                    map : googleMap,
                    position : coordinates,
                    infoWindowIndex : index,
                    icon : settings.image
                } );

                if ( 'null' != el.innerHTML ) {
                    map.infoWindows[ index ] = new google.maps.InfoWindow( {
                        content : el.innerHTML
                    } );

                    google.maps.event.addListener( map.markers[ index ], 'click', function() {
                        if ( el.innerHTML ) {
                            map.infoWindows[ index ].open( googleMap, this );
                        }
                    } );
                }
            } );
        } );
    },

    /**
     * Destroys the the Map instance.
     *
     * @since 1.0.0
     */
    destroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;

	    //this.$canvas.remove();
	    this.$el.off();
	    this.$win.off( 'resize', $.proxy( this.refresh, this ) );

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }
};

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @returns {*}
 */
$.fn.tailorGoogleMap = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorGoogleMap' );
        if ( ! instance ) {
            $.data( this, 'tailorGoogleMap', new Map( this, options, callbacks ) );
        }
    } );
};

module.exports = Map;
},{}],4:[function(require,module,exports){
/**
 * Tailor.Objects.Slideshow
 *
 * A slideshow module.
 *
 * @class
 */
var $ = window.jQuery,
    Slideshow;

/**
 * The Slideshow object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Slideshow = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$wrap = this.$el.find( '.tailor-slideshow__slides' );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
        this.options.rtl = true;
    }
    
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Slideshow.prototype = {

    defaults : {
        items : '.tailor-slideshow__slide',
        prevArrow: '<button type="button" data-role="none" class="lick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
        adaptiveHeight : true,
        draggable : false,
        speed : 250,
        slidesToShow : 1,
        slidesToScroll : 1,
        autoplay : false,
        arrows : false,
        dots : false,
        fade : true
    },

    callbacks : {

        /**
         * Callback function to be run when the object is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the object is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the object.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.slick();

        if ( 'function' == typeof this.callbacks.onInitialize ) {
            this.callbacks.onInitialize.call( this );
        }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

            // Fires before the element template is refreshed
            .on( 'before:element:refresh', $.proxy( this.unSlick, this ) )

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.maybeRefreshSlick, this ) )

            // Fires before and after the element is copied
            .on( 'before:element:copy', $.proxy( this.unSlick, this ) )
            .on( 'element:copy', $.proxy( this.slick, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.maybeRefreshSlick, this ) );
    },

    /**
     * Re-initializes the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeSlick : function( e ) {
        if ( e.target == this.el ) {
            this.slick();
        }
    },

    /**
     * Refreshes the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefreshSlick : function( e ) {
        if ( e.target == this.el ) {
            this.refreshSlick();
        }
    },

    /**
     * Destroys the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeUnSlick : function( e ) {
        if ( e.target == this.el ) {
            this.unSlick();
        }
    },

    /**
     * Destroys the object immediately before the element/view is destroyed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy( e );
        }
    },

    /**
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    slick : function() {
	    var slideshow = this;
	    this.$el.imagesLoaded( function() {
		    slideshow.addEventListeners();
		    slideshow.$wrap.slick( slideshow.options );
	    } );
    },

    /**
     * Refreshes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
        this.$wrap.slick( 'refresh' );
    },

    /**
     * Destroys the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        this.$wrap.slick( 'unslick' );
    },

    /**
     * Destroys the object.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        this.$el.off();

        this.unSlick();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Slideshow jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorSlideshow = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorSlideshow' );
        if ( ! instance ) {
            $.data( this, 'tailorSlideshow', new Slideshow( this, options, callbacks ) );
        }
    } );
};
},{}],5:[function(require,module,exports){
/**
 * Tailor.Objects.Tabs
 *
 * A tabs module.
 *
 * @class
 */
var $ = window.jQuery,
    Tabs;

/**
 * The Tabs object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 * @constructor
 */
Tabs = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Tabs.prototype = {

    defaults : {
        tabs : '.tailor-tabs__navigation .tailor-tabs__navigation-item',
        content : '.tailor-tabs__content .tailor-tab',
        initial : 1
    },

	callbacks : {

		/**
		 * Callback function to be run when the object is initialized.
		 *
		 * @since 1.0.0
		 */
		onInitialize : function () {},

		/**
		 * Callback function to be run when the object is destroyed.
		 *
		 * @since 1.0.0
		 */
		onDestroy : function () {}
	},

    /**
     * Initializes the Tabs instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.querySelectors();
        this.setActive();
        this.addEventListeners();

	    if ( 'function' == typeof this.callbacks.onInitialize ) {
		    this.callbacks.onInitialize.call( this );
	    }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

	        // Fires before the element template is refreshed
	        .on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

	        // Fires before the element is destroyed
	        .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

	        // Fires before and after a child element is added
	        .on( 'element:child:add element:child:ready', $.proxy( this.onChangeChild, this ) )

	        // Fires before and after a child element is refreshed
	        .on( 'element:child:refresh', $.proxy( this.onChangeChild, this ) )

	        // Fires before and after a child element is destroyed
	        .on( 'element:child:destroy', $.proxy( this.onDestroyChild, this ) )

	        // Fires before and after the position of an item is changed
	        .on( 'element:change:order', $.proxy( this.onReorderChild, this ) );
    },

    /**
     * Caches the tabs and tab content.
     *
     * @since 1.0.0
     */
    querySelectors : function() {
        if ( this.$tabs ) {
            this.$tabs.off();
        }

        this.$content = this.$el.find( this.options.content );
        this.$tabs = this.$el
            .find( this.options.tabs )
            .on( 'click', $.proxy( this.onClick, this ) );
    },

    /**
     * Sets the active tab on after (re)initialization.
     *
     * @since 1.0.0
     */
    setActive : function() {
        var active = this.$content.filter( function() {
            return this.classList.contains( 'is-active' );
        } );

        var el;
        if ( 0 == active.length ) {
            var initial = ( this.options.initial - 1 );
            if ( this.$content[ initial ] ) {
                el = this.$content[ initial ];
            }
        }
        else {
            el = active[0];
        }

        if ( el ) {
            this.activate( el.id );
        }
    },

    /**
     * Activates a tab when it is clicked.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        this.activate( e.target.getAttribute( 'data-id' ) );
        e.preventDefault();
    },

    /**
     * Refreshes the selectors when a tab is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onChangeChild : function( e, childView ) {
        if ( e.target == this.el ) {
            this.querySelectors();
            this.activate( childView.el.id );
        }
    },

	/**
	 * Updates the tabs container when the position of a tab is changed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
    onReorderChild : function( e, id, newIndex, oldIndex ) {
        if ( e.target == this.el ) {
            var $item = this.$content.filter( function() { return this.id == id; } );

            if ( oldIndex - newIndex < 0 ) {
                $item.insertAfter( this.$content[ newIndex ] );
            }
            else {
                $item.insertBefore( this.$content[ newIndex ] );
            }

            this.activate( id );
        }
    },

    /**
     * Refreshes the selectors when a tab is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onDestroyChild : function( e, childView ) {
        if ( e.target !== this.el ) {
			return;
        }

	    if ( ( 0 == childView.$el.index() && ! childView.el.nextSibling ) ) {
		    return;
	    }

	    var id = childView.el.nextSibling ? childView.el.nextSibling.id : childView.el.previousSibling.id;
	    childView.$el.remove();

	    this.querySelectors();
	    this.activate( id );
    },

    /**
     * Activates a given tab.
     *
     * @since 1.0.0
     *
     * @param id
     */
    activate : function( id ) {
        this.$tabs.each( function() {
            this.classList.toggle( 'is-active', this.getAttribute( 'data-id' ) == id );
        } );

        this.$content.each( function() {
            $( this )
                .toggle( this.id == id )
                .toggleClass( 'is-active', this.id == id )
                .children().each( function( index, el ) {
					var $el = $( el );

		            /**
		             * Fires after the tab is displayed.
		             *
		             * @since 1.0.0
		             */
		            $el.trigger( 'element:parent:change', $el );
                } );
        } );
    },

    /**
     * Destroys the Tabs instance immediately before the element/view is destroyed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy( e );
        }
    },

    /**
     * Destroys the the Tabs instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
	    this.$el.off();
	    this.$tabs.off();

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }
};

/**
 * Carousel jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorTabs = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorTabs' );
        if ( ! instance ) {
            $.data( this, 'tailorTabs', new Tabs( this, options, callbacks ) );
        }
    } );
};

module.exports = Tabs;
},{}],6:[function(require,module,exports){
/**
 * Tailor.Objects.Toggles
 *
 * A toggles module.
 *
 * @class
 */
var $ = window.jQuery,
    Toggles;

/**
 * The Toggles object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 * @constructor
 */
Toggles = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );

    this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Toggles.prototype = {

    defaults : {
        toggles : '.tailor-toggle__title',
        content : '.tailor-toggle__body',
        accordion : false,
        initial : -1,
        speed : 150
    },

	callbacks : {

		/**
		 * Callback function to be run when the object is initialized.
		 *
		 * @since 1.0.0
		 */
		onInitialize : function () {},

		/**
		 * Callback function to be run when the object is destroyed.
		 *
		 * @since 1.0.0
		 */
		onDestroy : function () {}
	},

    /**
     * Initializes the object.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.querySelectors();
        this.addEventListeners();

        var initial = ( this.options.initial - 1 );
        if ( this.$toggles[ initial ] ) {
            this.activate( this.$toggles[ initial ] );
        }

	    if ( 'function' == typeof this.callbacks.onInitialize ) {
		    this.callbacks.onInitialize.call( this );
	    }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

            // Fires before the element template is refreshed
            .on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after a child element is added
            .on( 'element:child:add element:child:ready', $.proxy( this.onChangeChild, this ) )

            // Fires after a child element is refreshed
            .on( 'element:child:refresh', $.proxy( this.onChangeChild, this ) )

            // Fires after a child element is destroyed
            .on( 'element:child:destroy', $.proxy( this.onChangeChild, this ) )
    },

    /**
     * Caches the toggles and toggle content.
     *
     * @since 1.0.0
     */
    querySelectors : function() {
        this.$content = this.$el.find( this.options.content );
        this.$toggles = this.$el
            .find( this.options.toggles )
            .off()
            .on( 'click', $.proxy( this.onClick, this ) );
    },

    /**
     * Activates a toggle when it is clicked.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        this.activate( e.target );
        e.preventDefault();
    },

    /**
     * Refreshes the selectors when a toggle is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onChangeChild : function( e, childView ) {
        if ( e.target == this.el ) {
            this.querySelectors();
        }
    },

    /**
     * Activates a given toggle.
     *
     * @since 1.0.0
     *
     * @param el
     */
    activate : function( el ) {
        var speed = this.options.speed;
        var $el = $( el );

        if ( this.options.accordion ) {
            this.$toggles.filter( function() {
                return this !== el;
            } ).removeClass( 'is-active' );

            this.$content.each( function() {
                var $toggle = $( this );
                if ( el.nextElementSibling == this ) {
                    $toggle
	                    .slideToggle( speed )
	                    .children().each( function( index, el ) {
		                    var $el = $( el );

		                    /**
		                     * Fires after the toggle is displayed.
		                     *
		                     * @since 1.0.0
		                     */
		                    $el.trigger( 'element:parent:change', $el );
	                    } );
                }
                else {
                    $toggle.slideUp( speed );
                }
            } );
        }
        else {
            this.$content
                .filter( function() { return el.nextElementSibling == this; } )
                .slideToggle( speed )
	            .each( function() {
		            $( this ).children().each( function( index, el ) {
			            var $el = $( el );

			            /**
			             * Fires after the toggle is displayed.
			             *
			             * @since 1.0.0
			             */
			            $el.trigger( 'element:parent:change', $el );
		            } );
	            } );
        }

        $el.toggleClass( 'is-active' );
    },

    /**
     * Destroys the Toggles instance immediately before the element/view is destroyed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy( e );
        }
    },

    /**
     * Destroys the the Toggles instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        this.$el.off();
        this.$toggles.off();

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }

};

/**
 * Toggles jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorToggles = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorToggles' );
        if ( ! instance ) {
            $.data( this, 'tailorToggles', new Toggles( this, options , callbacks ) );
        }
    } );
};

module.exports = Toggles;
},{}],7:[function(require,module,exports){
( function( $ ) {

    'use strict';

    require( './components/tabs' );
    require( './components/toggles' );
    require( './components/map' );
    require( './components/lightbox' );
    require( './components/slideshow' );
    require( './components/frontend/carousel' );

    $( document ).ready( function() {

	    /**
	     * Tabs.
	     */
	    $( '.tailor-tabs' ).tailorTabs();

	    /**
	     * Toggles.
	     */
	    $( '.tailor-toggles' ).tailorToggles();

	    /**
	     * Maps.
	     */
	    $( '.tailor-map' ).tailorGoogleMap();

	    /**
	     * Carousels.
	     */
	    $( '.tailor-carousel' ).each( function() {
		    var $el = $( this );
		    var $data = $el.data();

		    $el.tailorCarousel( {
			    slidesToShow : $data.slides || 1,
			    fade : ( $data.fade && 1 == $data.slides ),
			    infinite : this.classList.contains( 'tailor-posts' ) || this.classList.contains( 'tailor-gallery' )
		    } );
	    } );

	    /**
	     * Masonry layouts.
	     */
	    $( '.tailor-grid--masonry' ).each( function() {
		    var $el = $( this );

		    $el.imagesLoaded( function() {
			    $el.shuffle( {
				    itemSelector: '.tailor-grid__item'
			    } );
		    } );
	    } );

	    /**
	     * Slideshow galleries.
	     */
	    $( '.tailor-slideshow--gallery' ).each( function() {
		    var $el = $( this );
		    var $data = $el.data() || {};
		    var options = {
			    autoplay : $data.autoplay || false,
			    arrows : $data.arrows || false,
			    draggable : true
		    };

		    if ( '1' == $data.thumbnails ) {
			    options.customPaging = function( slider, i ) {
				    var thumb = $( slider.$slides[ i ] ).data( 'thumb' );
				    return '<img class="slick-thumbnail" src="' + thumb + '">';
			    };
			    options.dots = true;
		    }

		    $el.tailorSlideshow( options );
	    } );

	    /**
	     * Lightbox galleries.
	     */
	    $( '.is-lightbox-gallery' ).tailorLightbox();

    } );
} ) ( jQuery );
},{"./components/frontend/carousel":1,"./components/lightbox":2,"./components/map":3,"./components/slideshow":4,"./components/tabs":5,"./components/toggles":6}]},{},[7]);
