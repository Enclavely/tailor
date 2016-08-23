(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * The Canvas Marionette application.
 */
var $ = Backbone.$,
    $doc = $( document ),
    CanvasApplication;

CanvasApplication = Marionette.Application.extend( {

	/**
	 * Registers the remote communication channel before the canvas application starts.
	 *
	 * @since 1.0.0
	 */
    onBeforeStart : function() {
        if ( window.location.origin !== window.parent.location.origin ) {
            console.error( 'The Canvas has a different origin than the Sidebar' );
            return;
        }

        if ( ! window.parent.app ) {
            $( window.parent.document ).on( "DOMContentLoaded readystatechange load", this.registerRemoteChannel.bind( this ) );
        }
        else {
            this.registerRemoteChannel();
        }
    },

    /**
     * Initializes the application.
     *
     * @since 1.0.0
     */
	onStart : function() {

        // White listed events from the remote channel
        this.allowableEvents = [

            // Triggered when elements or templates are dragged from the sidebar
	        'canvas:dragstart', 'canvas:drag', 'canvas:dragend',

            // Triggered when a template is loaded
            'template:load',
            
            // Triggered when an element is edited
            'modal:apply',
            
            // Triggered when a sidebar setting changes
            'sidebar:setting:change',

            // Used to allow the sidebar to reset the canvas
            'canvas:reset',

            // Triggered when the element collection is reset (used by the History module)
            'elements:reset'
        ];
        
        this.addEventListeners();
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var canvas = this;

        $( 'a' ).attr( { draggable : false, target : '_blank' } );
        $( 'img' ).attr( { draggable : false } );

        $doc.on( 'keydown', function( e ) {

            if ( _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {
                return;
            }

            if ( e.ctrlKey && 90 == e.keyCode ) {

                /**
                 * Fires when a "CTRL-Z" is pressed.
                 *
                 * @since 1.0.0
                 */
                canvas.channel.trigger( 'history:undo' );
            }

            else if ( e.ctrlKey && 89 == e.keyCode ) {

                /**
                 * Fires when a "CTRL-Y" is pressed.
                 *
                 * @since 1.0.0
                 */
                canvas.channel.trigger( 'history:redo' );
            }

            else if ( 8 == e.keyCode ) {
                var selectedElement = canvas.channel.request( 'canvas:element:selected' );
                if ( selectedElement ) {
                    selectedElement.trigger( 'destroy', selectedElement );

                    /**
                     * Fires when an element is deleted.
                     *
                     * This is used by the History module instead of listening to the element collection, as the removal of
                     * an element can have cascading effects (e.g., the removal of column and row structures) which should
                     * not be tracked as steps.
                     *
                     * @since 1.0.0
                     *
                     * @param this.model
                     */
                    app.channel.trigger( 'element:delete', selectedElement );
                }
            }
        } );
    },

    /**
     * Registers the remote channel.
     *
     * @since 1.0.0
     */
    registerRemoteChannel : function() {
        var remoteChannel = parent.app.channel;

        /**
         * Returns the library collection from the registered remote channel.
         *
         * @since 1.0.0
         *
         * @param id
         * @returns {*|{}}
         */
        this.channel.reply( 'sidebar:library', function( id ) {
            return remoteChannel.request( 'sidebar:library', id );
        } );

        /**
         * Returns the current sidebar setting values from the registered remote channel.
         *
         * @since 1.4.0
         *
         * @returns {*|{}}
         */
        this.channel.reply( 'sidebar:settings', function() {
            return remoteChannel.request( 'sidebar:settings' );
        } );

        // Forward allowable events from the remote channel
	    this.listenTo( remoteChannel, 'all', this.forwardRemoteEvent );

        /**
         * Fires when the remote channel is registered.
         *
         * @since 1.5.0
         *
         * @param this
         */
        remoteChannel.trigger( 'canvas:handshake', this );
    },

    /**
     * Forwards specific events from the remote communication channel.
     *
     * @since 1.0.0
     */
    forwardRemoteEvent : function( eventName ) {
        if ( _.contains( this.allowableEvents, eventName ) ) {
            this.channel.trigger.apply( this.channel, arguments );
        }
    }

} );

module.exports = CanvasApplication;
},{}],2:[function(require,module,exports){
( function( window, $ ) {

    // Do nothing if the canvas does not exist in the page
    if ( null == document.getElementById( "canvas" ) ) {
        console.error( 'The canvas does not exist in the page.  This could be caused by a plugin or theme conflict.' );
        return;
    }

    // Include utilities
    require( '../shared/utility/polyfills/classlist' );
    require( '../shared/utility/polyfills/raf' );
    require( '../shared/utility/polyfills/transitions' );
    require( '../shared/utility/ajax' );

    // Include components
    require( '../shared/components/ui/tabs' );
    require( '../shared/components/ui/toggles' );
    require( '../shared/components/ui/map' );
    require( '../shared/components/ui/masonry' );
    require( '../shared/components/ui/slideshow' );
    require( '../shared/components/ui/lightbox' );
    require( '../shared/components/ui/parallax' );
    require( './components/ui/carousel' );
    require( './components/ui/carousel-simple' );
    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Container:          require( './components/behaviors/container' ),
            Droppable:          require( './components/behaviors/droppable' ),
            Editable:           require( './components/behaviors/editable' ),
            Movable:            require( './components/behaviors/movable' ),
            Draggable:          require( '../shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './app' );
    window.app = new App();

    // Create the Tailor object
    window.Tailor = {
        Api : {
            Setting :   require( '../shared/components/api/setting' ),
            Element :   require( './components/api/element' )
        },
        CSS :       require( '../shared/utility/css' ),
        Models :    {},
        Views :     {}
    };

    app.addRegions( {
        canvasRegion : {
            selector : "#canvas",
            regionClass : require( './modules/canvas/canvas-region' )
        },
        selectRegion : {
            selector : "#select",
            regionClass : require( './modules/tools/select-region' )
        }
    } );

    // Initialize preview
    require( './preview' );

    app.on( 'before:start', function() {

        // Load element-specific models
        Tailor.Models.Section =             require( './entities/models/wrappers/section' );
        Tailor.Models.Row =                 require( './entities/models/containers/row' );
        Tailor.Models.Column =              require( './entities/models/children/column' );
        Tailor.Models.GridItem =            require( './entities/models/children/grid-item' );
        Tailor.Models.Tabs =                require( './entities/models/containers/tabs' );
        Tailor.Models.Carousel =            require( './entities/models/containers/carousel' );
        Tailor.Models.Container =           require( './entities/models/element-container' );
        Tailor.Models.Wrapper =             require( './entities/models/element-wrapper' );
        Tailor.Models.Child =               require( './entities/models/element-child' );
        Tailor.Models.Default =             require( './entities/models/element' );

        // Load views
        Tailor.Views.Section =              require( './components/elements/wrappers/section' );
        Tailor.Views.Box =                  require( './components/elements/wrappers/box' );
        Tailor.Views.Card =                 require( './components/elements/wrappers/card' );
        Tailor.Views.Hero =                 require( './components/elements/wrappers/hero' );
        Tailor.Views.Column =               require( './components/elements/children/column' );
        Tailor.Views.Tab =                  require( './components/elements/children/tab' );
        Tailor.Views.Toggle =               require( './components/elements/children/toggle' );
        Tailor.Views.ListItem =             require( './components/elements/children/list-item' );
        Tailor.Views.CarouselItem =         require( './components/elements/children/carousel-item' );
        Tailor.Views.Tabs =                 require( './components/elements/containers/tabs' );
        Tailor.Views.Carousel =             require( './components/elements/containers/carousel' );
        Tailor.Views.Container =            require( './components/elements/element-container' );
        Tailor.Views.Wrapper =              require( './components/elements/element-container' );
        Tailor.Views.Child =                require( './components/elements/element-container' );
        Tailor.Views.Default =              require( './components/elements/element' );

        /**
         * Returns the element name (in title case) based on the tag or type.
         *
         * @since 1.5.0
         *
         * @param string
         */
        function getName( string ) {
            string = string || '';
            return string
                .replace( /_|-|tailor_/gi, ' ' )
                .replace( /(?: |\b)(\w)/g, function( key ) {
                    return key.toUpperCase().replace( /\s+/g, '' );
                } );
        }

        /**
         * Returns the appropriate object based on tag or type.
         *
         * @since 1.5.0
         *
         * @param tag
         * @param type
         * @param object
         * @returns {*}
         */
        Tailor.lookup = function( tag, type, object ) {

            if ( ! Tailor.hasOwnProperty( object ) ) {
                console.error( 'Object type ' + object + ' does not exist' );
                return;
            }

            var name = getName( tag );
            if ( Tailor[ object ].hasOwnProperty( name ) ) {
                return Tailor[ object ][ name ];
            }

            if ( type ) {
                name = getName( type );
                if ( Tailor[ object ].hasOwnProperty( name ) ) {
                    return Tailor[ object ][ name ];
                }
            }

            return Tailor[ object ].Default;
        };
    } );

    app.on( 'start', function() {

        // Load modules
        app.module( 'module:elements', require( './modules/elements/elements' ) );
        app.module( 'module:templates', require( './modules/templates/templates' ) );
        app.module( 'module:canvas', require( './modules/canvas/canvas' ) );
        app.module( 'module:tools', require( './modules/tools/tools' ) );
        app.module( 'module:css', require( './modules/css/css' ) );
    } );

    $( document ).ready( function() {

        // Start the app
        app.start( {
            elements : window._elements || [],
            nonces : window._nonces || [],
            mediaQueries : window._media_queries || {},
            cssRules : window._css_rules || {}
        } );
        
        /**
         * Fires when the canvas is initialized.
         *
         * @since 1.5.0
         *
         * @param app
         */
        app.channel.trigger( 'canvas:initialize', app );
    } );

} ( window, Backbone.$ ) );

//require( './utility/debug' );
},{"../shared/components/api/setting":53,"../shared/components/behaviors/draggable":54,"../shared/components/ui/lightbox":55,"../shared/components/ui/map":56,"../shared/components/ui/masonry":57,"../shared/components/ui/parallax":58,"../shared/components/ui/slideshow":59,"../shared/components/ui/tabs":60,"../shared/components/ui/toggles":61,"../shared/utility/ajax":62,"../shared/utility/css":63,"../shared/utility/polyfills/classlist":64,"../shared/utility/polyfills/raf":65,"../shared/utility/polyfills/transitions":66,"./app":1,"./components/api/element":3,"./components/behaviors/container":4,"./components/behaviors/droppable":5,"./components/behaviors/editable":6,"./components/behaviors/movable":7,"./components/elements/children/carousel-item":8,"./components/elements/children/column":9,"./components/elements/children/list-item":10,"./components/elements/children/tab":11,"./components/elements/children/toggle":12,"./components/elements/containers/carousel":13,"./components/elements/containers/tabs":18,"./components/elements/element":20,"./components/elements/element-container":19,"./components/elements/wrappers/box":21,"./components/elements/wrappers/card":22,"./components/elements/wrappers/hero":23,"./components/elements/wrappers/section":24,"./components/ui/carousel":26,"./components/ui/carousel-simple":25,"./entities/models/children/column":28,"./entities/models/children/grid-item":29,"./entities/models/containers/carousel":30,"./entities/models/containers/row":31,"./entities/models/containers/tabs":32,"./entities/models/element":38,"./entities/models/element-child":34,"./entities/models/element-container":36,"./entities/models/element-wrapper":37,"./entities/models/wrappers/section":39,"./modules/canvas/canvas":41,"./modules/canvas/canvas-region":40,"./modules/css/css":43,"./modules/elements/elements":45,"./modules/templates/templates":46,"./modules/tools/select-region":47,"./modules/tools/tools":51,"./preview":52}],3:[function(require,module,exports){
var callbacks = {
    'render' : [],
    'destroy' : []
};

var registerCallback = function( event, tag, callback ) {
    if ( callbacks.hasOwnProperty( event ) && 'function' === typeof callback ) {
        callbacks[ event ][ tag ] = callbacks[ event][ tag ] || [];
        callbacks[ event ][ tag ].push( callback );
    }
};

/**
 * Triggers registered callback functions when an element is rendered (or refreshed).
 *
 * @since 1.0.0
 *
 * @param view
 * @param atts
 */
var onRender = function( view, atts ) {
    var model = view.model;
    var tag = model.get( 'tag' );

    atts = atts || model.get( 'atts' );

    if ( callbacks.render[ tag ] ) {
        _.each( callbacks.render[ tag ], function( callback ) {
            callback.apply( view, [ atts, model ] );
        } );
    }
};

/**
 * Triggers registered callback functions when an element is destroyed.
 *
 * @since 1.0.0
 *
 * @param view
 */
var onDestroy = function( view ) {
    var model = view.model;
    var tag = model.get( 'tag' );

    if ( callbacks.destroy[ tag ] ) {
        _.each( callbacks.destroy[ tag ], function( callback ) {
            callback.apply( view, [ model.get( 'atts' ), model ] );
        } );
    }
};

window.app.listenTo( app.channel, 'element:ready element:refresh', onRender );
window.app.listenTo( app.channel, 'element:destroy', onDestroy );

module.exports = {

    /**
     * API for updating the canvas when an element is rendered.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param callback
     */
    onRender : function( tag, callback ) {
        registerCallback( 'render', tag, callback );
    },

    /**
     * API for updating the canvas when an element is destroyed.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param callback
     */
    onDestroy : function( tag, callback ) {
        registerCallback( 'destroy', tag, callback );
    }
};

},{}],4:[function(require,module,exports){
var ContainerBehaviors = Marionette.Behavior.extend( {

    events : {
		'container:add' : 'addChildView',
		'container:remove' : 'removeChildView'
	},

	modelEvents : {
		'container:collapse' : 'onCollapse'
	},

    /**
     * Adds a child view to the container.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
	addChildView : function( e, childView ) {
        if ( childView === this.view ) {
			return;
		}

        var $el = this.view.$childViewContainer ? this.view.$childViewContainer : this.$el;
        var index = $el.children().filter( ':not( .tailor-column__helper )' ).index( childView.$el );

		this.view._updateIndices( childView, true, index );
		this.view.proxyChildEvents( childView );
		this.view.children.add( childView, childView.model.get( 'order' ) );

	    childView._parent = this;

		//console.log( '\n Added view ' + childView.model.get( 'tag' ) + ' to ' + this.view.model.get( 'tag' ) );

	    /**
	     * Fires after a child view is added.
	     *
	     * @since 1.0.0
	     */
	    this.view.triggerAll( 'element:child:add', this.view, false );

	    e.stopPropagation();
    },

    /**
     * Removes a child view from the container.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    removeChildView : function( e, childView ) {
		if ( childView === this.view ) {
			return;
		}

		this.view.stopListening( childView );
		this.view.children.remove( childView, childView.model.get( 'order' ) );
		this.view._updateIndices( childView, false );

		delete childView._parent;

	    //console.log( '\n Removed view ' + childView.model.get( 'tag' ) + ' from ' + this.view.model.get( 'tag' ) );

	    childView.$el.detach();

	    /**
	     * Fires after a child view is removed.
	     *
	     * @since 1.0.0
	     */
	    this.view.triggerAll( 'element:child:remove', this.view, false );

	    e.stopPropagation();
	},

    /**
     * Collapses a container.
     *
     * @since 1.0.0
     *
     * @param model
     * @param children
     */
	onCollapse : function( model, children ) {
	    var containerView = this.view;
	    var index = containerView.$el.index();
	    var childView;
	    var siblings;

	    //console.log( '\n Collapsing ' + containerView.model.get( 'tag' ) + ' ' + containerView.model.get( 'id' ) );

	    _.each( children, function( child ) {
		    childView = this.view.children.findByModel( child );
		    siblings = containerView.el.parentNode.children;
		    childView.$el.insertAfter( siblings[ index ] );
		    index ++;

		    containerView.stopListening( childView );
		    containerView.children.remove( childView );
		    containerView._updateIndices( childView, false );

		    delete childView._parent;

		    /**
		     * Triggers an event to add the view to its new container.
		     *
		     * @since 1.0.0
		     */
		    childView.$el.trigger( 'container:add', childView );
	    }, this );

	    /**
	     * Triggers an event to remove the view from its container.
	     *
	     * @since 1.0.0
	     */
	    containerView.$el.trigger( 'container:remove', containerView );

	    containerView.destroy();

		//console.log( '\n Collapsed and destroyed view ' + containerView.model.get( 'tag' ) + ' ' + containerView.model.get( 'id' ) );
	}

} );

module.exports = ContainerBehaviors;
},{}],5:[function(require,module,exports){
var DroppableBehaviors = Marionette.Behavior.extend( {

	events : {
		'dragover' : 'onDragOver',
        'drop' : 'onDrop'
	},

    /**
     * Triggers an event when the item is dragged over another item.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragOver: function( e ) {
        app.channel.trigger( 'canvas:dragover', e.originalEvent, this.view );
	},

    /**
     * Triggers an event when the item is dropped.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDrop : function( e ) {
        app.channel.trigger( 'canvas:drop', e.originalEvent, this.view );
	}

} );

module.exports = DroppableBehaviors;
},{}],6:[function(require,module,exports){
var EditableBehaviors = Marionette.Behavior.extend( {

	events : {
		'mouseover' : 'onMouseOver',
		'mouseout' : 'onMouseOut',
        'click' : 'onClick'
	},

    modelEvents : {
        'select' : 'selectElement'
    },

    collectionEvents: {
        edit : 'onEdit'
    },

    /**
     * Adds helper text to the title of the element.
     *
     * @since 1.0.0
     */
    onRender : function() {
        this.view.el.title = _strings.edit_element;
    },

    /**
     * Selects or edits the element when clicked, depending on whether the Shift button is pressed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        if ( e.shiftKey ) {
            this.editElement();
        }
        else {
            this.selectElement();
        }

        e.preventDefault();
        e.stopPropagation();
    },

    /**
     * Updates the element class when the mouse is over it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseOver : function( e ) {
        this.view.$el.addClass( 'is-hovering' );

        e.stopPropagation();
    },

    /**
     * Updates the element class when the mouse leaves it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseOut : function( e ) {
        this.view.$el.removeClass( 'is-hovering' );

        e.stopPropagation();
    },

    /**
     * Edits the element.
     *
     * @since 1.0.0
     */
    editElement : function() {

        /**
         * Fires when the edit modal is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:open', this.view.model );
    },

    /**
     * Selects the element.
     *
     * This is used when an element is selected from the drop down menu of the select tool.
     *
     * @since 1.0.0
     */
    selectElement : function() {

        /**
         * Fires when an element is selected.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'canvas:select', this.view );
    },

    /**
     * Updates the element class when the element is being edited.
     *
     * @since 1.0.0
     *
     * @param model
     * @param editing bool
     */
    onEdit : function( model, editing ) {
        this.view.$el.toggleClass( 'is-editing', ( model === this.view.model && editing ) );
    }

} );

module.exports = EditableBehaviors;
},{}],7:[function(require,module,exports){
var MovableBehaviors = Marionette.Behavior.extend( {

	modelEvents : {
		'add:child' : 'addChild',
		'remove:child' : 'removeChild',
		'insert:before' : 'insertBefore',
		'insert:after' : 'insertAfter',
		'insert' : 'insert',
		'append' : 'append'
	},

    /**
     * Triggers an "append" event on the target model.
     *
     * @since 1.0.0
     *
     * @param model
     */
    insert : function( model ) {
        model.trigger( 'append', this.view );
    },

    /**
     * Triggers an event to add the element to its new parent container.
     *
     * @since 1.0.0
     */
	addChild : function() {
		this.view.$el.trigger( 'container:add', this.view );
	},

    /**
     * Triggers an event to remove the element from its container.
     *
     * @since 1.0.0
     */
	removeChild : function() {
		this.view.$el.trigger( 'container:remove', this.view );
    },

    /**
     * Inserts the view element before the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	insertBefore : function( view ) {
		this.view.$el.insertBefore( view.$el );
	},

    /**
     * Inserts the view element after the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	insertAfter : function( view ) {
		this.view.$el.insertAfter( view.$el );
	},

	/**
	 * Triggers an event on the element before it is added to a new container.
	 *
	 * @since 1.0.0
	 *
	 * @param view
	 */
	triggerEvent : function( view ) {

		/**
		 * Fires before the element is added to a new container.
		 *
		 * @since 1.0.0
		 */
		view.$el.trigger( 'before:element:child:add', this.view );
	},

    /**
     * Appends the view element to the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	append : function( view ) {
        var $el = view.$childViewContainer ? view.$childViewContainer : view.$el;
		this.view.$el.appendTo( $el );
	}

} );

module.exports = MovableBehaviors;
},{}],8:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    CarouselItemView;

CarouselItemView = ContainerView.extend( {

    /**
     * Sets the DOM element ID to the model ID.
     *
     * @since 1.0.0
     */
    onRenderTemplate : function() {
        this.el.draggable = false;
        this.el.id = this.model.cid;
    }

} );

module.exports = CarouselItemView;
},{"./../element-container":19}],9:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
	ColumnView;

ColumnView = ContainerView.extend( {

    ui : {
        'sizer' : '.tailor-column__sizer'
    },

    events : {
        'mousedown @ui.sizer' : 'onResize'
    },

    modelEvents : {
        'change:atts' : 'onChangeAttributes',
        'change:width' : 'onChangeWidth',
        'change:setting' : 'onChangeSetting'
    },

    /**
     * Appends the column handle to the element after child elements have been rendered.
     *
     * @since 1.0.0
     */
    onRenderCollection : function() {
        this.updateClassName( this.model.get( 'atts' ).width );
        this.$el
            .attr( 'draggable', true )
            .prepend(
	            '<div class="tailor-column__helper">' +
	                '<div class="tailor-column__sizer"></div>' +
	            '</div>'
	        );
    },

    /**
     * Handles resizing of the column when the resize handle is dragged.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onResize : function( e ) {
		var columnView = this;
		var model = columnView.model;
		var nextModel = model.collection.findWhere( {
            parent : model.get( 'parent' ),
            order : model.get( 'order' ) + 1 }
        );

        var originalWidth = model.get( 'atts' ).width;

	    /**
	     * Handles the resizing of columns.
	     *
	     * @since 1.0.0
	     *
	     * @param e
	     */
		function onResize( e ) {
			document.body.classList.add( 'is-resizing' );
			document.body.style.cursor = 'col-resize';

			var rect = columnView.el.getBoundingClientRect();
            var atts = _.clone( model.get( 'atts' ) );
            var nextAtts = _.clone( nextModel.get( 'atts' ) );
			var width = parseInt( atts.width );
            var nextWidth = parseInt( nextAtts.width );
			var newWidth = Math.round( ( e.clientX - rect.left ) / ( rect.width ) * width );
			if ( newWidth < 1 || ( newWidth + 1 ) > ( width + nextWidth ) || newWidth == width ) {
				return;
			}

            atts.width = newWidth;
            nextAtts.width =  nextWidth - ( newWidth - width );

            model.set( 'atts', atts, { silent : true } );
            nextModel.set( 'atts', nextAtts, { silent : true } );

            model.trigger( 'change:width', model, atts.width );
		    nextModel.trigger( 'change:width', nextModel, nextAtts.width );
        }

	    /**
	     * Maybe update the widths of affected columns after resizing ends.
	     *
	     * @since 1.0.0
	     *
	     * @param e
	     */
		function onResizeEnd( e ) {
			document.removeEventListener( 'mousemove', onResize, false );
			document.removeEventListener( 'mouseup', onResizeEnd, false );

            document.body.classList.remove( 'is-resizing' );
            document.body.style.cursor = 'default';

            if ( originalWidth != model.get( 'atts' ).width ) {

                /**
                 * Fires after the column has been resized.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'element:resize', model );
            }
        }

        document.addEventListener( 'mousemove', onResize, false );
        document.addEventListener( 'mouseup', onResizeEnd, false );

	    /**
	     * Resets the canvas when dragging of a column begins.
	     *
	     * @since 1.0.0
	     */
        app.channel.trigger( 'canvas:reset' );

        return false;
	},

    /**
     * Updates the column class name when the width changes.
     *
     * @since 1.0.0
     *
     * @param model
     * @param width
     */
	onChangeWidth : function( model, width ) {
        this.updateClassName( width );

	    /**
	     * Fires after the column width has changed.
	     *
	     * @since 1.0.0
	     */
	    this.triggerAll( 'element:parent:change', this );
	},

    /**
     * Updates the class name following a change to the column width.
     *
     * @since 1.0.0
     *
     * @param width
     */
    updateClassName : function( width ) {
        this.$el.removeClass( function( index, css ) {
            return ( css.match( /(^|\s)columns-\S+/g) || [] ).join( ' ' );
        } );

        this.el.classList.add( 'columns-' + width );
    }

} );

module.exports = ColumnView;
},{"./../element-container":19}],10:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    ListItemView;

ListItemView = ContainerView.extend( {
    childViewContainer : '.tailor-list__content'
} );

module.exports = ListItemView;
},{"./../element-container":19}],11:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    TabView;

