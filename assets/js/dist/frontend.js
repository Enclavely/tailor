(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = window.jQuery;

// Include polyfills
require( './shared/utility/polyfills/classlist' );
require( './shared/utility/polyfills/raf' );
require( './shared/utility/polyfills/transitions' );

// Create the Tailor object
var abstractComponent = require( './shared/components/ui/abstract' );
window.Tailor = {
	
	Components:     {

		/**
		 * Creates a new component.
		 *
		 * @since 1.7.5
		 *
		 * @param prototype
		 * @returns {component}
		 */
		create: function( prototype )  {
			var originalPrototype = prototype;
			var component = function( el, options, callbacks ) {
				abstractComponent.call( this, el, options, callbacks );
			};
			component.prototype = Object.create( abstractComponent.prototype );
			for ( var key in originalPrototype )  {
				component.prototype[ key ] = originalPrototype[ key ];
			}

			Object.defineProperty( component.prototype, 'constructor', {
				enumerable: false,
				value: component
			} );

			return component;
		}
	},

	/**
	 * Initializes all frontend elements.
	 * 
	 * Available for reuse when content is added to the page using AJAX.
	 * 
	 * @since 1.5.6
	 */
	initElements : function() {
		
		// Parallax sections
		$( '.tailor-section[data-ratio]' ).tailorParallax();

		// Tabs
		$( '.tailor-tabs' ).tailorTabs();

		// Toggles
		$( '.tailor-toggles' ).tailorToggles();

		// Google Maps
		$( '.tailor-map' ).tailorGoogleMap();

		// Carousels
		$( '.tailor-carousel' ).each( function() {
			var $el = $( this );
			var $data = $el.data();
			$el.tailorCarousel( {
				slidesToShow : $data.slides || 1,
				fade : ( $data.fade && 1 == $data.slides ),
				infinite : this.classList.contains( 'tailor-posts' ) || this.classList.contains( 'tailor-gallery' )
			} );
		} );

		// Masonry layouts
		$( '.tailor-grid--masonry' ).each( function() {
			var $el = $( this );
			$el.imagesLoaded( function() {
				$el.shuffle( {
					itemSelector: '.tailor-grid__item'
				} );
			} );
		} );

		// Slideshows
		$( '.tailor-slideshow--gallery' ).each( function() {
			var $el = $( this );
			var $data = $el.data() || {};
			var options = {
				autoplay : $data.autoplay || false,
				autoplaySpeed : $data.autoplaySpeed || 3000,
				arrows : $data.arrows || false,
				draggable : true
			};

			if ( '1' == $data.thumbnails ) {
				options.customPaging = function( slider, i ) {
					var thumb = $( slider.$slides[ i ] ).data( 'thumb' );
					return '<img class="slick-thumbnail" src="' + thumb + '">';
				};
				options.dots = true;
			}

			$el.tailorSlideshow( options );
		} );

		// Lightboxes
		$( '.is-lightbox-gallery' ).each( function() {
			var $el = $( this );
			if ( $el.hasClass( 'tailor-carousel' ) ) {
				$el.tailorLightbox( {
					delegate : '.slick-slide:not( .slick-cloned ) .is-lightbox-image'
				} );
			}
			else {
				$el.tailorLightbox();
			}
		} );

		$( '.is-lightbox-image' ).tailorLightbox( { delegate : false } );
	}
};

// Shared components
window.Tailor.Components.Abstract = abstractComponent;
window.Tailor.Components.Lightbox = require( './shared/components/ui/lightbox' );
window.Tailor.Components.Map = require( './shared/components/ui/map' );
window.Tailor.Components.Masonry = require( './shared/components/ui/masonry' );
window.Tailor.Components.Parallax = require( './shared/components/ui/parallax' );
window.Tailor.Components.Slideshow = require( './shared/components/ui/slideshow' );
window.Tailor.Components.Tabs = require( './shared/components/ui/tabs' );
window.Tailor.Components.Toggles = require( './shared/components/ui/toggles' );

// Frontend components
require( './frontend/components/ui/carousel' );

// Initialize elements when the document is ready
$( function() {
	window.Tailor.initElements();
} );
},{"./frontend/components/ui/carousel":2,"./shared/components/ui/abstract":3,"./shared/components/ui/lightbox":4,"./shared/components/ui/map":5,"./shared/components/ui/masonry":6,"./shared/components/ui/parallax":7,"./shared/components/ui/slideshow":8,"./shared/components/ui/tabs":9,"./shared/components/ui/toggles":10,"./shared/utility/polyfills/classlist":11,"./shared/utility/polyfills/raf":12,"./shared/utility/polyfills/transitions":13}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/**
 * Tailor.Components.Abstract
 *
 * An abstract component.
 *
 * @class
 */
