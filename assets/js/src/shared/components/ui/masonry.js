/**
 * Tailor.Components.Masonry
 *
 * A masonry component for managing Shuffle elements.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Masonry;

Masonry = Components.create( {

    shuffleActive : false,

    getDefaults: function() {
        return {
            itemSelector : '.tailor-grid__item'
        };
    },
    
    /**
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize: function() {
        this.$wrap = this.$el.find( '.tailor-grid--masonry' );
        this.shuffle();
    },

    /**
     * Initializes the Shuffle instance.
     *
     * @since 1.0.0
     */
    shuffle : function() {
        var component = this;
        this.$wrap.imagesLoaded( function() {
            component.$wrap.shuffle( component.options );
            component.shuffleActive = true;
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
        this.shuffleActive = false;
    },

    /**
     * Element listeners
     */
    onMove: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    },

    onChangeParent: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    },

    onDestroy: function() {
        if ( this.shuffleActive ) {
            this.unShuffle();
        }
    },
    
    /**
     * Window listeners
     */
    onResize: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    }
    
} );

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
