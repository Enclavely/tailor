/**
 * Tailor.Components.Slideshow
 *
 * A slideshow component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Slideshow;

Slideshow = Components.create( {
    
    slickActive: false,
    
    getDefaults: function() {
        return {
            items : '.tailor-slideshow__slide',
            prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
            nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
            adaptiveHeight : true,
            draggable : false,
            speed : 250,
            slidesToShow : 1,
            slidesToScroll : 1,
            autoplay : false,
            autoplaySpeed : 3000,
            arrows : false,
            dots : false,
            fade : true
        };
    },

    onInitialize: function() {
        this.$wrap = this.$el.find( '.tailor-slideshow__slides' );
        this.slick();
    },
    
    /**
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    slick : function() {
        var component = this;
        this.$el.imagesLoaded( function() {
            component.$wrap.slick( component.options );
            component.slickActive = true;
        } );
    },

    /**
     * Refreshes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
        if ( this.slickActive ) {
            this.$wrap.slick( 'refresh' );
        }
    },

    /**
     * Destroys the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        if ( this.slickActive ) {
            this.$wrap.slick( 'unslick' );
        }
    },
    
    /**
     * Element listeners
     */
    onMove: function() {
        this.refreshSlick();
    },
    
    onBeforeCopy: function() {
        this.unSlick();
    },
    
    onChangeParent: function() {
        this.refreshSlick();
    },

    onDestroy : function() {
        this.unSlick();
    },

    /**
     * Window listeners
     */
    onResize: function() {
        this.refreshSlick();
    }
    
} );

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
