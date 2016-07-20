/**
 * Tailor.Objects.Carousel
 *
 * A carousel module for managing Slick Slider elements in the Canvas.
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
		adaptiveHeight : false,
		draggable : false,
		speed : 250,
		slidesToShow : 1,
		slidesToScroll : 1,
		initialSlide : 0,
		autoplay : false,
		arrows : false,
		dots : false,
		fade : false,
		infinite : false
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
     * Initializes the carousel.
     *
     * @since 1.0.0
     */
    initialize : function() {
	    this.slickAt( 0, this.addEventListeners );

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

	    var showEl = true;

        this.$el

	        // Fires before the element template is refreshed
            .on( 'before:element:refresh', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:refresh', $.proxy( this.refreshSlick, this ) )

	        // Fires when the element parent changes
	        .on( 'element:change:parent', $.proxy( this.maybeRefreshSlick, this ) )

	        // Fires before and after the element is copied
	        .on( 'before:element:copy', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:copy', $.proxy( this.maybeSlick, this ) )

	        // Fires after the parent element is modified
	        .on( 'element:parent:change', $.proxy( this.maybeRefreshSlick, this ) )

	        // Fires before the element is destroyed
	        .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

	        /**
	         * Child event listeners
	         */

	        // Fires before and after a child element is added
	        .on( 'before:element:child:ready', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:ready', $.proxy( this.onReadyChild, this ) )

	        // Fires after a child element is added
	        .on( 'element:child:add', $.proxy( this.refreshSlick, this ) )

	        // Fires after a child element is removed
	        .on( 'element:child:remove', $.proxy( this.onDestroyDescendant, this ) )

	        // Fires before and after a child element is refreshed
	        .on( 'before:element:child:refresh', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:refresh', $.proxy( this.maybeSlick, this ) )

	        // Fires before and after the position of an item is changed
	        .on( 'before:element:change:order', $.proxy( this.maybeUnSlick, this ) ) // @todo rename to reflect child
	        .on( 'element:change:order', $.proxy( this.onReorderChild, this ) ) // @todo rename to reflect child

	        // Fires before and after a child element is destroyed
	        .on( 'before:element:child:destroy', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:destroy', $.proxy( this.onDestroyChild, this ) )

	        /**
	         * Descendant event listeners
	         */

	        // Fires after a descendant element is added
	        .on( 'element:descendant:add', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is removed
	        .on( 'element:descendant:remove', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is ready
	        .on( 'element:descendant:ready', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is destroyed
	        .on( 'element:descendant:destroy', $.proxy( this.onDestroyDescendant, this ) );
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

	    var carousel = this;

	    carousel.$items = carousel.$wrap.find( ' > ' + carousel.options.items );
	    carousel.$dots = carousel.$el.children( '.slick-dots' ).find( ' > li' );
	    carousel.$dots.on( 'click', function( e ) {
            var $dot = $( e.currentTarget );

		    carousel.currentSlide = $dot.data( 'id' );
		    carousel.$wrap.slick( 'slickGoTo', $dot.index() );
            e.preventDefault();
        } );

        if ( ! carousel.currentSlide ) {
            var $activeSlide = carousel.$items.filter( function() {
                return this.classList.contains( 'slick-current' );
            } );
	        carousel.currentSlide = $activeSlide.length ? $activeSlide.id : carousel.$items[0].id;
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
	 * Adds a new child element to the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onReadyChild : function( e, childView ) {
		if ( e.target == this.el ) {
			this.slickAt( childView.$el.index() );
		}
		else {
			this.refreshSlick();
		}
	},

	/**
	 * Reorders a child element in the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
	onReorderChild : function( e, id, newIndex, oldIndex ) {
		if ( e.target !== this.el ) {
			return;
		}

		this.querySelectors();

		var $item = this.$items.filter( function() { return this.id == id } );
		if ( oldIndex - newIndex < 0 ) {
			$item.insertAfter( this.$items[ newIndex ] );
		}
		else {
			$item.insertBefore( this.$items[ newIndex ] );
		}

		this.slickAt( newIndex );
	},

	/**
	 * Removes a child element from the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onDestroyChild : function( e, childView ) {
		var index = childView.$el.index();
		childView.$el.remove();
		this.slickAt( index );
	},

	/**
	 * Refreshes the carousel when a descendant element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onDestroyDescendant : function( e, childView ) {
		childView.$el.detach();
		this.refreshSlick();
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

	        //var carousel = this;
	        //carousel.$el.imagesLoaded( function() {
		    //    carousel.refreshSlick();
	        //} );
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
        var carousel = this;
	    var currentSlide = this.currentSlide;
	    var currentIndex = this.$dots.filter( function() { return this.getAttribute( 'data-id' ) == currentSlide; } ).index();
	    var options = $.extend( {}, this.options, {
		    autoplay : false,
		    fade : false,
		    initialSlide : currentIndex
	    } );

        //this.$el.imagesLoaded( function() {

            carousel.$wrap
                .slick( options )
                .on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
                    if ( slick.$slider[0] == carousel.$wrap[0] && currentSlide != nextSlide ) {
                        carousel.updateDots( nextSlide );
                    }
                } );

	        if ( 'function' == typeof callback ) {
		        callback.call( carousel );
	        }
        //} );
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