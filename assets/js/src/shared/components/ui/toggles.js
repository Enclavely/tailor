/**
 * Tailor.Objects.Toggles
 *
 * A toggles module.
 *
 * @class
 */
var $ = window.jQuery,
    Toggles;

/**
 * The Toggles object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 * @constructor
 */
Toggles = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );

    this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Toggles.prototype = {

    defaults : {
        toggles : '.tailor-toggle__title',
        content : '.tailor-toggle__body',
        accordion : false,
        initial : -1,
        speed : 150
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
        this.querySelectors();
        this.addEventListeners();

        var initial = ( this.options.initial - 1 );
        if ( this.$toggles[ initial ] ) {
            this.activate( this.$toggles[ initial ] );
        }

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
        this.$el

            // Fires before the element template is refreshed
            .on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after a child element is added
            .on( 'element:child:add element:child:ready', $.proxy( this.onChangeChild, this ) )

            // Fires after a child element is refreshed
            .on( 'element:child:refresh', $.proxy( this.onChangeChild, this ) )

            // Fires after a child element is destroyed
            .on( 'element:child:destroy', $.proxy( this.onChangeChild, this ) )
    },

    /**
     * Caches the toggles and toggle content.
     *
     * @since 1.0.0
     */
    querySelectors : function() {
        this.$content = this.$el.find( this.options.content );
        this.$toggles = this.$el
            .find( this.options.toggles )
            .off()
            .on( 'click', $.proxy( this.onClick, this ) );
    },

    /**
     * Activates a toggle when it is clicked.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        this.activate( e.target );
        e.preventDefault();
    },

    /**
     * Refreshes the selectors when a toggle is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onChangeChild : function( e, childView ) {
        if ( e.target == this.el ) {
            this.querySelectors();
        }
    },

    /**
     * Activates a given toggle.
     *
     * @since 1.0.0
     *
     * @param el
     */
    activate : function( el ) {
        var speed = this.options.speed;
        var $el = $( el );

        if ( this.options.accordion ) {
            this.$toggles.filter( function() {
                return this !== el;
            } ).removeClass( 'is-active' );

            this.$content.each( function() {
                var $toggle = $( this );
                if ( el.nextElementSibling == this ) {
                    $toggle
	                    .slideToggle( speed )
	                    .children().each( function( index, el ) {
		                    var $el = $( el );

		                    /**
		                     * Fires after the toggle is displayed.
		                     *
		                     * @since 1.0.0
		                     */
		                    $el.trigger( 'element:parent:change', $el );
	                    } );
                }
                else {
                    $toggle.slideUp( speed );
                }
            } );
        }
        else {
            this.$content
                .filter( function() { return el.nextElementSibling == this; } )
                .slideToggle( speed )
	            .each( function() {
		            $( this ).children().each( function( index, el ) {
			            var $el = $( el );

			            /**
			             * Fires after the toggle is displayed.
			             *
			             * @since 1.0.0
			             */
			            $el.trigger( 'element:parent:change', $el );
		            } );
	            } );
        }

        $el.toggleClass( 'is-active' );
    },

    /**
     * Destroys the Toggles instance immediately before the element/view is destroyed.
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
     * Destroys the the Toggles instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        this.$el.off();
        this.$toggles.off();

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }

};

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
