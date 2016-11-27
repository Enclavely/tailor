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