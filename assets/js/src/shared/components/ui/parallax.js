/**
 * Tailor.Objects.Parallax
 *
 * A parallax module.
 *
 * @class
 */
var $ = window.jQuery,
	Parallax;

/**
 * De-bounces events using requestAnimationFrame
 *
 * @param callback
 * @constructor
 */
function DeBouncer( callback ) {
	this.callback = callback;
	this.ticking = false;
}

DeBouncer.prototype = {

	/**
	 * dispatches the event to the supplied callback
	 * @private
	 */
	update : function () {
		this.callback && this.callback();
		this.ticking = false;
	},

	/**
	 * ensures events don't get stacked
	 * @private
	 */
	requestTick : function () {
		if ( ! this.ticking ) {
			requestAnimationFrame( this.rafCallback || ( this.rafCallback = this.update.bind( this ) ) );
			this.ticking = true;
		}
	},

	/**
	 * Attach this as the event listeners
	 */
	handleEvent : function () {
		this.requestTick();
	}
};

var id = 0;

/**
 * Translates an element on scroll to create a parallax effect.
 *
 * @param el
 * @param options
 * @constructor
 */
Parallax = function( el, options ) {
	this.id = 'tailor.parallax.' + id ++;
	this.options = $.extend( this.defaults, options );
	this.el = el.querySelector( this.options.selector );
	if ( ! this.el ) {
		return;
	}

	this.$el = $( el );
	this.$win = $( window );
	this.container = {
		el: el
	};

	this.initialize();
};

Parallax.prototype = {

	defaults : {
		ratio : 0.25,
		selector : '.tailor-section__background'
	},

	/**
	 * Initializes the Parallax element.
	 */
	initialize : function() {

		this.onResizeCallback = $.proxy( this.onResize, this );
		this.onScrollCallback = $.proxy( this.onScroll, this );

		this.addEventListeners();
		this.onResize();
	},


	/**
	 * Adds the required event listeners
	 */
	addEventListeners : function() {
		this.$win
			.on( 'resize.' + this.id, this.onResizeCallback )
			.on( 'scroll.' + this.id, this.onScrollCallback );

		this.$el

			// Fires before the element template is refreshed
			.on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

			// Fires before the element is destroyed
			.on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

			/**
			 * Child event listeners
			 */

			// Fires before and after a child element is added
			.on( 'element:child:ready', this.onResizeCallback )

			// Fires after a child element is added
			.on( 'element:child:add', this.onResizeCallback )

			// Fires after a child element is removed
			.on( 'element:child:remove', this.onResizeCallback )

			// Fires before and after a child element is refreshed
			.on( 'element:child:refresh', this.onResizeCallback )

			// Fires before and after the position of an item is changed
			.on( 'element:change:order', this.onResizeCallback )

			// Fires before and after a child element is destroyed
			.on( 'element:child:destroy', this.onResizeCallback )
	},

	/**
	 * Removes all registered event listeners.
	 *
	 * @since 1.4.0
	 */
	removeEventListeners: function() {
		this.$win
			.off( 'resize.' + this.id, this.onResizeCallback )
			.off( 'scroll.' + this.id, this.onScrollCallback );

		this.$el.off();
	},

	/**
	 * Perform checks and do parallax when the window is resized.
	 *
	 * @since 1.4.0
	 */
	onResize : function() {
		this.setup();
		this.doParallax();
	},

	onScroll : function() {
		requestAnimationFrame( this.doParallax.bind( this ) );
	},

	/**
	 * Get and set attributes w
	 */
	setup : function() {

		// Store window height
		this.windowHeight = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

		// Store container attributes
		var containerRect = this.container.el.getBoundingClientRect();
		var containerHeight = this.container.el.offsetHeight;
		var containerTop = containerRect.top + window.pageYOffset;

		this.container.top = containerTop;
		this.container.height = containerHeight;
		this.container.bottom = containerTop + containerHeight;

		// Adjust the element height
		this.el.style.top = '0px';
		this.el.style.height = Math.round( ( containerHeight + ( containerHeight * this.options.ratio ) ) ) + 'px';
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
		var containerBottom = this.container.top + this.container.height;

		return (
			this.container.top < winBottom &&   // Top of element is above the bottom of the window
			winTop < containerBottom            // Bottom of element is below top of the window
		);
	},

	/**
	 * Translate the element relative to its container to achieve the parallax effect.
	 * 
	 * @since 1.4.0
	 */
	doParallax : function() {

		// Do nothing if the parent is not in view
		if ( ! this.inViewport() ) {
			return;
		}

		var amountScrolled = 1 - (
				( this.container.bottom - window.pageYOffset  ) /
				( this.container.height + this.windowHeight )
			);

		var translateY = Math.round( ( amountScrolled * this.container.height * this.options.ratio ) * 100 ) / 100;

		this.el.style[ Modernizr.prefixed( 'transform' ) ] = 'translate3d( 0px, -' + translateY + 'px, 0px )';
	},

	/**
	 * Destroys the parallax instance if the event target is the parallax element.
	 *
	 * @since 1.4.0
	 *
	 * @param e
	 */
	maybeDestroy : function( e ) {
		if ( e.target == this.container.el ) {
			this.destroy();
		}
	},

	/**
	 * Destroys the parallax instance.
	 *
	 * @since 1.4.0
	 */
	destroy: function() {
		this.removeEventListeners();
	}
};

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
