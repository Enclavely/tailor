(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
( function( window, $ ) {

    // Do nothing if the canvas does not exist in the page
    if ( null == document.getElementById( "canvas" ) ) {
        console.error( 'The canvas does not exist in the page.  This could be caused by a plugin or theme conflict.' );
        return;
    }

    // Include utilities
    require( './shared/utility/polyfills/classlist' );
    require( './shared/utility/polyfills/raf' );
    require( './shared/utility/polyfills/transitions' );
    require( './shared/utility/ajax' );

    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Container:          require( './canvas/components/behaviors/container' ),
            Droppable:          require( './canvas/components/behaviors/droppable' ),
            Editable:           require( './canvas/components/behaviors/editable' ),
            Movable:            require( './canvas/components/behaviors/movable' ),
            Draggable:          require( './shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './canvas/app' );
    window.app = new App();

    // Create the Tailor object
    var abstractComponent = require( './shared/components/ui/abstract' );
    window.Tailor = {
        Api:            {
            Setting:        require( './shared/components/api/setting' ),
            Element:        require( './canvas/components/api/element' )
        },
        CSS:            require( './shared/utility/css' ),
        Models:         {},
        Views:          {},
        Settings:       {},
        Components:     {

	        /**
	         * Creates a new component.
             *
             * @since 1.7.5
             *
             * @param prototype
             * @returns {component}
             */
            create: function( prototype )  {
                var originalPrototype = prototype;
                var component = function( el, options, callbacks ) {
                    abstractComponent.call( this, el, options, callbacks );
                };
                component.prototype = Object.create( abstractComponent.prototype );
                for ( var key in originalPrototype )  {
                    component.prototype[ key ] = originalPrototype[ key ];
                }
                Object.defineProperty( component.prototype, 'constructor', {
                    enumerable: false,
                    value: component
                } );
                return component;
            }
        }
    };

    // Shared components
    window.Tailor.Components.Abstract = abstractComponent;
    window.Tailor.Components.Lightbox = require( './shared/components/ui/lightbox' );
    window.Tailor.Components.Map = require( './shared/components/ui/map' );
    window.Tailor.Components.Masonry = require( './shared/components/ui/masonry' );
    window.Tailor.Components.Parallax = require( './shared/components/ui/parallax' );
    window.Tailor.Components.Slideshow = require( './shared/components/ui/slideshow' );
    window.Tailor.Components.Tabs = require( './shared/components/ui/tabs' );
    window.Tailor.Components.Toggles = require( './shared/components/ui/toggles' );

    // Canvas components
    window.Tailor.Components.Carousel = require( './canvas/components/ui/carousel' );
    window.Tailor.Components.SimpleCarousel = require( './canvas/components/ui/carousel-simple' );

    app.addRegions( {
        canvasRegion : {
            selector : "#canvas",
            regionClass : require( './canvas/modules/canvas/canvas-region' )
        },
        selectRegion : {
            selector : "#select",
            regionClass : require( './canvas/modules/tools/select-region' )
        }
    } );

    // Initialize preview
    require( './canvas/preview' );

    app.on( 'before:start', function() {

        // Load element-specific models
        Tailor.Models.Section =             require( './canvas/entities/models/wrappers/section' );
        Tailor.Models.Row =                 require( './canvas/entities/models/containers/row' );
        Tailor.Models.Column =              require( './canvas/entities/models/children/column' );
        Tailor.Models.GridItem =            require( './canvas/entities/models/children/grid-item' );
        Tailor.Models.Tabs =                require( './canvas/entities/models/containers/tabs' );
        Tailor.Models.Carousel =            require( './canvas/entities/models/containers/carousel' );
        Tailor.Models.Container =           require( './canvas/entities/models/element-container' );
        Tailor.Models.Wrapper =             require( './canvas/entities/models/element-wrapper' );
        Tailor.Models.Child =               require( './canvas/entities/models/element-child' );
        Tailor.Models.Default =             require( './canvas/entities/models/element' );

        // Load views
        Tailor.Views.Column =               require( './canvas/components/elements/children/column' );
        Tailor.Views.Tab =                  require( './canvas/components/elements/children/tab' );
        Tailor.Views.CarouselItem =         require( './canvas/components/elements/children/carousel-item' );
        Tailor.Views.Tabs =                 require( './canvas/components/elements/containers/tabs' );
        Tailor.Views.Carousel =             require( './canvas/components/elements/containers/carousel' );
        Tailor.Views.Container =            require( './canvas/components/elements/element-container' );
        Tailor.Views.Wrapper =              require( './canvas/components/elements/element-container' );
        Tailor.Views.Child =                require( './canvas/components/elements/element-container' );
        Tailor.Views.Default =              require( './canvas/components/elements/element' );

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

    app.channel.on( 'sidebar:initialize', function() {
        
        // Load modules
        app.module( 'module:css', require( './canvas/modules/css/css' ) );
        app.module( 'module:elements', require( './canvas/modules/elements/elements' ) );
        app.module( 'module:templates', require( './canvas/modules/templates/templates' ) );
        app.module( 'module:canvas', require( './canvas/modules/canvas/canvas' ) );
        app.module( 'module:tools', require( './canvas/modules/tools/tools' ) );

        app.channel.on( 'module:canvas:ready', function() {

            /**
             * Fires when the canvas is initialized.
             *
             * @since 1.5.0
             *
             * @param app
             */
            app.channel.trigger( 'canvas:initialize', app );
        } );
    } );

    function start() {
        app.start( {
            elements : window._elements || [],
            nonces : window._nonces || [],
            mediaQueries : window._media_queries || {},
            cssRules : window._css_rules || {}
        } );
    }

    $( function() {
        var sidebarApp = window.parent.app;

        // Wait until the sidebar is initialized before starting the canvas
        if ( sidebarApp._initialized ) {
            start();
        }
        else {
            sidebarApp.on('start', function() {
                start();
            } );
        }
    } );

} ( window, Backbone.$ ) );

//require( './utility/debug' );
},{"./canvas/app":2,"./canvas/components/api/element":3,"./canvas/components/behaviors/container":4,"./canvas/components/behaviors/droppable":5,"./canvas/components/behaviors/editable":6,"./canvas/components/behaviors/movable":7,"./canvas/components/elements/children/carousel-item":8,"./canvas/components/elements/children/column":9,"./canvas/components/elements/children/tab":10,"./canvas/components/elements/containers/carousel":11,"./canvas/components/elements/containers/tabs":16,"./canvas/components/elements/element":18,"./canvas/components/elements/element-container":17,"./canvas/components/ui/carousel":20,"./canvas/components/ui/carousel-simple":19,"./canvas/entities/models/children/column":22,"./canvas/entities/models/children/grid-item":23,"./canvas/entities/models/containers/carousel":24,"./canvas/entities/models/containers/row":25,"./canvas/entities/models/containers/tabs":26,"./canvas/entities/models/element":32,"./canvas/entities/models/element-child":28,"./canvas/entities/models/element-container":30,"./canvas/entities/models/element-wrapper":31,"./canvas/entities/models/wrappers/section":33,"./canvas/modules/canvas/canvas":35,"./canvas/modules/canvas/canvas-region":34,"./canvas/modules/css/css":37,"./canvas/modules/elements/elements":39,"./canvas/modules/templates/templates":40,"./canvas/modules/tools/select-region":41,"./canvas/modules/tools/tools":45,"./canvas/preview":46,"./shared/components/api/setting":50,"./shared/components/behaviors/draggable":51,"./shared/components/ui/abstract":52,"./shared/components/ui/lightbox":53,"./shared/components/ui/map":54,"./shared/components/ui/masonry":55,"./shared/components/ui/parallax":56,"./shared/components/ui/slideshow":57,"./shared/components/ui/tabs":58,"./shared/components/ui/toggles":59,"./shared/utility/ajax":60,"./shared/utility/css":61,"./shared/utility/polyfills/classlist":62,"./shared/utility/polyfills/raf":63,"./shared/utility/polyfills/transitions":64}],2:[function(require,module,exports){
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

        // White listed events from the remote channel
        this.allowableEvents = [
            'sidebar:initialize',

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

        if ( window.location.origin !== window.parent.location.origin ) {
            console.error( 'The Canvas has a different origin than the Sidebar' );
            return;
        }
        
        this.registerRemoteChannel();
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

            if ( e.ctrlKey ) {
                if ( 89 == e.keyCode ) {
                    canvas.channel.trigger( 'history:redo' );
                }
                else if ( 90 == e.keyCode ) {
                    canvas.channel.trigger( 'history:undo' );
                }
            }
            else if ( e.metaKey && 90 == e.keyCode ) {
                if ( e.shiftKey ) {
                    canvas.channel.trigger( 'history:redo' );
                }
                else {
                    canvas.channel.trigger( 'history:undo' );
                }
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
         * Returns the current device preview size.
         *
         * @since 1.7.4
         *
         * @param id
         * @returns {*|{}}
         */
        this.channel.reply( 'sidebar:device', function() {
            return remoteChannel.request( 'sidebar:device' );
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
},{}],3:[function(require,module,exports){
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
		'append' : 'append',
		'template' : 'template'
	},

	template: function( id ) {
		var element = this.view;
		var model = element.model;
		model.createTemplate( id, element );
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
},{"./../element-container":17}],9:[function(require,module,exports){
var $ = window.jQuery,
	ContainerView = require( './../element-container' ),
	ColumnView,
	cssModule;

app.channel.on( 'module:css:stylesheets:ready', function( module ) {
	cssModule = module;
} );

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

	    if ( 'undefined' != typeof cssModule ) {
		    this.updateCSS( this.model.get( 'id' ), this.model.get( 'atts' ) );
	    }

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
	    var device = app.channel.request( 'sidebar:device' );
	    var setting = ( 'desktop' == device ) ? 'width' : ( 'width_' + device );

	    var model = columnView.model;
	    var nextModel = model.collection.findWhere( {
		    parent : model.get( 'parent' ),
		    order : model.get( 'order' ) + 1
	    } );

	    var atts = model.get( 'atts' );
	    var nextAtts = nextModel.get( 'atts' );

	    var width = parseFloat( atts[ setting ] || atts.width );
	    var nextWidth = parseFloat( nextAtts[ setting ] || nextAtts.width );
	    var columnsWidth = width + nextWidth;
	    
	    var column = columnView.el.getBoundingClientRect();

	    // Add visual indicators
	    var $first = $( '<span class="tailor-column__width tailor-column__width--right">' + width + '%</span>' );
	    var $second = $( '<span class="tailor-column__width tailor-column__width--left">' + nextWidth + '%</span>' );

	    $first.prependTo( columnView.$el );
	    $second.prependTo( columnView.$el.next() );

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

		    var columnWidth = Math.min( columnsWidth - 10, Math.max( 10, Math.round( parseFloat( ( ( e.clientX - column.left ) / column.width ) * width ) * 10 ) / 10 ) );
		    var nextColumnWidth = Math.round( parseFloat( columnsWidth - columnWidth ) * 10 ) / 10;

		    columnWidth += '%';
		    nextColumnWidth += '%';

		    // Update the UI
		    $first.html( columnWidth );
		    $second.html( nextColumnWidth );

		    // Update the attributes
		    var atts = _.clone( model.get( 'atts' ) );
		    var nextAtts = _.clone( nextModel.get( 'atts' ) );
		    atts[ setting ] = columnWidth;
		    nextAtts[ setting ] = nextColumnWidth;
		    model.set( 'atts', atts, { silent : true } );
		    nextModel.set( 'atts', nextAtts, { silent : true } );

		    // Trigger change events on the models
		    model.trigger( 'change:width', model, atts );
		    nextModel.trigger( 'change:width', nextModel, nextAtts );
        }

	    /**
	     * Maybe update the widths of affected columns after resizing ends.
	     *
	     * @since 1.0.0
	     */
		function onResizeEnd() {
			document.removeEventListener( 'mousemove', onResize, false );
			document.removeEventListener( 'mouseup', onResizeEnd, false );
            document.body.classList.remove( 'is-resizing' );
            document.body.style.cursor = 'default';

		    $first.remove();
		    $second.remove();

		    var atts = model.get( 'atts' );
            if ( width != atts[ setting ] ) {

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
     */
	onChangeWidth : function( model, atts ) {
	    this.updateCSS( model.get( 'id' ), atts );

	    /**
	     * Fires after the column width has changed.
	     *
	     * @since 1.7.5
	     */
	    this.triggerAll( 'element:refresh', this );
	},

	updateCSS : function( elementId, atts ) {
		var ruleSet = {};
		var width = atts['width'];
		var tabletWidth = atts['width_tablet'] || atts['width'];
		var mobileWidth = atts['width_mobile'] || atts['width'];

		// Desktop width
		ruleSet['desktop'] = {};
		ruleSet['desktop'][ elementId ] = [ {
			selectors: [],
			declarations:  { 'width' : width },
			setting: 'width'
		} ];

		// Tablet width
		ruleSet['tablet'] = {};
		ruleSet['tablet'][ elementId ] = [ {
			selectors: [ '.mobile-columns &', '.tablet-columns &' ],
			declarations:  { 'width' : tabletWidth },
			setting: 'width_tablet'
		} ];

		// Mobile width
		ruleSet['mobile'] = {};
		ruleSet['mobile'][ elementId ] = [ {
			selectors: [ '.mobile-columns &' ],
			declarations:  { 'width' : mobileWidth },
			setting: 'width_mobile'
		} ];

		cssModule.deleteRules( elementId, 'width' );
		cssModule.deleteRules( elementId, 'width_tablet' );
		cssModule.deleteRules( elementId, 'width_mobile' );
		cssModule.addRules( ruleSet );
	}

} );

module.exports = ColumnView;
},{"./../element-container":17}],10:[function(require,module,exports){
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
},{"./../element-container":17}],11:[function(require,module,exports){
var ContainerView = require( './../element-container' ),
	CarouselNavigationView = require( './navigation/carousel-navigation' ),
	CarouselView;

CarouselView = ContainerView.extend( {
	
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
},{"./../element-container":17,"./navigation/carousel-navigation":13}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
        var view = this;
        this.sortable = new Sortable( view.el, {
            draggable : 'li',
            animation : 150,

	        /**
	         * Update the order of the carousel items when they are repositioned.
	         *
	         * @since 1.0.0
	         */
            onUpdate : function( e ) {
		        var cid = e.item.getAttribute( 'data-id' );

		        /**
		         * Fires before the element is reordered.
		         *
		         * @since 1.7.5
		         */
		        view.$el.trigger( 'before:navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );

		        /**
		         * Fires when the element is reordered.
		         *
		         * @since 1.7.5
		         */
		        view.$el.trigger( 'navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );

		        /**
		         * Fires when the element is reordered.
		         *
		         * @since 1.7.5
		         */
		        app.channel.trigger( 'navigation:reorder', view.model );
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
},{"./carousel-navigation-item":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
        var view = this;
        this.sortable = new Sortable( view.el, {
            draggable : 'li',
            animation : 150,

            /**
             * Updates the order of the tabs when they are repositioned.
             *
             * @since 1.0.0
             */
            onUpdate : function( e ) {
	            var cid = e.item.getAttribute( 'data-id' );

	            /**
	             * Fires before the element is reordered.
	             * 
	             * @since 1.7.5
	             */
	            view.$el.trigger( 'before:navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );

	            /**
	             * Fires when the element is reordered.
	             *
	             * @since 1.7.5
	             */
	            view.$el.trigger( 'navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );
	            
	            /**
	             * Fires when the element is reordered.
	             *
	             * @since 1.7.5
	             */
	            app.channel.trigger( 'navigation:reorder', view.model );
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
},{"./tabs-navigation-item":14}],16:[function(require,module,exports){
var ContainerView = require( './../element-container' ), 
	TabsNavigationView = require( './navigation/tabs-navigation' ),
	TabsView;

TabsView = ContainerView.extend( {

    ui : {
        navigation : '.tailor-tabs__navigation'
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
},{"./../element-container":17,"./navigation/tabs-navigation":15}],17:[function(require,module,exports){
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
		'change:order' : 'onChangeOrder',
		'change:parent' : 'onChangeParent',
		'change:setting' : 'onChangeSetting'
	},

	childEvents : {
		'before:element:ready' : 'beforeChildElementReady',
		'element:ready' : 'childElementReady',
		'before:element:refresh' : 'beforeChildElementRefreshed',
		'element:refresh' : 'childElementRefreshed',
		'before:element:jsRefresh' : 'beforeChildElementJSRefreshed',
		'element:jsRefresh' : 'childElementJSRefreshed',
		'element:change:parent' : 'childElementChangeParent',
		'element:change:order' : 'childElementChangeOrder',
		'before:element:destroy' : 'beforeChildElementDestroyed',
		'element:destroy' : 'childElementDestroyed'
	},
	
	events : {
		'before:element:ready' : 'stopEventPropagation',
		'element:ready' : 'stopEventPropagation',
		'before:element:refresh' : 'stopEventPropagation',
		'element:refresh' : 'stopEventPropagation',
		'before:element:copy' : 'stopEventPropagation',
		'element:copy' : 'stopEventPropagation',
		'element:child:change:parent' : 'onDescendantChangeParent',
		'element:child:change:order' : 'onDescendantChangeOrder',
		'before:element:destroy' : 'stopEventPropagation',
		'element:destroy' : 'stopEventPropagation',
		'element:child:add' : 'onDescendantAdded',
		'element:child:remove' : 'onDescendantRemoved',
		'before:element:child:ready' : 'onBeforeDescendantReady',
		'element:child:ready' : 'onDescendantReady',
		'before:element:child:refresh' : 'onBeforeDescendantRefreshed',
		'element:child:refresh' : 'onDescendantRefreshed',
		'before:element:child:jsRefresh' : 'onBeforeDescendantJSRefreshed',
		'element:child:jsRefresh' : 'onDescendantJSRefreshed',
		'before:element:child:destroy' : 'onBeforeDescendantDestroyed',
		'element:child:destroy' : 'onDescendantDestroyed',
		'before:navigation:reorder' : 'stopEventPropagation',
		'navigation:reorder' : 'onReorder'
	},

	/**
	 * Updates children when they are reordered using navigation.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param index
	 * @param oldIndex
	 */
	onReorder: function( e, cid, index, oldIndex ) {
		var view = this.children.findByModelCid( cid );
		var otherView = this.children.find( function( childView ) { return childView.model.get( 'order' ) == index; } );

		// Update the DOM
		if ( oldIndex - index < 0 ) {
			view.$el.insertAfter( otherView.$el );
		}
		else {
			view.$el.insertBefore( otherView.$el );
		}

		// Update the view and model
		this.children.each( function( childView ) {
			var childIndex = childView.$el.index();
			childView._index = childIndex;
			childView.model.set( 'order', childIndex );
		} );

		view.model.collection.sort();
		e.stopPropagation();
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
			error : function( response ) {
				view.updateTemplate( '<p class="tailor-notification tailor-notification--error">The template for ' + view.cid + ' could not be refreshed</p>' );
				console.error( response );
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

				//view.refreshChildren();

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
	 * Triggers events before a descendant element is refreshed.
	 *
	 * @since 1.7.5
	 */
	onChangeOrder : function() {

		/**
		 * Fires when the order of the element changes.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:change:order', this );
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
	},

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
			 * Fires before the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:jsRefresh', this, this.model.get( 'atts' ) );

			/**
			 * Fires when an element setting is changed.
			 *
			 * This is only fired when the setting is configured for JavaScript updates.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );

			/**
			 * Fires after the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:jsRefresh', this, this.model.get( 'atts' ) );
		}
	},

    /**
     * Initializes the view.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this._isReady = false;
        this._isBeingDestroyed = false;

	    // Set the child view container option (if specified)
	    this.options.childViewContainer = this.model.get( 'child_container' ) || null;

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
	    this.el.setAttribute( 'tailor-label', this.model.get( 'label' ) );
	    this.el.classList.add( 'tailor-' + this.model.cid );
	    this.el.title = _l10n.edit_element;
	    
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
	 * Triggers an event before a child element is ready.
	 *
	 * @since 1.0.0
	 */
	beforeChildElementReady : function( childView ) {
		if ( this._isReady && this.children.contains( childView ) ) {

			/**
			 * Fires before a child element is refreshed.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:child:ready', childView );
		}
	},

	/**
	 * Triggers events when a child element is ready.
	 *
	 * If all children are ready, the element is also considered ready.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementReady : function( childView ) {
		if ( this.children.contains( childView ) ) {
			if ( ! this._isReady ) {
				var readyChildren = this.children.filter( function( childView ) {
					return childView._isReady;
				} ).length;

				if ( this.children.length == readyChildren ) {
					this._isReady = true;

					/**
					 * Fires when all child elements are ready (the container is fully rendered).
					 *
					 * @since 1.0.0
					 */
					this.triggerAll( 'element:ready', this );
					//this.refreshChildren();
				}
			}
			else  {

				/**
				 * Fires when a child element is ready (after the container is fully rendered).
				 *
				 * @since 1.0.0
				 */
				this.triggerAll( 'element:child:ready', childView );
			}
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
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires before a child element is refreshed.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:child:refresh', childView );
		}
	},
	
	/**
	 * Triggers events when a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childElementRefreshed : function( childView ) {
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires when a child element is refreshed.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:child:refresh', childView );
		}
	},

	/**
	 * Triggers events before a child element template is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param childView
	 */
	beforeChildElementJSRefreshed : function( childView ) {
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires before a child element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:child:jsRefresh', childView );
		}
	},
	
	/**
	 * Triggers events when a child element is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param childView
	 */
	childElementJSRefreshed : function( childView ) {
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires when a child element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:child:jsRefresh', childView );
		}
	},

	/**
	 * Triggers events when a child element order is changed.
	 *
	 * @since 1.7.5
	 *
	 * @param childView
	 */
	childElementChangeOrder: function( childView ) {
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires when a child element order changes.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:child:change:order', childView );
		}
	},

	/**
	 * Triggers events when a child element parent is changed.
	 *
	 * @since 1.7.5
	 *
	 * @param childView
	 */
	childElementChangeParent: function( childView ) {
		if ( this.children.contains( childView ) ) {

			/**
			 * Fires when a child element parent changes.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:child:change:parent', childView );
		}
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

			/**
			 * Fires before a child element is destroyed.
			 *
			 * @since 1.7.5
			 */
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
		if ( ! this._isBeingDestroyed  ) {

			/**
			 * Fires when a child element is destroyed.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:child:destroy', childView );
		}
	},

	/**
	 * Triggers events when a descendant element is added.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param view
	 */
	onDescendantAdded : function( e, view ) {

		/**
		 * Fires when a descendant element is added.
		 *
		 * @since 1.0.0
		 */
		this.triggerAll( 'element:descendant:add', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element is removed.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param view
	 */
	onDescendantRemoved : function( e, view ) {

		/**
		 * Fires when a descendant element is removed.
		 *
		 * @since 1.0.0
		 */
		this.triggerAll( 'element:descendant:remove', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events before a descendant element is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDescendantReady : function( e, view ) {

		/**
		 * Fires before a descendant element is ready.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'before:element:descendant:ready', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element is ready.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantReady : function( e, view ) {

		/**
		 * Fires when a descendant element is ready.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:ready', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events before a descendant element is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDescendantRefreshed : function( e, view ) {

		/**
		 * Fires before a descendant element is refreshed.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'before:element:descendant:refresh', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element is refreshed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantRefreshed : function( e, view ) {

		/**
		 * Fires when a descendant element is refreshed.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:refresh', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events before a descendant element is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDescendantJSRefreshed: function( e, view ) {

		/**
		 * Fires before a descendant element is refreshed using JavaScript.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'before:element:descendant:jsRefresh', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element is refreshed using JavaScript.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantJSRefreshed : function( e, view ) {

		/**
		 * Fires when a descendant element is refreshed using JavaScript.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:jsRefresh', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element order is changed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantChangeOrder : function( e, view ) {

		/**
		 * Fires when a descendant element order changes.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:change:order', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element parent is changed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantChangeParent : function( e, view ) {

		/**
		 * Fires when a descendant element parent changes.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:change:parent', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events before a descendant element is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onBeforeDescendantDestroyed : function( e, view ) {

		/**
		 * Fires when a descendant element is destroyed.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'before:element:descendant:destroy', view );
		e.stopPropagation();
	},

	/**
	 * Triggers events when a descendant element is destroyed.
	 *
	 * @since 1.7.5
	 *
	 * @param e
	 * @param view
	 */
	onDescendantDestroyed : function( e, view ) {

		/**
		 * Fires when a descendant element is destroyed.
		 *
		 * @since 1.7.5
		 */
		this.triggerAll( 'element:descendant:destroy', view );
		e.stopPropagation();
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
	}

} );

module.exports = CompositeView;
},{}],18:[function(require,module,exports){
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

		this.el.setAttribute( 'draggable', true );
		this.el.setAttribute( 'tailor-label', this.model.get( 'label' ) );
		this.el.classList.add( 'tailor-' + this.model.id );
		this.el.title = _l10n.edit_element;
		
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
			error : function( response ) {
				view.updateTemplate( '<p class="tailor-notification tailor-notification--error">The template for ' + view.cid + ' could not be refreshed</p>' );
				console.error( response );
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
			 * Fires before the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'before:element:jsRefresh', this, this.model.get( 'atts' ) );
			
			/**
			 * Fires when an element setting is changed.
			 *
			 * This is only fired when the setting is configured for JavaScript updates.
			 *
			 * @since 1.5.0
			 */
			app.channel.trigger( 'element:setting:change', setting, this );

			/**
			 * Fires after the element is refreshed using JavaScript.
			 *
			 * @since 1.7.5
			 */
			this.triggerAll( 'element:jsRefresh', this, this.model.get( 'atts' ) );
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
			.find( 'a' )
			.attr( { draggable : false, target : '_blank' } );

		this.$el
			.find( '[onchange]' )
			.removeAttr( 'onchange' );

		this.$el
			.find( 'img' )
			.attr( { draggable : false } );

		this.$el.imagesLoaded( function() {
			view._isReady = true;

			// Display the empty element message for widgets that do not produce any visible content
			if ( view.el.classList.contains( 'tailor-widget' ) && 0 == view.$el.children().innerHeight() ) {
				var el = document.querySelector( '#tmpl-tailor-element-empty' );
				if ( el ) {
					view.$el.html( el.innerHTML );
				}
			}

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
},{}],19:[function(require,module,exports){
/**
 * Tailor.Components.SimpleCarousel
 *
 * A simplified carousel component.
 *
 * @class
 */
var $ = window.jQuery,
	Components = window.Tailor.Components,
    Carousel;

Carousel = Components.create( {

	slickActive: false,
	
	getDefaults : function () {
		return {
			items : '.tailor-carousel__item',
			prevArrow : '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
			nextArrow : '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
			adaptiveHeight : true,
			draggable : false,
			speed : 250,
			slidesToShow : 1,
			slidesToScroll : 1,
			autoplay : false,
			autoplaySpeed : 3000,
			arrows : false,
			dots : true,
			fade : false
		};
	},

	onInitialize : function () {
		this.$wrap = this.$el.find( '.tailor-carousel__wrap' ).first();
		this.slick();
	},
	
	/**
	 * Creates a new Slick Slider instance.
	 *
	 * @since 1.0.0
	 */
	slick : function() {
		var component = this;
		component.$el.imagesLoaded( function() {
			component.$wrap.slick( component.options );
			component.slickActive = true;
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
	 * Element listeners
	 */
	onMove: function() {
		if ( this.slickActive ) {
			this.refreshSlick();
		}
	},

	onBeforeCopy: function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},
	
	onCopy: function() {
		if ( ! this.slickActive ) {
			this.slick();
		}
	},

	onBeforeRefresh: function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},

	onChangeParent: function() {
		this.refreshSlick();
	},
	
	onDestroy : function() {
		if ( this.slickActive ) {
			this.unSlick();
		}
	},

	/**
	 * Window listeners
	 */
	onResize: function() {
		if ( this.slickActive ) {
			this.refreshSlick();
		}
	}

} );	

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
},{}],20:[function(require,module,exports){
/**
 * Tailor.Components.Carousel
 *
 * A carousel component.
 *
 * @class
 */
var $ = window.jQuery,
	Components = window.Tailor.Components,
    Carousel;

Carousel = Components.create( {

	getDefaults: function() {
		return {
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
			autoplaySpeed : 3000,
			arrows : false,
			dots : false,
			fade : false,
			infinite : false
		};
	},

	onInitialize: function() {
		this.$wrap = this.$el.find( '.tailor-carousel__wrap' ).first();
		this.slickAt( 0, this.addEventListeners );
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
		var component = this;
		var currentSlide = this.currentSlide;
		var currentIndex = this.$dots.filter( function() { return this.getAttribute( 'data-id' ) == currentSlide; } ).index();
		var options = $.extend( {}, this.options, {
			autoplay : false,
			autoplaySpeed : 3000,
			fade : false,
			initialSlide : currentIndex
		} );

		component.$wrap
			.slick( options )
			.on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
				if ( slick.$slider[0] == component.$wrap[0] && currentSlide != nextSlide ) {
					component.updateDots( nextSlide );
				}
			} );

		if ( 'function' == typeof callback ) {
			callback.call( component );
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
	 * Refreshes the dot and item caches and defines the current slide.
	 *
	 * @since 1.0.0
	 */
	querySelectors : function() {
		if ( this.$dots ) {
			this.$dots.off();
		}

		var component = this;
		component.$items = component.$wrap.find( ' > ' + component.options.items );
		component.$dots = component.$el.children( '.slick-dots' ).find( ' > li' );
		component.$dots.on( 'click', function( e ) {
			var $dot = $( e.currentTarget );
			component.currentSlide = $dot.data( 'id' );
			component.$wrap.slick( 'slickGoTo', $dot.index() );
			e.preventDefault();
		} );

		if ( ! component.currentSlide ) {
			var $activeSlide = component.$items.filter( function() {
				return this.classList.contains( 'slick-current' );
			} );
			component.currentSlide = $activeSlide.length ? $activeSlide.id : component.$items[0].id;
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
	 * Element listeners
	 */
	onMove: function() {
		this.refreshSlick();
	},

	onBeforeCopy: function() {
		this.unSlick();
	},

	onBeforeRefresh: function() {
		this.unSlick();
	},

	onRefresh: function() {
		this.refreshSlick();
	},

	onJSRefresh: function() {
		this.refreshSlick();
	},
	
	onChangeParent: function() {
		this.refreshSlick();
	},

	onDestroy : function() {
		this.unSlick();
	},


	/**
	 * Child listeners
	 */
	onAddChild: function() {
		this.refreshSlick();
	},

	onRemoveChild: function( e, childView ) {
		childView.$el.detach();
		this.refreshSlick();
	},

	onBeforeReadyChild : function( e, childView ) {
		this.unSlick();
	},

	onReadyChild : function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},
	
	onBeforeReorderChild: function() {
		this.unSlick();
	},

	onReorderChild: function( e, cid, index, oldIndex ) {
		this.querySelectors();
		this.slickAt( index );
	},

	onBeforeRefreshChild: function() {
		this.unSlick();
	},

	onRefreshChild: function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},

	onBeforeJSRefreshChild: function() {
		this.unSlick();
	},

	onJSRefreshChild: function( e, childView ) {
		this.slickAt( childView.$el.index() );
	},

	onBeforeDestroyChild: function() {
		this.unSlick();
	},

	onDestroyChild : function( e, childView ) {
		var index = childView.$el.index();
		childView.$el.remove();
		this.slickAt( index );
	},


	/**
	 * Descendant listeners
	 */
	onAddDescendant: function() {
		this.refreshSlick();
	},

	onRemoveDescendant: function() {
		this.refreshSlick();
	},

	onReadyDescendant: function() {
		this.refreshSlick();
	},

	onRefreshDescendant: function() {
		this.refreshSlick();
	},

	onJSRefreshDescendant: function() {
		this.refreshSlick();
	},

	onDestroyDescendant : function() {
		this.refreshSlick();
	},

	/**
	 * Window listeners
	 */
	onResize: function() {
		this.refreshSlick();
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
$.fn.tailorCarousel = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorCarousel' );
        if ( ! instance ) {
            $.data( this, 'tailorCarousel', new Carousel( this, options, callbacks ) );
        }
    } );
};
},{}],21:[function(require,module,exports){
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
        if ( model instanceof Backbone.Model ) {
            model = model.toJSON();
        }

        var definitions = this.getElementDefinitions();
        var item = definitions.findWhere( { tag : model.tag } );
        var defaults = {
            label : item.get( 'label' ),
            type : item.get( 'type' )
        };

        var child = item.get( 'child' );
        if ( child ) {
            defaults.child = child;
        }

        var childViewContainer = item.get( 'child_container' );
        if ( childViewContainer ) {
            defaults.child_container = childViewContainer;
        }

        model.atts = model.atts || {};
        _.each( item.get( 'settings' ), function( setting ) {
            if ( ! _.isEmpty( setting['value'] ) && ! model.atts.hasOwnProperty( setting['id'] ) ) {
                model.atts[ setting['id'] ] = setting['value'];
            }
        } );

        return _.extend( model, defaults );
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
        
		if ( 'tailor_column' == model.get( 'tag' ) ) {
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
     * Adds a model to the collection.
     * 
     * @since 1.6.1
     * 
     * @param models
     * @param options
     * @returns {*}
     */
    add : function( models, options ) {
        if ( _.isArray( models ) ) {
            _.each( models, this.applyDefaults.bind( this ) );
        }
        else {
            this.applyDefaults( models );
        }
        return this.set( models, _.extend( { merge: false }, options, { add: true, remove: false } ) );
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

        return this.add( models, options );
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
            atts : { width : '50%' },
            parent : row.get( 'id' ),
            order : 0
        }, {
            tag : 'tailor_column',
            atts : { width : '50%' },
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
        return _.first( this.create( [ {
			tag : 'tailor_column',
			parent : parentId,
			order : order
		} ] ) );

	    //console.log( '\n Created column ' + column.get( 'id' ) + ' at ' + order );
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
        var children = this.create( [ {
            tag : childTag,
            parent : container.get( 'id' ),
            order : 0
        }, {
            tag : childTag,
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
    },

    /**
     * Adds a child into the specified parent.
     *
     * @since 1.7.3
     *
     * @param model
     */
    createChild : function( model ) {
        var child = _.first( this.create( [ {
            tag : model.get( 'child' ),
            parent : model.get( 'id' ),
            order : this.getChildren( model ).length
        } ], {
            silent : true
        } ) );

        this.create( [ {
            tag : 'tailor_content',
            parent : child.get( 'id' ),
            order : 0
        } ], {
            silent : true
        } );

        this.trigger( 'add', child, this, {} );
        return child;
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

            // Update the attributes
            atts['width'] = ( Math.round( parseFloat( 1 / numberChildren ) * 1000 ) / 10 ) + '%';
            delete atts['width_tablet'];
            delete atts['width_mobile'];
            child.set( 'atts', atts, { silent : true } );

            // Trigger change events on the model
            child.trigger( 'change:width', child, atts );
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
    }

} );

module.exports = ElementCollection;

},{}],22:[function(require,module,exports){
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
        return that.get( 'parent' ) == this.get( 'parent' ) || siblings.length < 6;
    }

} );

module.exports = ColumnModel;
},{"./../element-child":28}],23:[function(require,module,exports){
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
},{"./../element-child":28}],24:[function(require,module,exports){
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
        view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
        
        var $childViewContainer = view.getChildViewContainer( view );
        var $children = $childViewContainer.contents().detach();
        
        var $navigation = view.$el.find( '.slick-dots' ).detach();

        this.appendTemplate( id, view );

        $childViewContainer.append( $children );
        
	    $navigation.insertAfter( $childViewContainer );
        
        if ( isEditing ) {
            view.el.classList.add( 'is-editing' );
        }
    }

} );

module.exports = CarouselModel;
},{"./../element-container":30}],25:[function(require,module,exports){
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
},{"./../element-container":30}],26:[function(require,module,exports){
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
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();

		var $navigation = view.$el.find( '.tailor-tabs__navigation' );
		var $navigationItems = $navigation.children().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );

		$navigation.append( $navigationItems );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = TabsModel;
},{"./../element-container":30}],27:[function(require,module,exports){
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
	beforeCopyElement : function( id, view ) {
		view.triggerAll( 'before:element:copy', view );
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

		var templates = document.getElementById( 'tailor-templates' );
		templates.appendChild( template );
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

},{}],28:[function(require,module,exports){
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
},{"./element-composite":29}],29:[function(require,module,exports){
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

        this.copy( clone.cid, sourceView );

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

                clone.copy( clone.cid, childView );
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
	 * Creates a new element template for use with a copied element.
	 *
	 * @since 1.7.9
	 *
	 * @param id
	 * @param view
	 */
	copy: function( id, view ) {
		this.beforeCopyElement( id, view );
		this.createTemplate( id, view );
		this.afterCopyElement( id, view );
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
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );
		
		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = CompositeModel;
},{"./element-base":27}],30:[function(require,module,exports){
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
},{"./element-composite":29}],31:[function(require,module,exports){
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
},{"./element-composite":29}],32:[function(require,module,exports){
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

			return 'tailor_section' == parent.get( 'tag' ) || _.contains( [ 'left', 'right' ], region );
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

		this.copy( clone.cid, sourceView );
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
		clone.set( 'parent', targetView.model.get( 'parent' ) );
		clone.set( 'order', index );

		this.copy( clone.cid, sourceView );

		this.collection.add( clone );
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

		this.copy( clone.cid, sourceView );

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

		this.copy( clone.cid, sourceView );

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

		this.copy( clone.cid, sourceView );
		this.collection.add( clone );
	},

	/**
	 * Creates a new element template for use with a copied element.
	 * 
	 * @since 1.7.9
	 * 
	 * @param id
	 * @param view
	 */
	copy: function( id, view ) {
		this.beforeCopyElement( id, view );
		this.createTemplate( id, view );
		this.afterCopyElement( id, view );
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
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		this.appendTemplate( id, view );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = ElementModel;
},{"./element-base":27}],33:[function(require,module,exports){
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
},{"./../element-wrapper":31}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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
},{"./show/canvas-view":36}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
var Stylesheet = require( './stylesheet' ),
	CSSModule;

CSSModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onBeforeStart : function( options ) {
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
        this.listenTo( app.channel, 'css:delete', this.deleteRules );   // Delete CSS rules for an element/setting (or elements)
        this.listenTo( app.channel, 'css:update', this.updateRules );   // Update the CSS for a given element
		this.listenTo( app.channel, 'css:copy', this.copyRules );       // Copy the CSS for one element/setting to another
		this.listenTo( app.channel, 'css:clear', this.clearRules );     // Clear all dynamic CSS rules
		this.listenTo( this.collection, 'destroy', this.onDestroy );

		app.channel.reply( 'canvas:css', this.getRules.bind( this ) );
	},

	getRules: function() {
		var rules = {};
		for ( var queryId in this.stylesheets ) {
			if ( this.stylesheets.hasOwnProperty( queryId ) ) {
				rules[ queryId ] = this.stylesheets[ queryId ].getAllRules();
			}
		}
		return rules;
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
					this.stylesheets[ id + '-up' ] = this.createSheet( id + '-up', atts.min );
					this.stylesheets[ id ] = this.createSheet( id, atts.min, atts.max );
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
},{"./stylesheet":38}],38:[function(require,module,exports){
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
				for ( var i in ruleSet[ elementId ] ) {
					if ( ruleSet[ elementId ].hasOwnProperty( i ) ) {
						this.addRule( elementId, ruleSet[ elementId ][ i ] );
					}
				}
			}
		}
	},

	/**
	 * Adds a rule to the stylesheet.
	 *
	 * @since 1.7.3
	 *
	 * @param elementId
	 * @param rule
	 */
	addRule : function( elementId, rule ) {
		if ( this.checkRule( rule ) ) {
			var selectors = Tailor.CSS.parseSelectors( rule['selectors'], elementId );
			var declarations = Tailor.CSS.parseDeclarations( rule['declarations'] );

			if ( ! _.isEmpty( declarations ) ) {
				var settingId = rule['setting'];

				// this.deleteRules( elementId, settingId );

				// Add the rule to the stylesheet and lookup array
				Tailor.CSS.addRule( this.sheet, selectors, declarations, this.lookup.length );
				
				this.lookup.push( {
					elementId: elementId,
					settingId: settingId
				} );
			}
		}
	},

	/**
	 * Returns true if the rule is properly formatted.
	 *
	 * @since 1.7.3
	 *
	 * @param rule
	 * @returns {*|Boolean}
	 */
	checkRule : function( rule ) {
		return _.has( rule, 'selectors' ) &&
		       _.has( rule, 'declarations' ) &&
		       _.has( rule, 'setting' );
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

	getAllRules : function() {
		var rules = {};
		for ( var i = 0; i < this.lookup.length; i++ ) {
			var elementId = this.lookup[ i ]['elementId'];
			var rule = this.sheet.cssRules[ i ];
			
			rules[ elementId ] = rules[ elementId ] || [];
			rules[ elementId ].push( {
				selectors : rule.selectorText,
				declarations : rule.style.cssText,
				setting: this.lookup[ i ]['settingId'] || ''
			} );
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
},{}],39:[function(require,module,exports){
var $ = Backbone.$,
    $body = $( 'body' ),
    $win = $( window ),
    ElementCollection = require( '../../entities/collections/elements' ),
    ElementModule;

var $templates = jQuery( '<div id="tailor-templates"></div>' ).appendTo( $body );

ElementModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @param options
     */
	onBeforeStart : function( options ) {
        var module = this;

        this.collection = new ElementCollection( options.elements );
        
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
             * @param templates
             * @param css
             */
            resetElements : function( models, templates, css ) {
                if ( models === module.collection.models ) {
                    return;
                }

                $templates.append( templates );

                /**
                 * Clears all existing dynamic CSS rules.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'css:clear' );

                /**
                 * Fires before the element collection is restored.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'before:elements:restore' );
                app.channel.trigger( 'canvas:reset' );

                module.collection.reset( [] );
                module.collection.reset( models );

                /**
                 * Adds new dynamic CSS rules.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'css:add', css );

                /**
                 * Fires when the element collection is restored.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'elements:restore' );

                $win.trigger( 'resize' );
            },

            getTemplates: function() {
                module.collection.each( function( model ) {
                    model.trigger( 'template', model.get( 'id' ) );
                } );
                return $templates[0].innerHTML;
            }
        };

        app.channel.reply( 'canvas:elements', api.getElements );
        app.channel.reply( 'canvas:templates', api.getTemplates );
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
},{"../../entities/collections/elements":21}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
        this.el.style = '';
        this.el.style.visibility = 'hidden';
        this.el.style.opacity = 0;
    }

} );

module.exports = GuideView;
},{}],43:[function(require,module,exports){
var SelectMenuItemView = Marionette.ItemView.extend( {

    tagName : 'div',

	className : 'select__item',

	events : {
		'click' : 'onClick'
	},

	getTemplate : function() {
		return _.template( '<span><%= label %></span>' );
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
},{}],44:[function(require,module,exports){
var SelectMenuItemView = require( './select-menu-item' ),
    SelectMenuView;

SelectMenuView = Marionette.CompositeView.extend( {

    className : 'select',

	childView : SelectMenuItemView,

	childViewContainer : '.select__menu',

	ui : {
		'add' : '.js-add',
		'edit' : '.js-edit',
		'copy' : '.js-copy',
		'delete' : '.js-delete'
	},

    events : {
        'click @ui.add' : 'addElement',
        'click @ui.edit' : 'editElement',
        'click @ui.copy' : 'copyElement',
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
        data.type = this.model.get( 'type' );
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

        var style = getComputedStyle( this._view.el, null );
        var borderTop = parseInt( style.getPropertyValue( 'border-top-width' ), 10 );
        var borderRight = parseInt( style.getPropertyValue( 'border-right-width' ), 10 );
        var borderBottom = parseInt( style.getPropertyValue( 'border-bottom-width' ), 10 );
        var borderLeft = parseInt( style.getPropertyValue( 'border-left-width' ), 10 );

        var left = Math.round( parseFloat( thatRect.left ) ) + borderLeft;
        var right = Math.min( window.innerWidth + 1, Math.round( thatRect.right ) - borderRight );
        var width = right - left;

        this.el.style.top = ( Math.round( parseFloat( thatRect.top - parseFloat( thisRect.top ) ) ) + borderTop ) + 'px';
        this.el.style.left = ( left - thisRect.left ) + 'px';
        this.el.style.width = width + 'px';
        this.el.style.height = ( Math.round( parseFloat( thatRect.height ) ) - borderTop - borderBottom ) + 'px';

        var controls = this.el.querySelector( '.select__controls' );
        var menu = this.el.querySelector( '.select__menu' );
        if ( menu && controls ) {
            var menuRect = menu.getBoundingClientRect();
            var controlsRect = controls.getBoundingClientRect();
            if ( ( menuRect.width + controlsRect.width ) > parseInt( this.el.style.width, 10 ) ) {
                this.el.classList.add( 'is-minimal' );
            }
        }
    },

	/**
     * Adds a child to the container element.
     *
     * @since 1.7.3
     */
    addElement : function() {
        var child = this.model.collection.createChild( this.model );
        
        // Set the collection to library to ensure the history snapshot is created
        child.set( 'collection', 'library', { silent : true } );

        /**
         * Fires when a child element is added.
         *
         * @since 1.7.3
         *
         * @param this.model
         */
        app.channel.trigger( 'element:add', child );
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
	 * Copies the target element and creates a duplicate immediately below it.
     *
     * @since 1.6.2
     */
    copyElement : function() {
        this.model.copyAfter( this._view, this._view );

        /**
         * Fires when an element is copied.
         *
         * @since 1.6.2
         *
         * @param this.model
         */
        app.channel.trigger( 'element:copy', this.model );
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
},{"./select-menu-item":43}],45:[function(require,module,exports){
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
},{"./show/guide":42,"./show/select-menu":44}],46:[function(require,module,exports){
require( './preview/helpers' );
require( './preview/behaviors' );
require( './preview/css' );
},{"./preview/behaviors":47,"./preview/css":48,"./preview/helpers":49}],47:[function(require,module,exports){
( function( $, app, SettingAPI, ElementAPI ) {

	ElementAPI.onRender( 'tailor_carousel', function( atts, model ) {
		var carousel = this;
		var options = {
			autoplay : '1' == atts.autoplay,
			autoplaySpeed : atts.autoplay_speed,
			arrows : '1' == atts.arrows,
			dots : false,
			fade : '1' == atts.fade && '1' == atts.items_per_row,
			slidesToShow : parseInt( atts.items_per_row, 10 ) || 1,
			adaptiveHeight : true
		};

		carousel.$el.tailorCarousel( options );
	} );

	ElementAPI.onRender( 'tailor_content', function( atts, model ) {
		if ( this.$el.find( '.is-lightbox-image' ).length > 0 ) {
			this.$el.tailorLightbox( {
				disableOn : function() {
					return $el.hasClass( 'is-selected' );
				}
			} );
		}
	} );

	ElementAPI.onRender( 'tailor_gallery', function( atts, model ) {
		var $el = this.$el;
		var options;

		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				autoplaySpeed : atts.autoplay_speed,
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
				autoplaySpeed : atts.autoplay_speed,
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
				autoplaySpeed : atts.autoplay_speed,
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
		if ( atts['background_image'] && atts['parallax'] && 1 == atts['parallax'] ) {
			this.$el.tailorParallax();
		}
	} );

	ElementAPI.onRender( 'tailor_tabs', function( atts, model ) {
		this.$el.tailorTabs();
	} );

	ElementAPI.onRender( 'tailor_toggles', function( atts, model ) {
		this.$el.tailorToggles();
	} );

} ( window.jQuery, window.app, window.Tailor.Api.Setting, window.Tailor.Api.Element ) );
},{}],48:[function(require,module,exports){
var $ = Backbone.$,
	$win = $( window );

( function( window,  app, SettingAPI ) {

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
	 * Returns an object containing style positions and values.
	 *
	 * @since 1.7.2
	 *
	 * @param string
	 * @returns {*}
	 */
	function getStyleValues( string ) {
		var values;
		if ( -1 != string.indexOf( ',' ) ) {
			values = string.split( ',' );
		}
		else {
			values = string.split( '-' ); // Old format
		}
		if ( 2 == values.length ) {
			values = _.object( [ 'top', 'bottom' ], values );
		}
		else if ( 4 == values.length ) {
			values = _.object( [ 'top', 'right', 'bottom', 'left' ], values );
		}
		else {
			values = {};
		}
		return values;
	}

	/**
	 * Returns the media query for a given setting ID.
	 *
	 * @since 1.7.2
	 *
	 * @param string
	 * @returns {string}
	 */
	function getMediaQuery( string ) {
		var query = '';
		_.each( [ '_tablet', '_mobile' ], function( target ) {
			if ( string.substring( string.length - target.length ) == target ) {
				query = target.substring(1)
			}
		} );
		return query;
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
		window.Tailor.Settings.overrides = {

			// Global overrides
			'*' : {},

			'tailor_button' : {
				'color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'color', 'tailorValidateColor' ],
				'background_color' : [ [ '.tailor-button__inner' ], 'background-color', 'tailorValidateColor' ],
				'background_color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'background-color', 'tailorValidateColor' ],
				'border_color' : [ [ '.tailor-button__inner' ], 'border-color', 'tailorValidateColor' ],
				'border_color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'border-color', 'tailorValidateColor' ],
				'padding' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'margin' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'margin_tablet' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'margin_mobile' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'border_width' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_tablet' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_mobile' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_radius' : [ [ '.tailor-button__inner' ], 'border-radius', 'tailorValidateUnit' ],
				'shadow' : [ [ '.tailor-button__inner' ], 'box-shadow' ]
			},

			'tailor_card' : {
				'border_color' : [ [ '', '.tailor-card__header' ], 'border-color', 'tailorValidateColor' ],
				'padding' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ]
			},

			'tailor_carousel' : {
				'border_color' : [ [ '', '.slick-dots' ], 'border-color', 'tailorValidateColor' ]
			},

			'tailor_grid' : {
				'border_color' : [ [ '.tailor-grid__item' ], 'border-color', 'tailorValidateColor' ],
				'border_style' : function( to, from, model ) {
					return [ {
						selectors: [ '&.tailor-grid--bordered .tailor-grid__item' ],
						declarations: {
							'border-style': tailorValidateString( to ) + '!important'
						}
					} ];
				},
				'border_width' : function( to, from, model ) {
					return [ {
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				},
				'border_width_tablet' : function( to, from, model ) {
					return [ {
						media: 'tablet',
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				},
				'border_width_mobile' : function( to, from, model ) {
					return [ {
						media: 'mobile',
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				}
			},

			'tailor_grid_item' : {
				'padding' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ]
			},

			'tailor_tabs' : {
				'border_color' : [ [ '.tailor-tabs__navigation-item', '.tailor-tab' ], 'border-color', 'tailorValidateColor' ]
			},
			
			'tailor_tab' : {
				'background_color' : [ [ '&.tailor-tabs__navigation-item', '&.tailor-tab' ], 'background-color', 'tailorValidateColor' ],
				'padding' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'border_width' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_tablet' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_mobile' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'background_repeat' : [ [ '&.tailor-tab' ], 'background-repeat', 'tailorValidateString' ],
				'background_position' : [ [ '&.tailor-tab' ], 'background-position', 'tailorValidateString' ],
				'background_size' : [ [ '&.tailor-tab' ], 'background-size', 'tailorValidateString' ],
				'background_attachment' : [ [ '&.tailor-tab' ], 'background-attachment', 'tailorValidateString' ]
			},

			'tailor_toggle' : {
				'border_color' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-color', 'tailorValidateColor' ],
				'border_style' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-style', 'tailorValidateString' ],
				'border_radius' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-radius', 'tailorValidateUnit' ]
			},

			'tailor_section' : {
				'max_width' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'max_width_tablet' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'max_width_mobile' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'min_height' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ],
				'min_height_tablet' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ],
				'min_height_mobile' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ]
			}
		};

		/**
		 * Returns the CSS rule definition to be used for the element/setting.
		 *
		 * @since 1.7.3
		 */
		function getDefinition( tag, id, definition ) {
			if ( window.Tailor.Settings.overrides['*'].hasOwnProperty( id ) ) {
				return window.Tailor.Settings.overrides['*'][ id ];
			}
			if ( window.Tailor.Settings.overrides.hasOwnProperty( tag ) && window.Tailor.Settings.overrides[ tag ].hasOwnProperty( id ) ) {
				return window.Tailor.Settings.overrides[ tag ][ id ];
			}
			return definition;
		}

		/**
		 * Registers an Element Setting API callback function.
		 *
		 * @since 1.7.2
		 *
		 * @param definitions
		 */
		function registerCallbacks( definitions ) {
			_.each( definitions, function( definition, id ) {
				SettingAPI.onChange( 'element:' + id, function( to, from, model ) {
					definition = getDefinition( model.get( 'tag' ), id, definition );
					if ( 'function' == typeof definition ) {
						return definition.call( this, to, from, model );
					}

					if ( '' == to ) {
						return [];
					}
					
					var rule = {
						media: getMediaQuery( id ),
						selectors: definition[0],
						declarations: {}
					};
					if ( 'function' == typeof window[ definition[2] ] ) {
						rule.declarations[ definition[1] ] = window[ definition[2] ]( to );
					}
					else {
						rule.declarations[ definition[1] ] = to;
					}
					return [ rule ];
				} );
			} );
		}

		//
		// General
		//
		// Horizontal alignment
		_.each( [
			'horizontal_alignment',
			'horizontal_alignment_tablet',
			'horizontal_alignment_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				var media = getMediaQuery( id );
				if ( '' != media ) {
					media = '-' + media;
				}

				// Update class name
				if ( from ) {
					this.el.classList.remove( 'u-text-' + from + media );
				}
				this.el.classList.add( 'u-text-' + to + media );

				if ( 'tailor_list_item' == model.get( 'tag' ) ) {
					var atts = model.get( 'atts' );
					if ( ! _.isEmpty( atts['graphic_background_color'] ) || ! _.isEmpty( atts['graphic_background_color_hover'] ) ) {
						return [ {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == to ) ? '0' : '1em',
								'padding-right': ( 'right' == to ) ? '1em' : '0'
							}
						} ];
					}
					else {
						return [ {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': '0',
								'padding-right': '0'
							}
						} ];
					}
				}
			} );
		} );

		// Vertical alignment
		_.each( [
			'vertical_alignment',
			'vertical_alignment_tablet',
			'vertical_alignment_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				var media = getMediaQuery( id );
				if ( '' !== media ) {
					media = '-' + media;
				}

				if ( from ) {
					this.el.classList.remove( 'u-align-' + from + media );
				}
				this.el.classList.add( 'u-align-' + to + media );
			} );
		} );

		// Button size
		_.each( [
			'size',
			'size_tablet',
			'size_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				if ( 'tailor_button' == model.get( 'tag' ) ) {
					var media = getMediaQuery( id );
					if ( '' != media ) {
						media = '-' + media;
					}

					if ( from ) {
						this.el.classList.remove( 'tailor-button--' + from + media );
					}
					this.el.classList.add( 'tailor-button--' + to + media );
				}
			} );
		} );

		// Max width
		registerCallbacks( {
			'width': [ [], 'width', 'tailorValidateUnit' ],
			'width_tablet': [ [], 'width', 'tailorValidateUnit' ],
			'width_mobile': [ [], 'width', 'tailorValidateUnit' ],
			'max_width' : [ [], 'max-width', 'tailorValidateUnit' ],
			'max_width_tablet' : [ [], 'max-width', 'tailorValidateUnit' ],
			'max_width_mobile' : [ [], 'max-width', 'tailorValidateUnit' ],
			'min_height' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_height_tablet' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_height_mobile' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_item_height' : [ [ '.tailor-grid__item' ], 'min-height', 'tailorValidateUnit' ]
		} );

		//
		// Colors
		//
		// Color
		// Color (hover)
		// Link color
		// Link color (hover)
		// Heading color
		// Background color
		// Background color (hover)
		// Graphic color
		// Graphic color (hover)
		// Title color
		// Title background color
		registerCallbacks( {
			'color' : [ [], 'color', 'tailorValidateColor' ],
			'color_hover' : [ [ ':hover' ], 'color', 'tailorValidateColor' ],
			'link_color' : [ [ 'a' ], 'color', 'tailorValidateColor' ],
			'link_color_hover' : [ [ 'a:hover' ], 'color', 'tailorValidateColor' ],
			'heading_color' : [ [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ], 'color', 'tailorValidateColor' ],
			'background_color' : function( to, from, model ) {
				var atts = model.get( 'atts' );

				// Re-render the element if a background image is also being used
				if ( atts['background_image'] ) {
					return false;
				}

				var definition = getDefinition( model.get( 'tag' ), 'background_color', [ [], 'background-color', 'tailorValidateColor' ] );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				var rule = {
					selectors: definition[0],
					declarations: {}
				};
				if ( 'function' == typeof window[ definition[2] ] ) {
					rule.declarations[ definition[1] ] = window[ definition[2] ]( to );
				}
				else {
					rule.declarations[ definition[1] ] = to;
				}
				return [ rule ];
			},
			'background_color_hover' : [ [ ':hover' ], 'background-color', 'tailorValidateColor' ],
			'border_color' : [ [], 'border-color', 'tailorValidateColor' ],
			'border_color_hover' : [ [ ':hover' ], 'border-color', 'tailorValidateColor' ],
			'graphic_color' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				if ( 'tailor_box' == tag ) {
					return [ {
						selectors: [ '.tailor-box__graphic' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
				else if ( 'tailor_list_item' == tag ) {
					return [ {
						selectors: [ '.tailor-list__graphic' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
			},
			'graphic_color_hover' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				if ( 'tailor_box' == tag ) {
					return [ {
						selectors: [ '.tailor-box__graphic:hover' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
				else if ( 'tailor_list_item' == tag ) {
					return [ {
						selectors: [ '.tailor-list__graphic:hover' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
			},
			'graphic_background_color' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				var rules = [];

				if ( 'tailor_box' == tag ) {
					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-box__graphic' ],
							declarations: {
								'margin-bottom': '1em',
								'background-color' : tailorValidateColor( to ),
								'text-align': 'center'
							}
						} );
					}
				}
				else if ( 'tailor_list_item' == tag ) {
					var atts = model.get( 'atts' );
					var alignment = atts['horizontal_alignment'];

					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-list__graphic' ],
							declarations: {
								'background-color' : tailorValidateColor( to ),
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == alignment ) ? '0' : '1em',
								'padding-right': ( 'right' == alignment ) ? '1em' : '0'
							}
						} );
					}
					else {
						if ( ! _.isEmpty( atts['graphic_background_color_hover'] ) ) {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': ( 'right' == alignment ) ? '0' : '1em',
									'padding-right': ( 'right' == alignment ) ? '1em' : '0'
								}
							} );
						}
						else {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': '0',
									'padding-right': '0'
								}
							} );
						}
					}
				}

				return rules;
			},
			'graphic_background_color_hover' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				var rules = [];

				if ( 'tailor_box' == tag ) {
					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-box__graphic' ],
							declarations: {
								'margin-bottom': '1em',
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-box__graphic:hover' ],
							declarations: {
								'background-color' : tailorValidateColor( to )
							}
						} );
					}
				}
				else if ( 'tailor_list_item' == tag ) {
					var atts = model.get( 'atts' );
					var alignment = atts['horizontal_alignment'];

					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-list__graphic' ],
							declarations: {
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == alignment ) ? '0' : '1em',
								'padding-right': ( 'right' == alignment ) ? '1em' : '0'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__graphic:hover' ],
							declarations: {
								'background-color' : tailorValidateColor( to )
							}
						} );
					}
					else {
						if ( ! _.isEmpty( atts['graphic_background_color'] ) ) {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': ( 'right' == alignment ) ? '0' : '1em',
									'padding-right': ( 'right' == alignment ) ? '1em' : '0'
								}
							} );
						}
						else {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': '0',
									'padding-right': '0'
								}
							} );
						}
					}
				}

				return rules;
			},
			'title_color' : [ [ '.tailor-toggle__title' ], 'color', 'tailorValidateColor' ],
			'title_background_color' : [ [ '.tailor-toggle__title' ], 'background-color', 'tailorValidateColor' ],
			'navigation_color' : function( to, from, model ) {
				return [ {
					'selectors' : [ '.slick-active button:before' ],
					'declarations' : {
						'background-color' : tailorValidateColor( to )
					}
				}, {
					'selectors' : [ '.slick-arrow:not( .slick-disabled )' ],
					'declarations' : {
						'color' : tailorValidateColor( to )
					}
				} ];
			}
		} );

		//
		// Attributes
		//
		// Border style
		// Border radius
		// Background repeat
		// Background position
		// Background size
		// Background attachment
		registerCallbacks( {
			'class' : function( to, from, model ) {
				var classNames;
				if ( ! _.isEmpty( from ) ) {

					// Prevent multiple whitespace and whitespace at the end of string.
					classNames = from.trim().split( /\s+(?!$)/g );
					for ( var i in classNames ) {
						if ( classNames.hasOwnProperty( i ) ) {
							this.el.classList.remove( classNames[ i ] );
						}
					}
				}
				if ( ! _.isEmpty( to ) ) {
					classNames = to.trim().split( /\s+(?!$)/g );
					for ( var j in classNames ) {
						if ( classNames.hasOwnProperty( j ) ) {
							this.el.classList.add( classNames[ j ] );
						}
					}
				}
			},
			'border_style' : [ [], 'border-style', 'tailorValidateString' ],
			'border_radius' : [ [], 'border-radius', 'tailorValidateUnit' ],
			'background_repeat' : [ [], 'background-repeat', 'tailorValidateString' ],
			'background_position' : [ [], 'background-position', 'tailorValidateString' ],
			'background_size' : [ [], 'background-size', 'tailorValidateString' ],
			'background_attachment' : [ [], 'background-attachment', 'tailorValidateString' ],
			'shadow' : function( to, from, model ) {
				var definition = getDefinition( model.get( 'tag' ), 'shadow', [ [] ] );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				if ( 1 == to ) {
					return [ {
						selectors: definition[0],
						declarations: {
							'box-shadow' : '0 2px 6px rgba(0, 0, 0, 0.1)'
						}
					} ];
				}
				return [];
			}
		} );

		// Margin
		// Padding
		// Border width
		_.each( {
			'margin' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'margin_tablet' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'margin_mobile' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'padding' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'padding_tablet' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'padding_mobile' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'border_width' : [ [], 'border-{0}-width', 'tailorValidateUnit' ],
			'border_width_tablet' : [ [], 'border-{0}-width', 'tailorValidateUnit' ],
			'border_width_mobile' : [ [], 'border-{0}-width', 'tailorValidateUnit' ]
		}, function( definition, id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				definition = getDefinition( model.get( 'tag' ), id, definition );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				var rules = [];
				var rule = {
					media: getMediaQuery( id ),
					selectors: definition[0],
					declarations: {}
				};

				_.each( getStyleValues( to ), function( value, position ) {
					if ( 'function' == typeof window[ definition[3] ] ) {
						rule.declarations[ definition[1].replace( '{0}', position ) ] = window[ definition[2] ]( value );
					}
					else {
						rule.declarations[ definition[1].replace( '{0}', position ) ] = value;
					}
				} );

				if ( _.keys( rule.declarations ).length > 0 ) {
					rules.push( rule );
				}
				return rules;
			} );
		} );
	} );

} ( window, window.app, window.Tailor.Api.Setting ) );
},{}],49:[function(require,module,exports){
/**
 * Ensures a string does not contain numeric values.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*|void|{style, text, priority, click}|XML}
 */
window.tailorValidateString = function( string ) {
	return string.replace( /[0-9]/g, '' );
};

/**
 * Ensures a string contains only numeric values.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*|void|{style, text, priority, click}|XML}
 */
window.tailorValidateNumber = function( string ) {
	string = string.replace( /[^0-9,.]+/i, '' );
	return ! _.isEmpty( string ) ? string : '0';
};

/**
 * Ensures a hex or RGBA color value is valid.
 *
 * Since 1.7.2
 *
 * @param color
 * @returns {*}
 */
window.tailorValidateColor = function( color ) {
	if ( /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test( color ) ) {
		return color;
	}
	if ( isRGBA( color ) ) {
		return color;
	}
	return '';
};

/**
 * Returns true if the given color is RGBA.
 *
 * @since 1.7.2
 *
 * @param color
 * @returns {boolean}
 */
function isRGBA( color ) {
	return /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/.test( color )
}

/**
 * Ensures a string contains a valid numeric value and unit.
 *
 * @since 1.7.2
 *
 * @param value
 * @returns {string}
 */
window.tailorValidateUnit = function( value ) {
	var sign = '';
	if ( '-' == value.charAt( 0 ) ) {
		sign = '-';
		value = value.substring( 1 );
	}
	return ( sign + tailorValidateNumber( value ) + getUnit( value ) );
};

/**
 * Returns the unit within a given string.
 *
 * @since 1.7.2
 *
 * @param string
 * @returns {*}
 */
function getUnit( string ) {
	var map = [
		"px",
		"%",
		"in",
		"cm",
		"mm",
		"pt",
		"pc",
		"em",
		"rem",
		"ex",
		"vw",
		"vh"
	];
	var matches = string.match( new RegExp( map.join( '|' ) ) );
	if ( matches ) {
		return matches[0];
	}
	return 'px';
}
},{}],50:[function(require,module,exports){

var $ = window.jQuery,
    $win = $( window ),
    app = window.app,
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

    // Trigger a resize even on the window when a sidebar setting changes
    $win.trigger( 'resize' );
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

            // Re-render the element if the the callback function returns a value of false
            if ( false === rules ) {
                view.model.trigger( 'change:atts', view.model, view.model.get( 'atts' ) );
            }
            else if ( _.isArray( rules ) && rules.length > 0 ) {

                // Process the rules
                for ( var rule in rules ) {
                    if ( rules.hasOwnProperty( rule ) ) {
                        if ( ! rules[ rule ].hasOwnProperty( 'selectors' ) || ! rules[ rule ].hasOwnProperty( 'declarations' ) ) {
                            continue;
                        }
                        
                        var query = checkQuery( rules[ rule ].media );
                        ruleSets[ query ] = ruleSets[ query ] || {};
                        ruleSets[ query ][ elementId ] = ruleSets[ query ][ elementId ] || [];

                        if ( _.keys( rules[ rule ].declarations ).length > 0 ) {
                            ruleSets[ query ][ elementId ].push( {
                                selectors: rules[ rule ].selectors,
                                declarations: rules[ rule ].declarations,
                                setting: rules[ rule ].setting || settingId
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
},{}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
/**
 * Tailor.Components.Lightbox
 *
 * A lightbox component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Lightbox;

Lightbox = Components.create( {

    getDefaults: function() {
        return {
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
        };
    },

    /**
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize: function() {
        this.magnificPopup();
    },

    /**
     * Initializes the Magnific Popup plugin.
     *
     * @since 1.7.5
     */
    magnificPopup : function() {
        this.$el.magnificPopup( this.options );
    }

} );

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

module.exports = Lightbox;
},{}],54:[function(require,module,exports){
/**
 * Tailor.Components.Map
 *
 * A map component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Map;

Map = Components.create( {

    getDefaults: function() {
        return {
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
        };
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
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize : function() {
        var component = this;
        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options )
            .then( function( coordinates ) {
                component.center = coordinates;
                var controls = component.options.controls;
                var settings = {
                    zoom : component.options.zoom,
                    draggable : component.options.draggable,
                    scrollwheel : component.options.scrollwheel,
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
                var styles = component.getStyles( component.options.saturation, component.options.hue );
    
                component.map = new google.maps.Map( component.$canvas[0], settings );
                component.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
                component.map.setMapTypeId( 'map_style' );
                component.setupMarkers( component.$el, component.map );
            } );
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
                deferred.reject( new Error( 'No address or map coordinates provided' ) );
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
     * Refreshes and centers the map.
     * 
     * @since 1.7.5
     */
    refreshMap: function() {
        if (  this.map ) {
            google.maps.event.trigger( this.map, 'resize' );
            this.map.setCenter( this.center );
        }
    },

    /**
     * Element listeners
     */
    onMove: function() {
        this.refreshMap();
    },

    onRefresh: function() {
        this.refreshMap();
    },

    onChangeParent: function() {
        this.refreshMap();
    },
    
    onDestroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;
    },

    /**
     * Window listeners
     */
    onResize: function() {
        this.refreshMap();
    }

} );

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
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
},{}],55:[function(require,module,exports){
/**
 * Tailor.Components.Masonry
 *
 * A masonry component for managing Shuffle elements.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Masonry;

Masonry = Components.create( {

    shuffleActive : false,

    getDefaults: function() {
        return {
            itemSelector : '.tailor-grid__item'
        };
    },
    
    /**
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize: function() {
        this.$wrap = this.$el.find( '.tailor-grid--masonry' );
        this.shuffle();
    },

    /**
     * Initializes the Shuffle instance.
     *
     * @since 1.0.0
     */
    shuffle : function() {
        var component = this;
        this.$wrap.imagesLoaded( function() {
            component.$wrap.shuffle( component.options );
            component.shuffleActive = true;
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
        this.shuffleActive = false;
    },

    /**
     * Element listeners
     */
    onMove: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    },

    onChangeParent: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    },

    onDestroy: function() {
        if ( this.shuffleActive ) {
            this.unShuffle();
        }
    },
    
    /**
     * Window listeners
     */
    onResize: function() {
        if ( this.shuffleActive ) {
            this.refreshShuffle();
        }
    }
    
} );

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

},{}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
/**
 * Tailor.Components.Slideshow
 *
 * A slideshow component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Slideshow;

Slideshow = Components.create( {
    
    slickActive: false,
    
    getDefaults: function() {
        return {
            items : '.tailor-slideshow__slide',
            prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button"></button>',
            nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button"></button>',
            adaptiveHeight : true,
            draggable : false,
            speed : 250,
            slidesToShow : 1,
            slidesToScroll : 1,
            autoplay : false,
            autoplaySpeed : 3000,
            arrows : false,
            dots : false,
            fade : true
        };
    },

    onInitialize: function() {
        this.$wrap = this.$el.find( '.tailor-slideshow__slides' );
        this.slick();
    },
    
    /**
     * Initializes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    slick : function() {
        var component = this;
        this.$el.imagesLoaded( function() {
            component.$wrap.slick( component.options );
            component.slickActive = true;
        } );
    },

    /**
     * Refreshes the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    refreshSlick : function() {
        if ( this.slickActive ) {
            this.$wrap.slick( 'refresh' );
        }
    },

    /**
     * Destroys the Slick Slider plugin.
     *
     * @since 1.0.0
     */
    unSlick : function() {
        if ( this.slickActive ) {
            this.$wrap.slick( 'unslick' );
        }
    },
    
    /**
     * Element listeners
     */
    onMove: function() {
        this.refreshSlick();
    },
    
    onBeforeCopy: function() {
        this.unSlick();
    },
    
    onChangeParent: function() {
        this.refreshSlick();
    },

    onDestroy : function() {
        this.unSlick();
    },

    /**
     * Window listeners
     */
    onResize: function() {
        this.refreshSlick();
    }
    
} );

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

},{}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
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

        var elementClass = elementId ? '.tailor-' + elementId : '';
		var prefix = '.tailor-ui ';
		if ( ! selectors.length ) {
			return prefix + elementClass;
		}

		selectors = selectors.map( function( selector ) {
			if ( selector.indexOf( '&' ) > -1 ) {
				selector = selector.replace( '&', elementClass );
			}
			else {
				var firstCharacter = selector.charAt( 0 );
				if ( ':' == firstCharacter || '::' == firstCharacter ) {
					selector = elementClass + selector;
				}
				else {
					selector = elementClass + ' ' + selector
				}
			}
			return prefix + selector;
		} );

		return selectors.join( ',' );
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
},{}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}]},{},[1]);