TabView = ContainerView.extend( {

	/**
	 * Sets the DOM element ID to the model ID.
	 *
	 * @since 1.0.0
	 */
	onRenderTemplate : function() {
		this.el.draggable = false;
		this.el.id = this.model.cid;
	}

} );

module.exports = TabView;
},{"./../element-container":19}],12:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    ToggleView;

ToggleView = ContainerView.extend( {
    childViewContainer : '.tailor-toggle__body'
} );

module.exports = ToggleView;
},{"./../element-container":19}],13:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
	CarouselNavigationView = require( './navigation/carousel-navigation' ),
	CarouselView;

CarouselView = ContainerView.extend( {

    childViewContainer : '.tailor-carousel__wrap',

    events : {
        'element:change:order' : 'onReorderElement'
    },

	/**
	 * Handles the reordering of carousel items.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
    onReorderElement : function( e, id, newIndex, oldIndex ) {
        if ( newIndex - oldIndex < 0 ) {
            this.children.each( function( view ) {
                if ( view._index >= newIndex && view._index <= oldIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index++;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }
        else {
            this.children.each( function( view ) {
                if ( view._index >= oldIndex && view._index <= newIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index--;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }

        this.model.collection.sort();
    },

	/**
	 * Destroys the carousel navigation dots before the template is refreshed.
	 *
	 * @since 1.0.0
	 */
    onBeforeRenderTemplate : function() {
        if ( this.navigation ) {
            this.navigation.triggerMethod( 'destroy' );
        }
    },

	/**
	 * Inserts the carousel navigation dots into the DOM.
	 *
	 * @since 1.0.0
	 */
    onRenderTemplate : function() {
        this.navigation = new CarouselNavigationView( {
            model : this.model,
            collection : this.collection,
            sort : false
        } );

		this.$el.append( this.navigation.render().el );
    },

	/**
	 * Destroys the carousel navigation dots before the carousel is destroyed.
	 *
	 * @since 1.0.0
	 */
    onBeforeDestroy : function() {
		this.triggerAll( 'before:element:destroy', this );
        this.navigation.triggerMethod( 'destroy' );
    }

} );

