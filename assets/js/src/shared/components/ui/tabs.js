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
