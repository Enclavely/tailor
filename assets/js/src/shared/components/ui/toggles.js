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
