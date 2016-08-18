/**
 * Tailor.Objects.Masonry
 *
 * A masonry module for managing Shuffle elements.
 *
 * @class
 */
var $ = window.jQuery,
    Masonry;

/**
 * The Masonry object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Masonry = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$wrap = this.$el.find( '.tailor-grid--masonry' );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Masonry.prototype = {

    defaults : {
        itemSelector : '.tailor-grid__item'
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
     * Initializes the Carousel instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.shuffle();

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

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.refreshShuffle, this ) )

            // Fires before and after the element is copied
            .on( 'before:element:copy', $.proxy( this.maybeUnShuffle, this ) )
            .on( 'element:copy', $.proxy( this.maybeShuffle, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.refreshShuffle, this ) );
    },

    /**
     * Re-initializes the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.shuffle();
        }
    },

    /**
     * Refreshes the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefreshShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.refreshShuffle();
        }
    },

    /**
     * Destroys the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeUnShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.unShuffle();
        }
    },

    /**
     * Destroys the Shuffle instance immediately before the element/view is destroyed.
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
     * Creates a new Shuffle instance.
     *
     * @since 1.0.0
     */
    shuffle : function() {
	    var masonry = this;
	    this.$wrap.imagesLoaded( function() {
		    masonry.$wrap.shuffle( masonry.options );
		    masonry.addEventListeners();
	    } );
    },

    /**
     * Refreshes the Shuffle instance.
     *
     * @since 1.0.0
     */
    refreshShuffle : function() {
        this.$wrap.shuffle( 'update' );
    },

    /**
     * Destroys the Shuffle instance.
     *
     * @since 1.0.0
     */
    unShuffle : function() {
	    this.$wrap.shuffle( 'destroy' );
    },

    /**
     * Destroys the the Shuffle instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        this.unShuffle();
	    this.$el.off();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Masonry jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorMasonry = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorMasonry' );
        if ( ! instance ) {
            $.data( this, 'tailorMasonry', new Masonry( this, options, callbacks ) );
        }
    } );
};

module.exports = Masonry;