var $ = window.jQuery,
	$win = $( window ),
	$doc = $( document ),
    AbstractComponent,
	id = 0;

/**
 * An abstract component.
 *
 * @since 1.7.5
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
AbstractComponent = function( el, options, callbacks ) {
	this.id = 'tailor' + id ++;
    this.el = el;
    this.$el = $( this.el );
	this.callbacks = $.extend( {}, this.callbacks, callbacks );
	this.options = $.extend( {}, this.getDefaults(), this.$el.data(), options );
	if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
		this.options.rtl = true;
	}
	
    this.initialize();
};

AbstractComponent.prototype = {

	callbacks : {

		/**
		 * Fired after the component has been initialized.
		 *
		 * @since 1.7.5
		 */
		onInitialize : function () {},

		/**
		 * Fired after the component has been destroyed.
		 *
		 * @since 1.7.5
		 */
		onDestroy : function () {}
	},

	/**
	 * Returns the default values for the component.
	 *
	 * @since 1.7.5
	 *
	 * @returns {{}}
	 */
	getDefaults : function() { return {}; },

	/**
	 * Initializes the component.
	 *
	 * @since 1.7.5
	 */
    initialize : function() {
	    this.addEventListeners();

	    // Fires once the element listeners have been added
	    this.onInitialize();
        if ( 'function' == typeof this.callbacks.onInitialize ) {
            this.callbacks.onInitialize.call( this );
        }
    },

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.7.5
	 */
	addEventListeners : function() {
		var component = this;
	    this.onResizeCallback = _.throttle( this.onResize.bind( this ) , 100 );

	    /**
	     * Element listeners
	     */

	    // Element ready
	    this.$el
		    .on( 'before:element:ready.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onBeforeReady( e, view );
			    }
		    } )
		    .on( 'element:ready.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onReady( e, view );
			    }
		    } );
		
	    // Element moved
	    this.$el.on( 'element:change:order.' + component.id + ' element:change:parent.' + component.id, function( e, view ) {
		    if ( e.target == component.el ) {
			    component.onMove( e, view );
		    }
	    } );
		
	    // Element copied
	    this.$el
		    .on( 'before:element:copy.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onBeforeCopy( e, view );
			    }
		    } )
		    .on( 'element:copy.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onCopy( e, view );
			    }
		    } );

	    // Element refreshed
	    this.$el.on( 'before:element:refresh.' + component.id, function( e, view ) {
		    if ( e.target == component.el ) {
			    component.destroy();
			    component.onBeforeRefresh( e, view );
		    }
	    } );

	    // Element refreshed using JavaScript
	    this.$el
		    .on( 'before:element:jsRefresh.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onBeforeJSRefresh( e, view );
			    }
		    } )
		    .on( 'element:jsRefresh.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onJSRefresh( e, view );
			    }
		    } );

	    // Element destroyed
	    this.$el
		    .on( 'before:element:destroy.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.onBeforeDestroy( e, view );
			    }
		    } )
		    .on( 'element:destroy.' + component.id, function( e, view ) {
			    if ( e.target == component.el ) {
				    component.destroy();
			    }
		    } );

	    /**
	     * Child listeners
	     */

	    // Child added
	    this.$el.on( 'element:child:add.' + component.id, function( e, view ) {
		    if ( e.target == component.el ) {
			    component.onAddChild( e, view );
		    }
	    } );

	    // Child removed
	    this.$el.on( 'element:child:remove.' + component.id, function( e, view ) {
		    if ( e.target == component.el ) {
			    component.onRemoveChild( e, view );
		    }
	    } );
		
		// Child ready
		this.$el
			.on( 'before:element:child:ready.' + component.id, function( e, view ) {
				component.onBeforeReadyChild( e, view );
			} )
			.on( 'element:child:ready.' + component.id, function( e, view ) {
				component.onReadyChild( e, view );
			} );

		// Child moved
		this.$el.on( 'element:child:change:order.' + component.id + ' element:child:change:parent.' + component.id, function( e, view ) {
			component.onMoveChild( e, view );
		} );
		
		// Child reordered (using navigation)
		this.$el
			.on( 'before:navigation:reorder.' + component.id, function( e, cid, index, oldIndex ) {
				component.onBeforeReorderChild( e, cid, index, oldIndex  );
			} )
			.on( 'navigation:reorder.' + component.id, function( e, cid, index, oldIndex  ) {
				component.onReorderChild( e, cid, index, oldIndex );
				component.onReorderChild( e, cid, index, oldIndex );
			} );
		
		// Child refreshed
		this.$el
			.on( 'before:element:child:refresh.' + component.id, function( e, view ) {
				component.onBeforeRefreshChild( e, view );
			} )
			.on( 'element:child:refresh.' + component.id, function( e, view ) {
				component.onRefreshChild( e, view );
			} );
		
	    // Child refreshed using JavaScript
	    this.$el
		    .on( 'before:element:child:jsRefresh.' + component.id, function( e, view ) {
			    component.onBeforeJSRefreshChild( e, view );
		    } )
		    .on( 'element:child:jsRefresh.' + component.id, function( e, view ) {
			    component.onJSRefreshChild( e, view );
		    } );

	    // Child destroyed
	    this.$el
		    .on( 'before:element:child:destroy.' + component.id, function( e, view ) {
			    component.onBeforeDestroyChild( e, view );
		    } )
		    .on( 'element:child:destroy.' + component.id, function( e, view ) {
			    component.onDestroyChild( e, view );
		    } );

		// All child changes
		this.$el.on(
			'element:child:add.' + component.id + ' ' +
			'element:child:remove.' + component.id + ' ' +
			'element:child:ready.' + component.id + ' ' +
			'element:child:refresh.' + component.id + ' ' +
			'element:child:jsRefresh.' + component.id + ' ' +
			'element:child:destroy.' + component.id,
			function( e, view ) {
				component.onChangeChild( e, view );
			} );

	    /**
	     * Descendant listeners
	     */

	    // Descendant added
	    this.$el.on( 'element:descendant:add.' + component.id, function( e, view ) {
		    if ( e.target != component.el ) {
			    component.onAddDescendant( e, view );
		    }
	    } );

	    // Descendant removed
	    this.$el.on( 'element:descendant:remove.' + component.id, function( e, view ) {
		    if ( e.target != component.el ) {
			    component.onRemoveDescendant( e, view );
		    }
	    } );
		
		// Descendant ready
		this.$el
			.on( 'before:element:descendant:ready.' + component.id, function( e, view ) {
				if ( e.target != component.el ) {
					component.onBeforeReadyDescendant( e, view );
				}
			} )
			.on( 'element:descendant:ready.' + component.id, function( e, view ) {
				if ( e.target != component.el ) {
					component.onReadyDescendant( e, view );
				}
			} );

		// Descendant refreshed
	    this.$el
		    .on( 'before:element:descendant:refresh.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onBeforeRefreshDescendant( e, view );
			    }
		    } )
		    .on( 'element:descendant:refresh.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onRefreshDescendant( e, view );
			    }
		    } );

	    // Descendant refreshed using JavaScript
	    this.$el
		    .on( 'before:element:descendant:jsRefresh.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onBeforeJSRefreshDescendant( e, view );
			    }
		    } )
		    .on( 'element:descendant:jsRefresh.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onJSRefreshDescendant( e, view );
			    }
		    } );

	    // Descendant destroyed
	    this.$el
		    .on( 'before:element:descendant:destroy.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onBeforeDestroyDescendant( e, view );
			    }
		    } )
		    .on( 'element:descendant:destroy.' + component.id, function( e, view ) {
			    if ( e.target != component.el ) {
				    component.onDestroyDescendant( e, view );
			    }
		    } );

		// All descendant changes
		this.$el.on(
			'element:descendant:add.' + component.id + ' ' +
			'element:descendant:remove.' + component.id + ' ' +
			'element:descendant:ready.' + component.id + ' ' +
			'element:descendant:refresh.' + component.id + ' ' +
			'element:descendant:jsRefresh.' + component.id + ' ' +
			'element:descendant:destroy.' + component.id,
				function( e, view ) {
					component.onChangeDescendant( e, view );
				} );

	    /**
	     * Parent listeners.
	     */
	    $doc
		    .on(
			    'element:descendant:add.' + component.id + ' ' +
			    'element:descendant:remove.' + component.id + ' ' +
			    'element:descendant:ready.' + component.id + ' ' +
			    'element:descendant:destroy.' + component.id,
			    function( e, view ) {
				    if ( e.target.contains( component.el ) && e.target != component.el && view.el != component.el ) {
					    component.onChangeParent();
				    }
			    } )
		    .on(
			    'element:refresh.' + component.id + ' ' +
			    'element:jsRefresh.' + component.id + ' ' +
			    'element:descendant:refresh.' + component.id + ' ' +
			    'element:descendant:jsRefresh.' + component.id,
			    function( e, view ) {
				    if ( e.target.contains( component.el ) && e.target != component.el && view.el != component.el ) {
					    component.onChangeParent();
				    }
			    } );

	    /**
	     * Window listeners.
	     */
	    $win.on( 'resize.' + component.id, component.onResizeCallback );
    },

	/**
	 * Removes registered event listeners.
	 *
	 * @since 1.7.5
	 */
	removeEventListeners : function() {
		this.$el.off( '.' + this.id );
		$win.off( 'resize.' + this.id, this.onResizeCallback );
	},

	/**
	 * Fires when the element is initialized.
	 *
	 * @since 1.7.5
	 */
	onInitialize: function() {},

	/**
	 * Fires before the element is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeReady : function( e, view ) {},

	/**
	 * Fires when the element is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onReady: function( e, view ) {},
	
	/**
	 * Fires when the element is moved.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onMove: function( e, view ) {},

	/**
	 * Fires before the element is copied.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeCopy: function( e, view ) {},

	/**
	 * Fires when the element is copied.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onCopy: function( e, view ) {},

	/**
	 * Fires before the element is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeRefresh: function( e, view ) {},

	/**
	 * Fires before the element is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeJSRefresh : function( e, view ) {},

	/**
	 * Fires when the element is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onJSRefresh : function( e, view ) {},
	
	/**
	 * Fires before the element is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDestroy: function( e, view ) {},

	/**
	 * Destroys the element.
	 * 
	 * @since 1.7.5
	 */
	destroy: function() {
		this.removeEventListeners();
		this.onDestroy();
		if ( 'function' == typeof this.callbacks.onDestroy ) {
			this.callbacks.onDestroy.call( this );
		}
	},
	
	/**
	 * Fires when the element is destroyed.
	 *
	 * @since 1.7.5
	 */
	onDestroy: function() {},

	/**
	 * Fires when a child is added.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onAddChild: function( e, view ) {},

	/**
	 * Fires when a child is removed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onRemoveChild: function( e, view ) {},

	/**
	 * Fires before a child is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeReadyChild: function( e, view ) {},

	/**
	 * Fires when a child is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onReadyChild: function( e, view ) {},

	/**
	 * Fires when a child is moved.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onMoveChild: function( e, view ) {},
	
	/**
	 * Fires before a child is reordered (using navigation).
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param index
	 * @param oldIndex
	 */
	onBeforeReorderChild: function( e, index, oldIndex ) {},
	
	/**
	 * Fires when a child is reordered (using navigation).
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param index
	 * @param oldIndex
	 */
	onReorderChild: function( e, index, oldIndex ) {},
	
	/**
	 * Fires before a child is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeRefreshChild: function( e, view ) {},
	
	/**
	 * Fires when a child is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onRefreshChild : function( e, view ) {},

	/**
	 * Fires before a child is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeJSRefreshChild : function( e, view ) {},

	/**
	 * Fires when a child is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onJSRefreshChild : function( e, view ) {},

	/**
	 * Fires before a child is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDestroyChild: function( e, view ) {},

	/**
	 * Fires when a child is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDestroyChild: function( e, view ) {},

	/**
	 * Fires when a child:
	 *  - Is added
	 *  - Is removed
	 *  - Is ready
	 *  - Is refreshed
	 *  - Is refreshed using JavaScript
	 *  - Is destroyed
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onChangeChild: function( e, view ) {},

	/**
	 * Fires when a descendant is added.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onAddDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant is removed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onRemoveDescendant: function( e, view ) {},

	/**
	 * Fires before a descendant is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeReadyDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onReadyDescendant: function( e, view ) {},

	/**
	 * Fires before a descendant is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeRefreshDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onRefreshDescendant: function( e, view ) {},

	/**
	 * Fires before a descendant is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeJSRefreshDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onJSRefreshDescendant: function( e, view ) {},

	/**
	 * Fires before a descendant is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDestroyDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDestroyDescendant: function( e, view ) {},

	/**
	 * Fires when a descendant:
	 *  - Is added
	 *  - Is removed
	 *  - Is ready
	 *  - Is refreshed
	 *  - Is refreshed using JavaScript
	 *  - Is destroyed
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onChangeDescendant: function( e, view ) {},

	/**
	 * Fires when:
	 *  - A child or descendant is added to the parent (other than one associated with this component).
	 *  - A child or descendant is removed from the parent (other than one associated with this component).
	 *  - A child or descendant is ready within the parent (other than one associated with this component).
	 *  - A child or descendant is refreshed within the parent (other than one associated with this component).
	 *  - A child or descendant is refreshed using JavaScript within the parent (other than one associated with this component).
	 *  - A child or descendant is destroyed within the parent (other than one associated with this component).
	 *  - The parent is refreshed.
	 *  - The parent is refreshed using JavaScript.
	 *
	 *  @since 1.7.5
	 */
	onChangeParent: function() {},

	/**
	 * Fires when the window is resized.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onResize : function( e, view ) {}

};

module.exports = AbstractComponent;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
/**
 * Tailor.Components.Map
 *
 * A map component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Map;

Map = Components.create( {

    getDefaults: function() {
        return {
            height : 450,
            address : '',
            latitude : '',
            longitude : '',
            zoom : 12,
            draggable : 1,
            scrollwheel : 0,
            controls : 0,
            hue : null,
            saturation : 0
        };
    },

    getStyles : function( saturation, hue ) {
        return  [
            {
                featureType : 'all',
                elementType : 'all',
                stylers     : [
                    { saturation : ( saturation ) ? saturation : null },
                    { hue : ( hue ) ? hue : null }
                ]
            },
            {
                featureType : 'water',
                elementType : 'all',
                stylers     : [
                    { hue : ( hue ) ? hue : null },
                    { saturation : ( saturation ) ? saturation : null },
                    { lightness  : 50 }
                ]
            },
            {
                featureType : 'poi',
                elementType : 'all',
                stylers     : [
                    { visibility : 'simplified' } // off
                ]
            }
        ]
    },

    /**
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize : function() {
        var component = this;
        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options )
            .then( function( coordinates ) {
                component.center = coordinates;
                var controls = component.options.controls;
                var settings = {
                    zoom : component.options.zoom,
                    draggable : component.options.draggable,
                    scrollwheel : component.options.scrollwheel,
                    center : coordinates,
                    mapTypeId : google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: ! controls,
                    panControl: controls,
                    rotateControl : controls,
                    scaleControl: controls,
                    zoomControl: controls,
                    mapTypeControl: controls,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    }
                };
                var styles = component.getStyles( component.options.saturation, component.options.hue );
    
                component.map = new google.maps.Map( component.$canvas[0], settings );
                component.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
                component.map.setMapTypeId( 'map_style' );
                component.setupMarkers( component.$el, component.map );
            } );
    },

    /**
     * Returns the map coordinates.
     *
     * @since 1.0.0
     *
     * @param options
     * @returns {*}
     */
    getCoordinates : function( options ) {
        return $.Deferred( function( deferred ) {
            if ( 'undefined' == typeof google ) {
                deferred.reject( new Error( 'The Google Maps API is currently unavailable' ) );
            }
            else if ( '' != options.address ) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { address : options.address }, function( results, status ) {
                    if ( google.maps.GeocoderStatus.OK == status ) {
                        deferred.resolve( results[0].geometry.location );
                    }
                    else if ( options.latitude && options.longitude ) {
                        deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
                    }
                    else {
                        deferred.reject( new Error( status ) );
                    }
                } );
            }
            else if ( options.latitude && options.longitude ) {
                deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
            }
            else {
                deferred.reject( new Error( 'No address or map coordinates provided' ) );
            }
        } ).promise();
    },

    /**
     * Sets up the map markers.
     *
     * @since 1.0.0
     *
     * @param $el
     * @param googleMap
     */
    setupMarkers : function( $el, googleMap ) {
        var map = this;

        this.$el.find( '.tailor-map__marker' ).each( function( index, el ) {

            var defaults = {
                address : '',
                latitude : '',
                longitude : '',
                image : ''
            };

            var settings = _.extend( {}, defaults, $( el ).data() );

            map.getCoordinates( settings ).then( function( coordinates ) {
                map.markers[ index ] = new google.maps.Marker( {
                    map : googleMap,
                    position : coordinates,
                    infoWindowIndex : index,
                    icon : settings.image
                } );

                if ( 'null' != el.innerHTML ) {
                    map.infoWindows[ index ] = new google.maps.InfoWindow( {
                        content : el.innerHTML
                    } );

                    google.maps.event.addListener( map.markers[ index ], 'click', function() {
                        if ( el.innerHTML ) {
                            map.infoWindows[ index ].open( googleMap, this );
                        }
                    } );
                }
            } );
        } );
    },

	/**
     * Refreshes and centers the map.
     * 
     * @since 1.7.5
     */
    refreshMap: function() {
        if (  this.map ) {
            google.maps.event.trigger( this.map, 'resize' );
            this.map.setCenter( this.center );
        }
    },

    /**
     * Element listeners
     */
    onMove: function() {
        this.refreshMap();
    },

    onRefresh: function() {
        this.refreshMap();
    },

    onChangeParent: function() {
        this.refreshMap();
    },
    
    onDestroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;
    },

    /**
     * Window listeners
     */
    onResize: function() {
        this.refreshMap();
    }

} );

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorGoogleMap = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorGoogleMap' );
        if ( ! instance ) {
            $.data( this, 'tailorGoogleMap', new Map( this, options, callbacks ) );
        }
    } );
};