module.exports = CarouselView;
},{"./../element-container":19,"./navigation/carousel-navigation":15}],14:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    tagName : 'li',

    attributes : function() {
        return {
            'data-id' : this.model.cid
        };
    },

    /**
     * Returns the element template.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
	getTemplate : function() {
        return _.template( '<button data-role="none" role="button" aria-required="false" tabindex="0"></button>' );
    }

} );

},{}],15:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

    tagName : 'ul',

    className : 'slick-dots',

	childView : require( './carousel-navigation-item' ),

    events : {
        'dragstart' : 'onDragStart'
    },

	/**
     * Resets the canvas when dragging of a carousel item starts.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onDragStart : function( e ) {

		/**
		 * Fires when dragging of a carousel navigation item begins.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'canvas:reset' );
        e.stopPropagation();
    },

	/**
     * Initializes the SortableJS plugin when the elememt is rendered.
     *
     * SortableJS is used to allow reordering of carousel items.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var navigation = this;
        this.sortable = new Sortable( navigation.el, {
            draggable : 'li',
            animation : 150,

	        /**
	         * Update the order of the carousel items when they are repositioned.
	         *
	         * @since 1.0.0
	         */
            onUpdate : function( e ) {
                var $container = navigation.$el.parent();

                /**
                 * Fires before a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'before:element:change:order' );

	            /**
                 * Fires when a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'element:change:order', [ e.item.getAttribute( 'data-id' ), e.newIndex, e.oldIndex ] );

                /**
                 * Fires when a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'element:change:order', navigation.model );
            }
        } );
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend({
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) === this.model.get( 'id' );
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
		this.sortable.destroy();
	}

} );
},{"./carousel-navigation-item":14}],16:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {

    tagName : 'li',

	className : function() {
        return  'tailor-tabs__navigation-item tailor-' + this.model.get( 'id' );
    },

    modelEvents : {
        'change:atts' : 'onChangeAttributes'
    },

    /**
     * Adds the view ID to the element for use by the tab script.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    attributes : function() {
        return {
            'data-id' : this.model.cid
        };
    },

    /**
     * Returns the element template.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
	getTemplate : function() {
        return _.template( '<%= title || "Tab" %>' );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        var atts = this.model.get( 'atts' );
        data.title = atts.title;

        return data;
    },

    /**
     * Update the title when the attributes are updated.
     *
     * @since 1.0.0
     *
     * @param model
     * @param atts
     */
    onChangeAttributes : function( model, atts ) {
        this.el.innerHTML = atts.title || 'Tab';
    }

} );

},{}],17:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

	childView : require( './tabs-navigation-item' ),

    events : {
        'dragstart' : 'onDragStart'
    },

    onDragStart : function( e ) {

	    /**
	     * Fires when the dragging of a tab navigation item begins.
	     *
	     * @since 1.0.0
	     */
        app.channel.trigger( 'canvas:reset' );
        e.stopPropagation();
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend({
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) === this.model.get( 'id' );
    },

    /**
     * Enable sorting behavior for the tabs.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var navigation = this;
        this.sortable = new Sortable( navigation.el, {
            draggable : '.tailor-tabs__navigation-item',
            animation : 150,

            /**
             * Updates the order of the tabs when they are repositioned.
             *
             * @since 1.0.0
             */
            onUpdate : function( e ) {
                var $container = navigation.$el.parent();

                /**
                 * Fires before a tab is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'before:element:change:order' );

                /**
                 * Fires when a tab is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'element:change:order', [ e.item.getAttribute( 'data-id' ), e.newIndex, e.oldIndex ] );

	            /**
	             * Fires when a tab is reordered.
	             *
	             * @since 1.0.0
	             */
	            app.channel.trigger( 'element:change:order', navigation.model );
            }

        } );
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
    onBeforeDestroy : function() {
        this.sortable.destroy();
    }

} );
},{"./tabs-navigation-item":16}],18:[function(require,module,exports){
var ContainerView = require( './../element-container' ), 
	TabsNavigationView = require( './navigation/tabs-navigation' ),
	TabsView;

TabsView = ContainerView.extend( {

    ui : {
        navigation : '.tailor-tabs__navigation'
    },

    childViewContainer : '.tailor-tabs__content',

    events : {
        'element:change:order' : 'onReorderElement'
    },

	/**
	 * Handles the reordering of tabs.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
    onReorderElement : function( e, id, newIndex, oldIndex ) {
        if ( newIndex - oldIndex < 0 ) {
            this.children.each( function( view ) {
                if ( view._index >= newIndex && view._index <= oldIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index++;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }
        else {
            this.children.each( function( view ) {
                if ( view._index >= oldIndex && view._index <= newIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index--;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }

        this.model.collection.sort();
    },

	/**
	 * Destroys the tabs navigation before the template is refreshed.
	 *
	 * @since 1.0.0
	 */
    onBeforeRenderTemplate : function() {
        if ( this.navigation ) {
            this.navigation.triggerMethod( 'destroy' );
        }
    },

	/**
	 * Inserts the tabs navigation into the DOM.
	 *
	 * @since 1.0.0
	 */
    onRenderTemplate : function() {
        this.navigation = new TabsNavigationView( {
            el : this.ui.navigation,
            model : this.model,
            collection : this.collection,
            sort : false
        } );

        this.navigation.render();
    },

	/**
	 * Triggers events when a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childRefreshed : function( childView ) {
		childView.el.id = childView.model.cid;
		childView.el.classList.add( 'is-active' );

		this.triggerAll( 'element:child:refresh', childView );
	},

    /**
     * Destroys the tabs navigation before the tabs element is destroyed.
     *
     * @since 1.0.0
     */
    onBeforeDestroy : function() {
	    this.triggerAll( 'before:element:destroy', this );
        this.navigation.triggerMethod( 'destroy' );
    }

} );

module.exports = TabsView;
},{"./../element-container":19,"./navigation/tabs-navigation":17}],19:[function(require,module,exports){
var CompositeView = Marionette.CompositeView.extend( {

    behaviors : {
        Container : {},
        Draggable : {},
        Droppable : {},
        Editable : {},
        Movable : {}
    },

	modelEvents : {
		'change:atts' : 'onChangeAttributes',
		'change:parent' : 'onChangeParent',
		'change:setting' : 'onChangeSetting'
	},

	events : {
		'element:parent:change' : 'stopEventPropagation',
		'before:element:ready' : 'stopEventPropagation',
		'element:ready' : 'stopEventPropagation',
		'before:element:refresh' : 'stopEventPropagation',
		'element:refresh' : 'stopEventPropagation',
		'before:element:destroy' : 'stopEventPropagation',
		'element:destroy' : 'stopEventPropagation',
		'before:element:copy' : 'stopEventPropagation',
		'element:copy' : 'stopEventPropagation',
		'element:child:add' : 'onDescendantAdded',
		'element:child:remove' : 'onDescendantRemoved',
		'before:element:child:ready' : 'stopEventPropagation',
		'element:child:ready' : 'onDescendantReady',
		'before:element:child:refresh' : 'stopEventPropagation',
		'element:child:refresh' : 'stopEventPropagation',
		'before:element:child:destroy' : 'stopEventPropagation',
		'element:child:destroy' : 'onDescendantDestroyed'
	},

	childEvents : {
		'before:element:ready' : 'beforeChildElementReady',
		'element:ready' : 'childElementReady',
		'before:element:refresh' : 'beforeChildElementRefreshed',
		'element:refresh' : 'childElementRefreshed',
		'before:element:destroy' : 'beforeChildElementDestroyed',
		'element:destroy' : 'childElementDestroyed'
	},
	
    /**
     * Initializes the view.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this._isReady = false;
        this._isBeingDestroyed = false;

        this.addEventListeners();
    },

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
    addEventListeners : function() {
        this.listenTo( app.channel, 'before:elements:restore', this.onBeforeDestroy );
    },

    /**
     * Returns the appropriate child view based on the element tag.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
	    return Tailor.lookup( child.get( 'tag' ), child.get( 'type' ), 'Views' );
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend({
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the collection to ensure that only the appropriate children are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) === this.model.get( 'id' );
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     *
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = jQuery( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'draggable', true );

        return this;
    },

    /**
     * Returns the template ID.
     *
     * @since 1.0.0
     */
    getTemplateId : function() {
        return 'tmpl-tailor-' + this.model.get( 'id' );
    },

    /**
     * Returns the element template.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var el = document.querySelector( '#' + this.getTemplateId() );
        var template;

        if ( el ) {
            template = _.template( el.innerHTML );
            el.parentElement.removeChild( el );
        }
        else {
            el = document.querySelector( '#tmpl-tailor-' + this.model.get( 'tag' ) + '-default' );
            template = _.template( el.innerHTML );
        }

        return template;
    },

    /**
     * Updates the element template with the HTML provided.
     *
     * If the script element containing the element template does not exist in the page, it will be created.
     *
     * @since 1.0.0
     *
     * @param html
     */
    updateTemplate : function( html ) {
        var templateId = this.getTemplateId();
        var el = document.querySelector( '#' + templateId );

        if ( ! el ) {
            el = document.createElement( 'script' );
            el.setAttribute( 'type', 'text/html' );
            el.id = templateId;
            document.body.appendChild( el );
        }

        el.innerHTML = html;
    },

    /**
     * Renders the element template, without affecting child elements.
     *
     * @since 1.0.0
     */
    renderTemplate : function() {
        this._ensureViewIsIntact();

        var $childViewContainer = this.getChildViewContainer( this );
        var $children = $childViewContainer.contents().detach();

        this.resetChildViewContainer();
        this._renderTemplate();

        $childViewContainer = this.getChildViewContainer( this );
        $childViewContainer.append( $children );

        return this;
    },

    /**
     * Updated Marionette function : changed to update the 'order' attribute along with the view _index.
     *
     * @since 1.0.0
     *
     * @param view
     * @param increment
     * @param index
     * @private
     */
    _updateIndices : function( view, increment, index ) {

        if ( increment ) {
            view._index = index;

            //console.log( '\n Updated index of view ' + view.model.get( 'id' ) + ' ' + view.model.get( 'id' ) + ' to ' + index );

            view.model._changing = false;
            view.model.set( 'order', index );
        }

        this.children.each( function( laterView ) {
            if ( laterView._index >= view._index ) {
                laterView._index += increment ? 1 : -1;

                //console.log( '\n Updated index of view ' + laterView.model.get( 'tag' ) + ' ' + laterView.model.get( 'id' ) + ' to ' + laterView._index );

                laterView.model.set( 'order', laterView._index );
            }
        }, this );
    },

	/**
	 * Triggers events before the element is ready.
	 *
	 * @since 1.0.0
	 */
	onBeforeRender : function() {
		this.triggerAll( 'before:element:ready', this );
	},

	/**
	 * Prepares the view and triggers events when the DOM is refreshed.
	 *
	 * @since 1.0.0
	 */
	onDomRefresh : function() {

		this.$el
			.addClass( 'tailor-' + this.model.get( 'id' ) )
			.attr( { draggable: true } )
			.find( 'a' )
			.attr( { draggable : false, target : '_blank' } );

		this.$el
			.find( 'img' )
			.attr( { draggable : false } );
	},

	/**
	 * Triggers events before the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
		this.triggerAll( 'before:element:destroy', this );
	},

	/**
	 * Triggers an event when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onDestroy : function() {
		this.triggerAll( 'element:destroy', this );
	},
	
	/**
	 * Refreshes the element template when its attributes change.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @param atts
	 */
	onChangeAttributes : _.debounce( function( model, atts ) {
		model = this.model.toJSON();
		model.atts = atts ? atts : {};
		
		var view = this;
		view.el.classList.add( 'is-rendering' );

		window.ajax.send( 'tailor_render', {
			data : {
				model : JSON.stringify( model ),
				nonce : window._nonces.render
			},

			/**
			 * Attaches the refreshed template to the page.
			 *
			 * @since 1.0.0
			 *
			 * @param response
			 */
			success : function( response ) {
				view.updateTemplate( response.html );
				var id = view.model.get( 'id' );
				
				/**
				 * Fires when the custom CSS rules for a given element are updated.
				 *
				 * @since 1.0.0
				 *
				 * @param id
				 * @param response.css
				 */
				app.channel.trigger( 'css:update', id, response.css );
			},

			/**
			 * Catches template rendering errors.
			 *
			 * @since 1.0.0
			 */
			error : function() {
				view.updateTemplate( 'The template for ' + view.cid + ' could not be refreshed' );
			},

			/**
			 * Renders the element with the new template.
			 *
			 * @since 1.0.0
			 */
			complete : function() {
				var isEditing = view.$el.hasClass( 'is-editing' );
				var isSelected = view.$el.hasClass( 'is-selected' );

				view.$el.removeClass( 'is-rendering' );

				/**
				 * Fires before the container template is refreshed.
				 *
				 * @since 1.0.0
				 *
				 * @param compositeView
				 * @param model.atts
				 */
				view.triggerAll( 'before:element:refresh', view, model.atts );

				view.renderTemplate();

				/**
				 * Fires after the container template is refreshed.
				 *
				 * @since 1.0.0
				 *
				 * @param compositeView
				 * @param model.atts
				 */
				view.triggerAll( 'element:refresh', view, model.atts );

				view.refreshChildren();

				if ( isEditing ) {
					view.$el.addClass( 'is-editing' );
				}

				if ( isSelected ) {
					view.$el.addClass( 'is-selected' );
				}
			}
		} );

	}, 250 ),

	/**
	 * Triggers an event to update the DOM, if the setting is configured to update via JavaScript.
	 *
	 * @since 1.5.0
	 *
	 * @param setting
	 * @param refresh
	 */
	onChangeSetting: function( setting, refresh ) {
		if ( refresh ) {

			/**
			 * Fires when an element setting configured to be updated using JavaScript changes.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );
		}
	},

	/**
	 * Triggers events and refreshes all child elements when the element parent changes.
	 *
	 * @since 1.0.0
	 */
	onChangeParent : function() {

		/**
		 * Fires when the parent attributes of the element changes.
		 *
		 * @since 1.0.0
		 */
		this.triggerAll( 'element:change:parent', this );

		this.refreshChildren();
	},
	
	/**
	 * Triggers an event before a child element is ready.
	 *
	 * @since 1.0.0
	 */
	beforeChildElementReady : function( childView ) {
		if ( this._isReady ) {
			this.triggerAll( 'before:element:child:ready', childView );
		}
	},

	/**
	 * Triggers events after a child element is ready.
	 *
	 * If all children are ready, the element is also considered ready.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementReady : function( childView ) {
		if ( ! this._isReady ) {

			var readyChildren = this.children.filter( function( childView ) {
				return childView._isReady;
			} ).length;

			if ( this.children.length == readyChildren ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );

				this.refreshChildren();
			}
		}
		else  {

			/**
			 * Fires when a child element within this fully-rendered container is ready.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:child:ready', childView );
		}
	},

	/**
	 * Triggers events before a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	beforeChildElementRefreshed : function( childView ) {
		this.triggerAll( 'before:element:child:refresh', childView );
	},

	/**
	 * Triggers events after a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementRefreshed : function( childView ) {
		this.triggerAll( 'element:child:refresh', childView );
	},

	/**
	 * Triggers events before a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	beforeChildElementDestroyed : function( childView ) {
		if ( ! this._isBeingDestroyed ) {
			this.triggerAll( 'before:element:child:destroy', childView );
		}
	},

	/**
	 * Triggers events after a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementDestroyed : function( childView ) {
		if ( ! this._isBeingDestroyed && this.children.length > 1 ) {
			this.triggerAll( 'element:child:destroy', childView );
		}
	},

	/**
	 * Refreshes all child elements when the parent element is modified.
	 *
	 * @since 1.0.0
	 */
	onElementParentChange : function() {
		this.refreshChildren();
	},

	/**
	 * Refreshes all child elements when the a child element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onElementChildDestroy : function() {
		this.refreshChildren();
	},

	/**
	 * Triggers events after a child element is added.
	 *
	 * If this container is not fully rendered (i.e., it was created to contain the child element), the element is considered ready.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantAdded : function( e, descendantView ) {
		if ( ! this._isReady ) {

			var readyChildren = this.children.filter( function( childView ) {
				return childView._isReady;
			} ).length;

			if ( this.children.length == readyChildren ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );
			}

			e.stopImmediatePropagation();
		}
		else  {

			/**
			 * Fires when a descendant element within this fully-rendered container is ready.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:add', descendantView );

			e.stopPropagation();
		}
	},

	/**
	 * Triggers events after a child element is removed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantRemoved : function( e, descendantView ) {
		if ( ( 'container' == this.model.get( 'type' ) && this.children.length > 1 ) || this.children.length > 0 ) {
			this.triggerAll( 'element:descendant:remove', descendantView );
		}

		e.stopPropagation();
	},

	/**
	 * Triggers events after a child element is ready.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantReady : function( e, descendantView ) {
		if ( ! this._isReady ) {
			if ( this.children.length == 1 && this.children.contains( descendantView ) ) {
				this._isReady = true;

				/**
				 * Fires when all child elements are ready (i.e., the container is fully-rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:ready', this );
			}
			e.stopImmediatePropagation();
		}
		else  {

			/**
			 * Fires when a descendant element is created in this fully-rendered container.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:add', descendantView );

			// @todo Find a better way of refreshing complex content elements like carousel galleries
			this.refreshChildren();

			e.stopPropagation();
		}
	},

	/**
	 * Triggers events after a child element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param descendantView
	 */
	onDescendantDestroyed : function( e, descendantView ) {
		if ( ( 'container' == this.model.get( 'type' ) && this.children.length > 1 ) || this.children.length > 0 ) {

			/**
			 * Fires when a descendant element within in this fully-rendered container is destroyed.
			 *
			 * @since 1.0.0
			 */
			this.triggerAll( 'element:descendant:destroy', descendantView );
		}

		e.stopPropagation();
	},

	/**
	 * Refreshes all child elements.
	 *
	 * @since 1.0.0
	 */
	refreshChildren : function() {
		this.children.each( function( childView ) {
			childView.triggerAll( 'element:parent:change', childView );
		}, this );
	},

	/**
	 * Triggers events and methods during a given event in the lifecycle.
	 *
	 * @since 1.0.0
	 *
	 * @param event
	 * @param view
	 * @param atts
	 */
	triggerAll : function( event, view, atts ) {
		this.$el.trigger( event, view );
		this.triggerMethod( event, view );

		if ( atts ) {
			app.channel.trigger( event, this, atts);
		}
		else {
			app.channel.trigger( event, this );
		}
	},

	/**
	 * Stops the event from bubbling up the DOM tree.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	stopEventPropagation : function( e ) {
		e.stopPropagation();
	}

} );

module.exports = CompositeView;
},{}],20:[function(require,module,exports){
var $ = window.jQuery,
	ElementView;

ElementView = Marionette.ItemView.extend( {

	className : 'element',

	attributes : {
		draggable : true
	},

	behaviors : {
		Draggable : {},
		Droppable : {},
		Editable : {},
		Movable : {}
	},

	modelEvents : {
		'change:atts' : 'onChangeAttributes',
		'change:parent' : 'onChangeParent',
		'change:setting' : 'onChangeSetting'
	},

	/**
	 * Initializes the view.
	 *
	 * @since 1.0.0
	 */
	initialize : function() {
		this._isReady = false;
		this._isBeingDestroyed = false;

		this.addEventListeners();
	},

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
	addEventListeners : function() {
		this.listenTo( app.channel, 'before:elements:restore', this.onBeforeDestroy );
	},

	/**
	 * Returns the template ID.
	 *
	 * @since 1.0.0
	 */
	getTemplateId : function() {
		return 'tmpl-tailor-' + this.model.get( 'id' );
	},

	/**
	 * Returns the element template.
	 *
	 * @since 1.0.0
	 *
	 * @returns {string}
	 */
	getTemplate : function() {
		var el = document.querySelector( '#' + this.getTemplateId() );
		var template;

		if ( el ) {
			template = _.template( el.innerHTML );
			el.parentElement.removeChild( el );
		}
		else {
			el = document.querySelector( '#tmpl-tailor-' + this.model.get( 'tag' ) + '-default' );
			template = _.template( el.innerHTML );
		}

		return template;
	},

	/**
	 * Uses the rendered template HTML as the $el.
	 *
	 * @since 1.0.0
	 *
	 * @param html
	 * @returns {exports}
	 */
	attachElContent : function( html ) {
		var $el = $( html );
		var el = $el[0]; // Fix for elements that contain comments

		this.$el.replaceWith( el );
		this.setElement( el );

		return this;
	},

	/**
	 * Updates the element template with the HTML provided.
	 *
	 * If the script element containing the element template does not exist in the page, it will be created.
	 *
	 * @since 1.0.0
	 *
	 * @param html
	 */
	updateTemplate : function( html ) {
		var templateId = this.getTemplateId();
		var el = document.querySelector( '#' + templateId );

		if ( ! el ) {
			el = document.createElement( 'script' );
			el.setAttribute( 'type', 'text/html' );
			el.id = templateId;
			document.body.appendChild( el );
		}

		el.innerHTML = html;
	},

	/**
	 * Refreshes the element template when the element attributes change.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @param atts
	 */
	onChangeAttributes :  _.debounce( function( model, atts ) {
		var view = this;
		
		model = model.toJSON();
		if ( atts ) {
			model.atts = atts;
		}
		
		view.el.classList.add( 'is-rendering' );

		window.ajax.send( 'tailor_render', {
			data : {
				model : JSON.stringify( model ),
				nonce : window._nonces.render
			},

			/**
			 * Attaches the refreshed template to the page.
			 *
			 * @since 1.0.0
			 *
			 * @param response
			 */
			success : function( response ) {
				view.updateTemplate( response.html );
				
				/**
				 * Fires when the custom CSS rules for a given element are updated.
				 *
				 * @since 1.0.0
				 */
				app.channel.trigger( 'css:update', view.model.get( 'id' ), response.css );
			},

			/**
			 * Catches template rendering errors.
			 *
			 * @since 1.0.0
			 */
			error : function() {
				view.updateTemplate( 'The template for ' + view.cid + ' could not be refreshed' );
			},

			/**
			 * Renders the element with the new template.
			 *
			 * @since 1.0.0
			 */
			complete : function() {
				var isEditing = view.$el.hasClass( 'is-editing' );
				var isSelected = view.$el.hasClass( 'is-selected' );

				view.$el.removeClass( 'is-rendering' );

				/**
				 * Fires before the container template is refreshed.
				 *
				 * @since 1.0.0
				 */
				view.triggerAll( 'before:element:refresh', view, model.atts );

				view.render();

				/**
				 * Fires after the container template is refreshed.
				 *
				 * @since 1.0.0
				 */
				view.triggerAll( 'element:refresh', view, model.atts );

				if ( isEditing ) {
					view.$el.addClass( 'is-editing' );
				}

				if ( isSelected ) {
					view.$el.addClass( 'is-selected' );
				}
			}
		} );

	}, 500 ),

	/**
	 * Triggers an event to update the DOM, if the setting is configured to update via JavaScript.
	 *
	 * @since 1.5.0
	 *
	 * @param setting
	 * @param refresh
	 */
	onChangeSetting: function( setting, refresh ) {
		if ( refresh ) {

			/**
			 * Fires when an element setting configured to be updated using JavaScript changes.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );
		}
	},

	/**
	 * Triggers events when the element parent changes.
	 *
	 * @since 1.0.0
	 */
	onChangeParent : function() {
		this.triggerAll( 'element:change:parent', this );
	},

	/**
	 * Triggers an event on the application channel before the DOM element is rendered.
	 *
	 * @since 1.0.0
	 */
	onBeforeRender : function() {
		this.triggerAll( 'before:element:ready', this );
	},

	/**
	 * Prepares the view and triggers events when the DOM is refreshed.
	 *
	 * @since 1.0.0
	 */
	onDomRefresh : function() {
		var view = this;
		
		this.$el
			.addClass( 'tailor-' + this.model.get( 'id' ) )
			.attr( { draggable: true } )
			.find( 'a' )
			.attr( { draggable : false, target : '_blank' } );

		this.$el
			.find( 'img' )
			.attr( { draggable : false } );
		
		this.$el.imagesLoaded( function() {
			view._isReady = true;

			/**
			 * Fires when the element is rendered and all images have been loaded.
			 *
			 * @since 1.0.0
			 * 
			 * @param view
			 */
			view.triggerAll( 'element:ready', view );
		} );
	},

	/**
	 * Triggers events before the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
		this.triggerAll( 'before:element:destroy', this );
	},

	/**
	 * Triggers an event when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onDestroy : function() {
		this.triggerAll( 'element:destroy', this );
	},
	
	/**
	 * Triggers events and methods during a given event in the lifecycle.
	 *
	 * @since 1.0.0
	 *
	 * @param event
	 * @param view
	 * @param atts
	 */
	triggerAll : function( event, view, atts ) {
		this.$el.trigger( event, view );
		this.triggerMethod( event, view );

		if ( atts ) {
			app.channel.trigger( event, this, atts);
		}
		else {
			app.channel.trigger( event, this );
		}
	}

} );

module.exports = ElementView;
},{}],21:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    BoxView;

BoxView = ContainerView.extend( {
    childViewContainer : '.tailor-box__content'
} );

module.exports = BoxView;
},{"./../element-container":19}],22:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    CardView;

CardView = ContainerView.extend( {
    childViewContainer : '.tailor-card__content'
} );

module.exports = CardView;
},{"./../element-container":19}],23:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
    HeroView;

HeroView = ContainerView.extend( {
    childViewContainer : '.tailor-hero__content'
} );

module.exports = HeroView;
},{"./../element-container":19}],24:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
	SectionView;

SectionView = ContainerView.extend( {

	attributes : {
		draggable : true
	},

    modelEvents : {
        'change:atts' : 'onChangeAttributes',
        'change:order' : 'onChangeOrder',
        'change:setting' : 'onChangeSetting'
    },

    childViewContainer : '.tailor-section__content',

	onChangeOrder : function() {
		jQuery( window ).trigger( 'resize' );
	}

} );

