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

	this.options = $.extend( {}, this.defaults, options );
	if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
		this.options.rtl = true;
	}
	
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Carousel.prototype = {

    defaults : {
        items : '.tailor-carousel__item',
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
        adaptiveHeight : true,
        draggable : false,
        speed : 250,
        slidesToShow : 1,
        slidesToScroll : 1,
        autoplay : false,
        arrows : false,
        dots : true,
        fade : false
    },

    callbacks : {

        /**
         * Callback function to be run when the Carousel instance is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the Carousel instance is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the carousel.
     *
     * @since 1.0.0
     */
    initialize : function() {
	    this.slick( this.addEventListeners );

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

	        // Fires when the element is moved into a new container
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
	 * Re-initializes the carousel if the event was triggered on the element.
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
	 * Refreshes the carousel if the event was triggered on the carousel DOM element.
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
	 * Destroys the carousel if the event was triggered on the carousel DOM element.
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
	 * Destroys the carousel immediately before the view/DOM element is destroyed.
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
     * Creates a new Slick Slider instance.
     *
     * @since 1.0.0
     *
     * @param callback
     */
    slick : function( callback ) {
		var carousel = this;

	    this.$el.imagesLoaded( function() {
	        carousel.$wrap.slick( carousel.options );

		    if ( 'function' == typeof callback ) {
			    callback.call( carousel );
		    }
	    } );
    },

    /**
     * Refreshes the Slick Slider instance.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
	    this.$wrap.slick( 'refresh' );
    },

    /**
     * Destroys the Slick Slider instance.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        this.$wrap.slick( 'unslick' );
    },

    /**
     * Destroys the carousel.
     *
     * @since 1.0.0
     */
    destroy : function() {
        this.$el.off();
        this.unSlick();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Simple carousel jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorSimpleCarousel = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorSimpleCarousel' );
        if ( ! instance ) {
            $.data( this, 'tailorSimpleCarousel', new Carousel( this, options, callbacks ) );
        }
    } );
};