module.exports = Map;
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
/**
 * Tailor.Components.Parallax
 *
 * A parallax component.
 *
 * @class
 */
var $ = window.jQuery,
	$win = $( window ),
	Components = window.Tailor.Components,
	Parallax;


Parallax = Components.create( {

	getDefaults : function () {
		return {
			ratio : 0.25,
			selector : '.tailor-section__background'
		};
	},

	/**
	 * Initializes the component.
	 * 
	 * @since 1.7.5
	 */
	onInitialize : function () {
		this.position = {};
		this.background = this.el.querySelector( this.options.selector );
		if ( ! this.background ) {
			return;
		}

		this.addEvents();
		this.refreshParallax();
	},
	
	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.7.5
	 */
	addEvents: function() {
		this.onScrollCallback = this.onScroll.bind( this );
		$win.on( 'scroll.' + this.id, this.onScrollCallback );
	},

	/**
	 * Record the initial window position.
	 *
	 * @since 1.4.0
	 */
	doSetup : function() {

		// Store window height
		this.windowHeight = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

		// Store container attributes
		var rect = this.el.getBoundingClientRect();
		var height = this.el.offsetHeight;
		var top = rect.top + window.pageYOffset;

		this.position.top = top;
		this.position.height = height;
		this.position.bottom = top + height;

		// Adjust the background height
		this.background.style.bottom = '0px';
		this.background.style.height = Math.round( ( height + ( height * this.options.ratio ) ) ) + 'px';
	},

	/**
	 * Translate the element relative to its container to achieve the parallax effect.
	 *
	 * @since 1.4.0
	 */
	doParallax : function() {
		if ( ! this.inViewport() ) {
			return; // Do nothing if the parent is not in view
		}

		var amountScrolled = 1 - (
				( this.position.bottom - window.pageYOffset  ) /
				( this.position.height + this.windowHeight )
			);
		var translateY = Math.round( ( amountScrolled * this.position.height * this.options.ratio ) * 100 ) / 100;
		this.background.style[ Modernizr.prefixed( 'transform' ) ] = 'translate3d( 0px, ' + translateY + 'px, 0px )';
	},

	/**
	 * Refreshes the parallax effect.
	 *
	 * @since 1.7.5
	 */
	refreshParallax: function() {
		this.doSetup();
		this.doParallax();
	},

	/**
	 * Returns true if the parallax element is visible in the viewport.
	 *
	 * @since 1.4.0
	 *
	 * @returns {boolean}
	 */
	inViewport : function() {
		var winTop = window.pageYOffset;
		var winBottom = winTop + this.windowHeight;
		return (
			this.position.top < winBottom &&        // Top of element is above the bottom of the window
			winTop < this.position.bottom           // Bottom of element is below top of the window
		);
	},

	/**
	 * Element listeners
	 */
	onJSRefresh: function() {
		this.refreshParallax();
	},

	/**
	 * Child listeners
	 */
	onChangeChild : function() {
		this.refreshParallax();
	},

	/**
	 * Descendant listeners
	 */
	onChangeDescendant : function() {
		this.refreshParallax();
	},

	/**
	 * Window listeners
	 */
	onResize : function() {
		this.refreshParallax();
	},

	onScroll : function() {
		requestAnimationFrame( this.doParallax.bind( this ) );
	},
	
	/**
	 * Element listeners
	 */
	onDestroy: function() {
		$win.off( 'scroll.' + this.id, this.onScrollCallback );
		this.background.removeAttribute('style');
	}

} );