module.exports = SectionView;
},{"./../element-container":19}],25:[function(require,module,exports){
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

	this.options = $.extend( {}, this.defaults, options );
	if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
		this.options.rtl = true;
	}
	
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Carousel.prototype = {

    defaults : {
        items : '.tailor-carousel__item',
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
        adaptiveHeight : true,
        draggable : false,
        speed : 250,
        slidesToShow : 1,
        slidesToScroll : 1,
        autoplay : false,
        arrows : false,
        dots : true,
        fade : false
    },

    callbacks : {

        /**
         * Callback function to be run when the Carousel instance is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the Carousel instance is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the carousel.
     *
     * @since 1.0.0
     */
    initialize : function() {
	    this.slick( this.addEventListeners );

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
	        .on( 'before:element:refresh', $.proxy( this.unSlick, this ) )

	        // Fires when the element is moved into a new container
	        .on( 'element:change:parent', $.proxy( this.maybeRefreshSlick, this ) )

	        // Fires before and after the element is copied
	        .on( 'before:element:copy', $.proxy( this.unSlick, this ) )
	        .on( 'element:copy', $.proxy( this.slick, this ) )

	        // Fires before the element is destroyed
	        .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

	        // Fires after the parent element is modified
	        .on( 'element:parent:change', $.proxy( this.maybeRefreshSlick, this ) );
    },

	/**
	 * Re-initializes the carousel if the event was triggered on the element.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    maybeSlick : function( e ) {
        if ( e.target == this.el ) {
            this.slick();
        }
    },

	/**
	 * Refreshes the carousel if the event was triggered on the carousel DOM element.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	maybeRefreshSlick : function( e ) {
		if ( e.target == this.el ) {
			this.refreshSlick();
		}
	},

	/**
	 * Destroys the carousel if the event was triggered on the carousel DOM element.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    maybeUnSlick : function( e ) {
        if ( e.target == this.el ) {
            this.unSlick();
        }
    },

	/**
	 * Destroys the carousel immediately before the view/DOM element is destroyed.
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
     * Creates a new Slick Slider instance.
     *
     * @since 1.0.0
     *
     * @param callback
     */
    slick : function( callback ) {
		var carousel = this;

	    this.$el.imagesLoaded( function() {
	        carousel.$wrap.slick( carousel.options );

		    if ( 'function' == typeof callback ) {
			    callback.call( carousel );
		    }
	    } );
    },

    /**
     * Refreshes the Slick Slider instance.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
	    this.$wrap.slick( 'refresh' );
    },

    /**
     * Destroys the Slick Slider instance.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        this.$wrap.slick( 'unslick' );
    },

    /**
     * Destroys the carousel.
     *
     * @since 1.0.0
     */
    destroy : function() {
        this.$el.off();
        this.unSlick();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

/**
 * Simple carousel jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
 * @returns {*}
 */
$.fn.tailorSimpleCarousel = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorSimpleCarousel' );
        if ( ! instance ) {
            $.data( this, 'tailorSimpleCarousel', new Carousel( this, options, callbacks ) );
        }
    } );
};
},{}],26:[function(require,module,exports){
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

	this.options = $.extend( {}, this.defaults, options );
	if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
		this.options.rtl = true;
	}
	
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Carousel.prototype = {

	defaults : {
		items : '.tailor-carousel__item',
		prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
		nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
		adaptiveHeight : false,
		draggable : false,
		speed : 250,
		slidesToShow : 1,
		slidesToScroll : 1,
		initialSlide : 0,
		autoplay : false,
		arrows : false,
		dots : false,
		fade : false,
		infinite : false
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
     * Initializes the carousel.
     *
     * @since 1.0.0
     */
    initialize : function() {
	    this.slickAt( 0, this.addEventListeners );

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

	    var showEl = true;

        this.$el

	        // Fires before the element template is refreshed
            .on( 'before:element:refresh', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:refresh', $.proxy( this.refreshSlick, this ) )

	        // Fires when the element parent changes
	        .on( 'element:change:parent', $.proxy( this.maybeRefreshSlick, this ) )

	        // Fires before and after the element is copied
	        .on( 'before:element:copy', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:copy', $.proxy( this.maybeSlick, this ) )

	        // Fires after the parent element is modified
	        .on( 'element:parent:change', $.proxy( this.maybeRefreshSlick, this ) )

	        // Fires before the element is destroyed
	        .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

	        /**
	         * Child event listeners
	         */

	        // Fires before and after a child element is added
	        .on( 'before:element:child:ready', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:ready', $.proxy( this.onReadyChild, this ) )

	        // Fires after a child element is added
	        .on( 'element:child:add', $.proxy( this.refreshSlick, this ) )

	        // Fires after a child element is removed
	        .on( 'element:child:remove', $.proxy( this.onDestroyDescendant, this ) )

	        // Fires before and after a child element is refreshed
	        .on( 'before:element:child:refresh', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:refresh', $.proxy( this.maybeSlick, this ) )

	        // Fires before and after the position of an item is changed
	        .on( 'before:element:change:order', $.proxy( this.maybeUnSlick, this ) ) // @todo rename to reflect child
	        .on( 'element:change:order', $.proxy( this.onReorderChild, this ) ) // @todo rename to reflect child

	        // Fires before and after a child element is destroyed
	        .on( 'before:element:child:destroy', $.proxy( this.maybeUnSlick, this ) )
	        .on( 'element:child:destroy', $.proxy( this.onDestroyChild, this ) )

	        /**
	         * Descendant event listeners
	         */

	        // Fires after a descendant element is added
	        .on( 'element:descendant:add', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is removed
	        .on( 'element:descendant:remove', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is ready
	        .on( 'element:descendant:ready', $.proxy( this.refreshSlick, this ) )

	        // Fires after a descendant element is destroyed
	        .on( 'element:descendant:destroy', $.proxy( this.onDestroyDescendant, this ) );
    },

    /**
     * Refreshes the dot and item caches and defines the current slide.
     *
     * @since 1.0.0
     */
    querySelectors : function() {
        if ( this.$dots ) {
            this.$dots.off();
        }

	    var carousel = this;

	    carousel.$items = carousel.$wrap.find( ' > ' + carousel.options.items );
	    carousel.$dots = carousel.$el.children( '.slick-dots' ).find( ' > li' );
	    carousel.$dots.on( 'click', function( e ) {
            var $dot = $( e.currentTarget );

		    carousel.currentSlide = $dot.data( 'id' );
		    carousel.$wrap.slick( 'slickGoTo', $dot.index() );
            e.preventDefault();
        } );

        if ( ! carousel.currentSlide ) {
            var $activeSlide = carousel.$items.filter( function() {
                return this.classList.contains( 'slick-current' );
            } );
	        carousel.currentSlide = $activeSlide.length ? $activeSlide.id : carousel.$items[0].id;
        }
    },

    /**
     * Sets the dot with the given index as active.
     *
     * @since 1.0.0
     *
     * @param index
     */
    updateDots : function( index ) {
        this.$dots.each( function( i, el ) {
            if ( index == i ) {
                el.classList.add( 'slick-active' );
            }
            else {
                el.classList.remove( 'slick-active' );
            }
        } );

	    this.$dots.toggle( ( this.$dots.length / this.options.slidesToShow ) > 1 );
    },

	/**
	 * Adds a new child element to the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onReadyChild : function( e, childView ) {
		if ( e.target == this.el ) {
			this.slickAt( childView.$el.index() );
		}
		else {
			this.refreshSlick();
		}
	},

	/**
	 * Reorders a child element in the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
	onReorderChild : function( e, id, newIndex, oldIndex ) {
		if ( e.target !== this.el ) {
			return;
		}

		this.querySelectors();

		var $item = this.$items.filter( function() { return this.id == id } );
		if ( oldIndex - newIndex < 0 ) {
			$item.insertAfter( this.$items[ newIndex ] );
		}
		else {
			$item.insertBefore( this.$items[ newIndex ] );
		}

		this.slickAt( newIndex );
	},

	/**
	 * Removes a child element from the carousel.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onDestroyChild : function( e, childView ) {
		var index = childView.$el.index();
		childView.$el.remove();
		this.slickAt( index );
	},

	/**
	 * Refreshes the carousel when a descendant element is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param childView
	 */
	onDestroyDescendant : function( e, childView ) {
		childView.$el.detach();
		this.refreshSlick();
	},

    /**
     * Re-initializes the carousel if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeSlick : function( e ) {
	    if ( e.target == this.el ) {
		    this.slick();
	    }
    },

    /**
     * Refreshes the carousel if the event was triggered on the carousel DOM element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefreshSlick : function( e ) {
        if ( e.target == this.el ) {
	        this.refreshSlick();
        }
    },

    /**
     * Destroys the carousel if the event was triggered on the carousel DOM element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeUnSlick : function( e ) {
	    if ( e.target == this.el ) {
            this.unSlick();
        }
    },

    /**
     * Destroys the carousel immediately before the view/DOM element is destroyed.
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
	 * Initializes the Slick Slider plugin at a given index.
	 *
	 * @since 1.0.0
	 *
	 * @param index
	 * @param callback
	 */
	slickAt : function( index, callback ) {
		this.querySelectors();

		var numberItems = this.$items.length;
		if ( ! numberItems ) {
			return;
		}

		index = Math.min( index, numberItems - 1 );
		if ( index < this.options.slidesToShow ) {
			index = 0;
		}

		var $item = this.$items[ index ];
		this.currentSlide = $item.id;

		this.slick( callback );
		this.updateDots( index );
	},

    /**
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     *
     * @param callback
     */
    slick : function( callback ) {
        var carousel = this;
	    var currentSlide = this.currentSlide;
	    var currentIndex = this.$dots.filter( function() { return this.getAttribute( 'data-id' ) == currentSlide; } ).index();
	    var options = $.extend( {}, this.options, {
		    autoplay : false,
		    fade : false,
		    initialSlide : currentIndex
	    } );
	    
        carousel.$wrap
            .slick( options )
            .on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
                if ( slick.$slider[0] == carousel.$wrap[0] && currentSlide != nextSlide ) {
                    carousel.updateDots( nextSlide );
                }
            } );

        if ( 'function' == typeof callback ) {
	        callback.call( carousel );
        }
    },

    /**
     * Refreshes the Slick Slider instance.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
	    this.$wrap.slick( 'refresh' );
    },

    /**
     * Destroys the Slick Slider instance.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        this.$wrap.slick( 'unslick' );
    },

    /**
     * Destroys the carousel.
     *
     * @since 1.0.0
     */
    destroy : function() {
        this.$el.off();
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
},{}],27:[function(require,module,exports){
var ElementCollection = Backbone.Collection.extend( {

    /**
     * Sorts the collection by order.
     *
     * @since 1.0.0
     */
    comparator: 'order',

    /**
     * Returns the appropriate model based on the given tag.
     *
     * @since 1.0.0
     *
     * @param attrs
     * @param options
     * @returns {*|exports|module.exports}
     */
	model : function( attrs, options ) {
        var Model = Tailor.lookup( attrs.tag, attrs.type, 'Models' );
        return new Model( attrs, options );
	},

    /**
     * Initializes the elements collection.
     *
     * @since 1.0.0
     */
	initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'change:parent', this.onChangeParent );
        this.listenTo( this, 'add', this.onAdd );
        this.listenTo( this, 'destroy', this.onDestroy );
        this.listenTo( this, 'container:collapse', this.onCollapse );
        this.listenTo( this, 'reset', this.onReset );
    },

    /**
     * Returns the parent of a given model.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getParent : function( model ) {
        return this.findWhere( { id : model.get( 'parent' ) } );
    },

    /**
     * Returns the siblings for a given element.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getChildren : function( model ) {
        return this.where( { parent : model.get( 'id' ) } );
    },

    /**
     * Returns the siblings for a given element.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    getSiblings : function( model ) {
        return this.where( { parent : model.get( 'parent' ) } );
    },

    /**
     * Returns true if the given element has a selected parent.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {boolean}
     */
    hasSelectedParent : function( model ) {
        var selected = app.channel.request( 'canvas:element:selected' );

        if ( ! selected || model === selected ) {
            return false;
        }

        var parentId = model.get( 'parent' );
        var parent = this.findWhere( { id : parentId } );

        while ( 'undefined' !== typeof parent ) {
            if ( selected === parent ) {
                return true;
            }
            parentId = parent.get( 'parent' );
            parent = this.get( parentId );
        }
        
        return false;
    },

    /**
     * Performs checks on the previous parent when an element changes parent.
     *
     * @since 1.0.0
     *
     * @param model
     */
	onChangeParent : function( model ) {
		var parent = this.get( model.get( 'parent' ) );
		var previousParent = this.get( model.previous( 'parent' ) );

        //console.log( '\n Changed parent of ' + model.get( 'id' ) + ' from ' + model.previous( 'parent' ) + ' to ' + model.get( 'parent' ) );

	    this.sort( { silent : true } );

		this._checkParent( previousParent );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			this._reBalanceColumns( parent );
			this._reBalanceColumns( previousParent );
		}
	},

    /**
     * Re-balances the columns in a row when a new column is added.
     *
     * @since 1.0.0
     *
     * @param model
     * @param collection
     * @param options
     */
	onAdd : function( model, collection, options ) {

	    //console.log( '\n Added ' + model.get( 'id' ) + ' at ' + model.get( 'order' ) );

		if ( 'tailor_column' == model.get( 'tag' ) && options.rebalance ) {
			this._reBalanceColumns( this.get( model.get( 'parent' ) ) );
		}
    },

    /**
     * Performs checks on the parent when an element is deleted.
     *
     * @since 1.0.0
     *
     * @param model
     */
	onDestroy : function( model ) {
		var parent = this.get( model.get( 'parent' ) );

        //console.log( '\n Destroyed ' + model.get( 'id' ) );

		this._checkParent( parent );
        var children = this.where( { parent : model.get( 'id' ) } );

        if ( children.length ) {

            // Remove any children of the destroyed element
            _.each( children, function( child ) {
                child.trigger( 'destroy', child, this );
            }, this );
        }

        if ( parent && 'tailor_column' === model.get( 'tag' ) ) {
            this._reBalanceColumns( parent );
        }

        if ( 0 === this.length ) {
            this.onEmpty();
        }
	},

    /**
     * Ensures that the default section/content element is displayed if the canvas is empty following a reset.
     *
     * @since 1.0.0
     */
    onReset : function() {
        if ( 0 === this.length ) {
            this.onEmpty();
        }
    },

    /**
     * Populates the element collection with an empty text element inside a section.
     *
     * @since 1.0.0
     */
    onEmpty : function() {
        var section = this.createSection( 0 );

        this.create( [ {
            tag : 'tailor_content',
            atts : {},
            parent : section.get( 'id' ),
            order : 0
        } ] );
    },

    /**
     * Updates the parent reference for children of a collapsed element.
     *
     * @since 1.0.0
     *
     * @param model
     * @param children
     */
    onCollapse : function( model, children ) {
        var parentId = model.get( 'parent' );

        _.each( children, function( child ) {
            child.set( 'parent', parentId );
        }, this );
    },

    /**
     * Re-balances the columns in a given row.
     *
     * @since 1.0.0
     *
     * @param model
     */
    _reBalanceColumns : function( model ) {
        var children = this.where( { parent : model.get( 'id' ) } );
        var numberChildren = children.length;

        _.each( children, function( child ) {
            var atts = _.clone( child.get( 'atts' ) );
            atts.width = 12 / numberChildren;

            child.set( 'atts', atts, { silent : true } );
            child.trigger( 'change:width', model, atts.width );
        }, this );
    },

    /**
     * Performs checks on the previous parent when an element changes parent.
     *
     * @since 1.0.0
     *
     * @param model
     */
	_checkParent : function( model ) {
        if ( ! model ) {
            return;
        }
        if ( 'container' == model.get( 'type' ) ) {
            this._checkCollapsibleContainer( model );
        }
        this._checkChildren( model );
	},

    /**
     * Checks whether a collapsible container is still valid.
     *
     * @since 1.0.0
     *
     * @param model
     * @private
     */
    _checkCollapsibleContainer : function( model ) {
        var childTag = this.getElementDefinitions().findWhere( { tag : model.get( 'tag' ) } ).get( 'child' ) ;
        var containerId = model.get( 'id' );
        var children = this.filter( function( element ) {
            return containerId === element.get( 'parent' ) && childTag === element.get( 'tag' );
        } );

        // Collapse the container
        if ( 0 === children.length ) {
            model.trigger( 'container:collapse', model, this.where( { parent : containerId } ) );
        }

        // Collapse the only remaining column
        else if ( 1 === children.length ) {
	        var child = _.first( children );
            
            if ( 'tailor_row' === model.get( 'tag' ) ) {
                child.trigger( 'container:collapse', child, this.where( { parent : child.get( 'id' ) } ) );
            }
        }
    },

    /**
     * Destroys a container element if it is empty.
     *
     * @since 1.0.0
     *
     * @param model
     * @private
     */
	_checkChildren : function( model ) {
		var children = this.where( { parent : model.get( 'id' ) } );
		if ( 0 === children.length ) {
			model.trigger( 'destroy', model );
		}
	},

    /**
     * Creates and returns an element model.
     *
     * @since 1.0.0
     *
     * @param models
     * @param options
     * @returns {*}
     */
    create : function( models, options ) {
        options = options || {};

        if (_.isArray( models ) ) {
            models = _.each( models, this.applyDefaults, this );
        }
        else {
            models = this.applyDefaults( models );
        }

        return this.add( models, options );
    },

	/**
	 * Returns the library collection.
	 *
	 * @since 1.0.0
	 *
	 * @returns {*}
	 */
    getElementDefinitions : function() {
          return this.library || app.channel.request( 'sidebar:library' );
    },

    /**
     * Applies default values to the element model.
     *
     * @since 1.0.0
     *
     * @param model
     * @returns {*}
     */
    applyDefaults : function( model ) {
        var item = this.getElementDefinitions().findWhere( { tag : model.tag } );
        var label = item.get( 'label' );
        var defaults = {
            label : item.get( 'label' ),
            type : item.get( 'type' ),
            child : item.get( 'child' )
        };

        model.atts = model.atts || {};

        _.each( item.get( 'settings' ), function( setting ) {
            model.atts[ setting['id'] ] = model.atts[ setting['id'] ] || setting['value'];
        }, this );

        return _.extend( model, defaults );
    },

    /**
     * Creates and returns a new section.
     *
     * @since 1.0.0
     *
     * @param order
     * @returns {*}
     */
    createSection : function( order ) {
        return _.first( this.create( [ {
            tag : 'tailor_section',
            label : this.getElementDefinitions().findWhere( { tag : 'tailor_section' } ).get( 'label' ),
            order : order
        } ], {
            at : order
        } ) );
    },

    /**
     * Creates a new row/column layout based on a parent ID and order and returns the two resulting column models.
     *
     * @since 1.0.0
     *
     * @param parentId
     * @param order
     * @returns {*}
     */
    createRow : function( parentId, order ) {
        var row = _.first( this.create( [ {
            tag : 'tailor_row',
            parent : parentId,
            order : order
        } ], {} ) );

	    //console.log( '\n Created row ' + row.get( 'id' ) + ' at ' + order );

        return this.create( [ {
            tag : 'tailor_column',
            atts : { width : 6 },
            parent : row.get( 'id' ),
            order : 0
        }, {
            tag : 'tailor_column',
            atts : { width : 6 },
            parent : row.get( 'id' ),
            order : 1
        } ] );
    },

    /**
     * Creates and returns a new column.
     *
     * @since 1.0.0
     *
     * @param parentId
     * @param order
     * @returns {*}
     */
    createColumn : function( parentId, order ) {
        var columns = this.where( { parent : parentId } );
        return _.first( this.create( [ {
			tag : 'tailor_column',
			atts : { width : ( 12 / ( columns.length + 1 ) ) },
			parent : parentId,
			order : order
		} ], {
			rebalance : true
		} ) );

	    //console.log( '\n Created column ' + column.get( 'id' ) + ' at ' + order );
    },

    /**
     * Inserts a child into the specified parent.
     *
     * @since 1.0.0
     *
     * @param child
     * @param parent
     */
    insertChild : function( child, parent ) {

        if ( ! child ) {
            return;
        }

        if ( child.get( 'parent' ) !== parent.get( 'id' ) ) {
            child.trigger( 'remove:child' );
        }

        parent.trigger( 'insert', child );
        child.trigger( 'add:child' );

        child.set( 'parent', parent.get( 'id' ) );
    },

	/**
	 * Creates a new container.
     *
     * @since 1.0.0
     *
     * @param model
     * @param parentId
     * @param order
     * @param descendants
     */
    createContainer : function( model, parentId, order, descendants ) {
        var tag = model.get( 'tag' );
        var container = _.first( this.create( [ {
            tag : tag,
            parent : parentId,
            order : order
        } ], {
            at : order,
            silent : true
        } ) );

        var childTag = model.get( 'child' );
        var childLabel = this.getElementDefinitions().findWhere( { tag : childTag } ).get( 'label' );
        var children = this.create( [ {
            tag : childTag,
            label : childLabel,
            atts : {},
            parent : container.get( 'id' ),
            order : 0
        }, {
            tag : childTag,
            label : childLabel,
            atts : {},
            parent : container.get( 'id' ),
            order : 1

        } ], {
            silent : true
        } );

        if ( descendants ) {
            _.first( descendants ).set( 'parent', _.first( children ).get( 'id' ), { silent : true } );
            _.last( descendants ).set( 'parent', _.last( children ).get( 'id' ), { silent : true } );
        }

        this.trigger( 'add', container, this, {} );
    },

	/**
     * Creates and returns a new wrapper element.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param parentId
     * @param order
     * @param child
     * @returns {*}
     */
    createWrapper : function( tag, parentId, order, child ) {
        var wrapper = _.first( this.create( [ {
            tag : tag,
            parent : parentId,
            order : order
        } ], {
            silent : true
        } ) );

        if ( 'undefined' == typeof child ) {
            this.create( [ {
                tag : 'tailor_content',
                atts : {},
                parent : wrapper.get( 'id' ),
                order : 0
            } ], {
                silent : true
            } )
        }

        this.trigger( 'add', wrapper, this, {} );

        if ( 'undefined' != typeof child ) {
            this.insertChild( child, wrapper );
        }

        return wrapper;
    }

} );

module.exports = ElementCollection;

},{}],28:[function(require,module,exports){
var ChildModel = require( './../element-child' ),
    ColumnModel;

ColumnModel = ChildModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( _.contains( [ 'tailor_section', 'tailor_row' ], that.get( 'tag' ) ) || ! _.contains( [ 'left', 'right' ], region ) ) {
            return false;
        }
        if ( 'child' == that.get( 'type' ) && that.get( 'tag' ) != this.get( 'tag' ) ) {
            return false;
        }

        var siblings = this.collection.getSiblings( this );

        return that.get( 'parent' ) == this.get( 'parent' ) || siblings.length < 4;
    }

} );

module.exports = ColumnModel;
},{"./../element-child":34}],29:[function(require,module,exports){
var ChildModel = require( './../element-child' ),
    GridItemModel;

GridItemModel = ChildModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'tailor_section' == that.get( 'tag' ) || _.contains( [ 'top', 'bottom', 'center' ], region ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( parent.get( 'tag' ) == that.get( 'tag' ) ) {
            return false;
        }

        return that.get( 'tag' ) == this.get( 'tag' );
    }

} );

module.exports = GridItemModel;
},{"./../element-child":34}],30:[function(require,module,exports){
var ContainerModel = require( './../element-container' ),
	CarouselModel;

CarouselModel = ContainerModel.extend( {

    /**
     * Creates a new template based on the element.
     *
     * @since 1.0.0
     *
     * @param id
     * @param view
     */
    createTemplate : function( id, view ) {
        var isEditing =  view.el.classList.contains( 'is-editing' );

        this.beforeCopyElement( view );

        var $childViewContainer = view.getChildViewContainer( view );
        var $children = $childViewContainer.contents().detach();
        var $navigation = view.$el.find( '.slick-dots' ).detach();

        this.appendTemplate( id, view );

        $childViewContainer.append( $children );
	    $navigation.insertAfter( $childViewContainer );

        this.afterCopyElement( id, view );

        if ( isEditing ) {
            view.el.classList.add( 'is-editing' );
        }
    }

} );

module.exports = CarouselModel;
},{"./../element-container":36}],31:[function(require,module,exports){
var ContainerModel = require( './../element-container' ),
    RowModel;

RowModel = ContainerModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || 'tailor_section' == that.get( 'tag' ) || 'center' == region ) {
            return false;
        }

        return _.contains( [ 'top', 'bottom' ], region ) && 'tailor_column' != that.get( 'tag' );
    }

} );

