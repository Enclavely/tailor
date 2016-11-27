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