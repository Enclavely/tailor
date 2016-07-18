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