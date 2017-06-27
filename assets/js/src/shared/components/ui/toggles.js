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

	onInitialize : function() {
		var self = this;
		var initial = self.options.initial - 1;
		if ( initial <= 0 ) {
			initial = false;
		}

		var accordionOverrideCallback = function(){};
		if ( self.options.accordion ){
			accordionOverrideCallback = self.allowMultiplePanesOpen;
		}

		this.$el.accordion({
			header : '.tailor-toggle .tailor-toggle__title',
			collapsible : true,
			active : initial,
			animate : self.options.speed,
			beforeActivate : accordionOverrideCallback
		});
	},

	/**
	 * Element listeners
	 */
	onDestroy: function( e ) {
		this.$el.accordion( 'destroy' );
	},

	/**
	 * Child listeners
	 */
	onChangeChild: function() {
		this.$el.accordion( 'destroy' );
		this.onInitialize();
	},

	/**
	 * Special JQueryUI default activation behavior to allow multiple
	 * toggles to be open at once. This is necessary to preserve the "accordion"
	 * feature.
	 *
	 * @see http://stackoverflow.com/questions/3479447/jquery-ui-accordion-that-keeps-multiple-sections-open
	 */
	allowMultiplePanesOpen : function( event, ui ) {
		 // The accordion believes a panel is being opened
		if ( ui.newHeader[0] ) {
				var currHeader  = ui.newHeader;
				var currContent = currHeader.next( '.ui-accordion-content' );
		 // The accordion believes a panel is being closed
		} else {
				var currHeader  = ui.oldHeader;
				var currContent = currHeader.next( '.ui-accordion-content' );
		}
		 // Since we've changed the default behavior, this detects the actual status
		var isPanelSelected = currHeader.attr( 'aria-selected' ) == 'true';

		 // Toggle the panel's header
		currHeader.toggleClass( 'ui-corner-all', isPanelSelected ).toggleClass( 'accordion-header-active ui-state-active ui-corner-top', ! isPanelSelected ).attr( 'aria-selected', ( ( ! isPanelSelected).toString() ) );

		// Toggle the panel's icon
		currHeader.children( '.ui-icon' ).toggleClass( 'ui-icon-triangle-1-e' ,isPanelSelected ).toggleClass( 'ui-icon-triangle-1-s', ! isPanelSelected );

		 // Toggle the panel's content
		currContent.toggleClass( 'accordion-content-active', ! isPanelSelected )
		if ( isPanelSelected ) {
			currContent.slideUp();
		} else {
			currContent.slideDown();
		}

		return false; // Cancels the default action
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