module.exports = RowModel;
},{"./../element-container":36}],32:[function(require,module,exports){
var ContainerModel = require( './../element-container' ),
    TabsModel;

TabsModel = ContainerModel.extend( {

	/**
	 * Creates a new template based on the element.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );

		this.beforeCopyElement( view );

		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();
		var $navigation = view.$el.find( '.tailor-tabs__navigation' );
		var $navigationItems = $navigation.children().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );
		$navigation.append( $navigationItems );

		this.afterCopyElement( id, view );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = TabsModel;
},{"./../element-container":36}],33:[function(require,module,exports){
var Model;

/**
 * Wrap `model.set()` and update the internal unsaved changes record keeping.
 *
 * @since 1.0.0
 */
Backbone.Model.prototype.set = _.wrap( Backbone.Model.prototype.set, function( oldSet, key, val, options ) {

    if ( key == null ) return this;

    var attrs;

    if ( typeof key === 'object' ) {
        attrs = key;
        options = val;
    }
    else {
        ( attrs = {} )[ key ] = val;
    }

    options || ( options = {} );

    var ret = oldSet.call( this, attrs, options );

    if ( this._tracking ) {
        _.each( attrs, _.bind( function( val, key ) {
            if ( _.isEqual( this._original[ key ], val ) ) {
                delete this._unsaved[ key ];
            }
            else {
                this._unsaved[ key ] = val;
            }
        }, this ) );
    }

    return ret;

} );

/**
 * Modified implementation of Backbone.trackit
 *
 * @since 1.0.0
 *
 * https://github.com/NYTimes/backbone.trackit
 */
Model = Backbone.Model.extend( {
    _tracking : false,
    _original : {},
    _unsaved: {},

    /**
     * Returns an object containing the default parameters for an element.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {
        return {
            id : this.cid,
            tag : '',
            label : '',
            atts : {},
            parent : '',
            order : 0,
            collection : 'element'
        };
    },

	/**
	 * Returns true if the model is tracking changes.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    isTracking : function() {
        return this._tracking;
    },

    /**
     * Opt in to tracking attribute changes between saves.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    startTracking : function() {
        this._tracking = true;
        this.resetTracking();

        return this;
    },

    /**
     * Resets the default tracking values and stops tracking attribute changes.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    stopTracking : function() {
        this._tracking = false;
        this._original = {};
        this._unsaved = {};

        return this;
    },

    /**
     * Gets rid of accrued changes and resets state.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    resetTracking : function() {
        this._original = _.clone( this.attributes );
        this._unsaved = {};

        return this;
    },

    /**
     * Restores this model's attributes to their original values since tracking started.
     *
     * @since 1.0.0
     *
     * @returns {Backbone.Model}
     */
    resetAttributes: function() {
        if ( ! this._tracking ) { return; }
        this.attributes = this._original;
        this.resetTracking();

        this.trigger( 'change:atts', this, this.get( 'atts' ) );

        return this;
    },

    /**
     * Returns a text shortcode representing the element.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    toShortcode : function() {
        var tag = this.get( 'tag' );
        var atts = this.get( 'atts' );
        var content = '';
        var shortcode = '[' + tag;

        _.each( atts, function( attr, id ) {
	        if ( attr ) {
		        if ( 'content' === id ) {
			        content = attr;
		        }
		        else {

			        if ( _.isNumber( id ) ) {
				        if ( /\s/.test( attr ) ) {
					        shortcode += ' "' + attr + '"';
				        }
				        else {
					        shortcode += ' ' + attr;
				        }
			        }
			        else {
				        shortcode += ' ' + id + '="' + attr + '"';
			        }
		        }
	        }

        }, this );

        return shortcode + ']' + content + '[/' + tag + ']';
    },

    /**
     * Inserts the element before the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.trigger( 'remove:child' );
        this.trigger( 'insert:before', view );
        this.trigger( 'add:child' );

        this.set( 'parent', view.model.get( 'parent' ) );
    },

    /**
     * Inserts the element after the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.trigger( 'remove:child' );
        this.trigger( 'insert:after', view );
        this.trigger( 'add:child' );

        this.set( 'parent', view.model.get( 'parent' ) );
    },

    /**
     * Inserts the element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var model = view.model;
        var parent = model.get( 'parent' );

        if ( 'tailor_column' === model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, model.get( 'order' ) - 1 );
            this.collection.insertChild( this, column );
        }
        else {
            var columns = this.collection.createRow( parent, model.get( 'order' ) );
            this.collection.insertChild( this, _.first( columns ) );
            this.collection.insertChild( model, _.last( columns ) );
        }
    },

    /**
     * Inserts the element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var model = view.model;
        var parent = model.get( 'parent' );

        if ( 'tailor_column' === model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, ( model.get( 'order' ) ) );
            this.collection.insertChild( this, column );
        }
        else {
            var columns = this.collection.createRow( parent, model.get( 'order' ) );
            this.collection.insertChild( model, _.first( columns ) );
            this.collection.insertChild( this, _.last( columns ) );
        }
    },

	/**
	 * Triggers events before the element has been copied.
	 *
	 * @since 1.0.0
	 *
	 * @param view
	 */
	beforeCopyElement : function( view ) {
		var el = view.el;

		view.triggerAll( 'before:element:copy', view );

		el.classList.remove( 'is-dragging' );
		el.classList.remove( 'is-hovering' );
		el.classList.remove( 'is-selected' );
		el.classList.remove( 'is-editing' );
	},

	/**
	 * Appends a template based on the element to the page.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	appendTemplate : function( id, view ) {
		var oldId = view.model.get( 'id' );
		var template = document.createElement( 'script' );

		template.setAttribute( 'type', 'text/html' );
		template.id = 'tmpl-tailor-' + id;
		template.innerHTML = view.el.outerHTML.replace( oldId, id );

		document.body.appendChild( template );
	},

	/**
	 * Triggers events after the element has been copied.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	afterCopyElement : function( id, view ) {
		var oldId = view.model.get( 'id' );
		
		/**
		 * Fires after the element has been copied.
		 *
		 * @since 1.0.0
		 */
		view.$el.trigger( 'element:copy', view );

		/**
		 * Fires after an element has been copied.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'css:copy', oldId, id );
	}

} );

module.exports = Model;

},{}],34:[function(require,module,exports){
var CompositeModel = require( './element-composite' ),
    ChildModel;

ChildModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'tailor_section' == that.get( 'tag' ) || _.contains( [ 'left', 'right', 'center' ], region ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( parent.get( 'tag' ) == that.get( 'tag' ) ) {
            return false;
        }

        return that.get( 'tag' ) == this.get( 'tag' );
    },

    /**
     * Initializes the tabs model.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'element:move:top', this.insertBefore );
        this.listenTo( this, 'element:move:bottom', this.insertAfter );
        this.listenTo( this, 'element:move:left', this.insertBefore ); // Column
        this.listenTo( this, 'element:move:right', this.insertAfter ); // Column

        this.listenTo( this, 'element:copy:top', this.copyBefore );
        this.listenTo( this, 'element:copy:bottom', this.copyAfter );
        this.listenTo( this, 'element:copy:left', this.copyBefore ); // Column
        this.listenTo( this, 'element:copy:right', this.copyAfter ); // Column
    }

} );

module.exports = ChildModel;
},{"./element-composite":35}],35:[function(require,module,exports){
var BaseModel = require( './element-base' ),
    CompositeModel;

CompositeModel = BaseModel.extend( {

    /**
     * Clones the element and its child elements.
     *
     * @since 1.0.0
     *
     * @param sourceView
     * @param parent
     * @param index
     */
    cloneContainer : function( sourceView, parent, index ) {
        var collection = this.collection;
        var clone = sourceView.model.clone();

        clone.set( 'id', clone.cid );
        clone.set( 'parent', parent );
        clone.set( 'order', index );

        this.createTemplate( clone.cid, sourceView );

        var clonedChildren = this.cloneChildren( sourceView.children, clone, [] );

        collection.add( clonedChildren, { silent : true } );
        collection.add( clone );

	    /**
	     * Fires after the element has been copied.
	     *
	     * @since 1.0.0
	     */
        sourceView.triggerMethod( 'element:refresh' );
    },

    /**
     * Clones all children of a given element.
     *
     * @since 1.0.0
     *
     * @param childViews
     * @param parent
     * @param clones
     * @returns {*}
     */
    cloneChildren : function( childViews, parent, clones ) {
        if ( childViews.length ) {
            childViews.each( function( childView ) {
                var clone = childView.model.clone();
                clone.set( 'id', clone.cid );
                clone.set( 'parent', parent.get( 'id' ) );

                clone.createTemplate( clone.cid, childView );
                clones.push( clone );

                if ( childView.children ) {
                    this.cloneChildren( childView.children, clone, clones );
                }

            }, this );
        }

        return clones;
    },

    /**
     * Copies the source element and inserts it before the target element.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyBefore : function( targetView, sourceView ) {
        this.cloneContainer( sourceView, targetView.model.get( 'parent' ), targetView.model.get( 'order' ) - 1 );
    },

    /**
     * Copies the source element and inserts it after the target element.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyAfter : function( targetView, sourceView ) {
        this.cloneContainer( sourceView, targetView.model.get( 'parent' ), targetView.model.get( 'order' ) );
    },

    /**
     * Copies the source element and inserts it before the target element in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyColumnBefore : function( targetView, sourceView ) {
        var parent = targetView.model.get( 'parent' );

        if ( 'tailor_column' === targetView.model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, targetView.model.get( 'order' ) - 1 );
            this.cloneContainer( sourceView, column.get( 'id' ), 0 );
        }
        else {
            var columns = this.collection.createRow( parent, targetView.model.get( 'order' ) );
            this.collection.insertChild( targetView.model, _.last( columns ) );
            this.cloneContainer( sourceView, _.first( columns ).get( 'id' ), 0 );
        }

    },

    /**
     * Copies the source element and inserts it after the target element in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyColumnAfter : function( targetView, sourceView ) {
        var parent = targetView.model.get( 'parent' );

        if ( 'tailor_column' === targetView.model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, targetView.model.get( 'order' ) );
            this.cloneContainer( sourceView, column.get( 'id' ), 0 );
        }
        else {
            var columns = this.collection.createRow( parent, targetView.model.get( 'order' ) );
            this.collection.insertChild( targetView.model, _.first( columns ) );
            this.cloneContainer( sourceView, _.last( columns ).get( 'id' ), 0 );
        }
    },

	/**
	 * Creates a new template based on the element.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );

		this.beforeCopyElement( view );

		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );

		this.afterCopyElement( id, view );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = CompositeModel;
},{"./element-base":33}],36:[function(require,module,exports){
var CompositeModel = require( './element-composite' ),
    ContainerModel;

ContainerModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( 'tailor_row' == that.get( 'tag' ) ) {
            return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
        }
        if ( 'center' == region ) {
            return 'container' != that.get( 'type' );
        }
        if ( _.contains( [ 'wrapper', 'child' ], parent.get( 'type' ) ) ) {

            if ( _.contains( [ 'top', 'bottom' ], region ) ) {
                return _.contains( [ 'tailor_section', 'tailor_column' ], parent.get( 'tag' ) ) || ! _.contains( [ 'container', 'wrapper', 'child' ], that.get( 'type' ) );
            }

            return 'tailor_section' == parent.get( 'tag' ) || ! _.contains( [ 'left', 'right' ], region );
        }

        return 'container' != that.get( 'type' );
    },

    /**
     * Initializes the tabs model.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'element:move:top', this.insertBefore );
        this.listenTo( this, 'element:move:bottom', this.insertAfter );
        this.listenTo( this, 'element:move:left', this.columnBefore );
        this.listenTo( this, 'element:move:right', this.columnAfter );

        this.listenTo( this, 'element:copy:top', this.copyBefore );
        this.listenTo( this, 'element:copy:bottom', this.copyAfter );
        this.listenTo( this, 'element:copy:left', this.copyColumnBefore );
        this.listenTo( this, 'element:copy:right', this.copyColumnAfter );
    }

} );

module.exports = ContainerModel;
},{"./element-composite":35}],37:[function(require,module,exports){
var CompositeModel = require( './element-composite' ),
    WrapperModel;

WrapperModel = CompositeModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) || 'center' == region ) {
            return false;
        }

        var parent = this.collection.getParent( this );
        if ( 'tailor_row' == that.get( 'tag' ) ) {
            return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
        }
        if ( 'child' == parent.get( 'type' ) && 'tailor_column' != parent.get( 'tag' ) ) {
            return 'container' != that.get( 'type' ) && ! _.contains( [ 'left', 'right' ], region );
        }
        if ( _.contains( [ 'container', 'wrapper', 'child' ], parent.get( 'type' ) ) ) {
            return 'tailor_section' == parent.get( 'tag' ) || ! _.contains( [ 'left', 'right' ], region );
        }

        return true;
    },

    /**
     * Initializes the tabs model.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'element:move:top', this.insertBefore );
        this.listenTo( this, 'element:move:bottom', this.insertAfter );
        this.listenTo( this, 'element:move:left', this.columnBefore );
        this.listenTo( this, 'element:move:right', this.columnAfter );

        this.listenTo( this, 'element:copy:top', this.copyBefore );
        this.listenTo( this, 'element:copy:bottom', this.copyAfter );
        this.listenTo( this, 'element:copy:left', this.copyColumnBefore );
        this.listenTo( this, 'element:copy:right', this.copyColumnAfter );

        this.listenTo( this, 'element:move:center', this.createChild );
        this.listenTo( this, 'element:copy:center', this.copyChild );
    },

    /**
     * Inserts the source element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    createChild : function( targetView, sourceView ) {
        var id = targetView.model.get( 'id' );
        var childTag = targetView.model.get( 'child' );
        var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;

        this.createTemplate( sourceView.model.get( 'id' ), sourceView );
        this.collection.createWrapper( childTag, id, numberChildren, sourceView.model );
    },

    /**
     * Copies the source element and inserts it inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyChild : function( targetView, sourceView ) {
        var id = targetView.model.get( 'id' );
        var childTag = targetView.model.get( 'child' );
        var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;
        var wrapper = this.collection.createWrapper( childTag, id, numberChildren, false );

        this.cloneContainer( sourceView, wrapper.get( 'id' ), 0 );
    }

} );

module.exports = WrapperModel;
},{"./element-composite":35}],38:[function(require,module,exports){
var BaseModel = require( './element-base' ),
	ElementModel;

ElementModel = BaseModel.extend( {

	/**
	 * Returns true if this element is a valid drop target.
	 *
	 * @since 1.0.0
	 *
	 * @param that The element being dragged
	 * @param region The region of this element that the other element is over
	 * @param threshold The distance to the closest edge, if applicable
	 */
	validTarget : function( that, region, threshold ) {

		if ( threshold < 20 ) {
			return false;
		}
		
		if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) || 'center' == region ) {
			return false;
		}

		var parent = this.collection.getParent( this );
		if ( 'tailor_row' == that.get( 'tag' ) ) {
			return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
		}

		if ( 'child' == parent.get( 'type' ) && 'tailor_column' != parent.get( 'tag' ) ) {
			return 'container' != that.get( 'type' ) && ! _.contains( [ 'left', 'right' ], region );
		}

		if ( _.contains( [ 'wrapper', 'child' ], parent.get( 'type' ) ) ) {
			if ( _.contains( [ 'top', 'bottom' ], region ) ) {
				return _.contains( [ 'tailor_section', 'tailor_column' ], parent.get( 'tag' ) ) || ! _.contains( [ 'container', 'wrapper', 'child' ], that.get( 'type' ) );
			}

			return 'tailor_section' == parent.get( 'tag' ) || ! _.contains( [ 'left', 'right' ], region );
		}

		return true;
	},

	/**
	 * Initializes the element model.
	 *
	 * @since 1.0.0
	 */
	initialize : function() {
		this.addEventListeners();
	},

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
	addEventListeners : function() {
		this.listenTo( this, 'element:move:top', this.insertBefore );
		this.listenTo( this, 'element:move:bottom', this.insertAfter );
		this.listenTo( this, 'element:move:left', this.columnBefore );
		this.listenTo( this, 'element:move:right', this.columnAfter );

		this.listenTo( this, 'element:copy:top', this.copyBefore );
		this.listenTo( this, 'element:copy:bottom', this.copyAfter );
		this.listenTo( this, 'element:copy:left', this.copyColumnBefore );
		this.listenTo( this, 'element:copy:right', this.copyColumnAfter );

		this.listenTo( this, 'element:move:center', this.createChild );
		this.listenTo( this, 'element:copy:center', this.copyChild );
	},

	/**
	 * Copies the source element and inserts it before the target element.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyBefore : function( targetView, sourceView ) {
		var clone = sourceView.model.clone();
		var index = targetView.model.get( 'order' ) - 1;

		clone.set( 'id', clone.cid );
		clone.set( 'parent', targetView.model.get( 'parent' ) );//, { silent : true } );
		clone.set( 'order', index );//, { silent : true } );

		this.createTemplate( clone.cid, sourceView );
		this.collection.add( clone );//, { at : index } );
	},

	/**
	 * Copies the source element and inserts it after the target element.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyAfter : function( targetView, sourceView ) {
		var clone = sourceView.model.clone();
		var index = targetView.model.get( 'order' );

		clone.set( 'id', clone.cid );
		clone.set( 'parent', targetView.model.get( 'parent' ) );//, { silent : true } );
		clone.set( 'order', index );//, { silent : true } );

		this.createTemplate( clone.cid, sourceView );

		this.collection.add( clone );//, { at : index } );
	},

	/**
	 * Copies the source element and inserts it before the target element in a row/column layout.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyColumnBefore : function( targetView, sourceView ) {
		var model = targetView.model;
		var clone = sourceView.model.clone();

		clone.set( 'id', clone.cid );

		this.createTemplate( clone.cid, sourceView );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			var column = this.collection.createColumn( model.get( 'parent' ),  model.get( 'order' ) - 1 );

			clone.set( 'parent', column.get( 'id' ) );
			this.collection.add( clone );
		}
		else {
			var columns = this.collection.createRow( model.get( 'parent' ), model.get( 'order' ) );
			this.collection.insertChild( model, _.last( columns ) );

			clone.set( 'parent', _.first( columns ).get( 'id' ) );
			this.collection.add( clone );
		}
	},

	/**
	 * Copies the source element and inserts it after the target element in a row/column layout.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyColumnAfter : function( targetView, sourceView ) {
		var model = targetView.model;
		var clone = sourceView.model.clone();

		clone.set( 'id', clone.cid );

		this.createTemplate( clone.cid, sourceView );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			var column = this.collection.createColumn( model.get( 'parent' ), model.get( 'order' ) );

			clone.set( 'parent', column.get( 'id' ) );
			this.collection.add( clone );
		}
		else {
			var columns = this.collection.createRow( model.get( 'parent' ), model.get( 'order' ) );

			this.collection.insertChild( model, _.first( columns ) );
			clone.set( 'parent', _.last( columns ).get( 'id' ) );
			this.collection.add( clone );
		}
	},

	/**
	 * Inserts the source element inside a new child element in the target view.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	createChild : function( targetView, sourceView ) {
		var id = targetView.model.get( 'id' );
		var childTag = targetView.model.get( 'child' );
		var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;

		this.appendTemplate( sourceView.model.get( 'id' ), sourceView );
		this.collection.createWrapper( childTag, id, numberChildren, sourceView.model );
	},

	/**
	 * Copies the source element and inserts it inside a new child element in the target view.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyChild : function( targetView, sourceView ) {
		var id = targetView.model.get( 'id' );
		var childTag = targetView.model.get( 'child' );
		var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;
		var wrapper = this.collection.createWrapper( childTag, id, numberChildren, false );

		var clone = sourceView.model.clone();
		clone.set( 'id', clone.cid );
		clone.set( 'parent', wrapper.get( 'id' ) );
		clone.set( 'order', 0 );

		this.createTemplate( clone.cid, sourceView );
		this.collection.add( clone );
	},

	/**
	 * Creates a new element template based on a given element and appends it to the page.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );

		this.beforeCopyElement( view );
		this.appendTemplate( id, view );
		this.afterCopyElement( id, view );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = ElementModel;
},{"./element-base":33}],39:[function(require,module,exports){
var WrapperModel = require( './../element-wrapper' ),
    SectionModel;

SectionModel = WrapperModel.extend( {

    /**
     * Returns true if this element is a valid drop target.
     *
     * @since 1.0.0
     *
     * @param that The element being dragged
     * @param region The region of this element that the other element is over
     */
    validTarget : function( that, region ) {
        return 'tailor_section' == that.get( 'tag' ) && ! _.contains( [ 'left', 'right', 'center' ], region );
    }

} );

module.exports = SectionModel;
},{"./../element-wrapper":37}],40:[function(require,module,exports){
var CanvasRegion = Backbone.Marionette.Region.extend( {

	/**
     * Initialize the canvas region.
     * 
     * @since 1.0.0
     */
    initialize : function() {
        this.listenTo( app.channel, 'canvas:dragstart', this.onDragStart );
        this.listenTo( app.channel, 'canvas:dragend', this.onDragEnd );
    },

    /**
     * Adds a class name to the canvas when dragging begins.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onDragStart : function( view, region, options ) {
        this.el.classList.add( 'is-active' );
    },

    /**
     * Removes a class name from the canvas when dragging ends.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onDragEnd : function( view, region, options ) {
        this.el.classList.remove( 'is-active' );
    }

} );

module.exports = CanvasRegion;
},{}],41:[function(require,module,exports){
var $ = Backbone.$,
    $win = $( window ),
    $doc = $( document ),
    CanvasCollectionView = require( './show/canvas-view' ),
    CanvasModule;

CanvasModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
		this._model = null;
		this._isDragging = false;
        this.collection = app.channel.request( 'canvas:elements' );

        this.addEventListeners();
        this.showCanvas();

        /**
         * Fires when the Canvas module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:canvas:ready', this );
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'canvas:dragstart', this.onDragStart );
        this.listenTo( app.channel, 'canvas:dragover', this.onDragOver );
        this.listenTo( app.channel, 'canvas:dragend', this.onDragEnd );
        this.listenTo( app.channel, 'canvas:drop', this.onDrop );

        $doc.on( 'click dragover', this.reset.bind( this ) );
        $win.on( 'resize', this.reset.bind( this ) );
    },

    /**
     * Displays elements on the canvas.
     *
     * @since 1.0.0
     */
    showCanvas : function() {
        app.canvasRegion.show( new CanvasCollectionView( {
            collection : this.collection
        } ) );
    },

    /**
     * Records information about the drag target when dragging begins.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragStart : function( e, view ) {
        var collection = view.model.collection;

        // Do nothing if this is an element with a selected parent
        if ( 'function' === typeof collection.hasSelectedParent && collection.hasSelectedParent( view.model ) ) {
            return;
        }

		this._view = view;
		this._model = view.model;
		this._isDragging = true;

        view.el.classList.add( 'is-dragging' );

        // Use an empty drag image for elements to improve performance
        if ( 'element' == view.model.get( 'collection' ) ) {
            var testVar = window.DataTransfer || window.Clipboard;
            if ( 'setDragImage' in testVar.prototype ) {
                var dragImage = document.createElement( 'img' );
                dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                e.dataTransfer.setDragImage( dragImage, 0, 0 );
            }
        }

        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData( 'Text', this._model.cid );

		e.stopPropagation();
	},

    /**
     * Validates the drop target and updates the insertion guide when the drag target is dragged over an element.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragOver : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

	    // Maybe scroll the window while dragging
	    if ( e.pageY ) {
		    var scrollY = window.scrollY || document.documentElement.scrollTop;
		    if ( ( e.pageY - scrollY ) < 40 ) {
			    window.scrollTo( 0, scrollY - 20 );
		    }
		    else if ( ( ( scrollY + window.innerHeight ) - e.pageY ) < 40 ) {
			    window.scrollTo( 0, scrollY + 20 );
		    }
	    }

        var action = ( 'element' === this._model.get( 'collection' ) && e.shiftKey ) ? 'copy' : 'move';

        if ( 'move' === action && view.model === this._model ) {
            this.reset();
            e.stopPropagation();
            return;
        }

        var region = this._getDropRegion( e, view );
        if ( ! view.model.validTarget( this._model, region ) ) {
            return;
        }

        e.dataTransfer.dropEffect = action;

        app.channel.trigger( 'canvas:guide', view, region );

        e.preventDefault();
        e.stopPropagation();
	},

    /**
     * Validates the drop target and updates the canvas the drag target is dropped on an element.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDrop : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

        var model = this._model;
        var region = this._getDropRegion( e, view );
        if ( ! view.model.validTarget( model, region ) ) {
            return;
        }

        var action;
        if ( 'element' === model.get( 'collection' ) ) {
           action = e.shiftKey ? 'copy' : 'move';
            if ( 'move' === action && view.model === model ) {
                return;
            }
        }
        else {
            action = 'add';
        }

        /**
         * Fires after an action has been taken on the canvas.
         *
         * @since 1.0.0
         */
        model.trigger( 'element:' + action + ':' + region, view, this._view );

        /**
         * Fires after an action has been taken on the canvas.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'element:' + action, model );

        this.collection.sort( { silent : true } );

        e.preventDefault();
        e.stopPropagation();
	},

    /**
     * Cleans up the canvas when dragging of the drag target ends.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragEnd : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

 		this._isDragging = false;
		this._view.el.classList.remove( 'is-dragging' );
        this.reset();

        //app.channel.trigger( 'debug' );
    },

    /**
     * Resets the canvas.
     *
     * @since 1.0.0
     */
    reset : function() {

        /**
         * Fires when the canvas is reset.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'canvas:reset' );
    },

    /**
     * Returns the current point (x,y coordinates).
     *
     * @since 1.0.0
     *
     * @param e
     * @returns {{x: (*|number|Number), y: (*|number|Number)}}
     * @private
     */
    _getPoint : function( e ) {
        if ( e.targetTouches ) { // Prefer Touch Events
            return {
                x : e.targetTouches[0].clientX,
                y : e.targetTouches[0].clientY
            };
        }
        return {
            x : e.clientX,
            y : e.clientY
        };
    },

    /**
     * Returns the region of the element currently occupied by the drag target (top, right, bottom, left, center).
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     * @returns string
     * @private
     */
    _getDropRegion : function( e, view ) {
        var point = this._getPoint( e );
        var rect = view.el.getBoundingClientRect();
        var width = rect.width / 2;
        var height = rect.height / 2;
        var top = rect.top + ( rect.height - height ) / 2;
        var left = rect.left + ( rect.width - width ) / 2;

        if (
            ( left <= point.x ) && ( point.x <= ( left + width ) ) &&
            ( top <= point.y ) && ( point.y <= ( top + height ) )
        ) {
            return 'center';
        }
        else {
            var x = ( point.x - ( rect.left + width ) ) / ( width );
            var y = ( point.y - ( rect.top + height ) ) / ( height );
            
            if ( Math.abs( x ) > Math.abs( y ) ) {
                return x > 0 ? 'right' : 'left';
            }
            return y > 0 ? 'bottom' : 'top';
        }
    }

} );

module.exports = CanvasModule;
},{"./show/canvas-view":42}],42:[function(require,module,exports){
module.exports = Marionette.CollectionView.extend( {

	behaviors : {
		Container : {}
	},

    /**
     * Returns the appropriate child view based on the element tag.
     *
     * @since 1.0.0
     *
     * @returns {*|exports|module.exports}
     */
    getChildView : function() {
        return Tailor.lookup( 'tailor_section', 'wrapper', 'Views' );
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend( {
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return ! child.get( 'parent' );
    },

    /**
     * Updated Marionette function : changed to update the 'order' attribute along with the view _index.
     *
     * @since 1.0.0
     *
     * @param view
     * @param increment
     * @param index
     * @private
     */
    _updateIndices : function( view, increment, index ) {

        if ( increment ) {
            view._index = index;

            //console.log( '\n Updated index of view ' + view.model.get( 'id' ) + ' to ' + index );

            view.model._changing = false;
            view.model.set( 'order', index );
        }

        this.children.each( function( laterView ) {
            if ( laterView._index >= view._index ) {
                laterView._index += increment ? 1 : -1;

                //console.log( '\n Updated index of view ' + laterView.model.get( 'id' ) + ' to ' + laterView._index );

                laterView.model.set( 'order', laterView._index );
            }
        }, this );
    },

    /**
     * Triggers events and methods during a given event in the lifecycle.
     *
     * @since 1.0.0
     *
     * @param event
     * @param view
     * @param atts
     */
    triggerAll : function( event, view, atts ) {
        this.$el.trigger( event, view );
        this.triggerMethod( event, view );

        if ( atts ) {
            app.channel.trigger( event, this, atts);
        }
        else {
            app.channel.trigger( event, this );
        }
    }

} );

},{}],43:[function(require,module,exports){
var Stylesheet = require( './stylesheet' ),
	CSSModule;

CSSModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function( options ) {
        this.stylesheets = [];
	    this.collection = app.channel.request( 'canvas:elements' );

        this.createSheets( options.mediaQueries || {} );
        this.addRules( options.cssRules || {} );
        this.addEventListeners();

	    /**
	     * Fires when the CSS module is initialized.
	     *
	     * @since 1.5.0
	     *
	     * @param this
	     */
	    app.channel.trigger( 'module:css:ready', this );
    },

	/**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'css:add', this.addRules );         // Add CSS for an element (or elements)
        this.listenTo( app.channel, 'css:update', this.updateRules );   // Update the CSS for a given element
		this.listenTo( app.channel, 'css:copy', this.copyRules );       // Copy the CSS for one element to another
		this.listenTo( app.channel, 'css:clear', this.clearRules );     // Delete all CSS in the stylesheet

		//this.listenTo( this.collection, 'reset', this.onReset );
		this.listenTo( this.collection, 'destroy', this.onDestroy );
	},

	/**
	 * Creates a new stylesheet.
	 *
	 * @since 1.5.0
	 * 
	 * @param id
	 * @param min
	 * @param max
	 * @returns {*}
	 */
	createSheet : function( id, min, max ) {
		var media = 'only screen';
		if ( min ) {
			media += ' and (min-width: ' + min + ')';
		}
		if ( max ) {
			media += ' and (max-width: ' + max + ')';
		}
		return new Stylesheet( id, media );
	},

	/**
	 * Creates a stylesheet for each registered media query.
	 *
	 * @since 1.0.0
	 *
	 * @param mediaQueries
	 */
	createSheets : function( mediaQueries ) {
		_.each( mediaQueries, function( atts, id ) {
			if ( ! _.isEmpty( atts.min ) ) {
				if ( ! _.isEmpty( atts.max ) ) {
					this.stylesheets[ id ] = this.createSheet( id, atts.min, atts.max );
					this.stylesheets[ id + '-up' ] = this.createSheet( id + '-up', atts.min );
				}
				else {
					this.stylesheets[ id ] = this.createSheet( id, atts.min );
				}
			}
			else  {
				if ( ! _.isEmpty( atts.max ) ) {
					this.stylesheets[ id ] = this.createSheet( id, null, atts.max );
				}
				else {
					this.stylesheets[ id ] = this.createSheet( id );
				}
			}
		}, this );

		/**
		 * Fires when stylesheets have been created.
		 *
		 * @since 1.5.0
		 *
		 * @param this
		 */
		app.channel.trigger( 'module:css:stylesheets:ready', this );
	},

	/**
	 * Returns the stylesheet with the given ID (media query type).
	 * 
	 * @since 1.5.0
	 * 
	 * @param id
	 */
	getSheet : function( id ) {
		if ( this.stylesheets.hasOwnProperty( id ) ) {
			return this.stylesheets[ id ];
		}
		return false;
	},

	/**
	 * Adds CSS rules for each registered media query.
	 *
	 * @since 1.0.0
	 *
	 * @param cssRules
	 */
    addRules : function( cssRules ) {
		for ( var queryId in cssRules ) {
			if ( cssRules.hasOwnProperty( queryId ) ) {
				if ( this.stylesheets.hasOwnProperty( queryId ) ) {
					this.stylesheets[ queryId ].addRules( cssRules[ queryId ] );
				}
			}
		}
    },

	/**
	 * Clears all dynamic CSS rules.
	 *
	 * @since 1.0.0
	 */
    clearRules : function() {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                this.stylesheets[ queryId ].clearRules();
            }
        }
    },

	/**
	 * Copies the CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param newElementId
	 */
    copyRules : function( elementId, newElementId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {

	            // Get rules for the existing element
	            var rules = this.stylesheets[ queryId ].getRules( elementId );

	            if ( rules.length ) {

		            // Update the selector strings
		            for ( var rule in rules ) {
			            if ( rules.hasOwnProperty( rule ) ) {
				            rules[ rule ].selectors = rules[ rule ].selectors.replace( new RegExp( elementId, "g" ), newElementId );
			            }
		            }

		            // Generate a new rule set and add them to the stylesheet
		            var rulesSet = {};
		            rulesSet[ queryId ] = {};
		            rulesSet[ queryId ][ newElementId ] = rules;
		            
		            this.addRules( rulesSet );
	            }
            }
        }
    },

	/**
	 * Deletes the CSS rules associated with a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param settingId
	 */
    deleteRules : function( elementId, settingId ) {
        for ( var queryId in this.stylesheets ) {
            if ( this.stylesheets.hasOwnProperty( queryId ) ) {
                this.stylesheets[ queryId ].deleteRules( elementId, settingId );
            }
        }
    },

	/**
	 * Replaces the CSS rules for a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param elementId
	 * @param cssRules
	 */
    updateRules : function( elementId, cssRules ) {
        this.deleteRules( elementId );
        this.addRules( cssRules );
	},

	/**
	 * Clears all rules for this stylesheet when the element collection is reset.
	 *
	 * @since 1.5.0
	 */
	onReset: function() {
		this.clearRules();
	},

	/**
	 * Deletes the rules associated with an element when it is destroyed.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 */
	onDestroy : function( model ) {
		this.deleteRules( model.get( 'id' ) );
	}

} );

