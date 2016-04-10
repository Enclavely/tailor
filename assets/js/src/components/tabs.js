/**
 * Tailor.Objects.Tabs
 *
 * A tabs module.
 *
 * @class
 */
var $ = window.jQuery,
    Tabs;

/**
 * The Tabs object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 * @constructor
 */
Tabs = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Tabs.prototype = {

    defaults : {
        tabs : '.tailor-tabs__navigation .tailor-tabs__navigation-item',
        content : '.tailor-tabs__content .tailor-tab',
        initial : 1
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
     * Initializes the Tabs instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.querySelectors();
        this.setActive();
        this.addEventListeners();

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

	        // Fires before and after a child element is added
	        .on( 'element:child:add element:child:ready', $.proxy( this.onChangeChild, this ) )

	        // Fires before and after a child element is refreshed
	        .on( 'element:child:refresh', $.proxy( this.onChangeChild, this ) )

	        // Fires before and after a child element is destroyed
	        .on( 'element:child:destroy', $.proxy( this.onDestroyChild, this ) )

	        // Fires before and after the position of an item is changed
	        .on( 'element:change:order', $.proxy( this.onReorderChild, this ) );
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
     * Activates a tab when it is clicked.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        this.activate( e.target.getAttribute( 'data-id' ) );
        e.preventDefault();
    },

    /**
     * Refreshes the selectors when a tab is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onChangeChild : function( e, childView ) {
        if ( e.target == this.el ) {
            this.querySelectors();
            this.activate( childView.el.id );
        }
    },

	/**
	 * Updates the tabs container when the position of a tab is changed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
    onReorderChild : function( e, id, newIndex, oldIndex ) {
        if ( e.target == this.el ) {
            var $item = this.$content.filter( function() { return this.id == id; } );

            if ( oldIndex - newIndex < 0 ) {
                $item.insertAfter( this.$content[ newIndex ] );
            }
            else {
                $item.insertBefore( this.$content[ newIndex ] );
            }

            this.activate( id );
        }
    },

    /**
     * Refreshes the selectors when a tab is added, removed or refreshed.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    onDestroyChild : function( e, childView ) {
        if ( e.target !== this.el ) {
			return;
        }

	    if ( ( 0 == childView.$el.index() && ! childView.el.nextSibling ) ) {
		    return;
	    }

	    var id = childView.el.nextSibling ? childView.el.nextSibling.id : childView.el.previousSibling.id;
	    childView.$el.remove();

	    this.querySelectors();
	    this.activate( id );
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
                .toggleClass( 'is-active', this.id == id )
                .children().each( function( index, el ) {
					var $el = $( el );

		            /**
		             * Fires after the tab is displayed.
		             *
		             * @since 1.0.0
		             */
		            $el.trigger( 'element:parent:change', $el );
                } );
        } );
    },

    /**
     * Destroys the Tabs instance immediately before the element/view is destroyed.
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
     * Destroys the the Tabs instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
	    this.$el.off();
	    this.$tabs.off();

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
$.fn.tailorTabs = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorTabs' );
        if ( ! instance ) {
            $.data( this, 'tailorTabs', new Tabs( this, options, callbacks ) );
        }
    } );
};

module.exports = Tabs;