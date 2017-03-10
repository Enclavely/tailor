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

	initialize : function() {
		var self = this;
		var initial = self.options.initial - 1;
		if (initial <= 0) {
			initial = false;
		}

		var accordionOverrideCallback = function(){};
		if (self.options.accordion){
			accordionOverrideCallback = self.allowMultiplePanesOpen;
		}

		this.$el.accordion({
			header : '.tailor-toggle .tailor-toggle__title',
			collapsible : true,
			active : initial,
			animate : self.options.speed,
			beforeActivate: accordionOverrideCallback
		});
	},

	/**
	 * Special JQueryUI default activation behavior to allow multiple
	 * toggles to be open at once. This is necessary to preserve the "accordion"
	 * feature.
	 *
	 * @see http://stackoverflow.com/questions/3479447/jquery-ui-accordion-that-keeps-multiple-sections-open
	 * @since TODO
	 */
	allowMultiplePanesOpen : function(event, ui) {
		 // The accordion believes a panel is being opened
		if (ui.newHeader[0]) {
				var currHeader  = ui.newHeader;
				var currContent = currHeader.next('.ui-accordion-content');
		 // The accordion believes a panel is being closed
		} else {
				var currHeader  = ui.oldHeader;
				var currContent = currHeader.next('.ui-accordion-content');
		}
		 // Since we've changed the default behavior, this detects the actual status
		var isPanelSelected = currHeader.attr('aria-selected') == 'true';

		 // Toggle the panel's header
		currHeader.toggleClass('ui-corner-all',isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top',!isPanelSelected).attr('aria-selected',((!isPanelSelected).toString()));

		// Toggle the panel's icon
		currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e',isPanelSelected).toggleClass('ui-icon-triangle-1-s',!isPanelSelected);

		 // Toggle the panel's content
		currContent.toggleClass('accordion-content-active',!isPanelSelected)
		if (isPanelSelected) { currContent.slideUp(); }  else { currContent.slideDown(); }

		return false; // Cancels the default action
	}

	// /**
	//  * Initializes the component.
	//  *
	//  * @since 1.7.5
	//  */
	// onInitialize : function() {
	// 	this.querySelectors();
	//
	// 	var initial = this.options.initial - 1;
	// 	if ( initial >= 0 && this.$toggles.length > initial ) {
	// 		this.activate( this.$toggles[ initial ] );
	// 	}
	// },
	//
	// /**
	//  * Caches the toggles and toggle content.
	//  *
	//  * @since 1.0.0
	//  */
	// querySelectors : function() {
	// 	this.$content = this.$el.find( this.options.content ).hide();
	// 	this.$toggles = this.$el
	// 		.find( this.options.toggles )
	// 		.off()
	// 		.on( 'click', $.proxy( this.onClick, this ) );
	// },
	//
	// /**
	//  * Activates a given toggle.
	//  *
	//  * @since 1.0.0
	//  *
	//  * @param el
	//  */
	// activate: function( el ) {
	// 	var speed = this.options.speed;
	// 	var $el = $( el );
	//
	// 	if ( this.options.accordion ) {
	// 		this.$toggles.filter( function() {
	// 			return this !== el;
	// 		} ).removeClass( 'is-active' );
	//
	// 		this.$content.each( function() {
	// 			var $toggle = $( this );
	// 			if ( el.nextElementSibling == this ) {
	// 				$toggle.slideToggle( speed );
	// 			}
	// 			else {
	// 				$toggle.slideUp( speed );
	// 			}
	// 		} );
	// 	}
	// 	else {
	// 		this.$content
	// 			.filter( function() { return el.nextElementSibling == this; } )
	// 			.slideToggle( speed );
	// 	}
	//
	// 	$el.toggleClass( 'is-active' );
	//
	// 	$win.trigger( 'resize' );
	// },
	//
	// /**
	//  * Activates a toggle when it is clicked.
	//  *
	//  * @since 1.7.5
	//  *
	//  * @param e
	//  */
	// onClick: function( e ) {
	// 	this.activate( e.target );
	// 	e.preventDefault();
	// },
	//
	// /**
	//  * Element listeners
	//  */
	// onDestroy: function( e ) {
	// 	this.$toggles.off();
	// },
	//
	// /**
	//  * Child listeners
	//  */
	// onChangeChild: function() {
	// 	this.querySelectors();
	// }

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