/**
 * Parallax jQuery plugin.
 *
 * @since 1.4.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorParallax = function( options, callbacks ) {
	return this.each( function() {
		var instance = $.data( this, 'tailorParallax' );
		if ( ! instance ) {
			$.data( this, 'tailorParallax', new Parallax( this, options, callbacks ) );
		}
	} );
};

module.exports = Parallax;
},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
/**
 * Tailor.Components.Tabs
 *
 * A tabs component.
 *
 * @class
 */
var $ = window.jQuery,
	$win = $( window ),
	Components = window.Tailor.Components,
    Tabs;

Tabs = Components.create( {
	
	getDefaults: function() {
		return {
			tabs : '.tailor-tabs__navigation .tailor-tabs__navigation-item',
			content : '.tailor-tabs__content .tailor-tab',
			initial : 1
		};
	},

	/**
	 * Initializes the component.
	 *
	 * @since 1.7.5
	 */
	onInitialize : function() {
		this.querySelectors();
		this.setActive();
	},

	/**
	 * Caches the tabs and tab content.
	 *
	 * @since 1.0.0
	 */
	querySelectors : function() {
		if ( this.$tabs ) {
			this.$tabs.off();
		}

		this.$content = this.$el.find( this.options.content );
		this.$tabs = this.$el
			.find( this.options.tabs )
			.on( 'click', $.proxy( this.onClick, this ) );
	},

	/**
	 * Sets the active tab on after (re)initialization.
	 *
	 * @since 1.0.0
	 */
	setActive : function() {
		var active = this.$content.filter( function() {
			return this.classList.contains( 'is-active' );
		} );

		var el;
		if ( 0 == active.length ) {
			var initial = ( this.options.initial - 1 );
			if ( this.$content[ initial ] ) {
				el = this.$content[ initial ];
			}
		}
		else {
			el = active[0];
		}
		if ( el ) {
			this.activate( el.id );
		}
	},

	/**
	 * Activates a given tab.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 */
	activate : function( id ) {
		this.$tabs.each( function() {
			this.classList.toggle( 'is-active', this.getAttribute( 'data-id' ) == id );
		} );

		this.$content.each( function() {
			$( this )
				.toggle( this.id == id )
				.toggleClass( 'is-active', this.id == id );
		} );
		
		$win.trigger( 'resize' );
	},

	/**
	 * Refreshes the tabs.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	refreshTabs : function( e, childView ) {
		this.querySelectors();
		this.activate( childView.el.id );
	},

	onClick : function( e ) {
		this.activate( e.target.getAttribute( 'data-id' ) );
		e.preventDefault();
	},
	
	/**
	 * Element listeners
	 */
	onDestroy: function() {
		this.$tabs.off();
	},
	
	/**
	 * Child listeners
	 */
	onAddChild: function( e, childView ) {
		this.refreshTabs( e, childView );
	},

	onReadyChild: function( e, childView ) {
		this.refreshTabs( e, childView );
	},
	
	onRemoveChild: function( e, childView ) {
		this.refreshTabs( e, childView );
	},
	
	onRefreshChild: function( e, childView ) {
		this.refreshTabs( e, childView );
	},

	onReorderChild: function( e, id, newIndex, oldIndex ) {
		this.activate( id );
	},

	onDestroyChild : function( e, childView ) {
		if ( ( 0 == childView.$el.index() && ! childView.el.nextSibling ) ) {
			return;
		}

		var id = childView.el.nextSibling ? childView.el.nextSibling.id : childView.el.previousSibling.id;
		childView.$el.remove();

		this.querySelectors();
		this.activate( id );
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
$.fn.tailorTabs = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorTabs' );
        if ( ! instance ) {
            $.data( this, 'tailorTabs', new Tabs( this, options, callbacks ) );
        }
    } );
};

