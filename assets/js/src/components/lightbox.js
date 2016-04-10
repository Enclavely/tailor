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