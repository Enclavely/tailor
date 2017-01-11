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
        autoplaySpeed : 3000,
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
