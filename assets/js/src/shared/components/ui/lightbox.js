/**
 * Tailor.Components.Lightbox
 *
 * A lightbox component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Lightbox;

Lightbox = Components.create( {

    getDefaults: function() {
        return {
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
        };
    },

    /**
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize: function() {
        this.magnificPopup();
    },

    /**
     * Initializes the Magnific Popup plugin.
     *
     * @since 1.7.5
     */
    magnificPopup : function() {
        this.$el.magnificPopup( this.options );
    }

} );

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

module.exports = Lightbox;