module.exports = CSSModule;
},{"./stylesheet":44}],44:[function(require,module,exports){
/**
 * Stylesheet object for managing CSS.
 *
 * @param id
 * @param media
 * @constructor
 */
function Stylesheet( id, media ) {
    this.id = id;

    this.initialize( media );
}

Stylesheet.prototype = {

	/**
     * Initializes the stylesheet.
     *
     * @since 1.0.0
     *
     * @param media
     */
    initialize : function( media ) {
        this.stylesheet = this.createStylesheet( media );
        this.sheet = this.stylesheet.sheet;
		this.lookup = [];
	},

	/**
	 * Adds the stylesheet to the DOM.
	 *
	 * @since 1.0.0
	 *
	 * @param media
	 * @returns {Element}
	 */
    createStylesheet : function( media ) {
        var style = document.createElement( 'style' );
        style.appendChild( document.createTextNode( '' ) );

        media = media || 'screen';
        style.setAttribute( 'media', media );
        style.setAttribute( 'id', 'tailor-' + this.id );

        document.head.appendChild( style );
        return style;
    },

	/**
	 * Adds a set of CSS rules to the stylesheet.
	 *
	 * @since 1.5.0
	 *
	 * @param ruleSet
	 */
    addRules : function( ruleSet ) {
		for ( var elementId in ruleSet ) {
			if ( ruleSet.hasOwnProperty( elementId ) ) {

				this.lookup = this.lookup || [];

				// Add rules for each element
				for ( var rule in ruleSet[ elementId ] ) {

					// Check that the data is correctly formatted
					if (
						ruleSet[ elementId ].hasOwnProperty( rule ) &&
						_.has( ruleSet[ elementId ][ rule ], 'selectors' ) &&
						_.has( ruleSet[ elementId ][ rule ], 'declarations' ) &&
						_.has( ruleSet[ elementId ][ rule ], 'setting' )
					) {
						var selectorString = Tailor.CSS.parseSelectors( ruleSet[ elementId ][ rule ]['selectors'], elementId );
						var declarationString = Tailor.CSS.parseDeclarations( ruleSet[ elementId ][ rule ]['declarations'] );

						if ( ! _.isEmpty( declarationString ) ) {

							// Add the rule to the stylesheet
							Tailor.CSS.addRule(
								this.sheet,
								selectorString,
								declarationString,
								this.lookup.length
							);

							// Add rule data to the lookup array
							this.lookup.push( {
								elementId: elementId,
								settingId: ruleSet[ elementId ][ rule ]['setting']
							} );
						}
					}
				}
			}
		}
	},

	/**
	 * Gets the rules for a given element.
	 *
	 * @since 1.5.0
	 *
	 * @param elementId
	 * 
	 * @returns {Array}
	 */
	getRules : function( elementId ) {
		var rules = [];
		for ( var i = 0; i < this.lookup.length; i++ ) {
			if ( _.has( this.lookup[ i ], 'elementId' ) && elementId == this.lookup[ i ]['elementId'] ) {
				var rule = this.sheet.cssRules[ i ];
				if ( rule.selectorText && rule.selectorText.indexOf( elementId ) > -1 ) {
					rules.push( {
						selectors : rule.selectorText,
						declarations : rule.style.cssText,
						setting: this.lookup[ i ]['settingId'] || ''
					} );
				}
			}
		}
		return rules;
	},

	/**
	 * Deletes rules for a given element from the stylesheet.
	 *
	 * @since 1.5.0
	 *
	 * @param elementId
	 * @param settingId
	 */
    deleteRules : function( elementId, settingId ) {
		for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
			if ( _.has( this.lookup[ i ], 'elementId' ) && elementId == this.lookup[ i ]['elementId'] ) {

				if ( _.isEmpty( settingId ) ) {
					this.deleteRule( i );
					i--;
				}

				// Check the element and setting ID
				else {
					if ( _.has( this.lookup[ i ], 'settingId' ) && settingId == this.lookup[ i ]['settingId'] ) {
						this.deleteRule( i );
						i--;
					}
				}
			}
		}
	},

	/**
	 * Deletes a rule from the stylesheet.
	 * 
	 * @since 1.5.0
	 * 
	 * @param i
	 */
	deleteRule: function( i ) {
		Tailor.CSS.deleteRule( this.sheet, i );
		this.lookup.splice( i, 1 );
	},

	/**
	 * Deletes all rules from the stylesheet.
	 *
	 * @since 1.0.0
	 **/
    clearRules : function() {
		for ( var i = 0; i < this.sheet.cssRules.length; i++ ) {
			this.deleteRule( i );
			i--;
		}
		this.lookup = [];
    }
};

module.exports = Stylesheet;
},{}],45:[function(require,module,exports){
var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    ElementCollection = require( '../../entities/collections/elements' ),
    ElementModule;

ElementModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @param options
     */
	onBeforeStart : function( options ) {
        var module = this;

        this.collection = new ElementCollection( options.elements, { silent: false } );

        var api = {

            /**
             * Returns a given element if an ID is provided, otherwise the element collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getElements : function( id ) {
                if ( id ) {
                    return module.collection.findWhere( { id : id } );
                }
                return module.collection;
            },

            /**
             * Resets the element collection with an array of objects.
             *
             * New templates are created in a single request to the server before the collection is reset.
             *
             * @since 1.0.0
             *
             * @param models
             */
            resetElements : function( models ) {
                if ( models === module.collection.models ) {
                    return;
                }

                var canvas = app.canvasRegion.el;
                var templates;
                
                canvas.classList.add( 'is-loading' );
                
                window.ajax.send( 'tailor_reset', {
                    data : {
                        models : JSON.stringify( models ),
                        nonce : window._nonces.reset
                    },

                    /**
                     * Appends the element templates to the page.
                     *
                     * @since 1.0.0
                     *
                     * @param response
                     */
                    success : function( response ) {

                        // Update the model collection with the sanitized models
                        models = response.models;

                        // Record the template HTML and append it to the page
                        templates = response.templates;

                        $body.append( templates );
                        
                        /**
                         * Clears all existing dynamic CSS rules.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'css:clear' );

                        /**
                         * Adds new dynamic CSS rules.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'css:add', response.css );
                    },

                    /**
                     * Resets the collection with the given set of elements.
                     *
                     * @since 1.0.0
                     */
                    complete : function() {

                        if ( templates ) {

                            /**
                             * Fires before the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'before:elements:restore' );
                            app.channel.trigger( 'canvas:reset' );

                            module.collection.reset( null );
                            module.collection.reset( models );

                            /**
                             * Fires when the element collection is restored.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'elements:restore' );

                            $win.trigger( 'resize' );
                        }

                        canvas.classList.remove( 'is-loading' );
                    }
                } );
            }
        };

        app.channel.reply( 'canvas:elements', api.getElements );
        app.channel.on( 'elements:reset', api.resetElements );
    },

    /**
     * Initializes the module.
     */
    onStart : function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:elements:ready', this );
    }

} );

module.exports = ElementModule;
},{"../../entities/collections/elements":27}],46:[function(require,module,exports){
var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    TemplateModule;

TemplateModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     */
	onStart : function() {
        var module = this;

        this.collection = app.channel.request( 'canvas:elements' );

        var api = {

            /**
             * Loads a template by retrieving, sanitizing and inserting the associated models into the collection.
             *
             * @since 1.0.0
             *
             * @param model
             * @param parent
             * @param index
             */
            loadTemplate : function( model, parent, index ) {
                var models;
                var templates;
                var canvas = app.canvasRegion.el;
                
                canvas.classList.add( 'is-loading' );
                
                window.ajax.send( 'tailor_load_template', {
                    data : {
                        template_id : model.get( 'id' ),
                        nonce : window._nonces.loadTemplate
                    },

                    /**
                     * Appends the element templates to the page.
                     *
                     * @param response
                     */
                    success : function( response ) {

                        // Update the model collection with the sanitized models
                        models = response.models;

                        // Record the template HTML and append it to the page
                        templates = response.templates;

                        $body.append( templates );
                        
                        /**
                         * Adds new dynamic CSS rules.
                         *
                         * @since 1.0.0
                         */
                        app.channel.trigger( 'css:add', response.css );
                    },

                    /**
                     * Resets the collection with the given set of elements.
                     */
                    complete : function() {
                        if ( templates ) {
                            var parents = [];
                            var children = [];

                            _.each( models, function( model ) {
                                if ( '' == model.parent ) {
                                    parents.push( model );
                                }
                                else {
                                    children.push( model );
                                }
                            } );

                            module.collection.add( children, { silent : true } );

                            if ( parents.length > 1 ) {
                                module.collection.add( parents, { at : index + 1 } );
                            }
                            else {
                                parents[0].parent = parent;
                                parents[0].order = index;
                                module.collection.add( parents );
                            }

                            /**
                             * Fires when a template is added.
                             *
                             * @since 1.0.0
                             */
                            app.channel.trigger( 'template:add', model );

                            $win.trigger( 'resize' );
                        }

                        canvas.classList.remove( 'is-loading' );
                    }
                } );
            }
        };

        app.channel.on( 'template:load', api.loadTemplate );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:templates:ready', this );
    }

} );

module.exports = TemplateModule;
},{}],47:[function(require,module,exports){
var SelectRegion = Backbone.Marionette.Region.extend( {

    /**
     * Adds a class name to the underlying view when selected.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onShow : function( view, region, options ) {
        view._view.el.classList.add( 'is-selected' );
    },

    /**
     * Removes a class name from the underlying view when deselected.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onEmpty : function( view, region, options ) {
        view._view.el.classList.remove( 'is-selected' );
    }

} );

module.exports = SelectRegion;
},{}],48:[function(require,module,exports){
var GuideView = Marionette.ItemView.extend( {

	template : false,

	/**
     * Positions the insertion guide over a given element.
     *
     * @since 1.0.0
     *
     * @param view
     * @param drop
     */
    position : function( view, drop ) {
        var $el = view.$el;
        var offset = $el.offset();
        var parentOffset = this.$el.offsetParent().offset();

        this.el.style.visibility = 'visible';
        this.el.className = 'guide guide--' + drop + ' guide--' + view.model.get( 'tag' );
        this.el.style.left = offset.left - parentOffset.left + 'px';
        this.el.style.top = offset.top - parentOffset.top + 'px';
        this.el.style.width = $el.outerWidth() + 'px';
        this.el.style.height = $el.outerHeight() + 'px';
        this.el.style.opacity = 1;
    },

	/**
     * Resets the insertion guide.
     *
     * @since 1.0.0
     */
    reset : function() {
        this.el.style.visibility = 'hidden';
        this.el.style.opacity = 0;
    }

} );

module.exports = GuideView;
},{}],49:[function(require,module,exports){
var SelectMenuItemView = Marionette.ItemView.extend( {

    tagName : 'a',

	className : 'select__item',

	events : {
		'click' : 'onClick'
	},

	getTemplate : function() {
		return _.template( '<%= label %>' );
	},

	/**
	 * Toggles the breadcrumb list, or selects a breadcrumb.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	onClick : function( e ) {
		if ( 0 === this._index ) {

            /**
             * Toggles the breadcrumbs.
             *
             * @since 1.0.0
             */
			this.triggerMethod( 'toggle' );
		}
		else {

            /**
             * Triggers a select event on the model.
             *
             * @since 1.0.0
             */
			this.model.trigger( 'select' );
		}

		e.stopPropagation();
	}

} );

module.exports = SelectMenuItemView;
},{}],50:[function(require,module,exports){
var SelectMenuItemView = require( './select-menu-item' ),
    SelectMenuView;

SelectMenuView = Marionette.CompositeView.extend( {

    className : 'select',

	childView : SelectMenuItemView,

	childViewContainer : '.select__menu',

	ui : {
		'edit' : '.js-edit',
		'delete' : '.js-delete'
	},

    events : {
        'click @ui.edit' : 'editElement',
        'click @ui.delete' : 'deleteElement'
    },

    modelEvents : {
        'destroy' : 'destroy'
    },
    
    childEvents : {
		'toggle' : 'toggleMenu'
	},

    template : '#tmpl-tailor-tools-select',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.CompositeView.prototype.serializeData.apply( this, arguments );
        data.siblings = this.collection.where( { parent : this.model.get( 'parent' ) } ).length;
        return data;
    },

    /**
     * Initializes the selector.
     *
     * @since 1.0.0
     *
     * @param options
     */
	initialize : function( options ) {
        this._view = options.view;
    },

    /**
     * Filters the collection so that only ancestors of the target element are displayed in the menu.
     *
     * @since 1.0.0
     *
     * @returns {Array}
     * @private
     */
    _filteredSortedModels : function() {
        var models = [];
        var model = this.model;

        while ( 'undefined' !== typeof model ) {
            models.push( model );
            model = this.collection.get( model.get( 'parent' ) );
        }
        return models;
    },

    /**
     * Positions the selector over the target view.
     *
     * @since 1.0.0
     */
	onDomRefresh : function() {
        var thisRect = this.el.parentNode.getBoundingClientRect();
        var thatRect = this._view.el.getBoundingClientRect();

        this.el.style.top = thatRect.top - thisRect.top + 'px';
        this.el.style.left = thatRect.left - thisRect.left + 'px';
        this.el.style.width = thatRect.width + 'px';
        this.el.style.height = thatRect.height + 'px';
    },

    /**
     * Edits the target element.
     *
     * @since 1.0.0
     */
    editElement : function() {

        /**
         * Fires when the edit modal is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:open', this.model );
    },

    /**
     * Removes the target element.
     *
     * @since 1.0.0
     */
    deleteElement : function() {
        this.model.trigger( 'destroy', this.model );

        /**
         * Fires when an element is deleted.
         *
         * This is used by the History module instead of listening to the element collection, as the removal of
         * an element can have cascading effects (e.g., the removal of column and row structures) which should
         * not be tracked as steps.
         *
         * @since 1.0.0
         *
         * @param this.model
         */
        app.channel.trigger( 'element:delete', this.model );
    },

    /**
     * Toggles the menu.
     *
     * @since 1.0.0
     */
    toggleMenu : function() {
        this.$el.toggleClass( 'is-expanded' );
    }

} );

module.exports = SelectMenuView;
},{"./select-menu-item":49}],51:[function(require,module,exports){
var GuideView = require( './show/guide' ),
    SelectorView = require( './show/select-menu' ),
    ToolsModule;

ToolsModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        var guide = new GuideView( { el : '#guide' } ).render();
        var api = {

            /**
             * Shows and positions the insertion guide.
             *
             * @since 1.0.0
             *
             * @param view
             * @param drop
             */
            positionGuide : function( view, drop ) {
                guide.position( view, drop );
            },

            /**
             * Displays the element selector.
             *
             * @since 1.0.0
             *
             * @param view
             */
            selectElement : function( view ) {
                app.selectRegion.show(
                    new SelectorView( {
                        model : view.model,
                        collection : app.channel.request( 'canvas:elements' ),
                        view : view
                    } )
                );
            },

            /**
             * Resets the canvas.
             *
             * @since 1.0.0
             */
            resetGuide : function() {
                guide.reset();

                app.selectRegion.empty();
            },

            /**
             * Returns the currently selected element, if one exists.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getSelectedElement : function() {
                var select = app.selectRegion.currentView;
                return select ? select.model : null;
            }
        };

        this.listenTo( app.channel, 'canvas:guide', api.positionGuide );
        this.listenTo( app.channel, 'canvas:select', api.selectElement );
        this.listenTo( app.channel, 'canvas:reset', api.resetGuide );
        this.listenTo( app.channel, 'element:refresh:template', api.resetGuide );

        app.channel.reply( 'canvas:element:selected', api.getSelectedElement );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:tools:ready', this );
    }

} );

module.exports = ToolsModule;
},{"./show/guide":48,"./show/select-menu":50}],52:[function(require,module,exports){
var $ = Backbone.$,
	$win = $( window );

/**
 * Element behaviors.
 */
( function( app, SettingAPI, ElementAPI ) {

	ElementAPI.onRender( 'tailor_carousel', function( atts, model ) {
		var carousel = this;
		var options = {
			autoplay : '1' == atts.autoplay,
			arrows : '1' == atts.arrows,
			dots : false,
			fade : '1' == atts.fade && '1' == atts.items_per_row,
			slidesToShow : parseInt( atts.items_per_row, 10 ) || 1,
			adaptiveHeight : true
		};

		carousel.$el.tailorCarousel( options );

		SettingAPI.onChange( 'sidebar:_tailor_element_spacing', function( to, from ) {
			carousel.triggerAll( 'element:parent:change', carousel );
		} );
	} );

	ElementAPI.onRender( 'tailor_column', function( atts, model ) {
		var column = this;

		// Refreshes all child elements when the column spacing setting changes
		SettingAPI.onChange( 'sidebar:_tailor_column_spacing', function( to, from ) {
			column.triggerAll( 'element:parent:change', column );
		} );
	} );

	ElementAPI.onRender( 'tailor_content', function( atts, model ) {
		this.$el.tailorLightbox( {
			disableOn : function() {
				return $el.hasClass( 'is-selected' );
			}
		} );
	} );

	ElementAPI.onRender( 'tailor_gallery', function( atts, model ) {
		var $el = this.$el;
		var options;

		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				arrows : '1' == atts.arrows,
				dots : '1' == atts.dots,
				fade : ( '1' == atts.fade && '1' == atts.items_per_row ),
				infinite: false,
				slidesToShow : parseInt( atts.items_per_row, 10 ) || 2
			};

			$el.tailorSimpleCarousel( options ) ;
		}
		else if ( 'slideshow' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				arrows : '1' == atts.arrows,
				dots : false,
				fade : true,
				items : '.tailor-slideshow__slide',
				adaptiveHeight : true,
				draggable : false,
				speed : 250
			};

			if ( '1' == atts.thumbnails ) {
				options.customPaging = function( slider, i ) {
					var thumb = $( slider.$slides[ i ] ).data( 'thumb' );
					return '<img class="slick-thumbnail" src="' + thumb + '">';
				};
				options.dots = true;
			}

			$el.tailorSlideshow( options );
		}
		else if ( atts.masonry ) {
			$el.tailorMasonry();
		}

		if ( this.el.classList.contains( 'is-lightbox-gallery' ) ) {
			$el.tailorLightbox( {
				disableOn : function() {
					return $el.hasClass( 'is-selected' );
				}
			} );
		}
	} );

	ElementAPI.onRender( 'tailor_map', function( atts, model ) {
		this.$el.tailorGoogleMap();
	} );

	ElementAPI.onRender( 'tailor_posts', function( atts, model ) {
		var $el = this.$el;
		var options;

		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				arrows : '1' == atts.arrows,
				dots : '1' == atts.dots,
				fade : ( '1' == atts.fade && '1' == atts.items_per_row ),
				infinite: false,
				slidesToShow : parseInt( atts.items_per_row, 10 ) || 2
			};

			this.$el.tailorSimpleCarousel( options ) ;
		}
		else if ( atts.masonry ) {
			$el.tailorMasonry();
		}
	} );

	ElementAPI.onRender( 'tailor_section', function( atts, model ) {
		var section = this;

		// Refreshes all child elements when the section width setting changes
		SettingAPI.onChange( 'sidebar:_tailor_section_width', function( to, from ) {
			section.triggerAll( 'element:parent:change', section );
		} );

		var ratio = this.el.getAttribute( 'data-ratio' );
		if ( atts.parallax && ratio ) {
			this.$el.tailorParallax( { ratio: ratio } );
		}
	} );

	ElementAPI.onRender( 'tailor_tabs', function( atts, model ) {
		this.$el.tailorTabs();
	} );

	ElementAPI.onRender( 'tailor_toggles', function( atts, model ) {
		this.$el.tailorToggles();
	} );

} ( window.app, window.Tailor.Api.Setting, window.Tailor.Api.Element ) );

