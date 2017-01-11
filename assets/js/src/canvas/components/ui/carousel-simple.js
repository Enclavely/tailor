/**
 * Tailor.Components.SimpleCarousel
 *
 * A simplified carousel component.
 *
 * @class
 */
var $ = window.jQuery,
	Components = window.Tailor.Components,
    Carousel;

Carousel = Components.create( {

	slickActive: false,
	
	getDefaults : function () {
		return {
			items : '.tailor-carousel__item',
			prevArrow : '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
			nextArrow : '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
			adaptiveHeight : true,
			draggable : false,
			speed : 250,
			slidesToShow : 1,
			slidesToScroll : 1,
			autoplay : false,
			autoplaySpeed : 3000,
			arrows : false,
			dots : true,
			fade : false
		};
	},

	onInitialize : function () {
		this.$wrap = this.$el.find( '.tailor-carousel__wrap' ).first();
		this.slick();
	},
	
	/**
	 * Creates a new Slick Slider instance.
	 *
	 * @since 1.0.0
	 */
	slick : function() {
		var component = this;
		component.$el.imagesLoaded( function() {
			component.$wrap.slick( component.options );
			component.slickActive = true;
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
	 * Element listeners
	 */
	onMove: function() {
		if ( this.slickActive ) {
			this.refreshSlick();
		}
	},

	onBeforeCopy: function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},
	
	onCopy: function() {
		if ( ! this.slickActive ) {
			this.slick();
		}
	},

	onBeforeRefresh: function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},

	onChangeParent: function() {
		this.refreshSlick();
	},
	
	onDestroy : function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},

	/**
	 * Window listeners
	 */
	onResize: function() {
		if ( this.slickActive ) {
			this.refreshSlick();
		}
	}

} );	

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