module.exports = Tabs;

},{}],10:[function(require,module,exports){
/**
 * Tailor.Components.Toggles
 *
 * A toggles component.
 *
 * @class
 */
var $ = window.jQuery,
	$win = $( window ),
	Components = window.Tailor.Components,
    Toggles;

Toggles = Components.create( {

	getDefaults : function () {
		return {
			toggles : '.tailor-toggle__title',
			content : '.tailor-toggle__body',
			accordion : false,
			initial : 0,
			speed : 150
		};
	},

	/**
	 * Initializes the component.
	 *
	 * @since 1.7.5
	 */
	onInitialize : function() {
		this.querySelectors();

		var initial = this.options.initial - 1;
		if ( initial >= 0 && this.$toggles.length > initial ) {
			this.activate( this.$toggles[ initial ] );
		}
	},

	/**
	 * Caches the toggles and toggle content.
	 *
	 * @since 1.0.0
	 */
	querySelectors : function() {
		this.$content = this.$el.find( this.options.content ).hide();
		this.$toggles = this.$el
			.find( this.options.toggles )
			.off()
			.on( 'click', $.proxy( this.onClick, this ) );
	},

	/**
	 * Activates a given toggle.
	 *
	 * @since 1.0.0
	 *
	 * @param el
	 */
	activate: function( el ) {
		var speed = this.options.speed;
		var $el = $( el );

		if ( this.options.accordion ) {
			this.$toggles.filter( function() {
				return this !== el;
			} ).removeClass( 'is-active' );

			this.$content.each( function() {
				var $toggle = $( this );
				if ( el.nextElementSibling == this ) {
					$toggle.slideToggle( speed );
				}
				else {
					$toggle.slideUp( speed );
				}
			} );
		}
		else {
			this.$content
				.filter( function() { return el.nextElementSibling == this; } )
				.slideToggle( speed );
		}

		$el.toggleClass( 'is-active' );

		$win.trigger( 'resize' );
	},

	/**
	 * Activates a toggle when it is clicked.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 */
	onClick: function( e ) {
		this.activate( e.target );
		e.preventDefault();
	},

	/**
	 * Element listeners
	 */
	onDestroy: function( e ) {
		this.$toggles.off();
	},

	/**
	 * Child listeners
	 */
	onChangeChild: function() {
		this.querySelectors();
	}
	
} );

/**
 * Toggles jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorToggles = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorToggles' );
        if ( ! instance ) {
            $.data( this, 'tailorToggles', new Toggles( this, options , callbacks ) );
        }
    } );
};

module.exports = Toggles;

},{}],11:[function(require,module,exports){
/**
 * classList Polyfill
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */
( function() {

	if ( 'undefined' === typeof window.Element || 'classList' in document.documentElement ) {
		return;
	}

	var prototype = Array.prototype,
		push = prototype.push,
		splice = prototype.splice,
		join = prototype.join;

	function DOMTokenList( el ) {
		this.el = el;
		var classes = el.className.replace( /^\s+|\s+$/g, '' ).split( /\s+/ );
		for ( var i = 0; i < classes.length; i++ ) {
			push.call( this, classes[ i ] );
		}
	}

	DOMTokenList.prototype = {

		add: function( token ) {
			if ( this.contains( token ) ) {
				return;
			}
			push.call( this, token );
			this.el.className = this.toString();
		},

		contains: function( token ) {
			return this.el.className.indexOf( token ) != -1;
		},

		item: function( index ) {
			return this[ index ] || null;
		},

		remove: function( token ) {
			if ( ! this.contains( token ) ) {
				return;
			}
			for ( var i = 0; i < this.length; i++ ) {
				if ( this[ i ] == token ) {
					break;
				}
			}
			splice.call( this, i, 1 );
			this.el.className = this.toString();
		},

		toString: function() {
			return join.call( this, ' ' );
		},

		toggle: function( token ) {
			if ( ! this.contains( token ) ) {
				this.add( token );
			}
			else {
				this.remove( token );
			}
			return this.contains( token );
		}
	};

	window.DOMTokenList = DOMTokenList;

	function defineElementGetter( obj, prop, getter ) {
		if ( Object.defineProperty ) {
			Object.defineProperty( obj, prop, {
				get : getter
			} );
		}
		else {
			obj.__defineGetter__( prop, getter );
		}
	}

	defineElementGetter( Element.prototype, 'classList', function() {
		return new DOMTokenList( this );
	} );

} )();

},{}],12:[function(require,module,exports){
/**
 * requestAnimationFrame polyfill.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
( function( window ) {

	'use strict';

	var lastTime = 0,
		vendors = [ 'ms', 'moz', 'webkit', 'o' ];

	for ( var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++x ) {
		window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
		window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
	}

	if ( ! window.requestAnimationFrame ) {
		window.requestAnimationFrame = function( callback, el ) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() {
					callback( currTime + timeToCall );
				},
				timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if ( ! window.cancelAnimationFrame ) {
		window.cancelAnimationFrame = function( id ) {
			clearTimeout( id );
		};
	}

} ) ( window );

},{}],13:[function(require,module,exports){
/**
 * Makes animation and transition support status and end names available as global variables.
 */
( function( window ) {

    'use strict';

    var el = document.createElement( 'fakeelement' );

    function getAnimationEvent(){
        var t,
            animations = {
                'animation' : 'animationend',
                'OAnimation' : 'oAnimationEnd',
                'MozAnimation' : 'animationend',
                'WebkitAnimation' : 'webkitAnimationEnd'
            };

        for ( t in animations ) {
            if ( animations.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return animations[ t ];
            }
        }

        return false;
    }

    function getTransitionEvent(){
        var t,
            transitions = {
                'transition' : 'transitionend',
                'OTransition' : 'oTransitionEnd',
                'MozTransition' : 'transitionend',
                'WebkitTransition' : 'webkitTransitionEnd'
            };

        for ( t in transitions ) {
            if ( transitions.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return transitions[ t ];
            }
        }

        return false;
    }

    window.animationEndName = getAnimationEvent();
    window.transitionEndName = getTransitionEvent();

} ) ( window );

},{}]},{},[1]);