/**
 * Live setting and dynamic CSS updates.
 */
( function( app, SettingAPI ) {

	// CSS rule sets associated with sidebar settings
	var cssRules = window._pageRules || [];

	// Collection of CSS by setting ID
	var cssCollection = {
		'_tailor_section_width' : '',
		'_tailor_column_spacing' : '',
		'_tailor_element_spacing' : '',
		'_tailor_page_css' : '' // Custom page CSS
	};

	// Stylesheet for page setting CSS
	var stylesheet = document.createElement( 'style' );
	stylesheet.appendChild( document.createTextNode( '' ) );
	stylesheet.setAttribute( 'media', 'screen' );
	stylesheet.setAttribute( 'id', 'tailor-settings' );
	document.head.appendChild( stylesheet );

	/**
	 * Returns true if all values in an array are equal.
	 *
	 * @since 1.5.0
	 *
	 * @param array
	 * @returns {boolean}
	 */
	function isIdentical( array ) {
		for ( var i = 0; i < array.length - 1; i++ ) {
			if( array[ i ] !== array[ i + 1 ] ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Generates CSS for a given setting.
	 *
	 * @since 1.4.0
	 *
	 * @param settingId
	 * @param value
	 */
	function generateCSS( settingId, value ) {
		cssCollection[ settingId ] = '';
		value = _.isString( value ) ? value.trim() : value;

		// Compile the CSS rules for non-empty setting values
		if ( ! _.isEmpty( value ) ) {
			_.each( cssRules[ settingId ], function( rule ) {
				var selectors = Tailor.CSS.parseSelectors( rule.selectors );
				var declarations = Tailor.CSS.parseDeclarations( rule.declarations ).replace( /\{\{(.*?)\}\}/g, value );
				cssCollection[ settingId ] += "\n" + selectors + " {" + declarations + "}";
			} );
		}
	}

	/**
	 * Updates the stylesheet.
	 *
	 * @since 1.4.0
	 */
	function updateStylesheet() {
		var value = '';
		for ( var settingId in cssCollection ) {
			if ( cssCollection.hasOwnProperty( settingId ) ) {
				value += cssCollection[ settingId ];
			}
		}
		stylesheet.innerHTML = value;
		$win.trigger( 'resize' );
	}

	app.channel.on( 'module:css:stylesheets:ready', function( cssModule ) {

		// Generate page setting CSS on page load
		var settings = app.channel.request( 'sidebar:settings' );
		if ( settings && settings.length ) {
			settings.each( function( setting ) {
				var id = setting.get( 'id' );
				var value = setting.get( 'value' );
				value = _.isString( value ) ? value.trim() : value;

				if ( ! _.isEmpty( value ) && cssCollection.hasOwnProperty( id ) ) {
					if ( cssRules.hasOwnProperty( id ) ) {
						generateCSS( id, value );
					}
					else {
						cssCollection[ id ] = value
					}
				}
			} );
		}

		updateStylesheet();

		/**
		 * Sidebar settings.
		 */
		var ids = [
			'_tailor_section_width',
			'_tailor_column_spacing',
			'_tailor_element_spacing'
		];
		_.each( ids, function( settingId ) {
			if ( cssRules.hasOwnProperty( settingId ) ) {
				SettingAPI.onChange( 'sidebar:' + settingId, function( to, from ) {
					generateCSS( settingId, to );
					updateStylesheet();
				} );
			}
		} );

		// Custom page CSS
		SettingAPI.onChange( 'sidebar:_tailor_page_css', function( to, from ) {
			cssCollection[ '_tailor_page_css' ] = to;
			updateStylesheet();
		} );

		// Post title
		SettingAPI.onChange( 'sidebar:_post_title', function( to, from ) {
			$( 'h1, h2, h1 a, h2 a'  ).each( function() {
				if ( from == this.textContent ) {
					this.textContent = to;
				}
			} );
		} );

		/**
		 * Element settings.
		 */
		ids = [

			// Dimensions
			'min_height',

			// Colors
			'color',
			'background_color',
			'border_color',

			// Borders
			'border_style',
			'border_radius',

			// Background images
			'background_repeat',
			'background_position',
			'background_size',
			'background_attachment'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rule = {
					selectors: 'tailor_button' == model.get( 'tag' ) ? [ 'a.tailor-button__inner' ] : [],
					declarations: {}
				};
				rule.declarations[ settingId.replace( '_', '-' ) ] = to;

				// Return the rule(s)
				return [ rule ];
			} );
		} );

		// Link color
		SettingAPI.onChange( 'element:link_color', function( to, from, model ) {
			return [ {
				selectors: [ 'a' ],
				declarations: { color : to }
			} ];
		} );

		// Heading color
		SettingAPI.onChange( 'element:heading_color', function( to, from, model ) {
			return [ {
				selectors: [ 'h1, h2, h3, h4, h5' ],
				declarations: { color : to }
			} ];
		} );

		// Graphic color
		SettingAPI.onChange( 'element:graphic_color', function( to, from, model ) {
			var tag = model.get( 'tag' );
			if ( 'tailor_list_item' == tag ) {
				return [ {
					selectors: [ '.tailor-list__graphic' ],
					declarations: { color : to }
				} ];
			}
			return [ {
				selectors: [ '.' + tag.replace( /_/gi, '-' ) + '__graphic' ],
				declarations: { color : to }
			} ];
		} );

		// Graphic hover color
		SettingAPI.onChange( 'element:graphic_color_hover', function( to, from, model ) {
			var tag = model.get( 'tag' );
			if ( 'tailor_list_item' == tag ) {
				return [ {
					selectors: [ '.tailor-list__graphic:hover' ],
					declarations: { color : to }
				} ];
			}
			return [ {
				selectors: [ '.' + tag.replace( /_/gi, '-' ) + '__graphic:hover' ],
				declarations: { color : to }
			} ];
		} );

		// Minimum item height
		SettingAPI.onChange( 'element:min_item_height', function( to, from, model ) {
			return [ {
				selectors: [ model.get( 'tag' ).replace( /_/gi, '-' ) + '__item' ],
				declarations: { minHeight : to }
			} ];
		} );

		// Maximum width
		SettingAPI.onChange( 'element:max_width', function( to, from, model ) {
			var $el = this.$childViewContainer ? this.$childViewContainer : this.$el;
			$el.css( { maxWidth: to } );
		} );

		// Minimum column height
		SettingAPI.onChange( 'element:min_column_height', function( to, from, model ) {
			return [ {
				selectors: [ '.tailor-column' ],
				declarations: { 'min-height' : to }
			} ];
		} );

		// Column spacing
		SettingAPI.onChange( 'element:column_spacing', function( to, from, model ) {
			return [
				{
					selectors: [],
					declarations: {
						'margin-left' : '-calc(' + to + '/2)',
						'margin-right' : '-calc(' + to + '/2)'
					}
				},
				{
					selectors: [ '.tailor-column' ],
					declarations: {
						'padding-left' : 'calc(' + to + '/2)',
						'padding-right' : 'calc(' + to + '/2)'
					}
				}
			];
		} );

		// Horizontal alignment
		SettingAPI.onChange( 'element:horizontal_alignment', function( to, from, model ) {
			this.el.className = this.el.className.replace( /\bu-text-.*?\b/g, '' );
			this.el.classList.add( 'u-text-' + to );
		} );

		// Vertical alignment
		SettingAPI.onChange( 'element:vertical_alignment', function( to, from, model ) {
			this.el.className = this.el.className.replace( /\bu-align-.*?\b/g, '' );
			this.el.classList.add( 'u-align-' + to );
		} );

		// Class name
		SettingAPI.onChange( 'element:class', function( to, from, model ) {
			if ( ! _.isEmpty( from ) ) {
				this.el.classList.remove( from );
			}
			if ( ! _.isEmpty( to ) ) {
				this.el.classList.add( to );
			}
		} );

		// Box shadow
		SettingAPI.onChange( 'element:shadow', function( to, from, model ) {
			var rules = [];
			if ( 1 == to ) {
				rules.push( {
					selectors: [],
					declarations: { 'box-shadow' : '0 2px 6px rgba(0, 0, 0, 0.1)' }
				} );
			}
			return rules;
		} );

		// Hover colors
		ids = [
			'color_hover',
			'background_color_hover',
			'border_color_hover'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rule = {
					selectors: 'tailor_button' == model.get( 'tag' ) ? [ 'a.tailor-button__inner:hover' ] : [ ':hover' ],
					declarations: {}
				};
				rule.declarations[ settingId.substring( 0, settingId.lastIndexOf( '_hover' ) ).replace( '_', '-' ) ] = to;
				return [ rule ];
			} );
		} );
		
		// Link hover color
		SettingAPI.onChange( 'element:link_color_hover', function( to, from, model ) {
			return [ {
				selectors: [ 'a:hover' ],
				declarations: { color : to }
			} ];
		} );
		
		// Multi-dimensional attributes
		ids = [
			'padding',
			'margin'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rules = [];
				var rule = {
					selectors: [],
					declarations: {}
				};

				// Process setting value
				to = to.split( '-' );
				if ( isIdentical( to ) ) {
					rule.declarations[ settingId ] = to[0];
				}
				else {
					if ( 2 == to.length ) {
						to = _.object( [ 'top', 'bottom' ], to );
					}
					else if ( 4 == to.length ) {
						to = _.object( [ 'top', 'right', 'bottom', 'left' ], to );
					}
					else {
						return;
					}
					for ( var key in to ) {
						if ( to.hasOwnProperty( key ) ) {
							rule.declarations[ settingId + '-' + key ] = to[ key ];
						}
					}
				}

				if ( _.keys( rule.declarations ).length > 0 ) {
					rules.push( rule );
				}

				return rules;
			} );
		} );

		// Border width
		SettingAPI.onChange( 'element:border_width', function( to, from, model ) {
			var rules = [];
			var rule = {
				selectors: [],
				declarations: {}
			};

			// Process setting value
			to = to.split( '-' );
			if ( isIdentical( to ) ) {
				rule.declarations[ 'border-width' ] = to[0];
			}
			else {
				if ( 2 == to.length ) {
					to = _.object( [ 'top', 'bottom' ], to );
				}
				else if ( 4 == to.length ) {
					to = _.object( [ 'top', 'right', 'bottom', 'left' ], to );
				}
				else {
					return;
				}
				for ( var key in to ) {
					if ( to.hasOwnProperty( key ) ) {
						rule.declarations[ 'border-' + key + '-width' ] = to[ key ];
					}
				}
			}

			if ( _.keys( rule.declarations ).length > 0 ) {
				rules.push( rule );
			}

			return rules;
		} );

	} );
} ( window.app, window.Tailor.Api.Setting ) );
},{}],53:[function(require,module,exports){

var app = window.app,
    cssModule,
    callbacks = {
        'sidebar' : [],
        'element' : []
    };

/**
 * Ensures that the query name provided is valid.
 *
 * @since 1.5.0
 *
 * @param query
 * @returns {*}
 */
function checkQuery( query ) {
    if ( ! query || ! _.contains( _.keys( cssModule.stylesheets ), query ) ) {
        query = 'all';
    }
    return query;
}

/**
 * Triggers registered callback functions when a sidebar setting is changed.
 *
 * @since 1.5.0
 *
 * @param setting
 */
var onSidebarChange = function( setting ) {
    var settingId = setting.get( 'id' );

    // Do nothing if there are no registered callbacks for this setting
    if ( _.isEmpty( callbacks['sidebar'][ settingId ] ) ) {
        return;
    }

    _.each( callbacks['sidebar'][ settingId ], function( callback ) {
        callback.apply( window, [ setting.get( 'value' ), setting.previous( 'value' ) ] );
    } );
};

/**
 * Triggers registered callback functions when an element setting is changed.
 *
 * @since 1.5.0
 *
 * @param setting
 * @param view
 */
var onElementChange = function( setting, view ) {
    var elementId = view.model.get( 'id' );
    var settingId = setting.get( 'id' );

    // Do nothing if there are no registered callbacks for this setting
    if ( ! callbacks['element'].hasOwnProperty( settingId ) || 0 == callbacks['element'][ settingId ].length ) {
        return;
    }

    if ( 1 == callbacks['element'][ settingId ].length ) {
        cssModule.deleteRules( elementId, settingId );
    }

    var ruleSets = {};
    var rules;
    
    _.each( callbacks['element'][ settingId ], function( callback ) {
        if ( 'function' == typeof callback ) {
            
            // Get the collection of rules from the callback function
            rules = callback.apply( view, [ setting.get( 'value' ), setting.previous( 'value' ), view.model ] );
            
            if ( _.isArray( rules ) && rules.length > 0 ) {

                // Process the rules
                for ( var rule in rules ) {
                    if ( rules.hasOwnProperty( rule ) ) {
                        
                        if (
                            ! rules[ rule ].hasOwnProperty( 'selectors' ) ||
                            ! rules[ rule ].hasOwnProperty( 'declarations' )
                        ) {
                            continue;
                        }
                        
                        var query = checkQuery( rules[ rule ].media );
                        ruleSets[ query ] = ruleSets[ query ] || {};
                        ruleSets[ query ][ elementId ] = ruleSets[ query ][ elementId ] || [];

                        if ( _.keys( rules[ rule ].declarations ).length > 0 ) {
                            ruleSets[ query ][ elementId ].push( {
                                selectors: rules[ rule ].selectors,
                                declarations: rules[ rule ].declarations,
                                setting: settingId
                            } );
                        }
                    }
                }

                // Update the rules for the element/setting
                cssModule.addRules( ruleSets );
            }
        }
    } );
};

app.listenTo( app.channel, 'sidebar:setting:change', onSidebarChange );
app.listenTo( app.channel, 'element:setting:change', onElementChange );
app.channel.on( 'module:css:stylesheets:ready', function( module ) {
    cssModule = module;
} );

function registerCallback( type, id, callback ) {
    if ( 'function' === typeof callback ) {
        callbacks[ type ][ id ] = callbacks[ type ][ id ] || [];
        callbacks[ type ][ id ].push( callback );
    }
}

module.exports = {

    /**
     * API for updating the canvas when a sidebar or element setting is changed.
     * 
     * Accepts an event in the form "setting_type:setting_id".
     *
     * @since 1.5.0
     *
     * @param id
     * @param callback
     */
    onChange : function( id, callback ) {
        var parts = id.split( ':' );
        if ( parts.length >= 2 && _.contains( [ 'sidebar', 'element' ], parts[0] ) ) {
            registerCallback( parts[0], parts[1], callback );
        }
    }
};
},{}],54:[function(require,module,exports){
var DraggableBehaviors = Marionette.Behavior.extend( {

	events : {
		'dragstart' : 'onDragStart',
		'dragend' : 'onDragEnd',
		'drag' : 'onDrag'
	},

    /**
     * Triggers an event when dragging starts.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragStart : function( e ) {
        app.channel.trigger( 'canvas:dragstart', e.originalEvent, this.view );
	},

	/**
	 * Triggers an event while dragging.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	onDrag : function( e ) {
		app.channel.trigger( 'canvas:drag', e.originalEvent, this.view );
	},

    /**
     * Triggers an event when dragging ends.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragEnd : function( e ) {
        app.channel.trigger( 'canvas:dragend', e.originalEvent, this.view );
	}

} );

module.exports = DraggableBehaviors;
},{}],55:[function(require,module,exports){
/**
 * Tailor.Objects.Lightbox
 *
 * A lightbox module.
 *
 * @class
 */
var $ = window.jQuery,
    Lightbox;

/**
 * The Lightbox object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Lightbox = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Lightbox.prototype = {

    defaults : {
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
        //zoom: {
        //    enabled: true,
        //    duration: 300
        //}
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
     * Initializes the Carousel instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.magnificPopup();
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
        this.$el.on( 'before:element:destroy', $.proxy( this.destroy, this ) );
    },

    /**
     * Initializes the Magnific Popup plugin.
     *
     * @since 1.0.0
     */
    magnificPopup : function() {
        this.$el.magnificPopup( this.options );
    },

    /**
     * Destroys the object.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        if ( e.target != this.el ) {
            return;
        }

        this.$el.off();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

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

},{}],56:[function(require,module,exports){
/**
 * Tailor.Objects.Map
 *
 * A map module.
 *
 * @class
 */
var $ = window.jQuery,
    Map;

/**
 * The Map object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Map = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$win = $( window );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
	this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Map.prototype = {

    defaults : {
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
     * Initializes the Map instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        var map = this;

        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options ).then( function( coordinates ) {
            map.center = coordinates;

            var controls = map.options.controls;
            var settings = {
                zoom : map.options.zoom,
                draggable : map.options.draggable,
                scrollwheel : map.options.scrollwheel,
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
            var styles = map.getStyles( map.options.saturation, map.options.hue );

            map.map = new google.maps.Map( map.$canvas[0], settings );
            map.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
            map.map.setMapTypeId( 'map_style' );

            map.setupMarkers( map.$el, map.map );
            map.addEventListeners();

	        if ( 'function' == typeof map.callbacks.onInitialize ) {
		        map.callbacks.onInitialize.call( map );
	        }
        } );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

	        // Fires before the element is destroyed
	        //.on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.refresh, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.refresh, this ) );

	    this.$win.on( 'resize', $.proxy( this.refresh, this ) );
    },

    /**
     * Refreshes the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefresh : function( e ) {
        if ( e.target == this.el ) {
            this.refresh();
        }
    },

    /**
     * Refreshes the map.
     *
     * @since 1.0.0
     */
    refresh : function() {
        google.maps.event.trigger( this.map, 'resize' );
        this.map.setCenter( this.center );
    },

    /**
     * Destroys the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy();
        }
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
                deferred.reject( new Error( 'No address or map coordinates provided'  ) );
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
     * Destroys the the Map instance.
     *
     * @since 1.0.0
     */
    destroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;

	    //this.$canvas.remove();
	    this.$el.off();
	    this.$win.off( 'resize', $.proxy( this.refresh, this ) );

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }
};

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
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

},{}],57:[function(require,module,exports){
/**
 * Tailor.Objects.Masonry
 *
 * A masonry module for managing Shuffle elements.
 *
 * @class
 */
var $ = window.jQuery,
    Masonry;

/**
 * The Masonry object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Masonry = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$wrap = this.$el.find( '.tailor-grid--masonry' );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Masonry.prototype = {

    defaults : {
        itemSelector : '.tailor-grid__item'
    },

    callbacks : {

        /**
         * Callback function to be run when the Carousel instance is initialized.
         *
         * @since 1.0.0
         */
        onInitialize : function () {},

        /**
         * Callback function to be run when the Carousel instance is destroyed.
         *
         * @since 1.0.0
         */
        onDestroy : function () {}
    },

    /**
     * Initializes the Carousel instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.shuffle();

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

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.refreshShuffle, this ) )

            // Fires before and after the element is copied
            .on( 'before:element:copy', $.proxy( this.maybeUnShuffle, this ) )
            .on( 'element:copy', $.proxy( this.maybeShuffle, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.refreshShuffle, this ) );
    },

    /**
     * Re-initializes the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.shuffle();
        }
    },

    /**
     * Refreshes the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefreshShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.refreshShuffle();
        }
    },

    /**
     * Destroys the Shuffle instance if the event was triggered on the masonry element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeUnShuffle : function( e ) {
        if ( e.target == this.el ) {
            this.unShuffle();
        }
    },

    /**
     * Destroys the Shuffle instance immediately before the element/view is destroyed.
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
     * Creates a new Shuffle instance.
     *
     * @since 1.0.0
     */
    shuffle : function() {
	    var masonry = this;
	    this.$wrap.imagesLoaded( function() {
		    masonry.$wrap.shuffle( masonry.options );
		    masonry.addEventListeners();
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
    },

    /**
     * Destroys the the Shuffle instance.
     *
     * @since 1.0.0
     */
    destroy : function( e ) {
        this.unShuffle();
	    this.$el.off();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

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

},{}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
/**
 * Tailor.Objects.Slideshow
 *
 * A slideshow module.
 *
 * @class
 */
var $ = window.jQuery,
    Slideshow;

/**
 * The Slideshow object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Slideshow = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$wrap = this.$el.find( '.tailor-slideshow__slides' );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
    if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
        this.options.rtl = true;
    }
    
    this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Slideshow.prototype = {

    defaults : {
        items : '.tailor-slideshow__slide',
        prevArrow: '<button type="button" data-role="none" class="lick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
        adaptiveHeight : true,
        draggable : false,
        speed : 250,
        slidesToShow : 1,
        slidesToScroll : 1,
        autoplay : false,
        arrows : false,
        dots : false,
        fade : true
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
        this.slick();

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
            .on( 'before:element:refresh', $.proxy( this.unSlick, this ) )

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.maybeRefreshSlick, this ) )

            // Fires before and after the element is copied
            .on( 'before:element:copy', $.proxy( this.unSlick, this ) )
            .on( 'element:copy', $.proxy( this.slick, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.maybeRefreshSlick, this ) );
    },

    /**
     * Re-initializes the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeSlick : function( e ) {
        if ( e.target == this.el ) {
            this.slick();
        }
    },

    /**
     * Refreshes the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefreshSlick : function( e ) {
        if ( e.target == this.el ) {
            this.refreshSlick();
        }
    },

    /**
     * Destroys the object if the event was triggered on the element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeUnSlick : function( e ) {
        if ( e.target == this.el ) {
            this.unSlick();
        }
    },

    /**
     * Destroys the object immediately before the element/view is destroyed.
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
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    slick : function() {
	    var slideshow = this;
	    this.$el.imagesLoaded( function() {
		    slideshow.addEventListeners();
		    slideshow.$wrap.slick( slideshow.options );
	    } );
    },

    /**
     * Refreshes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
        this.$wrap.slick( 'refresh' );
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
     */
    destroy : function( e ) {
        this.$el.off();

        this.unSlick();

        if ( 'function' == typeof this.callbacks.onDestroy ) {
            this.callbacks.onDestroy.call( this );
        }
    }
};

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

},{}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
/**
 * window.ajax
 *
 * Simple AJAX utility module.
 *
 * @class
 */
var $ = jQuery,
    Ajax;

Ajax = {

    url : window.ajaxurl,

    /**
     * Sends a POST request to WordPress.
     *
     * @param  {string} action The slug of the action to fire in WordPress.
     * @param  {object} data   The data to populate $_POST with.
     * @return {$.promise}     A jQuery promise that represents the request.
     */
    post : function( action, data ) {
        return ajax.send( {
            data: _.isObject( action ) ? action : _.extend( data || {}, { action: action } )
        } );
    },

    /**
     * Sends a POST request to WordPress.
     *
     * Use with wp_send_json_success() and wp_send_json_error().
     *
     * @param  {string} action  The slug of the action to fire in WordPress.
     * @param  {object} options The options passed to jQuery.ajax.
     * @return {$.promise}      A jQuery promise that represents the request.
     */
    send : function( action, options ) {

        if ( _.isObject( action ) ) {
            options = action;
        }
        else {
            options = options || {};
            options.data = _.extend( options.data || {}, {
                action : action,
                tailor : 1
            } );
        }

        options = _.defaults( options || {}, {
            type : 'POST',
            url : ajax.url,
            context : this
        } );

        return $.Deferred( function( deferred ) {

            if ( options.success ) {
                deferred.done( options.success );
            }

            var onError = options.error ? options.error : ajax.onError;
            deferred.fail( onError );

            delete options.success;
            delete options.error;

            $.ajax( options )
                .done( function( response ) {

                    // Treat a response of `1` as successful for backwards compatibility with existing handlers.
                    if ( response === '1' || response === 1 ) {
                        response = { success: true };
                    }
                    if ( _.isObject( response ) && ! _.isUndefined( response.success ) ) {
                        deferred[ response.success ? 'resolveWith' : 'rejectWith' ]( this, [ response.data ] );
                    }
                    else {
                        deferred.rejectWith( this, [ response ] );
                    }
                } )
                .fail( function() {
                    deferred.rejectWith( this, arguments );
                } );

        } ).promise();
    },

    /**
     * General error handler for AJAX requests.
     *
     * @since 1.0.0
     *
     * @param response
     */
    onError : function( response ) {

        // Print the error to the console if the Notify feature is unavailable
        if ( ! Tailor.Notify ) {
            console.error( response );
            return;
        }

        if ( response && response.hasOwnProperty( 'message' ) ) {  // Display the error from the server
            Tailor.Notify( response.message );
        }
        else if ( '0' == response ) {  // Session expired
            Tailor.Notify( window._l10n.expired );
        }
        else if ( '-1' == response ) {  // Invalid nonce
            Tailor.Notify( window._l10n.invalid );
        }
        else {  // General error condition
            Tailor.Notify( window._l10n.error );
        }
    }
};

window.ajax = Ajax;

module.exports = Ajax;
},{}],63:[function(require,module,exports){
/**
 * Tailor.CSS
 *
 * Helper functions for managing dynamic stylesheets.
 *
 * @class
 */
var CSS = {

	/**
	 * Adds a CSS rule to an existing style sheet.
	 *
	 * @since 1.0.0
	 *
	 * @param sheet
	 * @param selector
	 * @param declaration
	 * @param index
	 */
    addRule : function( sheet, selector, declaration, index ) {
        if ( 'insertRule' in sheet ) {
            sheet.insertRule( selector + " {" + declaration + "}", sheet.cssRules.length );
        }
        else if ( 'addRule' in sheet ) {
            sheet.addRule( selector, declaration, sheet.cssRules.length );
        }
    },

	/**
	 * Deletes a CSS rule from an existing style sheet.
	 *
	 * @since 1.0.0
	 *
	 * @param sheet
	 * @param index
	 */
    deleteRule : function( sheet, index ) {
        if ( 'deleteRule' in sheet ) {
            sheet.deleteRule( index );
        }
        else if ( 'removeRule' in sheet ) {
            sheet.removeRule( index );
        }
    },

	/**
	 * Parses CSS selector string(s) for a given element.
	 *
	 * @since 1.0.0
	 *
	 * @param selectors
	 * @param elementId
	 * @returns {*}
	 */
    parseSelectors : function( selectors, elementId ) {
        if ( _.isString( selectors ) ) {
            return selectors;
        }

        var elementClass = elementId ? '.tailor-ui .tailor-' + elementId : '';
        var selector;

        if ( ! selectors.length ) {
            selector = elementClass;
        }
        else {
            if ( elementClass ) {
                selectors = selectors.map( function( selector ) {
                    if ( selector.indexOf( '&' ) > -1 ) {
                        selector = selector.replace( '&', elementClass );
                    }
                    else if ( ':' == selector.charAt( 0 ) ) {
                        selector = elementClass + selector;
                    }
                    else {
                        selector = elementClass + ' ' + selector;
                    }
                    return selector;
                } );
            }
            selector = selectors.join( ',' );
        }
        return selector;
    },

	/**
	 * Parses CSS declaration(s).
	 *
	 * @since 1.0.0
	 *
	 * @param declarations
	 * @returns {*}
	 */
    parseDeclarations : function( declarations ) {
        if ( _.isString( declarations ) ) {
            return declarations;
        }
        var declaration = '';
        _.each( declarations, function( value, property ) {
            declaration += property + ':' + value + ';';
        } );
        return declaration;
    }

};

module.exports = CSS;
},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{}]},{},[2]);
