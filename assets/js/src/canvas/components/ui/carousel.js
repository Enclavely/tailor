/**
 * Tailor.Components.Carousel
 *
 * A carousel component.
 *
 * @class
 */
var $ = window.jQuery,
	Components = window.Tailor.Components,
    Carousel;

Carousel = Components.create( {

	getDefaults: function() {
		return {
			items : '.tailor-carousel__item',
			prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
			nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
			adaptiveHeight : false,
			draggable : false,
			speed : 250,
			slidesToShow : 1,
			slidesToScroll : 1,
			initialSlide : 0,
			autoplay : false,
			autoplaySpeed : 3000,
			arrows : false,
			dots : false,
			fade : false,
			infinite : false
		};
	},

	onInitialize: function() {
		this.$wrap = this.$el.find( '.tailor-carousel__wrap' ).first();
		this.slickAt( 0, this.addEventListeners );
	},

	/**
	 * Initializes the Slick Slider plugin at a given index.
	 *
	 * @since 1.0.0
	 *
	 * @param index
	 * @param callback
	 */
	slickAt : function( index, callback ) {
		this.querySelectors();

		var numberItems = this.$items.length;
		if ( ! numberItems ) {
			return;
		}

		index = Math.min( index, numberItems - 1 );
		if ( index < this.options.slidesToShow ) {
			index = 0;
		}

		var $item = this.$items[ index ];
		this.currentSlide = $item.id;

		this.slick( callback );
		this.updateDots( index );
	},

	/**
	 * Initializes the Slick Slider plugin.
	 *
	 * @since 1.0.0
	 *
	 * @param callback
	 */
	slick : function( callback ) {
		var component = this;
		var currentSlide = this.currentSlide;
		var currentIndex = this.$dots.filter( function() { return this.getAttribute( 'data-id' ) == currentSlide; } ).index();
		var options = $.extend( {}, this.options, {
			autoplay : false,
			autoplaySpeed : 3000,
			fade : false,
			initialSlide : currentIndex
		} );

		component.$wrap
			.slick( options )
			.on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
				if ( slick.$slider[0] == component.$wrap[0] && currentSlide != nextSlide ) {
					component.updateDots( nextSlide );
				}
			} );

		if ( 'function' == typeof callback ) {
			callback.call( component );
		}
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
	 * Refreshes the dot and item caches and defines the current slide.
	 *
	 * @since 1.0.0
	 */
	querySelectors : function() {
		if ( this.$dots ) {
			this.$dots.off();
		}

		var component = this;
		component.$items = component.$wrap.find( ' > ' + component.options.items );
		component.$dots = component.$el.children( '.slick-dots' ).find( ' > li' );
		component.$dots.on( 'click', function( e ) {
			var $dot = $( e.currentTarget );
			component.currentSlide = $dot.data( 'id' );
			component.$wrap.slick( 'slickGoTo', $dot.index() );
			e.preventDefault();
		} );

		if ( ! component.currentSlide ) {
			var $activeSlide = component.$items.filter( function() {
				return this.classList.contains( 'slick-current' );
			} );
			component.currentSlide = $activeSlide.length ? $activeSlide.id : component.$items[0].id;
		}
	},

	/**
	 * Sets the dot with the given index as active.
	 *
	 * @since 1.0.0
	 *
	 * @param index
	 */
	updateDots : function( index ) {
		this.$dots.each( function( i, el ) {
			if ( index == i ) {
				el.classList.add( 'slick-active' );
			}
			else {
				el.classList.remove( 'slick-active' );
			}
		} );
		this.$dots.toggle( ( this.$dots.length / this.options.slidesToShow ) > 1 );
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

	onBeforeRefresh: function() {
		this.unSlick();
	},

	onRefresh: function() {
		this.refreshSlick();
	},

	onJSRefresh: function() {
		this.refreshSlick();
	},
	
	onChangeParent: function() {
		this.refreshSlick();
	},

	onDestroy : function() {
		this.unSlick();
	},


	/**
	 * Child listeners
	 */
	onAddChild: function() {
		this.refreshSlick();
	},

	onRemoveChild: function( e, childView ) {
		childView.$el.detach();
		this.refreshSlick();
	},

	onBeforeReadyChild : function( e, childView ) {
		this.unSlick();
	},

	onReadyChild : function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},
	
	onBeforeReorderChild: function() {
		this.unSlick();
	},

	onReorderChild: function( e, cid, index, oldIndex ) {
		this.querySelectors();
		this.slickAt( index );
	},

	onBeforeRefreshChild: function() {
		this.unSlick();
	},

	onRefreshChild: function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},

	onBeforeJSRefreshChild: function() {
		this.unSlick();
	},

	onJSRefreshChild: function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},

	onBeforeDestroyChild: function() {
		this.unSlick();
	},

	onDestroyChild : function( e, childView ) {
		var index = childView.$el.index();
		childView.$el.remove();
		this.slickAt( index );
	},


	/**
	 * Descendant listeners
	 */
	onAddDescendant: function() {
		this.refreshSlick();
	},

	onRemoveDescendant: function() {
		this.refreshSlick();
	},

	onReadyDescendant: function() {
		this.refreshSlick();
	},

	onRefreshDescendant: function() {
		this.refreshSlick();
	},

	onJSRefreshDescendant: function() {
		this.refreshSlick();
	},

	onDestroyDescendant : function() {
		this.refreshSlick();
	},

	/**
	 * Window listeners
	 */
	onResize: function() {
		this.refreshSlick();
	}

} );

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