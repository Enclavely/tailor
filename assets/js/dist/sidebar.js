(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
/**
 * Tailor.Notify
 *
 * Notification class for presenting simple messages to the end user.
 *
 * @class
 */
var Notification;

require( './polyfills/transitions' );

Notification = function( options ) {
    this.options = _.extend( {}, this.defaults, options );
    this.el = document.createElement( 'div' );
    this.el.className = 'notification notification--' + this.options.type;
    this.container = document.getElementById( 'tailor-notification-container' ) || document.body;

    this.initialize();
};

Notification.prototype = {

    defaults : {
        message : '',
        type : '',
        ttl : 3000,

        onShow: function () {},
        onHide: function () {}
    },

	/**
	 * Initializes the notification.
	 *
	 * @since 1.0.0
	 */
	initialize : function() {
        this.el.innerHTML = this.options.message;
        this.container.insertBefore( this.el, this.container.firstChild );
    },

	/**
	 * Shows the notification.
	 *
	 * @since 1.0.0
	 */
    show : function() {
        var notification = this;
        notification.el.classList.add( 'is-visible' );

        if ( 'function' == typeof notification.options.onShow ) {
            notification.options.onShow.call( notification );
        }

        notification.session = setTimeout( function() {
            notification.hide();
        }, notification.options.ttl );
    },

    /**
     * Hides the notification.
     *
     * @since 1.0.0
     */
    hide : function() {

        var obj = this;

        var onTransitionEnd = function( e ) {

            if ( Modernizr.cssanimations ) {
                if ( e.target !== obj.el ) {
                    return false;
                }
                obj.el.removeEventListener( window.transitionEndName, onTransitionEnd );
            }

            obj.container.removeChild( obj.el );

            if ( 'function' == typeof obj.options.onShow ) {
                obj.options.onShow.call( obj );
            }
        };

        clearTimeout( obj.session );

        if ( Modernizr.csstransitions ) {
            obj.el.addEventListener( window.transitionEndName, onTransitionEnd );
            obj.el.classList.remove( 'is-visible' );
        }
        else {
            onTransitionEnd();
        }
    }
};

/**
 * Creates a new notification.
 *
 * @since 1.0.0
 *
 * @param msg
 * @param type
 */
var notify = function( msg, type ) {

    var notification = new Notification( {
        message : msg,
        type : type || 'error'
    } );

    notification.show();
};

module.exports = notify;

},{"./polyfills/transitions":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
( function( window, $ ) {
    
    'use strict';
    
    var $doc = $( document );
    var $win = $( window );
    
    // Include utilities
    require( './shared/utility/polyfills/classlist' );
    require( './shared/utility/polyfills/raf' );
    require( './shared/utility/polyfills/transitions' );
    require( './shared/utility/ajax' );

    // Include components
    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Resizable:          require( './sidebar/components/behaviors/resizable' ),
            Panel:              require( './sidebar/components/behaviors/panel' ),
            Draggable:          require( './shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './sidebar/app' );
    window.app = new App();

    // Create the Tailor object
    window.Tailor = {
        Api : {
            Setting :   require( './shared/components/api/setting' )
        },
        Notify :    require( './shared/utility/notify' ),
        Models :    {},
        Panels :    {},
        Sections :  {},
        Controls :  {},
        Items :     {},
        Helpers :   {
            
            /**
             * Evaluates whether the given condition is true, given two values.
             *
             * @since 1.5.0
             *
             * @param actual
             * @param condition
             * @param required
             * 
             * @returns {*}
             */
            checkCondition : function( condition, actual, required ) {
                actual = actual || '';
                switch ( condition ) {
                    case 'equals' : return actual === required;

                    case 'not':
                        if ( _.isArray( required ) ) {
                            return -1 === required.indexOf( actual );
                        }
                        return actual !== required;

                    case 'lessThan': return ( actual < parseInt( required, 10 ) );

                    case 'greaterThan': return ( actual > parseInt( required, 10 ) );

                    case 'contains' :
                        if ( _.isString( actual ) ) {
                            actual = actual.split( ',' );
                        }
                        if ( _.isArray( required ) ) {
                            var intersection = _.intersection( required, actual );
                            return 0 !== intersection.length;
                        }
                        return -1 !== _.indexOf( actual, required );
                }
            }
        }
    };

    wp.media.view.settings.post.id = window.post.id;

    app.addRegions( {
        content : '#tailor-sidebar-content',
        dialog : {
            selector : "#tailor-dialog-container",
            regionClass : require( './sidebar/modules/dialog/dialog-region' )
        },
        modal : {
            selector : "#tailor-modal-container",
            regionClass : require( './sidebar/modules/modal/modal-region' )
        }
    } );

    // Load models
    Tailor.Models.Container =           require( './sidebar/entities/models/element-container' );
    Tailor.Models.Wrapper =             require( './sidebar/entities/models/element-wrapper' );
    Tailor.Models.Section =             require( './sidebar/entities/models/element-wrapper' ); // Sections are just special wrappers
    Tailor.Models.Default =             require( './sidebar/entities/models/element' );

    // Load views
    Tailor.Panels.Default =             require( './sidebar/components/panels/panel-default' );
    Tailor.Panels.Empty =               require( './sidebar/components/panels/panel-empty' );
    Tailor.Sections.Default =           require( './sidebar/components/sections/section-default' );
    Tailor.Controls.ButtonGroup =       require( './sidebar/components/controls/button-group' );
    Tailor.Controls.Checkbox =          require( './sidebar/components/controls/checkbox' );
    Tailor.Controls.Code =              require( './sidebar/components/controls/code' );
    Tailor.Controls.Colorpicker =       require( './sidebar/components/controls/colorpicker' );
    Tailor.Controls.Editor =            require( './sidebar/components/controls/editor' );
    Tailor.Controls.Gallery =           require( './sidebar/components/controls/gallery' );
    Tailor.Controls.Icon =              require( './sidebar/components/controls/icon' );
    Tailor.Controls.Image =             require( './sidebar/components/controls/image' );
    Tailor.Controls.InputGroup =        require( './sidebar/components/controls/input-group' );
    Tailor.Controls.Link =              require( './sidebar/components/controls/link' );
    Tailor.Controls.List =              require( './sidebar/components/controls/list' );
    Tailor.Controls.Radio =             require( './sidebar/components/controls/radio' );
    Tailor.Controls.Range =             require( './sidebar/components/controls/range' );
    Tailor.Controls.Select =            require( './sidebar/components/controls/select' );
    Tailor.Controls.SelectMulti =       require( './sidebar/components/controls/select-multi' );
    Tailor.Controls.Style =             require( './sidebar/components/controls/style' );
    Tailor.Controls.Switch =            require( './sidebar/components/controls/switch' );
    Tailor.Controls.Text =              require( './sidebar/components/controls/text' );
    Tailor.Controls.Textarea =          require( './sidebar/components/controls/textarea' );
    Tailor.Controls.Video =             require( './sidebar/components/controls/video' );
    Tailor.Controls.WidgetForm =        require( './sidebar/components/controls/widget-form' );
    Tailor.Controls.Default =           require( './sidebar/components/controls/text' );
    Tailor.Controls.Abstract =          require( './sidebar/components/controls/abstract-control' );

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

    // Load modules
    app.module( 'module:library', require( './sidebar/modules/library/library' ) );
    app.module( 'module:templates', require( './sidebar/modules/templates/templates' ) );
    app.module( 'module:settings', require( './sidebar/modules/settings/settings' ) );
    app.module( 'module:history', require( './sidebar/modules/history/history' ) );
    app.module( 'module:sections', require( './sidebar/modules/sections/sections' ) );
    app.module( 'module:panels', require( './sidebar/modules/panels/panels' ) );
    app.module( 'module:modal', require( './sidebar/modules/modal/modal' ) );
    app.module( 'module:dialog', require( './sidebar/modules/dialog/dialog' ) );
    app.module( 'module:notification', require( './sidebar/modules/notifications/notifications' ) );
    app.module( 'module:devicePreview', require( './sidebar/modules/device-preview/device-preview' ) );

    // Initialize preview
    require( './sidebar/preview' );
    
    app.on( 'before:start', function( options ) {

        $doc.on( 'heartbeat-send', function( e, data ) {
            data['tailor_post_id'] = window.post.id;
        } );

        wp.heartbeat.interval( 60 );
        wp.heartbeat.connectNow();

        $win

        /**
         * Warns the user if they attempt to navigate away from the page without saving changes.
         *
         * @since 1.0.0
         */
            .on( 'beforeunload.tailor', function( e ) {
                if ( app.hasUnsavedChanges() ) {
                    return window._l10n.confirmPage;
                }
            } )

            /**
             * Unlocks the post when the user navigates away from the page.
             *
             * @since 1.0.0
             */
            .on( 'unload.tailor', function( e ) {
                window.ajax.send( 'tailor_unlock_post', {
                    data : {
                        post_id : options.postId,
                        nonce : options.nonces.unlockPost
                    }
                } );
            } );
    } );

    $( function() {
        
        // Start the app
        app.start( {
            postId : window.post.id,
            nonces : window._nonces,
            l10n : window._l10n || [],
            library : window._library || [],
            templates : window._templates || [],
            panels : window._panels || [],
            sections : window._sections || [],
            settings : window._settings || [],
            controls : window._controls || []
        } );
    } );
    
} ( window, Backbone.$ ) );
},{"./shared/components/api/setting":1,"./shared/components/behaviors/draggable":2,"./shared/utility/ajax":3,"./shared/utility/notify":4,"./shared/utility/polyfills/classlist":5,"./shared/utility/polyfills/raf":6,"./shared/utility/polyfills/transitions":7,"./sidebar/app":9,"./sidebar/components/behaviors/panel":10,"./sidebar/components/behaviors/resizable":11,"./sidebar/components/controls/abstract-control":12,"./sidebar/components/controls/button-group":13,"./sidebar/components/controls/checkbox":14,"./sidebar/components/controls/code":15,"./sidebar/components/controls/colorpicker":16,"./sidebar/components/controls/editor":17,"./sidebar/components/controls/gallery":18,"./sidebar/components/controls/icon":19,"./sidebar/components/controls/image":20,"./sidebar/components/controls/input-group":21,"./sidebar/components/controls/link":22,"./sidebar/components/controls/list":25,"./sidebar/components/controls/radio":26,"./sidebar/components/controls/range":27,"./sidebar/components/controls/select":29,"./sidebar/components/controls/select-multi":28,"./sidebar/components/controls/style":30,"./sidebar/components/controls/switch":31,"./sidebar/components/controls/text":32,"./sidebar/components/controls/textarea":33,"./sidebar/components/controls/video":34,"./sidebar/components/controls/widget-form":35,"./sidebar/components/panels/panel-default":36,"./sidebar/components/panels/panel-empty":37,"./sidebar/components/sections/section-default":38,"./sidebar/entities/models/element":51,"./sidebar/entities/models/element-container":49,"./sidebar/entities/models/element-wrapper":50,"./sidebar/modules/device-preview/device-preview":56,"./sidebar/modules/dialog/dialog":58,"./sidebar/modules/dialog/dialog-region":57,"./sidebar/modules/history/history":60,"./sidebar/modules/library/library":62,"./sidebar/modules/modal/modal":65,"./sidebar/modules/modal/modal-region":64,"./sidebar/modules/notifications/notifications":73,"./sidebar/modules/panels/panels":74,"./sidebar/modules/sections/sections":79,"./sidebar/modules/settings/settings":81,"./sidebar/modules/templates/templates":84,"./sidebar/preview":85}],9:[function(require,module,exports){
/**
 * The Sidebar Marionette application.
 */
var $ = Backbone.$,
    $doc = $( document ),
    SidebarApplication;

SidebarApplication = Marionette.Application.extend( {

    _initialized: false,
    
	el : document.querySelector( '#tailor' ),

    /**
     * Initializes the application.
     *
     * @since 1.0.0
     */
	onBeforeStart : function() {
        this._collapsed = false;
        this._unsavedChanges = false;
        this.saveButton = document.querySelector( '#tailor-save' );
        this.allowableEvents = [

            // Triggered when the canvas is initialized
            'canvas:initialize',

            // Triggered by element actions
	        'element:add',
            'element:move',
            'element:resize',
            'navigation:reorder',
            'element:copy',
            'element:delete',
            
            // Triggered when the element collection is restored from a snapshot
	        'elements:restore',

            // Triggered when a set of template models are added to the element collection
            'template:add',

            // Triggered when CTRL-Z or CTRL-Y is used on the canvas
            'history:undo', 'history:redo',

            // Triggered when an element is edited
            'modal:open',
            'modal:destroy'
        ];

        this.addEventListeners();
    },
    
    onStart: function() {
        this._initialized = true;
    },

    /**
     * Returns true if there are unsaved changes.
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    hasUnsavedChanges : function() {
        return this._unsavedChanges;
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var sidebar = this;
        var events = [
            'element:add',              // When an element is added
            'element:move',             // When an element is moved
            'element:resize',           // When an element (e.g., column) is resized
            'navigation:reorder',       // When an element (e.g., tab) is reordered using navigation
            'element:copy',             // When an element is copied
            'element:delete',           // When an element is deleted
            'modal:apply',              // When changes to an element are applied
            'template:add',             // When a template is added
            'sidebar:setting:change'    // When a sidebar setting is changed
        ];

        /**
         * Updates the Save button and adds a confirmation prompt to the window when a change occurs.
         *
         * @since 1.0.0
         */
        sidebar.listenTo( sidebar.channel, events.join( ' ' ), function() {
            sidebar.saveButton.disabled = false;
            sidebar.saveButton.innerHTML = window._l10n.publish;
            sidebar._unsavedChanges = true;
        } );

        /**
         * Collapses the Sidebar when the Collapse button is selected.
         *
         * @since 1.0.0
         */
        $( '#tailor-collapse' ).on( 'click', function() {
            sidebar._collapsed = ! sidebar._collapsed;
            sidebar.el.classList.toggle( 'is-collapsed', sidebar._collapsed );
            sidebar.saveButton.setAttribute( 'aria-expanded', ! sidebar._collapsed );

            /**
             * Fires before the application closes.
             *
             * @since 1.0.0
             */
            sidebar.triggerMethod( 'collapse:sidebar' );
        } );

        /**
         * Saves settings and models when the Save button is clicked.
         *
         * @since 1.0.0
         */
        $( sidebar.saveButton ).on( 'click', function() {
            sidebar.el.classList.add( 'is-saving' );
            sidebar.saveButton.setAttribute( 'disabled', true );

            var models = sidebar.channel.request( 'canvas:elements' );
            var settings = sidebar.channel.request( 'sidebar:settings' );

            window.ajax.send( 'tailor_save', {
                data : {
                    post_id : window.post.id,
                    models : JSON.stringify( models.toJSON() ),
                    settings : JSON.stringify( settings.toJSON() ),
                    nonce : window._nonces.save
                },

                /**
                 * Updates the sidebar after a save action is completed successfully.
                 *
                 * @since 1.0.0
                 */
                success : function() {
                    sidebar.saveButton.disabled = true;
                    sidebar.saveButton.innerHTML = window._l10n.saved;
                    sidebar._unsavedChanges = false;

                    /**
                     * Fires when changes are successfully saved.
                     *
                     * @since 1.0.0
                     */
                    sidebar.channel.trigger( 'sidebar:save' );
                },

                /**
                 * Displays an error notification on request failure.
                 *
                 * @since 1.0.0
                 *
                 * @param response
                 */
                error: function( response ) {
                    sidebar.saveButton.disabled = false;

                    if ( response && response.hasOwnProperty( 'message' ) ) { // Display the error from the server
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
                },

                /**
                 * Updates the sidebar upon request completion.
                 *
                 * @since 1.0.0
                 */
                complete : function() {
                    sidebar.el.classList.remove( 'is-saving' );
                }
            } );
        } );

        sidebar.listenTo( sidebar.channel, 'canvas:handshake', sidebar.registerRemoteChannel );

        $doc.on( 'keydown', function( e ) {
            if ( _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {
                return;
            }

            if ( e.ctrlKey ) {
                if ( 89 == e.keyCode ) {
                    sidebar.channel.trigger( 'history:redo' );
                }
                else if ( 90 == e.keyCode ) {
                    sidebar.channel.trigger( 'history:undo' );
                }
            }
            else if ( e.metaKey && 90 == e.keyCode ) {
                if ( e.shiftKey ) {
                    sidebar.channel.trigger( 'history:redo' );
                }
                else {
                    sidebar.channel.trigger( 'history:undo' );
                }
            }

        } );
    },

    /**
     * Registers the remote window Radio channel.
     *
     * @since 1.0.0
     */
    registerRemoteChannel : function() {
        var sidebarApp = this;
        var iFrame = this.el.querySelector( '#tailor-sidebar-preview' );

        if ( window.location.origin === iFrame.contentWindow.location.origin ) {
            var remoteChannel = iFrame.contentWindow.app.channel;
            
            /**
             * Returns the element collection from the remote window.
             *
             * @since 1.0.0
             */
            app.channel.reply( 'canvas:elements', function() {
                return remoteChannel.request( 'canvas:elements' );
            } );

            /**
             * Returns the element templates from the remote window.
             *
             * @since 1.7.9
             */
            app.channel.reply( 'canvas:templates', function() {
                return remoteChannel.request( 'canvas:templates' );
            } );

            /**
             * Returns the element CSS from the remote window.
             *
             * @since 1.7.9
             */
            app.channel.reply( 'canvas:css', function() {
                return remoteChannel.request( 'canvas:css' );
            } );
            
            /**
             * Returns the selected element (if any) from the remote window.
             *
             * @since 1.0.0
             */
            app.channel.reply( 'canvas:element:selected', function() {
                return remoteChannel.request( 'canvas:element:selected' );
            } );

            // Forward allowable events from the canvas
            app.listenTo( remoteChannel, 'all', sidebarApp.forwardRemoteEvent );

            app.el.classList.add( 'is-initialized' );
            app.el.querySelector( '.tailor-preview__viewport' ).classList.add( 'is-loaded' );
            
            /**
             * Fires when the sidebar is initialized.
             *
             * @since 1.0.0
             *
             * @param app
             */
            app.channel.trigger( 'sidebar:initialize', app );
        }
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
    },

    /**
     * Triggers the collapse method if the Collapse button is selected using the Enter key.
     *
     * @since 1.0.0
     */
    maybeCollapse : function( e ) {
        if ( 13 === e.keyCode ) {
            this.onCollapse();
        }
    },

    /**
     * Triggers the save method if the Save button is selected using the Enter key.
     *
     * @since 1.0.0
     */
    maybeSave : function( e ) {
        if ( 13 === e.keyCode ) {
            this.onSave();
        }
    }

} );

module.exports = SidebarApplication;
},{}],10:[function(require,module,exports){
var PanelBehavior = Marionette.Behavior.extend( {

    ui: {
        backButton : '.back-button',
        helpButton : '.help-button',
        helpDescription : '.help-description',
        searchBar : '.search'
    },

    events : {
        'click @ui.helpButton': 'toggleHelp',
        'change @ui.searchBar' : 'doSearch',
        'input @ui.searchBar': 'doSearch',
        'keyup @ui.searchBar': 'doSearch',
        'search @ui.searchBar': 'doSearch'
    },

    triggers : {
        'click @ui.backButton': 'back'
    },

    /**
     * Toggles the help text when the Help button is pressed.
     *
     * @since 1.0.0
     */
    toggleHelp : function() {
        this.ui.helpButton.toggleClass( 'is-open' );
        this.ui.helpDescription.slideToggle( 150 );
    },

    /**
     * Performs a collection search based on the search criteria provided.
     *
     * @since 1.0.0
     *
     * @param e
     */
    doSearch : function( e ) {
        this.view.collection.doSearch( e.target.value );
    }

} );

module.exports = PanelBehavior;
},{}],11:[function(require,module,exports){
var ResizableBehavior = Marionette.Behavior.extend( {

    ui : {
        handle : '.modal__title'
    },

    events : {
        'mousemove' : 'onMouseMove',
        'mousedown' : 'onMouseDown',
        'dblclick @ui.handle' : 'toggleFullScreen'
    },

    /**
     * Creates and inserts the insertion pane into the page.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this._isResizing = false;
        this._isResizing = false;
        this.$ghostPane = jQuery( '<div class="ghost-pane"></div>' ).appendTo( 'body' );

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var behavior = this;
        window.addEventListener( 'resize', function() {
            behavior.checkPosition();
        }, false );
    },

    /**
     * Returns the edges of the modal window that the mouse is currently over (if any).
     *
     * @since 1.0.0
     *
     * @param e
     * @returns {Array}
     */
    detectEdges : function( e ) {
        var rect = this.el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var threshold = 8;
        var edges = [];

        // Top
        if ( y < threshold ) {
            edges.push( 'top' );
        }

        // Bottom
        if ( y >= ( rect.height - threshold ) ) {
            edges.push( 'bottom' );
        }

        // Left
        if ( x < threshold ) {
            edges.push( 'left' );
        }

        // Right
        if ( x >= ( rect.width - threshold ) ) {
            edges.push( 'right' );
        }
        return edges;
    },

    /**
     * Adds a class name to the modal window associated with the possible drag action.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseMove: function( e ) {
        if ( this._isResizing || this._isDragging ) {
            return;
        }

        this.$el.removeClass( 'top top-left top-right left right bottom bottom-left bottom-right is-draggable' );

        var edges = this.detectEdges( e );
        if ( edges.length && ! this.container.classList.contains( 'is-full-screen' ) && ! document.body.classList.contains( 'mce-fullscreen' ) ) {
            this.$el.addClass( edges.join( '-' ) );
        }
        else if ( e.target.classList.contains( 'modal__title' ) ) {
            this.el.classList.add( 'is-draggable' );
        }
    },

    /**
     * Initiates the drag or resize action, if appropriate.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseDown : function( e ) {
        if ( this._isResizing || this._isDragging ) {
            return;
        }

        var edges = this.detectEdges( e );
        if (
            edges.length &&
            ! this.$container.hasClass( 'is-full-screen' ) &&
            ! document.body.classList.contains( 'mce-fullscreen' )
        ) {
            this.resize( e, edges );
        }
        else if ( e.target === this.ui.handle.get(0) ) {
            this.drag( e );
        }
    },

    /**
     * Updates the width and height of the modal window when the user resizes it.
     *
     * @since 1.0.0
     *
     * @param e
     * @param edges
     */
    resize : function( e, edges ) {
        var that = this;
        var edge = edges.join( '-' );
        var direction = ( _.contains( edges, 'top' ) || _.contains( edges, 'left' ) ) ? -1 : 1;

        this._isResizing = true;

        document.body.classList.add( 'is-dragging' );
        document.addEventListener( 'mousemove', onResize, false );
        document.addEventListener( 'mouseup', onResizeEnd, false );

        var lastX = e.pageX;
        var lastY = e.pageY;
        var lastWidth = parseInt( that.container.style.width, 10 );
        var lastHeight = parseInt( that.container.style.height, 10 );

        /**
         * Updates the width and height of the modal window as it is resized.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onResize( e ) {
            var xDifference = ( direction * ( e.pageX - lastX ) );
            var yDifference = ( direction * ( e.pageY - lastY ) );

            switch ( edge ) {

                case 'top':
                    lastHeight = lastHeight + yDifference;
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'bottom':
                    lastHeight = lastHeight + yDifference;
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;

                case 'left':
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    break;

                case 'right':
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    break;

                case 'top-left':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'top-right':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth - xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                        that.container.style.top = ( parseInt( that.container.style.top, 10 ) - yDifference ) + 'px';
                    }
                    break;

                case 'bottom-left':
                    lastHeight = lastHeight - yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                        that.container.style.left = ( parseInt( that.container.style.left, 10 ) - xDifference ) + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;

                case 'bottom-right':
                    lastHeight = lastHeight + yDifference;
                    lastWidth = lastWidth + xDifference;
                    if ( lastWidth > 300 ) {
                        that.container.style.width = lastWidth + 'px';
                    }
                    if ( lastHeight > 400 ) {
                        that.container.style.height = lastHeight + 'px';
                    }
                    break;
            }

            that.triggerResize( lastWidth, lastHeight );

            lastY = e.pageY;
            lastX = e.pageX;
        }

        /**
         * Removes event listeners and checks to ensure that the final size is valid.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onResizeEnd( e ) {
            that._isResizing = false;

            document.body.classList.remove( 'is-dragging' );
            document.removeEventListener( 'mousemove', onResize, false );
            document.removeEventListener( 'mouseup', onResizeEnd, false );

            that.checkPosition( 150 );
        }
    },

    /**
     * Updates the position of the modal window when the user drags it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    drag : function( e ) {
        var that = this;
        var lastX;
        var lastY;

        this._isDragging = true;

        document.addEventListener( 'mousemove', onDrag, false );
        document.addEventListener( 'mouseup', onDragEnd, false );

        /**
         * Updates the top and left position of the modal window as it is dragged.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onDrag( e ) {
            document.body.classList.add( 'is-dragging' );

            that.container.style.top = parseInt( that.container.style.top, 10 ) + ( e.pageY - lastY ) + 'px';
            that.container.style.left = parseInt( that.container.style.left, 10 ) + ( e.pageX - lastX ) + 'px';

            if ( e.pageX < 5 ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'left' );
            }
            else if ( e.pageX > ( window.innerWidth - 5 ) ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'right' );
            }
            else if ( e.pageY < 5 ) {
                that.$ghostPane.css( { display: 'block' } ).addClass( 'top' );
            }
            else {

                that.resetGhostPane();

                if ( that.container.classList.contains( 'is-full-screen' ) ) {
                    that.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );
                    that.container.style.top = ( e.pageY - 20 ) + 'px';
                    that.container.style.left = ( e.pageX - ( parseInt( that.container.style.width, 10 ) / 2 ) ) + 'px';

                    that.triggerResize( parseInt( that.container.style.width, 10 ), parseInt( that.container.style.height, 10 ) );
                }
            }

            lastX = e.pageX;
            lastY = e.pageY;
        }

        /**
         * Removes event listeners and checks to ensure that the final position is valid.
         *
         * @since 1.0.0
         *
         * @param e
         */
        function onDragEnd( e ) {
            that._isDragging = false;

            document.body.classList.remove( 'is-dragging' );
            document.removeEventListener( 'mousemove', onDrag, false );
            document.removeEventListener( 'mouseup', onDragEnd, false );

            that.maybeToggleFullScreen( e );
        }
    },

	/**
     * Toggles full-screen mode if the modal window is dragged to the left, right or top of the screen.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeToggleFullScreen : function( e ) {
        var position;

        if ( e.pageY < 5 ) {
            position = 'top';
        }
        else if ( e.pageX < 5 ) {
            position = 'left';
        }
        else if ( e.pageX > ( window.innerWidth - 5 ) ) {
            position = 'right';
        }

        if ( position ) {
            this.enterFullScreen( position );
        }
        else {
            this.checkPosition( 150 );
        }
    },

    /**
     * Toggles full-screen mode.
     *
     * @since 1.0.0
     */
    toggleFullScreen : function() {
        if ( ! this.container.classList.contains( 'is-full-screen' ) ) {
            this.enterFullScreen( 'top' );
        }
        else {
            this.exitFullScreen();
        }
    },

	/**
     * Enters full-screen mode.
     *
     * @since 1.0.0
     *
     * @param position
     */
    enterFullScreen : function( position ) {
        this.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );
        this.container.classList.add( 'is-full-screen' );
        this.container.classList.add( 'is-full-screen-' + position );

        var rect = this.container.getBoundingClientRect();
        this.triggerResize( rect.width, rect.height );
    },

	/**
     * Exits full-screen mode.
     *
     * @since 1.0.0
     */
    exitFullScreen : function() {
        this.$container.removeClass( 'is-full-screen is-full-screen-left is-full-screen-right' );

        this.triggerResize( parseInt( this.container.style.width, 10 ), parseInt( this.container.style.height, 10 ) );
        this.checkPosition( 150 );
        this.resetGhostPane();
    },

    /**
     * Fires a refresh event based on the inline width and height.
     *
     * @since 1.0.0
     *
     * @param width
     * @param height
     */
    triggerResize : function( width, height ) {

	    /**
	     * Fires when the element is resized.
         *
         * @since 1.0.0
         */
        this.view.trigger( 'modal:resize', width, height );
    },

	/**
     * Hides the ghost pane.
     *
     * @since 1.0.0
     */
    resetGhostPane : function() {
        this.$ghostPane.css( { display: 'none' } );
        this.$ghostPane[0].className = 'ghost-pane';
    },

    /**
     * Sets the initial focus and checks the position of the modal window when it is first shown.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.container = this.el.parentNode;
        this.$container = this.$el.parent();

        this.checkPosition();
    },

    /**
     * Ensures that the modal window is positioned inside the viewport.
     *
     * @since 1.0.0
     *
     * @param duration
     */
    checkPosition : function( duration ) {
        duration = duration || 0;

        var width = parseInt( this.container.style.width, 10 );
        var height = parseInt( this.container.style.height, 10 );
        var top = parseInt( this.container.style.top, 10 );
        var left = parseInt( this.container.style.left, 10 );
        var css = {};

        if ( top < window.scrollY ) {
            css.top = window.scrollY;
        }
        else if ( ( top + height ) > ( window.scrollY + window.innerHeight ) ) {
            css.top = Math.max( window.scrollY + window.innerHeight - height, window.scrollY );
        }

        if ( left < 0 ) {
            css.left = window.scrollX;
        }
        else if ( ( left + width ) > ( window.scrollX + window.innerWidth ) ) {
            css.left = Math.max( window.scrollX + window.innerWidth - width, window.scrollX );
        }

        if ( duration ) {
            this.$container.animate( css, duration );
        }
        else {
            this.$container.css( css );
        }
    },

    /**
     * Removes the ghost pane.
     *
     * @since 1.0.0
     */
    onDestroy  : function() {
        this.$ghostPane.remove();
    }

} );

module.exports = ResizableBehavior;
},{}],12:[function(require,module,exports){
var $ = window.jQuery,
    AbstractControl;

AbstractControl = Marionette.ItemView.extend( {

    tagName : 'li',

    media : 'desktop',

    ui : {
        'input' : 'input',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },
    
    events : {
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

	/**
     * Returns the class name.
     * 
     * @since 1.0.0
     * 
     * @returns {string}
     */
    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },
    
	/**
	 * Returns the template ID.
     * 
     * @since 1.0.0
     * 
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-control-' + this.model.get( 'type' );
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.values = this.getValues();
        data.hideDefault = this.checkDefault( data.values );
        data = this.addSerializedData( data );
        
        return data;
    },
    
    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        return data;
    },
    
	/**
     * Returns true if the Default button should be hidden.
     * 
     * @since 1.7.2
     * 
     * @param values
     * @returns {boolean}
     */
    checkDefault : function( values ) {
        var hide = true;
        _.each( this.getDefaults(), function( value, media ) {
            if (
                ! _.isNull( value ) &&
                values.hasOwnProperty( media ) &&
                ! _.isNull( values[ media ] ) &&
                value !== values[ media ]
            ) {
                hide = false;
            }
        } );
        return hide;
    },

    /**
     * Initializes the control.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.addEventListeners();
        this.checkDependencies();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        _.each( this.getSettings(), function( setting ) {
            this.listenTo( setting, 'change', this.onSettingChange );
        }, this );
        this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );
    },

    /**
     * Checks whether the control should be visible, based on its dependencies.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    checkDependencies : function( setting ) {
        setting = setting || this.getSetting();
        var dependencies = this.model.get( 'dependencies' );
        var settingCollection = setting.collection;
        var visible = true;

        for ( var id in dependencies ) {
            if ( dependencies.hasOwnProperty( id ) ) {
                var target = settingCollection.get( id );
                if ( ! target ) {
                    continue;
                }

                var condition = dependencies[ id ].condition;
                var actual = target.get( 'value' );
                var required = dependencies[ id ].value;

                if ( ! Tailor.Helpers.checkCondition( condition, actual, required ) ) {
                    visible = false;
                    break;
                }
            }
        }

        this.$el.toggle( visible );
    },

	/**
	 * Updates the media-query based control groups when the control is rendered.
     * 
     * @since 1.7.2
     */
    onRender : function() {
        this.updateControlGroups();
    },

	/**
     * Displays the appropriate media-query based control group when the Media button is pressed.
     * 
     * @since 1.7.2
     * 
     * @param e
     */
    onMediaButtonChange : function( e ) {
        this.media = e.currentTarget.getAttribute( 'data-media' );
        app.channel.trigger('sidebar:device', this.media);
        this.updateControlGroups();
    },

	/**
     * Restores the default setting values when the Default button is pressed.
     * 
     * @since 1.7.2
     */
    onDefaultButtonChange : function() {
        this.restoreDefaults();
        this.render();
    },

	/**
	 * Updates the current setting value when a field change occurs.
     * 
     * @since 1.7.2
     */
    onFieldChange : function() {
        this.setValue( this.ui.input.filter( '[name^="' + this.media + '"]' ).val() );
    },

	/**
	 * Updates the state of the Default button when a setting value changes.
     * 
     * @since 1.7.2
     */
    onSettingChange : function() {
        this.updateDefaultButton();
    },

	/**
     * Displays the control group associated with the current media query.
     * 
     * @since 1.7.2
     */
    updateControlGroups : function() {
        var media = this.media;

        this.ui.controlGroups.each( function() {
            $( this ).toggleClass( 'is-hidden', media != this.id );
        } );

        this.ui.mediaButton.each( function() {
            $( this ).toggleClass( 'active', media == this.getAttribute( 'data-media' ) );
        } );
    },

	/**
     * Updates the visibility of the Default button.
     * 
     * @since 1.7.2
     */
    updateDefaultButton : function() {
        this.ui.defaultButton.toggleClass( 'is-hidden', this.checkDefault( this.getValues() ) );
    },

	/**
     * Returns all control settings.
     * 
     * @since 1.7.2
     * 
     * @returns {*}
     */
    getSettings : function() {
        return this.model.settings;
    },

	/**
     * Returns the setting associated with a given media query.
     * 
     * @since 1.7.2
     * 
     * @param media
     * @returns {*}
     */
    getSetting : function( media ) {
        media = media || this.media;
        var settings = this.getSettings();
        for ( var i in settings ) {
            if ( settings.hasOwnProperty( i ) ) {
                if ( settings[ i ].media == media ) {
                    return settings[ i ];
                }
            }
        }
        return false;
    },

	/**
	 * Returns the default value for each setting.
     * 
     * @since 1.7.2
     * 
     * @returns {{}}
     */
    getDefaults : function() {
        var defaults = {};
        _.each( this.getSettings(), function( setting ) {
            defaults[ setting.media ] = setting.get( 'default' );
        } );
        return defaults;
    },

	/**
	 * Returns the value for each setting.
     * 
     * @since 1.7.2
     * 
     * @returns {{}}
     */
    getValues : function() {
        var values = {};
        _.each( this.getSettings(), function( setting ) {
            values[ setting.media ] = setting.get( 'value' ) || '';
        } );
        return values;
    },

	/**
     * Returns the default value for the current setting.
     * 
     * @since 1.7.2
     * 
     * @returns {*}
     */
    getDefault : function() {
        return this.getSetting().get( 'default' );
    },

    /**
     * Returns the value for the current setting.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    getValue : function() {
        return this.getSetting().get( 'value' );
    },

    /**
     * Updates value for the current setting.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    setValue : function( value ) {
        this.getSetting().set( 'value', value );
    },

    /**
     * Restores each setting to its default value.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    restoreDefaults : function() {
        _.each( this.getSettings(), function( setting ) {
            setting.set( 'value', setting.get( 'default' ) );
        } );
    }

} );

module.exports = AbstractControl;
},{}],13:[function(require,module,exports){
/**
 * Tailor.Controls.ButtonGroup
 *
 * A button group control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	ButtonGroupControl;

ButtonGroupControl = AbstractControl.extend( {

    ui : {
        'input' : '.control__body .button',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'click @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        active : function( media, key ) {
            return key === this.values[ media ] ? 'active' : '';
        }
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        this.ui.input.filter( '[name^="' + this.media + '"]' ).removeClass( 'active' );
        var button = e.currentTarget;
        button.classList.add( 'active' );
        this.setValue( button.value );
    }

} );

module.exports = ButtonGroupControl;

},{"./abstract-control":12}],14:[function(require,module,exports){
/**
 * Tailor.Controls.Checkbox
 *
 * A checkbox control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	CheckboxControl;

CheckboxControl = AbstractControl.extend( {

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media, key ) {
            var values = this.values[ media ].split( ',' );
            return -1 !== values.indexOf( key ) ? 'checked' : '';
        }
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var values = [];
        _.each( this.ui.input.filter( '[name^="' + this.media + '"]:checked' ), function( field ) {
            if ( field.checked ) {
                values.push( field.value || 0 );
            }
        } );
        this.setValue( values.join( ',' ) );
    }

} );

module.exports = CheckboxControl;

},{"./abstract-control":12}],15:[function(require,module,exports){
/**
 * Tailor.Controls.Code
 *
 * A code editor control.
 *
 * @augments Marionette.ItemView
 */

var $ = window.jQuery,
	AbstractControl = require( './abstract-control' ),
	CodeControl;

CodeControl = AbstractControl.extend( {

	ui : {
		'input' : 'textarea',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

	events : {
		'click @ui.mediaButton' : 'onMediaButtonChange',
		'click @ui.defaultButton' : 'onDefaultButtonChange'
	},

	/**
	 * Provides additional data to the template rendering function.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	addSerializedData : function( data ) {
		data.cid = this.cid;
		return data;
	},

	/**
	 * Initailizes the CodeMirror editor when the control is rendered.
	 * 
	 * @since 1.7.2
	 */
    onRender : function() {
	    var control = this;
	    var mode = control.model.get( 'mode' );
	    this.editors = {};

	    _.each( this.getValues(), function( value, media ) {
		    var $field = control.ui.input.filter( '[name^="' + media + '-' + control.cid + '"]' );

		    control.editors[ media ] = CodeMirror.fromTextArea( $field.get(0), {
			    mode : mode,
			    lineNumbers : true,
			    matchBrackets : true,
			    continueComments : 'Enter',
			    viewportMargin : Infinity,
			    extraKeys : {

				    'F11' : function( cm ) {
					    cm.setOption( 'fullScreen', ! cm.getOption( 'fullScreen' ) );
				    },

				    'Esc' : function( cm ) {
					    if ( cm.getOption( 'fullScreen' ) )  {
						    cm.setOption( 'fullScreen', false );
					    }
				    }
			    }
		    } );

		    control.editors[ media ].on( 'change', function( editor ) {
			    control.setValue( editor.getValue() );
		    }, this );

		    setTimeout( function() {
			    control.editors[ media ].refresh();
		    }, 10 );
	    } );

	    this.updateControlGroups();
    },

	/**
	 * Restores each setting to its default value.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	restoreDefaults : function() {
		_.each( this.getSettings(), function( setting, media ) {
			var value = setting.get( 'default' ) || '';
			setting.set( 'value', value );
		} );
	},

	/**
	 * Displays the control group associated with the current media query.
	 *
	 * @since 1.7.2
	 */
	updateControlGroups : function() {
		var control = this;
		var media = this.media;

		this.ui.controlGroups.each( function() {
			$( this ).toggleClass( 'is-hidden', media != this.id );
		} );

		this.ui.mediaButton.each( function() {
			$( this ).toggleClass( 'active', media == this.getAttribute( 'data-media' ) );
		} );

		control.editors[ media ].refresh();
	},

    /**
     * Destroys the editor instance when the control is destroyed.
     *
     * @since 1.0.0
     */
	onDestroy : function() {
		var control = this;
	    _.each( this.getValues(), function( value, media ) {
		    control.editors[ media ].off();
		    control.editors[ media ].toTextArea();
	    } );
	}

} );

module.exports = CodeControl;

},{"./abstract-control":12}],16:[function(require,module,exports){
/**
 * Tailor.Controls.ColorPicker
 *
 * A color picker control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    AbstractControl = require( './abstract-control' ),
    ColorPickerControl;

/**
 * wp-color-picker-alpha
 *
 * Overwrite Automattic Iris for enabled Alpha Channel in wpColorPicker
 *
 * Version: 1.2
 *
 * https://github.com/23r9i0/wp-color-picker-alpha
 * Copyright (c) 2015 Sergio P.A. (23r9i0).
 * Licensed under the GPLv2 license.
 */
( function( $ ) {

    var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAAHnlligAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHJJREFUeNpi+P///4EDBxiAGMgCCCAGFB5AADGCRBgYDh48CCRZIJS9vT2QBAggFBkmBiSAogxFBiCAoHogAKIKAlBUYTELAiAmEtABEECk20G6BOmuIl0CIMBQ/IEMkO0myiSSraaaBhZcbkUOs0HuBwDplz5uFJ3Z4gAAAABJRU5ErkJggg==';
    var	_before = '<a tabindex="0" class="wp-color-result" />',
        _after = '<div class="wp-picker-holder" />',
        _wrap = '<div class="wp-picker-container" />',
        _button = '<input type="button" class="button button-small hidden" />';

    /**
     * Overwrite Color for enable support rbga
     */
    Color.fn.toString = function() {
        if ( this._alpha < 1 )
            return this.toCSS( 'rgba', this._alpha ).replace( /\s+/g, '' );

        var hex = parseInt( this._color, 10 ).toString( 16 );

        if ( this.error )
            return '';

        if ( hex.length < 6 ) {
            for ( var i = 6 - hex.length - 1; i >= 0; i-- ) {
                hex = '0' + hex;
            }
        }

        return '#' + hex;
    };

    /**
     * Overwrite wpColorPicker
     */
    $.widget( 'wp.wpColorPicker', $.wp.wpColorPicker, {

        _create: function() {

            if ( ! $.support.iris ) {
                return;
            }

            var self = this,
                el = self.element;

            $.extend( self.options, el.data() );

            self.close = $.proxy( self.close, self );
            self.initialValue = el.val();

            // Set up HTML structure, hide things
            el.addClass( 'wp-color-picker' ).hide().wrap( _wrap );
            self.wrap = el.parent();
            self.toggler = $( _before )
                .insertBefore( el )
                .css( { backgroundColor: self.initialValue } )
                .attr( 'title', wpColorPickerL10n.pick )
                .attr( 'data-current', wpColorPickerL10n.current );
            self.pickerContainer = $( _after ).insertAfter( el );
            self.button = $( _button );

            if ( self.options.defaultColor ) {
                self.button.addClass( 'wp-picker-default' ).val( wpColorPickerL10n.defaultString );
            }
            else {
                self.button.addClass( 'wp-picker-clear' ).val( wpColorPickerL10n.clear );
            }

            el.wrap( '<span class="wp-picker-input-wrap" />' ).after(self.button);
            el.iris( {
                target: self.pickerContainer,
                hide: self.options.hide,
                width: self.options.width,
                mode: self.options.mode,
                palettes: self.options.palettes,
                change: function( event, ui ) {
                    if ( self.options.rgba ) {
                        self.toggler.css( { 'background-image': 'url(' + image + ')' } ).html('<span />');
                        self.toggler.find('span').css({
                            'width': '100%',
                            'height': '100%',
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'border-top-left-radius': '3px',
                            'border-bottom-left-radius': '3px',
                            'background': ui.color.toString()
                        });
                    }
                    else {
                        self.toggler.css( { backgroundColor: ui.color.toString() } );
                    }
                    if ( $.isFunction( self.options.change ) ) {
                        self.options.change.call( this, event, ui );
                    }
                }
            } );

            el.val( self.initialValue );
            self._addListeners();
            if ( ! self.options.hide ) {
                self.toggler.click();
            }
        },

        _addListeners: function() {
            var self = this;

            self.wrap.on( 'click.wpcolorpicker', function( event ) {
                event.stopPropagation();
            });

            self.toggler.click( function(){
                if ( self.toggler.hasClass( 'wp-picker-open' ) ) {
                    self.close();
                }
                else {
                    self.open();
                }
            });

            self.element.change( function( event ) {
                var me = $( this ),
                    val = me.val();

                if ( val === '' || self.element.hasClass('iris-error') ) {
                    if ( self.options.rgba ) {
                        self.toggler.removeAttr('style');
                        self.toggler.find('span').css( 'backgroundColor', '' );
                    }
                    else {
                        self.toggler.css( 'backgroundColor', '' );
                    }

                    if ( $.isFunction( self.options.clear ) ) {
                        self.options.clear.call( this, event );
                    }
                }
            });

            self.toggler.on( 'keyup', function( event ) {
                if ( event.keyCode === 13 || event.keyCode === 32 ) {
                    event.preventDefault();
                    self.toggler.trigger( 'click' ).next().focus();
                }
            });

            self.button.click( function( event ) {
                var me = $( this );
                if ( me.hasClass( 'wp-picker-clear' ) ) {
                    self.element.val( '' );
                    if ( self.options.rgba ) {
                        self.toggler.removeAttr('style');
                        self.toggler.find('span').css( 'backgroundColor', '' );
                    }
                    else {
                        self.toggler.css( 'backgroundColor', '' );
                    }
                    if ( $.isFunction( self.options.clear ) ) {
                        self.options.clear.call( this, event );
                    }
                }
                else if ( me.hasClass( 'wp-picker-default' ) ) {
                    self.element.val( self.options.defaultColor ).change();
                }
            });
        }
    } );

    /**
     * Overwrite Iris
     */
    $.widget( 'a8c.iris', $.a8c.iris, {

        _create: function() {
            this._super();
            this.options.rgba = this.element.data( 'rgba' ) || false;
            if ( ! this.element.is( ':input' ) ) {
                this.options.alpha = false;
            }

            if ( typeof this.options.rgba !== 'undefined' && this.options.rgba ) {
                var self = this,
                    _html = '<div class="iris-strip iris-slider iris-alpha-slider"><div class="iris-slider-offset iris-slider-offset-alpha"></div></div>',
                    aContainer = $( _html ).appendTo( self.picker.find( '.iris-picker-inner' ) ),
                    aSlider = aContainer.find( '.iris-slider-offset-alpha' ),
                    controls = {
                        aContainer: aContainer,
                        aSlider: aSlider
                    };

                // Push new controls
                $.each( controls, function( k, v ){
                    self.controls[k] = v;
                } );

                // Change size strip and add margin for sliders
                self.controls.square.css({'margin-right': '0'});
                var emptyWidth = ( self.picker.width() - self.controls.square.width() - 20 ),
                    stripsMargin = emptyWidth/6,
                    stripsWidth = (emptyWidth/2) - stripsMargin;

                $.each( [ 'aContainer', 'strip' ], function( k, v ) {
                    self.controls[v].width( stripsWidth ).css({ 'margin-left': stripsMargin + 'px' });
                } );

                self._initControls();
                self._change();
            }
        },

        _initControls: function() {
            this._super();
            if ( this.options.rgba ) {
                var self = this,
                    controls = self.controls;

                controls.aSlider.slider( {
                    orientation: 'vertical',
                    min: 0,
                    max: 100,
                    step: 1,
                    value: parseInt( self._color._alpha * 100 ),
                    slide: function( event, ui ) {
                        self._color._alpha = parseFloat( ui.value/100 );
                        self._change.apply( self, arguments );
                    }
                } );
            }
        },

        _change: function() {

            this._super();

            var self = this,
                el = self.element;

            if ( this.options.rgba ) {
                var	controls = self.controls,
                    alpha = parseInt( self._color._alpha * 100 ),
                    color = self._color.toRgb(),
                    gradient = [
                        'rgb(' + color.r + ',' + color.g + ',' + color.b + ') 0%',
                        'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0) 100%'
                    ],
                    defaultWidth = self.options.defaultWidth,
                    customWidth = self.options.customWidth,
                    target = self.picker.closest('.wp-picker-container').find( '.wp-color-result' );

                controls.aContainer.css( { 'background': 'linear-gradient(to bottom, ' + gradient.join( ', ' ) + '), url(' + image + ')' } );

                if ( target.hasClass('wp-picker-open') ) {
                    controls.aSlider.slider( 'value', alpha );

                    if ( self._color._alpha < 1 ) {
                        var style = controls.strip.attr( 'style' ).replace( /rgba\(([0-9]+,)(\s+)?([0-9]+,)(\s+)?([0-9]+)(,(\s+)?[0-9\.]+)\)/g, 'rgb($1$3$5)' );
                        controls.strip.attr( 'style', style );
                        el.width( parseInt( defaultWidth + customWidth ) );
                    }
                    else {
                        el.width( defaultWidth );
                    }
                }
            }

            var reset = el.data( 'reset-alpha' ) || false;
            if ( reset ) {
                self.picker.find( '.iris-palette-container' ).on( 'click.palette', '.iris-palette', function() {
                    self._color._alpha = 1;
                    self.active = 'external';
                    self._change();
                } );
            }
        },

        _addInputListeners: function( input ) {
            var self = this,
                debounceTimeout = 100,
                callback = function( event ){
                    var color = new Color( input.val() ),
                        val = input.val();

                    input.removeClass( 'iris-error' );
                    if ( color.error ) {
                        if ( val !== '' ) {
                            input.addClass( 'iris-error' );
                        }
                    }
                    else {
                        if ( color.toString() !== self._color.toString() ) {
                            if ( ! ( event.type === 'keyup' && val.match( /^[0-9a-fA-F]{3}$/ ) ) ) {
                                self._setOption( 'color', color.toString() );
                            }
                        }
                    }
                };

            input.on( 'change', callback ).on( 'keyup', self._debounce( callback, debounceTimeout ) );

            // If we initialized hidden, show on first focus. The rest is up to you.
            if ( self.options.hide ) {
                input.one( 'focus', function() {
                    self.show();
                } );
            }
        }
    } );

}( jQuery ) );

ColorPickerControl = AbstractControl.extend( {

    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.rgba = this.model.get( 'rgba' );
        return data;
    },

    /**
     * Initializes the Iris colorpicker and updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        this.initWidgets();
        this.updateControlGroups();
    },

    /**
     * Restores the default setting values when the Default button is pressed.
     *
     * @since 1.7.2
     */
    onDefaultButtonChange : function() {
        this.restoreDefaults();
        this.destroyWidgets();
        this.render();
    },

	/**
	 * Initializes the Iris colorpicker(s).
     *
     * @since 1.7.2
     */
    initWidgets : function() {
        var control = this;
        var defaults = this.getDefaults();
        var palettes = this.model.get( 'palettes' );

        this.ui.input.each( function() {

            var $el = $( this );
            $el.wpColorPicker( {
                palettes : palettes,
                defaultColor : defaults[ this.name ],

                change : function() {
                    var color = control.ui.input.wpColorPicker( 'color' );
                    if ( 'undefined' == typeof control.getValue() && '' == color ) {
                        return;
                    }
                    control.setValue( $el.wpColorPicker( 'color' ) );
                },

                clear : function() {
                    control.setValue( '' );
                }
            } );
        } );
    },

    /**
     * Destroys the Iris colorpicker(s).
     *
     * @since 1.7.2
     */
    destroyWidgets : function() {
        this.ui.input.each( function() {
            $( this ).wpColorPicker( 'close' );
        } );
    },

	/**
     * Destroys the Iris colorpicker(s) before the control is destroyed.
     *
     * @since 1.7.2
     */
    onBeforeDestroy : function() {
        this.destroyWidgets();
    }

} );

module.exports = ColorPickerControl;

},{"./abstract-control":12}],17:[function(require,module,exports){
/**
 * Tailor.Controls.Editor
 *
 * An editor control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
	EditorControl;

EditorControl = AbstractControl.extend( {

	ui : {
		'input' : 'textarea',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

	events : {
		'blur @ui.input' : 'onFieldChange',
		'click @ui.mediaButton' : 'onMediaButtonChange',
		'click @ui.defaultButton' : 'restoreDefaults'
	},

    getTemplate : function() {
        var html = document.getElementById( 'tmpl-tailor-control-editor' ).innerHTML;
        return _.template( html
                .replace( new RegExp( 'tailor-editor', 'gi' ), '<%= media %>-<%= cid %>' )
                .replace( new RegExp( 'tailor-value', 'gi' ), '<%= values[ media ] %>' )
        );
    },
	
	/**
	 * Provides additional data to the template rendering function.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	addSerializedData : function( data ) {
		data.cid = this.cid;
		return data;
	},

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
	addEventListeners : function() {
		this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );
	},

	/**
	 * Maybe refershes the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 * 
	 * @param el
	 */
	maybeRefreshEditor : function( el ) {
        if ( el.contains( this.el ) ) {
	        _.each( this.getValues(), function( value, media ) {
		        tinyMCE.execCommand( 'mceRemoveEditor', false, media + '-' + this.cid );
		        tinyMCE.execCommand( 'mceAddEditor', false, media + '-' + this.cid );
	        }, this );
        }
    },

	/**
	 * Initializes the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 */
    onAttach : function() {
	    var control = this;

	    _.each( this.getValues(), function( value, media ) {
		    var id = media + '-' + control.cid;
		    var quickTagSettings = _.extend( {}, tinyMCEPreInit.qtInit['tailor-editor'], { id : id } );

		    quicktags( quickTagSettings );
		    QTags._buttonsInit();

		    tinyMCEPreInit.mceInit[ id ] = _.extend( {}, tinyMCEPreInit.mceInit['tailor-editor'], {
			    id : id,
			    resize : 'vertical',
			    height: 350,

			    setup : function( ed ) {
				    ed.on( 'change', function() {
					    ed.save();
					    control.setValue( ed.getContent() );
				    } );
			    }
		    } );

		    switchEditors.go( id, 'tmce' );
		    tinymce.execCommand( 'mceAddEditor', true, id );
	    }, this );
	},

	/**
	 * Restores each setting to its default value.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	restoreDefaults : function() {
		_.each( this.getSettings(), function( setting ) {

			var value = setting.get( 'default' ) || '';
			setting.set( 'value', value );

			var editor = tinyMCE.get( setting.media + '-' + this.cid );
			editor.setContent( value );

		}, this );
	},

	/**
	 * Destroys the TinyMCE instance(s).
	 * 
	 * @since 1.7.2
	 */
	onDestroy : function() {
	    _.each( this.getValues(), function( value, media ) {
		    tinyMCE.execCommand( 'mceRemoveEditor', true, media + '-' + this.cid );
	    }, this );
	}

} );

module.exports = EditorControl;

},{"./abstract-control":12}],18:[function(require,module,exports){
/**
 * Tailor.Controls.Gallery
 *
 * A gallery control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    GalleryControl;

GalleryControl = AbstractControl.extend( {

	ui: {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'thumbnails' : '.thumbnails',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

    events : {
        'click @ui.select' : 'selectImages',
        'click @ui.change' : 'selectImages',
	    'click @ui.remove' : 'removeImages',
	    'click @ui.thumbnails' : 'selectImages',
	    'click @ui.mediaButton' : 'onMediaButtonChange',
	    'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

	/**
	 * Provides additional data to the template rendering function.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	addSerializedData : function( data ) {
		data.ids = {};
		_.each( data.values, function( value, media ) {
			data.ids[ media ] = this.getIds( value );
		}, this );
		return data;
	},

	/**
	 * Opens the Media Library window.
	 *
	 * @since 1.0.0
	 */
    selectImages : function() {

		_.each( this.getValues(), function( value, media ) {
			if ( media == this.media ) {
				var control = this;
				var ids = control.getIds( value );
				var selection = this.getSelection( ids );
				var frame = wp.media( {
					frame : 'post',
					state : ( ids.length ? 'gallery-edit' : 'gallery-library' ),
					editing : true,
					multiple : true,
					selection : selection
				} );

				var library;

				frame

					/**
					 * Hide the Cancel Gallery link and record the original library.
					 */
					.on( 'open', function() {
						var mediaFrame = frame.views.get( '.media-frame-menu' )[0];
						mediaFrame.$el.children().slice( 0, 2 ).hide();
						library = JSON.stringify( selection.toJSON() );
					} )

					/**
					 * Update the setting value and thumbnails.
					 */
					.on( 'update', function( collection ) {
						var value = collection.pluck( 'id' ).join( ',' );
						control.setValue( value );

						// Trigger change if the images are the same (implies other change)
						if ( ! _.isEqual( library, JSON.stringify( collection.toJSON() ) ) ) {
							var setting = control.getSetting( media );
							setting.trigger( 'change', setting, value );
						}
					} )

					/**
					 * Dispose of the media frame when it's closed.
					 */
					.on( 'close', function() {
						frame.dispose();
					} );

				frame.open();
			}
		}, this );
    },

	/**
	 * Returns the ID(s) of the selected image(s).
	 * 
	 * @since 1.7.2
	 * 
	 * @param value
	 * @returns {*}
	 */
	getIds : function( value ) {
		if ( _.isEmpty( value ) ) {
			return false;
		}
		return value.split( ',' )
	},

	/**
	 * Removes all selected images.
	 *
	 * @since 1.0.0
	 */
    removeImages : function() {
        this.setValue( '' );
    },

	/**
	 * Re-renders the control when a setting value changes.
	 * 
	 * @since 1.7.2
	 */
	onSettingChange : function() {
		this.render();
	},

	/**
	 * Updates the thumbnails when the control is rendered.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
		var control = this;
		_.each( this.getValues(), function( value, media ) {
			var selection = this.getSelection( control.getIds( value ) );
			selection.more().done( function() {
				selection.props.set( { query: false } );
				selection.unmirror();
				selection.props.unset( 'orderby' );
				control.updateThumbnails( selection, media );
			} );
		}, this );

		this.updateControlGroups();
	},

	/**
	 * Updates the image thumbnails.
	 * 
	 * @since 1.7.2
	 * 
	 * @param selection
	 * @param media
	 */
	updateThumbnails : function( selection, media ) {
		var html = '';
		var urls = selection.map( function( attachment ) {
			var sizes = attachment.get( 'sizes' );
			var url;
			if ( sizes.hasOwnProperty( 'medium' ) ) {
				url = sizes.medium.url;
			}
			else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
				url = sizes.thumbnail.url;
			}
			else if ( sizes.hasOwnProperty( 'full' ) ) {
				url = sizes.full.url;
			}
			else {
				url = '';
			}
			return url;
		} );

		if ( urls.length ) {
			_.each( urls, function( url ) {
				html += '<li class="thumbnail"><img src="' + url + '"/></li>';
			} );
		}

		this.ui.controlGroups
			.filter( '[id^="' + media + '"]' )
			.find( '.thumbnails' )
			.removeClass( 'is-loading' )
			.html( html );
	},

	/**
	 * Returns a Media Library selection from a given set of image ids.
	 *
	 * @since 1.0.0
	 *
	 * @param ids
	 * @returns {*|R|r}
	 */
    getSelection : function( ids ) {
        var attachments = wp.media.query( {
            orderby : 'post__in',
            order: 'ASC',
            type: 'image',
            post__in : ids
        } );

        return new wp.media.model.Selection( attachments.models, {
            props : attachments.props.toJSON(),
            multiple: true
        } );
    }

} );

module.exports = GalleryControl;

},{"./abstract-control":12}],19:[function(require,module,exports){
/**
 * Tailor.Controls.Icon
 *
 * An icon control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    IconControl;

IconControl = AbstractControl.extend( {

	ui: {
        'select' : '.button--select',
        'change' : '.button--change',
        'remove' : '.button--remove',
        'icon' : 'i',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

    events : {
        'click @ui.select' : 'openDialog',
        'click @ui.change' : 'openDialog',
        'click @ui.remove' : 'removeIcon',
        'click @ui.icon' : 'openDialog',
	    'click @ui.mediaButton' : 'onMediaButtonChange',
	    'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

	/**
	 * Opens the icon selection dialog.
	 *
	 * @since 1.0.0
	 */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Select Icon',
            button : window._l10n.select,

            /**
             * Returns the content for the Select Icon dialog.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            content : function() {
                var kits = window._kits || {};
                var value = control.getValue();

                if ( _.keys( kits ).length ) {
                    return _.template( document.getElementById( 'tmpl-tailor-control-icon-select' ).innerHTML)( {
                        kits : kits,
                        value : value
                    } );
                }

                return document.getElementById( 'tmpl-tailor-control-icon-empty' ).innerHTML;
            },

	        /**
	         * Adds the required event listeners to the dialog window content.
	         *
	         * @since 1.0.0
	         */
            onOpen : function() {
                var $el = this.$el;
                var $li = $el.find( 'li' );
                var $kits = $el.find( '.icon-kit' );

                this.$el.find( '.search--icon' ).on( 'input', function( e ) {
                    var term = this.value.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );
                    term = term.replace( / /g, ')(?=.*' );
                    var match = new RegExp( '^(?=.*' + term + ').+', 'i' );

                    $li.each( function() {
                        this.classList.toggle( 'is-hidden', ! match.test( this.getAttribute( 'title' ) ) );
                    } );
                } );

                this.$el.find( '.select--icon' ).on( 'change', function( e ) {
                    var kit = this.value;
                    $kits
                        .removeClass( 'is-hidden' )
                        .filter( function() {
                            return this.id != kit;
                        } )
                        .addClass( 'is-hidden' );
                } );
            },

	        /**
	         * Returns true if an icon has been selected.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            onValidate : function() {
                return $( 'input[name=icon]:checked' ).val();
            },

	        /**
	         * Updates the setting value with the selected icon name.
	         *
	         * @since 1.0.0
	         */
            onSave : function() {
                control.setValue( $( 'input[name=icon]:checked' ).val() );
            },

	        /**
	         * Cleans up event listeners.
	         *
	         * @since 1.0.0
	         */
            onClose : function() {
                this.$el.find( '.search--icon' ).off( 'input' );
            }
        };

	    /**
	     * Fires when the dialog window is opened.
	     *
	     * @since 1.0.0
	     */
	    app.channel.trigger( 'dialog:open', options );
    },

	/**
	 * Re-renders the control when a setting value changes.
	 *
	 * @since 1.7.2
	 */
	onSettingChange : function() {
		this.render();
	},

	/**
	 * Clears the current setting value when an icon is removed.
	 * 
	 * @since 1.7.2
	 */
    removeIcon : function() {
        this.setValue( '' );
    }

} );

module.exports = IconControl;

},{"./abstract-control":12}],20:[function(require,module,exports){
/**
 * Tailor.Controls.Image
 *
 * An image control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    ImageControl;

ImageControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *',
        'thumbnail' : '.thumbnail'
    },

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeImage',
        'click @ui.thumbnail' : 'openFrame',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.frame = wp.media( {
            states: [
                new wp.media.controller.Library({
                    title : 'Select Image',
                    library : wp.media.query( { type : [ 'image' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        this.addEventListeners();
        this.checkDependencies();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        _.each( this.getSettings(), function( setting ) {
            this.listenTo( setting, 'change', this.onSettingChange );
        }, this );
        this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );

        this.frame.on( 'select', this.selectImage.bind( this ) );
    },

    /**
     * Opens the media frame.
     *
     * @since 1.0.0
     */
    openFrame : function() {
        this.frame.open();
    },

    /**
     * Saves the image ID and updates the thumbnail when the selected image changes.
     *
     * @since 1.0.0
     */
    selectImage : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();
        var sizes = attachment.get( 'sizes' );
        this.setValue( attachment.get( 'id' ) );
    },

    /**
     * Updates the image thumbnail.
     *
     * @since 1.0.0
     *
     * @param sizes
     * @param media
     */
    updateThumbnail : function( sizes, media ) {
        var url;
        if ( sizes.hasOwnProperty( 'medium' ) ) {
            url = sizes.medium.url;
        }
        else if ( sizes.hasOwnProperty( 'thumbnail' ) ) {
            url = sizes.thumbnail.url;
        }
        else if ( sizes.hasOwnProperty( 'full' ) ) {
            url = sizes.full.url; // Small images do not have thumbnail generated
        }
        else {
            return; // Invalid sizes
        }
        
        this.ui.controlGroups
            .filter( '[id^="' + media + '"]' )
            .find( '.thumbnails' )
            .removeClass( 'is-loading' )
            .html( '<li class="thumbnail"><img src="' + url + '"/></li>' );
    },

    /**
     * Removes the selected image.
     *
     * @since 1.0.0
     */
    removeImage : function() {
        this.setValue( '' );
    },

    /**
     * Re-renders the control when a setting value changes.
     *
     * @since 1.7.2
     */
    onSettingChange : function() {
        this.render();
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        _.each( this.getValues(), function( value, media ) {
            if ( value ) {
                var attachment = wp.media.attachment( value );
                var sizes = attachment.get( 'sizes' );
                if ( sizes ) {
                    this.updateThumbnail( sizes, media );
                }
                else {
                    var control = this;
                    attachment.fetch( {
                        success : function() {
                            sizes = attachment.get( 'sizes' );
                            control.updateThumbnail( sizes, media );
                        }
                    } );
                }
            }
        }, this );

        this.updateControlGroups();
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.off().dispose();
    }

} );

module.exports = ImageControl;

},{"./abstract-control":12}],21:[function(require,module,exports){
/**
 * Tailor.Controls.InputGroup
 *
 * An input group control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    InputGroup;

InputGroup = AbstractControl.extend( {

    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.choices = this.model.get( 'choices' );
        data.values = {};
        
        _.each( this.getValues(), function( value, media ) {
            data.values[ media ] = {};
            var values = [];
            if ( _.isString( value ) ) {
                if ( -1 != value.indexOf( ',' ) ) {
                    values = value.split( ',' );
                }
                else {
                    values = value.split( '-' ); // Old format
                }
            }

            var i = 0;
            for ( var choice in data.choices ) {
                if ( data.choices.hasOwnProperty( choice ) ) {
                    data.values[ media ][ choice ] = values[ i ];
                    i ++;
                }
            }
        } );

        return data;
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.ui.input.filter( '[name^="' + this.media + '"]' ).serializeArray();
        var values = _.map( fields, function( field ) {
            return field.value;
        } );
        this.setValue( values.join( ',' ) );
    }

} );

module.exports = InputGroup;

},{"./abstract-control":12}],22:[function(require,module,exports){
/**
 * Tailor.Controls.Link
 *
 * A link control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    LinkControl;

LinkControl = AbstractControl.extend( {

	ui: {
        'input' : 'input',
        'select' : '.button--select',
		'mediaButton' : '.js-setting-group .button',
		'defaultButton' : '.js-default',
		'controlGroups' : '.control__body > *'
	},

    events : {
        'blur @ui.input' : 'onFieldChange',
        'click @ui.select' : 'openDialog',
	    'click @ui.mediaButton' : 'onMediaButtonChange',
	    'click @ui.defaultButton' : 'onDefaultButtonChange'
    },
	
	/**
	 * Provides additional data to the template rendering function.
	 *
	 * @since 1.7.2
	 *
	 * @returns {*}
	 */
	addSerializedData : function( data ) {
		data.placeholder = this.model.get( 'placeholder' );
		return data;
	},

	/**
     * Queries the server for links based on the search criteria.
     *
     * @since 1.0.0
     *
     * @param term
     */
    search : function( term ) {
        var control = this;
        var $searchResults = this.$el.find( '.search-results' );

        if ( $searchResults.length ) {
            control.$el.addClass( 'is-searching' );
            var options = {
	            
                data : {
                    s : term,
                    nonce : window._nonces.query
                },

	            /**
	             * Appends the list of search results to the page.
	             *
	             * @since 1.0.0
	             */
                success : function( response ) {
                    $searchResults.html( response );
                },

	            /**
	             * Resets the control classname when searching is complete.
	             */
                complete : function() {
                    control.$el.removeClass( 'is-searching' );
                }
            };

            window.ajax.send( 'tailor_get_links', options );
        }
    },

	/**
     * Opens the link selection dialog.
     *
     * @since 1.0.0
     */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Select content',
            button : window._l10n.select,

	        /**
	         * Returns the content for the Select Content dialog.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            content : function() {
                return  '<div class="dialog__container">' +
                            '<input class="search--content" type="search" role="search" placeholder="Search">' +
                            '<span class="spinner"></span>' +
                            '<div class="search-results"></div>' +
                        '</div>';
            },

	        /**
	         * Adds the required event listeners to the dialog window content.
	         *
	         * @since 1.0.0
	         */
            onOpen : function() {
                var dialog = this;
                var previousTerm = '';
                var minimumCharacters = 3;
                var timeout;

                this.$el.find( '.search--content' ).on( 'input', function( e ) {
                    clearTimeout( timeout );
                    var term = this.value;
                    if ( term.length >= minimumCharacters && previousTerm != $.trim( term ) ) {
                        timeout = setTimeout( $.proxy( control.search, dialog, term ), 500 );
                    }
                } );
            },

	        /**
	         * Returns true if an item has been selected.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            onValidate : function() {
                return $( 'input[name=url]:checked' ).val()
            },

	        /**
	         * Updates the setting value with the selected item URL.
	         *
	         * @since 1.0.0
	         */
            onSave : function() {
                var url = $( 'input[name=url]:checked' ).val();
                control.setValue( url );
            },

	        /**
	         * Cleans up event listeners.
	         *
	         * @since 1.0.0
	         */
            onClose : function() {
                this.$el.find( '.search--content' ).off( 'input' );
            }
        };

		/**
		 * Fires when the dialog window is opened.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'dialog:open', options );
    },
	
	/**
	 * Re-renders the control when a setting value changes.
	 *
	 * @since 1.7.2
	 */
	onSettingChange : function() {
		this.render();
	}

} );

module.exports = LinkControl;

},{"./abstract-control":12}],23:[function(require,module,exports){
/**
 * The empty-list view.
 *
 * @since 1.0.0
 */
var EmptyListView = Marionette.ItemView.extend( {

    template : '#tmpl-tailor-control-list-empty'

} );

module.exports = EmptyListView;
},{}],24:[function(require,module,exports){
/**
 * Individual list item view.
 *
 * @augments Marionette.CompositeView
 */
var ListItemControl = Marionette.CompositeView.extend( {

    tagName : 'li',

    className : 'list-item',

    ui : {
        title : '.list-item__title',
        content : '.list-item__content',
        delete : '.js-delete-list-item',
        close : '.js-close-list-item'
    },

    triggers : {
        'click @ui.title' : 'toggle',
        'click @ui.close' : 'toggle',
        'click @ui.delete' : 'delete'
    },

    events : {
        'keypress' : 'onKeyPress'
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView: function( child ) {
        return Tailor.lookup( child.get( 'type' ), false, 'Controls' );
    },

    childViewContainer : '#controls',

    template : '#tmpl-tailor-control-list-item',

	/**
	 * Initializes the list item view.
	 *
	 * @since 1.0.0
	 *
	 * @param options
	 */
    initialize : function( options ) {
        this.settings = options.settings;
        this._open = false;
        this.model.startTracking();

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChangeSettings );
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
    },

	/**
	 * Updates the list item title.
	 *
	 * @since 1.0.0
	 *
	 * @param from
	 * @param to
	 */
    updateTitle : function( from, to ) {
        this.ui.title.find( ':contains(' + from + ')' ).html( to );
    },

	/**
	 * Toggles the list item when selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'toggle' );
        }
    },

	/**
	 * Toggles the list item.
	 *
	 * @since 1.0.0
	 */
    onToggle : function() {
        if ( this._open ) {
            this.slideUp();
        }
        else {
            this.slideDown();
        }
    },

	/**
	 * Hides the list item.
	 *
	 * @since 1.0.0
	 */
    slideUp : function() {
        var control = this;
        control._open = false;

        control.ui.content.slideUp( 150, function() {
            control.el.classList.remove( 'is-open' );
        } );
    },

	/**
	 * Shows the list item.
	 *
	 * @since 1.0.0
	 */
    slideDown : function() {
        var control = this;
        control._open = true;

        control.ui.content.slideDown( 150, function() {
            control.el.classList.add( 'is-open' );
        } );
    },

	/**
	 * Triggers the 'remove' method/event on the list item when removed.
	 *
	 * @since 1.0.0
	 */
    onDelete : function() {
        var control = this;
        control.$el.slideUp( 250, function() {

            /**
             * Destroys the list item view.
             *
             * @since 1.0.0
             */
            control.triggerMethod( 'remove' );
        } );
    },

	/**
	 * Updates the model and view when changes are made.
	 *
	 * @since 1.0.0
	 *
	 * @param setting
	 */
    onChangeSettings : function( setting ) {
        var atts = _.clone( this.model.get( 'atts' ) );
        var settingId = setting.get( 'id' );
        var settingValue = setting.get( 'value' );

        if ( 'title' == settingId ) {
            this.updateTitle( atts.title, settingValue );
        }

        atts[ settingId ] = settingValue;

        this.model.set( 'atts', atts );
    },

	/**
	 * Stops tracking changes when changes are applied.
	 *
	 * @since 1.0.0
	 */
    onApplyModal : function() {
        this.model.stopTracking();
    },

	/**
	 * Reset attributes to their original values when changes are discarded.
	 *
	 * @since 1.0.0
	 */
    onCloseModal : function() {
        this.model.resetAttributes();
    }

} );

module.exports = ListItemControl;

},{}],25:[function(require,module,exports){
/**
 * Tailor.Controls.List
 *
 * A list control.
 *
 * @augments Marionette.CompositeView
 */
var ListControl = Marionette.CompositeView.extend( {

    childView : require( './list-item' ),

    childViewContainer : '#list-items',

    emptyView : require( './list-empty' ),

    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },

    ui : {
        'button' : '.js-add'
    },

    events : {
        'click @ui.button' : 'addItem'
    },

    collectionEvents : {
        'add' : 'updateContent',
        'remove' : 'updateContent',
        'change' : 'updateContent'
    },

    childEvents : {
        'remove' : 'deleteItem',
        'toggle' : 'onToggleItem'
    },

    template : '#tmpl-tailor-control-list',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.childLabel = this.child.get( 'label' ).toLowerCase();
        return data;
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var controlCollection = app.channel.request( 'sidebar:controls', model );
        var settingCollection = app.channel.request( 'sidebar:settings', model );
        var options = {
            model : model,
            collection : controlCollection,
            settings : settingCollection
        };

        return options;
    },

    /**
     * Initializes the list.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.element = options.element;
        this._added = [];
        this._deleted = [];

        var listItemDefinition = app.channel.request( 'sidebar:library', this.element.get( 'tag' ) );
        this.child = app.channel.request( 'sidebar:library', listItemDefinition.get( 'child' ) );

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
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
        return child.get( 'parent' ) == this.element.get( 'id' );
    },

    /**
     * Enables sorting of the list items.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var listControl = this;

        this.sortable = Sortable.create( this.$childViewContainer.get(0), {
            draggable : '.list-item',
            handle : '.list-item__title',
            animation : 250,

            /**
             * Updates the order of the list items when they are sorted.
             *
             * @since 1.0.0
             */
            onEnd : function ( e ) {

                /**
                 * Fires when a list item is reordered.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'list:change:order', listControl.el );

                listControl.updateOrder();
            }
        } );
    },

    /**
     * Returns true if the collection is empty (i.e., the list has no list items).
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    isEmpty : function() {
        return this.collection.getChildren( this.element ).length == 0;
    },

	/**
	 * Toggle a list item.
	 *
	 * @since 1.0.0
	 *
	 * @param child
	 */
	onToggleItem : function( child ) {
		this.children.each( function( childView ) {
			if ( childView !== child ) {
				childView.slideUp();
			}
		}, this );
	},

    /**
     * Slides up other list items when a list item is added.
     *
     * @since 1.0.0
     *
     * @param child
     */
    onAddChild : function( child ) {
        this.children.each( function( childView ) {
            if ( childView !== child ) {
                childView.slideUp();
            }
        }, this );
    },

    /**
     * Adds a list item.
     *
     * New list items are tracked so that they can be added, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    addItem : function() {
        var numberChildren = this.collection.getChildren( this.element ).length;
        var item = _.first( this.collection.create( [ {
            tag : this.child.get( 'tag' ),
            parent : this.element.get( 'id' ),
            order : numberChildren,
            atts : {
                title : this.child.get( 'label' )
            }
        } ], { } ) );

        this._added.push( item );
    },

    /**
     * Deletes a list item.
     *
     * Preexisting list items are tracked so that they can be deleted, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    deleteItem : function( view ) {

        // Delete the list item from the 'added' list, if it exists
        for ( var i = 0; i < this._added.length; i++ ) {
            if ( this._added[ i ] ==  view.model ) {
                this._added.splice( i, 1 );
            }
        }

        this.collection.remove( view.model );
        this._deleted.push( view.model );
    },

    /**
     * Resets the added and deleted list items.
     */
    onApplyModal : function() {
        this._deleted = [];
        this._added = [];
    },

    /**
     * Updates the collection to undo any unapplied changes to the collection.
     *
     * @since 1.0.0
     */
    onCloseModal : function() {
        this.collection.add( this._deleted );
        this.collection.remove( this._added );
    },

    /**
     * Updates the order of each list item after sorting.
     *
     * @since 1.0.0
     */
    updateOrder : function() {
        this.children.each( function( view ) {
            view.model.set( 'order', view.$el.index() );
        }, this );

	    this.collection.sort( { silent : true } );

	    this.updateContent();
    },

    /**
     * Updates the content attribute of the list when a list item changes.
     *
     * @since 1.0.0
     */
    updateContent : function() {
	    var shortcode = this.generateShortcode();
        this.model.settings[0].set( 'value', shortcode );
    },

    /**
     * Generates the content attribute of the list (i.e., a shortcode representing the list items).
     *
     * @since 1.0.0
     */
    generateShortcode : function() {
        var obj = this;
        var content = '';
        var parentId = this.element.get( 'id' );
        var children = this.collection.filter( function( model ) {
            return  model.get( 'parent' ) === parentId && ! obj._deleted.hasOwnProperty( model.cid );
        } );

        _.each( children, function( child ) {
            content += child.toShortcode();
        } );

        return content;
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
        this.sortable.destroy();
        this.collection.sort();
    }

} );

module.exports = ListControl;

},{"./list-empty":23,"./list-item":24}],26:[function(require,module,exports){
/**
 * Tailor.Controls.Radio
 *
 * A radio control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    RadioControl;

RadioControl = AbstractControl.extend( {

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media, key ) {
            return this.values[ media ] === key ? 'checked' : '';
        }
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        this.setValue( this.ui.input.filter( '[name^="' + this.media + '"]:checked' ).val() );
    }

} );

module.exports = RadioControl;

},{"./abstract-control":12}],27:[function(require,module,exports){
/**
 * Tailor.Controls.Range
 *
 * A range control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    RangeControl;

RangeControl = AbstractControl.extend( {
    
    ui : {
        'range' : 'input[type=range]',
        'input' : 'input[type=text]',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'input @ui.range' : 'onFieldChange',
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        /**
         * Returns the attributes for the control.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        inputAttrs : function() {
            var atts = '';
            _.each( this.attrs, function( value, attr ) {
                atts += ( attr + '="' + value + '"' );
            } );
            return atts;
        }
    },
    
    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.attrs = this.model.get( 'input_attrs' );
        return data;
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var value = e.target.value;
        this.ui.input.filter( '[name^="' + this.media + '"]' ).val( value );
        this.ui.range.filter( '[name^="' + this.media + '"]' ).val( value );
        this.setValue( value );
    }

} );

module.exports = RangeControl;

},{"./abstract-control":12}],28:[function(require,module,exports){
/**
 * Tailor.Controls.SelectMulti
 *
 * A select multi control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectMultiControl;

SelectMultiControl = AbstractControl.extend( {
    
    ui : {
        'input' : 'select',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        selected : function( media, key ) {
            var values = this.values[ media ].split( ',' );
            return -1 !== values.indexOf( key ) ? 'selected' : '';
        }
    },

    /**
     * Initializes the Select2 instance(s) and updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );
            $field.select2()
        }, this );

        this.updateControlGroups();
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        var $field = this.ui.input.filter( '[name^="' + this.media + '"]' );
        var field = $field.get(0);
        var values = [];
        for ( var i = 0; i < field.length; i ++ ) {
            if ( field[ i ].selected ) {
                values.push( field[ i ].value );
            }
        }
        this.setValue( values.join( ',' ) );
    },

    /**
     * Destroys the Select2 instance(s).
     *
     * @since 1.7.2
     */
    onDestroy : function() {
        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );
            $field.select2( 'destroy' );
        }, this );
    }

} );

module.exports = SelectMultiControl;

},{"./abstract-control":12}],29:[function(require,module,exports){
/**
 * Tailor.Controls.Select
 *
 * A select control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectControl;

SelectControl = AbstractControl.extend( {

    ui : {
        'input' : 'select',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {
        
        selected : function( media, key ) {
            return key === this.values[ media ] ? 'selected' : '';
        }
    }

} );

module.exports = SelectControl;

},{"./abstract-control":12}],30:[function(require,module,exports){
/**
 * Tailor.Controls.Style
 *
 * A style control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    AbstractControl = require( './abstract-control' ),
    StyleControl;

StyleControl = AbstractControl.extend( {

    linked : true,

    ui : {
        'input' : 'input',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'linkButton' : '.js-link',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'input @ui.input' : 'updateLinkedFields',
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange',
        'click @ui.linkButton' : 'onLinkButtonChange'
    },

    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.choices = this.model.get( 'choices' );
        data.values = {};

        _.each( this.getValues(), function( value, media ) {
            data.values[ media ] = {};
            var values = [];
            if ( _.isString( value ) ) {
                if ( -1 != value.indexOf( ',' ) ) {
                    values = value.split( ',' );
                }
                else {
                    values = value.split( '-' ); // Old format
                }
            }

            var i = 0;
            for ( var choice in data.choices ) {
                if ( data.choices.hasOwnProperty( choice ) ) {
                    data.values[ media ][ choice ] = values[ i ];
                    i ++;
                }
            }
        } );

        return data;
    },

    /**
     * Updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        this.updateControlGroups();
        this.updateLinkButton();
    },

	/**
     * Updates the control state when the Linked button is pressed.
     *
     * @since 1.7.2
     */
    onLinkButtonChange: function() {
        this.linked = ! this.linked;
        this.updateLinkButton();
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.ui.input.filter( '[name^="' + this.media + '"]' ).serializeArray();
        var values = _.map( fields, function( field ) {
            return field.value;
        } );
        this.setValue( values.join( ',' ) );
    },

	/**
	 * Updates the Linked button state.
     *
     * @since 1.7.2
     */
    updateLinkButton: function() {
        this.ui.linkButton.toggleClass( 'is-active', this.linked );
    },

	/**
     * Updates linked fields when a setting value changed.
     *
     * @since 1.7.2
     *
     * @param e
     */
    updateLinkedFields : function( e ) {
        if ( this.linked ) {
            this.ui.input
                .filter( '[name^="' + this.media + '"]' )
                .filter( function( i, el ) { return el != e.currentTarget; } )
                .val( e.currentTarget.value );
        }
    }

} );

module.exports = StyleControl;

},{"./abstract-control":12}],31:[function(require,module,exports){
/**
 * Tailor.Controls.Switch
 *
 * A switch control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SwitchControl;

SwitchControl = AbstractControl.extend( {

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        checked : function( media ) {
            return 1 == parseInt( this.values[ media ], 10 ) ? 'checked' : '';
        }
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        var $field = this.ui.input.filter( '[name^="' + this.media + '"]' );
        this.setValue( $field.get(0).checked ? '1' : '0' );
    }

} );

module.exports = SwitchControl;

},{"./abstract-control":12}],32:[function(require,module,exports){
/**
 * Tailor.Controls.Text
 *
 * A text control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    TextControl;

TextControl = AbstractControl.extend( {
    
    templateHelpers : {

        /**
         * Returns the attributes for the control.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        inputAttrs : function() {
            var atts = '';
            _.each( this.attrs, function( value, attr ) {
                atts += ( attr + '="' + value + '"' );
            } );
            return atts;
        }
    },
    
    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.attrs = this.model.get( 'input_attrs' );
        return data;
    }
    
} );

module.exports = TextControl;

},{"./abstract-control":12}],33:[function(require,module,exports){
/**
 * Tailor.Controls.Textarea
 *
 * A textarea control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    TextareaControl;

TextareaControl = AbstractControl.extend( {

    ui : {
        'input' : 'textarea',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    }

} );

module.exports = TextareaControl;

},{"./abstract-control":12}],34:[function(require,module,exports){
/**
 * Tailor.Controls.Video
 *
 * A video control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    VideoControl;

VideoControl = AbstractControl.extend( {

	ui : {
        'select' : '.button--select',
        'enterUrl' : '.button--enter',
        'change' : '.button--change',
		'remove' : '.button--remove',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
	},

    events : {
        'click @ui.select' : 'openFrame',
        'click @ui.enterUrl' : 'openDialog',
        'click @ui.change' : 'openFrame',
        'click @ui.remove' : 'removeVideo',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    /**
     * Initializes the media frame for the control.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.frame = wp.media( {
            states: [
                new wp.media.controller.Library({
                    title : 'Select Video',
                    library : wp.media.query( { type : [ 'video' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        this.addEventListeners();
        this.checkDependencies();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        _.each( this.getSettings(), function( setting ) {
            this.listenTo( setting, 'change', this.onSettingChange );
        }, this );
        this.listenTo( this.getSetting().collection, 'change', this.checkDependencies );

        this.frame.on( 'select', this.selectVideo.bind( this ) );
    },

    /**
     * Opens the media frame.
     *
     * @since 1.0.0
     */
    openFrame : function() {
        this.frame.open();
    },

    /**
     * Saves the image ID and updates the thumbnail when the selected image changes.
     *
     * @since 1.0.0
     */
    selectVideo : function() {
        var selection = this.frame.state().get( 'selection' );
        var attachment = selection.first();

        this.setValue( attachment.get( 'id' ) );
    },

    /**
     * Opens the link selection dialog.
     *
     * @since 1.0.0
     */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Enter URL',
            button : window._l10n.select,

            /**
             * Returns the content for the Select Content dialog.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            content : function() {
                return  '<div class="dialog__container">' +
                            '<input class="search--content" type="search" role="search">' +
                        '</div>';
            },

            /**
             * Returns true if an item has been selected.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            onValidate : function() {
                var url = $( '.search--content' ).val();
                return url && /^(ftp|http|https):\/\/[^ "]+$/.test( url );
            },

            /**
             * Updates the setting value with the selected item URL.
             *
             * @since 1.0.0
             */
            onSave : function() {
                control.setValue( $( '.search--content' ).val() );
            },

            /**
             * Cleans up event listeners.
             *
             * @since 1.0.0
             */
            onClose : function() {
                this.$el.find( '.search--content' ).off( 'input' );
            }
        };

        /**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

    /**
     * Re-renders the control when a setting value changes.
     *
     * @since 1.7.2
     */
    onSettingChange : function() {
        this.render();
    },
    
    /**
     * Removes the selected video.
     *
     * @since 1.0.0
     */
    removeVideo : function() {
        this.setValue( '' );
    },

    /**
     * Renders the image thumbnail.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var control = this;
        _.each( this.getValues(), function( value, media ) {
            if ( value ) {
                var attachment = wp.media.attachment( value );
                if ( ! attachment.get( 'url' ) ) {
                    attachment.fetch( {
                        success : function() {
                            control.updatePreview( attachment, media );
                        }
                    } );
                }
                else {
                    control.updatePreview( attachment, media );
                }
            }
        }, this );

        this.updateControlGroups();
    },

    /**
     * Updates the video preview.
     *
     * @since 1.0.0
     *
     * @param attachment
     * @param media
     */
    updatePreview : function( attachment, media ) {
        var url = attachment.get( 'url' );
        var mime = attachment.get( 'mime' );

        this.ui.controlGroups
            .filter( '[id^="' + media + '"]' )
            .find( '.video-preview' )
            .removeClass( 'is-loading' )
            .html( '<video controls><source src="' + url + '" type="' + mime + '"></video>' );
    },

    /**
     * Disposes of the media frame when the control is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.frame.dispose();
    }
    
} );

module.exports = VideoControl;

},{"./abstract-control":12}],35:[function(require,module,exports){
/**
 * Tailor.Controls.WidgetForm
 *
 * A widget form control.
 *
 * @augments Marionette.ItemView
 */
var $ = window.jQuery,
    AbstractControl = require( './abstract-control' ),
    WidgetFormControl;

WidgetFormControl = AbstractControl.extend( {

    ui : {},

    events : {
        'blur *' : 'onFieldChange',
        'change *' : 'onFieldChange'
    },

    /**
     * Returns the template ID.
     *
     * @since 1.6.0
     */
    getTemplateId : function() {
        return 'tmpl-tailor-widget-form-' + this.model.get( 'widget_id_base' );
    },

    /**
     * Returns the element template.
     *
     * @since 1.6.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var el = document.getElementById( this.getTemplateId() );
        var template = '';
        if ( el ) {
            template = _.template( el.innerHTML );
        }
        return template;
    },

	/**
     * Populate the form with setting values when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender: function() {
        var idBase = this.model.get( 'widget_id_base' );
        var $el = this.$el;

        // Format the default WordPress widget label
        this.$el.find( 'label' )
            .addClass( 'control__title' )
            .each( function() {
                var $label = $( this );
                $label.html( this.innerHTML.replace( ':', '' ) );
            } );

        _.each( this.getValues(), function( value, media ) {
            if ( ! _.isEmpty( value ) ) {
                var values = JSON.parse( value );
                _.each( values, function( value, name ) {
                    var $field = $el.find( '[name="widget-' + idBase + '[__i__][' + name + ']"]' );
                    if ( $field.length ) {
                        if ( 'checkbox' == $field[0].type || 'radio' == $field[0].type  ) {
                            $field.attr( 'checked', 'true' );
                        }
                        else {
                            $field.val( value );
                        }
                    }
                } );
            }
        }, this );
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.$el.find( 'input, select, radio, textarea' ).serializeArray();
        var values = {};

        $.each( fields, function() {
            var matches = this.name.match( /\[(.*?)\]/g );
            if ( matches && 2 == matches.length ) { // Expecting name in format: widget-{type}[__i__][{field_id}]
                var name = matches[1].substring( 1, matches[1].length - 1 );
                if ( 'undefined' != typeof values[ name ] ) {
                    if ( ! values[ name ].push ) {
                        values[ name ] = [ values[ name ] ];
                    }
                    values[ name ].push( this.value || '' );
                }
                else {
                    values[ name ] = this.value || '';
                }
            }
        } );

        this.setValue( JSON.stringify( values ) );

        e.preventDefault();
        e.stopImmediatePropagation();
    },

	/**
     * Do nothing on setting change.
     *
     * @since 1.7.2
     */
    onSettingChange : function() {}
    
} );

module.exports = WidgetFormControl;
},{"./abstract-control":12}],36:[function(require,module,exports){
var DefaultPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : Tailor.Panels.Empty,

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {*|exports|module.exports}
     */
    getChildView : function() {
        return Tailor.lookup( this.model.get( 'type' ), false, 'Items' );
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
        switch ( this.model.get( 'type' ) ) {

            // Do not display child elements in the library
            case 'library':
                return ! _.contains( [ 'tailor_row' ], child.get( 'tag' ) ) && 'child' != child.get( 'type' );
                break;

            // Do not show sections from other panels
            case 'default':
                return child.get( 'panel' ) === this.model.get( 'id' );
                break;

            default:
                return true;
                break;
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-panel-' + type;
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
        data.items = this.collection;
        return data;
    },

	/**
     * Sets focus on the back button when the panel is displayed.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.backButton.get(0).focus();
    }

} );

module.exports = DefaultPanel;

},{}],37:[function(require,module,exports){
var EmptyPanelView = Marionette.ItemView.extend( {

    className : 'empty',

    initialize : function( options ) {
        this.type = options.type;
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.type || 'default';
        return '#tmpl-tailor-panel-' + type + '-empty';
    }

} );

module.exports = EmptyPanelView;
},{}],38:[function(require,module,exports){
var DefaultSection = Marionette.CompositeView.extend( {

    ui: {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:panel'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './section-empty' ),

    childViewContainer : '#controls',

    /**
     * Initializes the section view.
     *
     * @since 1.0.0
     * @param options
     */
    initialize : function( options ) {
        this.panel = options.panel;
    },

    /**
     * Returns the appropriate child view based on the control type.
     *
     * @since 1.0.0
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return Tailor.lookup( child.get( 'type' ), false, 'Controls' );
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
        if ( 'default' === this.model.get( 'type' ) ) {
            return child.get( 'section' ) === this.model.get( 'id' )
        }
        return true;
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-section-' + this.model.get( 'type' );
    },

    /**
     * Serializes the data that is provided to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.panel = this.panel.get( 'title' );
        return data;
    },

	/**
	 * Sets focus on the back button and refreshes code editors when the section is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
    }

} );

module.exports = DefaultSection;

},{"./section-empty":39}],39:[function(require,module,exports){
var EmptySectionView = Marionette.ItemView.extend( {

    className : 'empty',

    /**
     * Returns the appropriate template based on the section type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-section-' + type + '-empty';
    }

} );

module.exports = EmptySectionView;
},{}],40:[function(require,module,exports){
var ControlCollection = Backbone.Collection.extend( {

	model : require( '../models/control' ),

    /**
     * Initializes the controls collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.settings ) {
            this.settings = options.settings;
        }
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.onReset );
    },

    /**
     * Assigns settings to each control in the collection.
     *
     * @since 1.0.0
     */
    onReset : function() {

        var mediaQueries = [];
        for ( var mediaQueryId in _media_queries ) {
            if ( _media_queries.hasOwnProperty( mediaQueryId ) && '' != _media_queries[ mediaQueryId ].max ) {
                mediaQueries.push( mediaQueryId );
            }
        }

        this.each( function( model ) {
            var settingId = model.get( 'setting' );
            model.settings = this.settings.filter( function( setting ) {
                var id = setting.get( 'id' );
                if ( id == settingId ) {
                    setting.media = 'desktop';
                    return true;
                }
                else {
                    var index = _.indexOf( mediaQueries, id.replace( settingId + '_', '' ) );
                    if ( -1 !== index ) {
                        setting.media = mediaQueries[ index ];
                        return true;
                    }
                }

                return false;
            } );
        }, this );
    }

} );

module.exports = ControlCollection;

},{"../models/control":48}],41:[function(require,module,exports){
var SearchableCollection = require( './searchable' ),
	LibraryCollection;

LibraryCollection= SearchableCollection.extend( {

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

	comparator : 'label',

	/**
	 * Returns the attributes of a model to use in a search.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @returns {string}
	 */
	getHaystack : function( model ) {
		return [
			model.get( 'label' ),
			model.get( 'type' ),
			model.get( 'description' ),
			model.get( 'badge' ),
			model.get( 'tag' )
		].join( ' ' );
	}

} );

module.exports = LibraryCollection;
},{"./searchable":43}],42:[function(require,module,exports){
var PanelCollection = Backbone.Collection.extend( {
	model : require( '../models/panel' )
} );

module.exports = PanelCollection;

},{"../models/panel":52}],43:[function(require,module,exports){
var $ = Backbone.$,
	SearchableCollection;

SearchableCollection = Backbone.Collection.extend( {

	/**
	 * Performs a search based on a given search term.
	 *
	 * @since 1.0.0
	 *
	 * @param value
	 */
	doSearch: function( value ) {

		// Don't do anything if we've already done this search
		if ( this.terms === value ) {
			return;
		}
		this.terms = value;

		if ( this.terms.length > 0 ) {
			this.search( this.terms );
		}

		// If search is blank, show all items
		if ( this.terms === '' ) {
			this.each( function( item ) {
				item.set( 'match', true );
			} );
		}
	},

	/**
	 * Shows or hides items based on whether they match the search criteria.
	 *
	 * @since 1.0.0
	 *
	 * @param term
	 */
	search: function( term ) {
		var match, haystack;

		// Escape the term string for RegExp meta characters
		term = term.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );

		// Consider spaces as word delimiters and match the whole string so matching terms can be combined
		term = term.replace( / /g, ')(?=.*' );

		match = new RegExp( '^(?=.*' + term + ').+', 'i' );

		this.each( function( item ) {
			haystack = this.getHaystack( item );
			item.set( 'match', match.test( haystack ) );
		}, this );
	}

} );

module.exports = SearchableCollection;

},{}],44:[function(require,module,exports){
var SectionCollection = Backbone.Collection.extend( {
	model : require( '../models/section' )
} );

module.exports = SectionCollection;

},{"../models/section":53}],45:[function(require,module,exports){
var SettingCollection = Backbone.Collection.extend( {

	model : require( '../models/setting' ),

    /**
     * Initializes the setting collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.element ) {
            this.element = options.element;
        }

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.load );
    },

	/**
     * Assigns the initial value to the setting.
     *
     * @since 1.0.0
     */
    load : function() {
        var atts = this.element.get( 'atts' );
        this.each( function( model ) {
            model.set( 'value', atts[ model.get( 'id' ) ] );
        }, this );
    }

} );

module.exports = SettingCollection;

},{"../models/setting":54}],46:[function(require,module,exports){
var SnapshotCollection = Backbone.Collection.extend( {

    /**
     * The maximum number of history entries to store.
     *
     * @since 1.0.0
     */
	maxSize : 50,

    /**
     * The active history entry.
     *
     * @since 1.0.0
     */
    active : null,

    /**
     * The attribute by which entries in the collection are sorted.
     *
     * @since 1.0.0
     */
    comparator : function( model ) {
        return - model.get( 'timestamp' );
    },

    /**
     * Initializes the history entry collection.
     *
     * @since 1.0.0
     */
	initialize: function() {
        this.addEventListeners();
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'add', this.checkLength );
        this.listenToOnce( app.channel, 'canvas:initialize', function() {
            this.save( window._l10n.initialized );
        } );
    },

    /**
     * Saves the current element collection as a history entry.
     *
     * @since 1.0.0
     *
     * @param label
     */
    save : function( label ) {

        // If the active entry exists and is not the latest one, remove subsequent entries
        if ( this.active ) {
            var activePosition = this.indexOf( this.active );
            if ( activePosition > 0 ) {
                this.remove( this.slice( 0, activePosition ) );
            }
        }

        var models = app.channel.request( 'canvas:elements' );
        var templates = app.channel.request( 'canvas:templates' );
        var css = app.channel.request( 'canvas:css' );

        console.log( models, templates, css );

        // Add the new entry to the collection
        var entry = this.add( {
            label : label || '',
            elements : models ? models.toJSON() : [],
            templates: templates,
            css: css,
            time : this.getTime(),
            timestamp : _.now()
        } );

	    this.setActive( entry );
    },

    /**
     * Returns the current time as a formatted string.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTime : function() {
        var date = new Date();
        var hours = date.getHours();
        var separator = ':';
        var suffix;

        if ( hours > 12 ) {
            hours -= 12;
            suffix = ' PM';
        }
        else {
            suffix = ' AM';
        }

        return (
            hours + separator +
            ( '0' + date.getMinutes() ).slice( -2 ) + separator +
            ( '0' + date.getSeconds() ).slice( -2 ) + suffix
        );
    },

    /**
     * Restores a given history entry.
     *
     * @since 1.0.0
     *
     * @param timestamp
     */
    restore : function( timestamp ) {
        var entry = this.findWhere( { timestamp : timestamp } );
        if ( ! entry || entry === this.getActive() ) {
            return;
        }

        this.setActive( entry );
        var elements = entry.get( 'elements' );
        var templates = entry.get( 'templates' );
        var css = entry.get( 'css' );

        /**
         * Fires when the element collection is reset.
         *
         * @since 1.0.0
         *
         * @param elements
         */
        app.channel.trigger( 'elements:reset', elements, templates, css );
    },

    /**
     * Restores the previous history entry.
     *
     * @since 1.0.0
     */
    undo : function() {
        if ( ! this.length ) {
            return;
        }

        var entry = this.at( this.indexOf( this.getActive() ) + 1 );
        if ( entry ) {
            this.restore( entry.get( 'timestamp' ) );
        }
    },

    /**
     * Restores the next history entry.
     *
     * @since 1.0.0
     */
    redo : function() {
        if ( ! this.length ) {
            return;
        }

        if ( 0 === this.indexOf( this.getActive() ) ) {
            return;
        }
        
        var entry = this.at( this.indexOf( this.getActive() ) - 1 );

        if ( entry ) {
            this.restore( entry.get( 'timestamp' ) );
        }
    },

    /**
     * Removes the oldest entry from the collection if it reaches it's maximum length.
     *
     * @since 1.0.0
     */
    checkLength : function() {
        if ( this.length > this.maxSize ) {
            this.pop();
        }
	},

    /**
     * Sets the given entry as active.
     *
     * @since 1.0.0
     *
     * @param model
     */
    setActive : function( model ) {
        this.active = model;
        this.trigger( 'change:active', model );
    },

    /**
     * Returns the active entry.
     *
     * @since 1.0.0
     *
     * @returns {null}
     */
    getActive : function() {
        return this.active;
    }

} );

module.exports = SnapshotCollection;

},{}],47:[function(require,module,exports){
var SearchableCollection = require( './searchable' ),
	TemplateCollection;

TemplateCollection = SearchableCollection.extend( {

	model : require( '../models/template' ),

	comparator : 'name',

	/**
	 * Returns the attributes of a model to use in a search.
	 *
	 * @since 1.0.0
	 *
	 * @param model
	 * @returns {string}
	 */
	getHaystack : function( model ) {
		return [
			model.get( 'id' ),
			model.get( 'label' )
		].join( ' ' );
	}

} );

module.exports = TemplateCollection;

},{"../models/template":55,"./searchable":43}],48:[function(require,module,exports){
var ControlModel = Backbone.Model.extend( {

    /**
     * The default parameters for a control.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		label : '',
		description : '',
		type : '',
		choices : {},
		priority : 0,
		setting : '',
		section : '' // Only used for controls on the Settings panel
	}
} );

module.exports = ControlModel;

},{}],49:[function(require,module,exports){
var ContainerModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) + 1 );
    },

    /**
     * Creates a new wrapper element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        var tag = 'tailor_content';
        var children = model.collection.create( [ {
            tag : tag,
            atts : {}
        }, {
            tag : tag,
            atts : {}
        } ], {
            silent : true
        } );

        model.collection.createContainer( this, model.get( 'parent' ), index, children );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.last( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.first( columns ).get( 'id' ), 0, children );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );
        var tag = 'tailor_content';
        var children;

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, column.get( 'id' ), 0, children );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.insertChild( view.model, _.first( columns ) );

            children = view.model.collection.create( [ {
                tag : tag,
                atts : {}
            }, {
                tag : tag,
                atts : {}
            } ], {
                silent : true
            } );

            view.model.collection.createContainer( this, _.last( columns ).get( 'id' ), 0, children );
        }
    }

} );

module.exports = ContainerModel;
},{}],50:[function(require,module,exports){
var WrapperModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    /**
     * Creates and inserts an element before the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new wrapper element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.createWrapper( this.get( 'tag' ), model.get( 'parent' ), index );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' ) - 1;
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.last( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.first( columns ).get( 'id' ), 0 );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );
        var index = view.model.get( 'order' );
        var tag = 'tailor_content';

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, index );
            view.model.collection.createWrapper( this.get( 'tag' ), column.get( 'id' ), 0 );
        }
        else {

            var columns = view.model.collection.createRow( parentId, index );
            view.model.collection.insertChild( view.model, _.first( columns ) );
            view.model.collection.createWrapper( this.get( 'tag' ), _.last( columns ).get( 'id' ), 0 );

        }
    },

    /**
     * Inserts the element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        view.model.collection.createWrapper( this.get( 'tag' ), wrapper.get( 'id' ), 0 );
    }

} );

module.exports = WrapperModel;
},{}],51:[function(require,module,exports){
var ElementModel = Backbone.Model.extend( {

    /**
     * The default model parameters.
     *
     * @since 1.0.0
     *
     * @returns object
     */
    defaults : function() {

        return {
            label : '',
            description : '',
            tag : '',
            icon : '',
            sections : [],
            controls : [],
            type : 'default',
            child : '',
            collection : 'library'
        };
    },

    /**
     * Initializes the model.
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    /**
     * Creates and inserts an element before the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertBefore : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) - 1 );
    },

    /**
     * Creates and inserts an element after the target view inside a section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    insertAfter : function( view ) {
        this.insertAtIndex( view.model, view.model.get( 'order' ) );
    },

    /**
     * Creates a new element at the given position.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     */
    insertAtIndex : function( model, index ) {
        model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : model.get( 'parent' ),
            type : this.get( 'type' ),
            order : index
        } ], {} );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.first( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.last( columns ) );

        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {

        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : column.get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            view.model.collection.create( [ {
                tag : this.get( 'tag' ),
                label : this.get( 'label' ),
                parent : _.last( columns ).get( 'id' ),
                type : this.get( 'type' ),
                order : 0
            } ], {
                at : 0
            } );

            view.model.collection.insertChild( view.model, _.first( columns ) );
        }
    },

    /**
     * Inserts the element inside a new child element in the target view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        var child = view.model.collection.create( [ {
            tag : this.get( 'tag' ),
            label : this.get( 'label' ),
            parent : wrapper.get( 'id' ),
            type : this.get( 'type' ),
            order : 0
        } ], {
            at : 0
        } );
    }

} );

module.exports = ElementModel;
},{}],52:[function(require,module,exports){
var PanelModel = Backbone.Model.extend( {

    /**
     * The default parameters for a panel.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		title : '',
		description : '',
		collection : '',
		priority : 0
	}
} );

module.exports = PanelModel;

},{}],53:[function(require,module,exports){
var SectionModel = Backbone.Model.extend( {

    /**
     * The default parameters for a section.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		title : '',
		description : '',
		priority : 0,
		panel : ''
	}
} );

module.exports = SectionModel;

},{}],54:[function(require,module,exports){
var SettingModel = Backbone.Model.extend( {

    /**
     * The default parameters for a setting.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
        type : ''
    }
} );

module.exports = SettingModel;

},{}],55:[function(require,module,exports){
var TemplateModel = Backbone.Model.extend( {

    /**
     * Returns an object containing the default parameters for a template.
     *
     * @since 1.0.0
     * @returns object
     */
    defaults : function() {
        return {
            id : this.cid,
            label : '',
            collection : 'template'
        };
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
        this.listenTo( this, 'element:add:top', this.insertBefore );
        this.listenTo( this, 'element:add:bottom', this.insertAfter );
        this.listenTo( this, 'element:add:left', this.columnBefore );
        this.listenTo( this, 'element:add:right', this.columnAfter );
        this.listenTo( this, 'element:add:center', this.createChild );
    },

    createChild : function( view ) {
        var parentId = view.model.get( 'id' );
        var childTag = view.model.get( 'child' );
        var numberChildren = view.model.collection.where( { parent : parentId, tag : childTag } ).length;
        var wrapper = view.model.collection.createWrapper( childTag, parentId, numberChildren, false );

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, wrapper.get( 'id' ), 0 );
    },

    /**
     * Creates and inserts an element before the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnBefore : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) - 1 );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );

        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.first( columns ).get( 'id' ), 0 );
            view.model.collection.insertChild( view.model, _.last( columns ) );
        }
    },

    /**
     * Creates and inserts an element after the target view in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param view
     */
    columnAfter : function( view ) {
        var parentId = view.model.get( 'parent' );

        if ( 'tailor_column' == view.model.get( 'tag' ) ) {
            var column = view.model.collection.createColumn( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, column.get( 'id' ), 0 );
        }
        else {
            var columns = view.model.collection.createRow( parentId, view.model.get( 'order' ) );

            /**
             * Fires when a template is loaded.
             *
             * @since 1.0.0
             */
            app.channel.trigger( 'template:load', this, _.last( columns ).get( 'id' ), 0 );

            view.model.collection.insertChild( view.model, _.first( columns ) );
        }
    },

    /**
     * Creates and inserts a template before the target view inside a section.
     *
     * @since 1.0.0
     * @param view
     */
	insertBefore : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) - 1 );
	},

	insertAfter : function( view ) {

        /**
         * Fires when a template is loaded.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'template:load', this, view.model.get( 'parent' ), view.model.get( 'order' ) );
    }

} );

module.exports = TemplateModel;

},{}],56:[function(require,module,exports){
var $ = window.jQuery,
    DevicePreviewModule;

DevicePreviewModule = Marionette.Module.extend( {

    device : 'desktop',

    onBeforeStart : function() {
        var module = this;
        var api = {

            /**
             * Returns the current device preview size.
             *
             * @since 1.7.4
             *
             * @returns {*}
             */
            getDevice : function() {
                return module.device;
            }
        };

        app.channel.reply( 'sidebar:device', api.getDevice );
    },

    /**
     * Initializes the module.
     *
     * @since 1.7.4
     */
	onStart : function() {
        var module = this;
        this.$buttons = $( '.tailor-sidebar .devices button' );
        this.preview = document.querySelector( '.tailor-preview' );
        this.viewport = this.preview.querySelector( '.tailor-preview__viewport' );
        this.mediaQueries = window._media_queries;

        //this.setActive( this.$buttons.get(0) );
        this.setDevice( this.$buttons.get(0).getAttribute( 'data-device' ) );

        this.addEventListeners();

        /**
         * Fires when the module is initialized.
         *
         * @since ≈
         *
         * @param this
         */
        app.channel.trigger( 'module:devicePreview:ready', this );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.7.4
     */
    addEventListeners : function() {
        this.$buttons.on( 'click', this.onClick.bind( this ) );
        app.channel.on( 'sidebar:device', this.setDevice.bind(this) );
    },

    onClick: function( e ) {
        this.setDevice( e.target.getAttribute( 'data-device' ) );
    },

    setDevice: function( device ) {
        this.device = device;

        // Update buttons
        var $button = this.$buttons.filter( "[data-device='" + this.device + "']" );
        this.$buttons.removeClass( 'is-active' ).attr( 'aria-pressed', false );
        $button.addClass( 'is-active' ).attr( 'aria-pressed', true );

        // Update preview window
        if ( this.mediaQueries.hasOwnProperty( this.device ) && this.mediaQueries[ this.device ].max ) {
            this.viewport.style.maxWidth = this.mediaQueries[ this.device ].max;
        }
        else {
            this.viewport.style.maxWidth ='';
        }
    }
} );

module.exports = DevicePreviewModule;

},{}],57:[function(require,module,exports){
var DialogRegion = Backbone.Marionette.Region.extend( {

    /**
     * Initializes the dialog region.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.$overlay = jQuery( '<div id="overlay"></div>' );
    },

    /**
     * Shows the dialog window and adds necessary event listeners.
     *
     * @since 1.0.0
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );
        this.$overlay
            .on( 'click', jQuery.proxy( this.empty, this ) )
            .appendTo( 'body' );
    },

    /**
     * Hides the dialog window and removes event listeners.
     *
     * @since 1.0.0
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
        this.$overlay
            .off()
            .detach();
    }

} );

module.exports = DialogRegion;

},{}],58:[function(require,module,exports){
var DialogView = require( './show/dialog' ),
	DialogModule;

DialogModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
		var api = {

            /**
             * Opens the dialog window.
             *
             * @since 1.0.0
             *
             * @param options
             */
			showDialog : function( options ) {
                app.dialog.show( new DialogView( options ) );
			}
		};

		this.listenTo( app.channel, 'dialog:open', api.showDialog );

	    /**
	     * Fires when the module is initialized.
	     *
	     * @since 1.5.0
	     *
	     * @param this
	     */
	    app.channel.trigger( 'module:dialog:ready', this );
    }

} );

module.exports = DialogModule;
},{"./show/dialog":59}],59:[function(require,module,exports){
/**
 * Dialog view for present growl-style notifications to the user.
 *
 * @class
 */
var $ = window.jQuery,
    DialogView;

DialogView = Backbone.Marionette.ItemView.extend( {

    className : 'dialog',

    defaults : {
        title : '',
        content : '',
        button : ''
    },

    ui : {
        close : '.js-close',
        content : '.dialog__content',
        save : '.js-save'
    },

    events : {
        'input' : 'onChange',
        'change' : 'onChange'
    },

    triggers : {
        'click @ui.close' : 'close',
        'click @ui.save' : 'save'
    },

    template : '#tmpl-tailor-dialog',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {

        return {
            title : this.title,
            content : this.content,
            button : this.button
        }
    },

    /**
     * Initializes the dialog window.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.title = options.title || this.defaults.title;
        this.content = options.content || this.defaults.content;
        this.button = options.button || this.defaults.button;
        this.callbacks = {
            validate : options.onValidate,
            open : options.onOpen,
            save : options.onSave,
            close : options.onClose
        };
    },

	/**
     * Generate content using the content callback function, if provided.
     *
     * @since 1.0.0
     */
    onBeforeRender : function() {
        if ( 'function' == typeof this.content ) {
            this.content = this.content.call( this );
        }
    },

    /**
     * Triggers the "onOpen" and "onValidate" callback functions when the dialog window is loaded.
     *
     * @since 1.0.0
     */
    onDomRefresh : function() {
        if ( 'function' === typeof this.callbacks.open ) {
            this.callbacks.open.call( this );
        }

        this.validate();
    },

    /**
     * Triggers the "onValidate" callback function when the dialog window is changed.
     *
     * @since 1.0.0
     */
    onChange : function() {
        this.validate();
    },

    /**
     * Validates the contents of the dialog window.
     *
     * If the validation criteria are met, the Save button is enabled.
     *
     * @since 1.0.0
     */
    validate : function() {
        if ( 'function' === typeof this.callbacks.validate ) {
            this.ui.save.prop( 'disabled', ! this.callbacks.validate.call( this ) );
        }
    },

    /**
     * Triggers the "onSave" callback function and closes the dialog window.
     *
     * @since 1.0.0
     */
    onSave : function() {
        if ( 'function' === typeof this.callbacks.save ) {
            this.callbacks.save.call( this );
        }

        this.onClose();
    },

    /**
     * Closes the dialog window.
     *
     * @since 1.0.0
     */
    onClose : function() {
        if ( 'function' === typeof this.callbacks.close ) {
            this.callbacks.close.call( this );
        }

        this.triggerMethod( 'destroy' );
    }

} );

module.exports = DialogView;

},{}],60:[function(require,module,exports){
var SnapshotsCollection = require( '../../entities/collections/snapshots' ),
    SnapshotMenuItem = require( './show/snapshot-menu-item' ),
    HistoryModule;

Tailor.Items.History = SnapshotMenuItem;

HistoryModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     */
	onStart : function( options ) {
        var module = this;

        module.collection = new SnapshotsCollection();
        
        var api = {

            /**
             * Returns a given history snapsho if an ID is provided, otherwise the snapshot collection.
             *
             * @since 1.5.0
             *
             * @param id
             * @returns {*}
             */
            getSnapshot : function( id ) {
                if ( id ) {
                    return module.collection.findWhere( { id : id } );
                }
                return module.collection;
            }
        };
        
        app.channel.reply( 'sidebar:history', api.getSnapshot );

        this.l10n = options.l10n;
        this.addEventListeners();
        
        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:history:ready', this );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'element:add', this.onAddElement );
	    this.listenTo( app.channel, 'element:copy', this.onCopyElement );
	    this.listenTo( app.channel, 'element:move', this.onMoveElement );
        this.listenTo( app.channel, 'modal:apply', this.onEditElement );
        this.listenTo( app.channel, 'element:delete', this.onDeleteElement );
        this.listenTo( app.channel, 'element:resize', this.onResizeElement );
        this.listenTo( app.channel, 'navigation:reorder', this.onReorderElement );
        this.listenTo( app.channel, 'template:add', this.onAddTemplate );
        this.listenTo( app.channel, 'history:restore', this.restoreSnapshot );
        this.listenTo( app.channel, 'history:undo', this.undoStep );
        this.listenTo( app.channel, 'history:redo', this.redoStep );
    },

    /**
     * Creates a new history entry after a new element is added.
     * 
     * Only show elements in the list of snapshots, templates are added separately
     *
     * @since 1.0.0
     *
     * @param model
     */
    onAddElement : function( model ) {
        if ( 'library' == model.get( 'collection' ) ) {
            this.saveSnapshot( this.l10n.added + ' ' + model.get( 'label' ) );
        }
    },

    /**
     * Creates a new history entry after an element is edited.
     *
     * @since 1.0.0
     *
     * @param modal
     * @param model
     */
    onEditElement : function( modal, model ) {
        this.saveSnapshot( this.l10n.edited + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is copied.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onCopyElement : function( model ) {
        this.saveSnapshot( this.l10n.copied + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is moved.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onMoveElement : function( model ) {
        this.saveSnapshot( this.l10n.moved + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is deleted.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onDeleteElement : function( model ) {
        this.saveSnapshot( this.l10n.deleted + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after an element is resized.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onResizeElement : function( model ) {
        this.saveSnapshot( this.l10n.resized + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after the children of a container are reordered.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onReorderElement : function( model ) {
        this.saveSnapshot( this.l10n.reordered + ' ' + model.get( 'label' ) );
    },

    /**
     * Creates a new history entry after a template is added.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onAddTemplate : function( model ) {
        this.saveSnapshot( this.l10n.added + ' ' + this.l10n.template + ' - ' + model.get( 'label' ) );
    },

    /**
     * Creates a snapshot of the element collection.
     *
     * @since 1.0.0
     *
     * @param label
     */
    saveSnapshot : function( label ) {
        this.collection.save( label );
    },

    /**
     * Restores a snapshot of the element collection.
     *
     * @since 1.0.0
     *
     * @param timestamp
     */
    restoreSnapshot : function( timestamp ) {
        this.collection.restore( timestamp );
    },

    /**
     * Restores the previous history snapshot.
     *
     * @since 1.0.0
     */
    undoStep : function() {
        this.collection.undo();
    },

    /**
     * Restores the next history snapshot.
     *
     * @since 1.0.0
     */
    redoStep : function() {
        this.collection.redo();
    }

} );

module.exports = HistoryModule;
},{"../../entities/collections/snapshots":46,"./show/snapshot-menu-item":61}],61:[function(require,module,exports){
var $ = Backbone.$,
    HistoryItem;

HistoryItem = Marionette.ItemView.extend( {

    events : {
        click : 'restore',
        keypress : 'onKeyPress'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-history-item',

    /**
     * Initializes the item.
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
        this.listenTo( this.model.collection, 'change:active', this.toggleClass );
    },

	/**
	 * Assigns the appropriate class name to the item based on whether it is active.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
        this.toggleClass();
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

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Restores the associated history entry when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.restore();
        }
    },

    /**
     * Restores the history entry.
     *
     * @since 1.0.0
     */
    restore : function() {
        var timestamp = this.model.get( 'timestamp' );

	    /**
	     * Fires before a request is made to restore a given history entry.
	     *
	     * @since 1.0.0
	     *
	     * @param id
	     */
	    app.channel.trigger( 'before:history:restore', timestamp );

        /**
         * Fires after a request is made to restore a given history entry.
         *
         * @since 1.0.0
         *
         * @param id
         */
        app.channel.trigger( 'history:restore', timestamp );
    },

    /**
     * Toggles the state of the entry element based on its status.
     *
     * @since 1.0.0
     *
     * @param model
     */
    toggleClass : function( model ) {
        model = model || this.model.collection.getActive();
        this.$el.toggleClass( 'is-active', model === this.model );
    }

} );

module.exports = HistoryItem;

},{}],62:[function(require,module,exports){

var LibraryCollection = require( '../../entities/collections/library' ),
    LibraryMenuItem = require( './show/library-menu-item' ),
    LibraryModule;

Tailor.Items.Library = LibraryMenuItem;

LibraryModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var collection = new LibraryCollection( options.library );
        var api = {

            /**
             * Returns a given library item if a tag is provided, otherwise the library.
             *
             * @since 1.0.0
             *
             * @param tag
             * @returns {*}
             */
            getLibraryItem : function ( tag ) {
                if ( tag ) {
                    return collection.findWhere( { tag : tag } );
                }
                return collection;
            }
        };

        app.channel.reply( 'sidebar:library', api.getLibraryItem );
    },

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:library:ready', this );
    }
    
} );

module.exports = LibraryModule;
},{"../../entities/collections/library":41,"./show/library-menu-item":63}],63:[function(require,module,exports){
var $ = Backbone.$,
    ElementMenuItem;

ElementMenuItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function() {
        var el = this.el;

        if ( el.classList.contains( 'is-inactive') ) {
            return;
        }

        var onAnimationEnd = function( e ) {
            el.removeEventListener( window.animationEndName, onAnimationEnd );
            el.classList.remove( 'shake' );
        };

        if ( Modernizr.cssanimations ) {
            el.addEventListener( window.animationEndName, onAnimationEnd );
            el.classList.add( 'shake' );
        }

        Tailor.Notify( window._l10n.dragElement, 'warning' );
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-library-item';
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );

        return this;
    },

	/**
     * Shows or hides the item based on whether it matches search criteria.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = ElementMenuItem;

},{}],64:[function(require,module,exports){
var ModalRegion = Backbone.Marionette.Region.extend( {

    /**
     * Displays the modal container and sets the initial modal window position.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );

        var rect = this.el.getBoundingClientRect();
        var width = this.el.style.width ? this.el.style.width : rect.width;
        this.el.style.width = width + 'px';

        if ( ! this.el.style.height ) {
            this.el.style.height = ( window.innerHeight - 40 ) + 'px';
        }

        if ( ! this.el.style.top  ) {
            this.el.style.top = '20px';
        }

        if ( ! this.el.style.left ) {
            if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
                this.el.style.left = 20 + 'px';
            }
            else {
                this.el.style.left = window.innerWidth - ( rect.width + 20 ) + 'px';
            }
        }

        // Update the element class name
        this.updateClassName( width );

        // Listen to resize events on the modal view
        this.listenTo( view, 'modal:resize', this.onResize );
    },

    /**
     * Responds to changes in the modal width and/or height.
     *
     * @since 1.0.0
     *
     * @param width
     * @param height
     */
    onResize : function( width, height ) {
        this.updateClassName( width );
    },

    /**
     * Updates the container class name based on the width.
     *
     * @since 1.0.0
     *
     * @param width
     */
    updateClassName : function( width ) {
        this.$el
            .toggleClass( 'is-x-small', width < 480 )
            .toggleClass( 'is-small', ( 481 < width ) && ( width < 767 ) )
            .toggleClass( 'is-medium', ( 768 < width ) && ( width < 979 ) )
            .toggleClass( 'is-large', ( 980 < width ) && ( width < 1199 ) )
            .toggleClass( 'is-x-large', width >= 1200 );
    },

    /**
     * Hides the modal container.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
	    this.stopListening( view, 'modal:resize', this.onResize );
    }

} );

module.exports = ModalRegion;
},{}],65:[function(require,module,exports){
var ModalView = require( './show/modal' ),
	ModalModule;

ModalModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
		var api = {

            /**
             * Opens a modal window to edit the given element.
             *
             * @since 1.0.0
             *
             * @param model
             */
			openModal : function( model ) {

                // Closes the current modal window and prompts the user to save any unsaved changes
                if ( app.modal.hasView() ) {
                    if ( model === app.modal.currentView.model ) {
                        return;
                    }
                    app.modal.currentView.triggerMethod( 'close' );
                }

                app.modal.show( new ModalView( {
                    model : model
                } ) );
			},

            /**
             * Closes the current modal window.
             *
             * @since 1.0.0
             */
            closeModal : function() {
                app.modal.empty();
            }
		};

		this.listenTo( app.channel, 'modal:open', api.openModal );
		this.listenTo( app.channel, 'elements:reset', api.closeModal );

	    /**
	     * Fires when the module is initialized.
	     *
	     * @since 1.5.0
	     *
	     * @param this
	     */
	    app.channel.trigger( 'module:modal:ready', this );
    }

} );

module.exports = ModalModule;
},{"./show/modal":68}],66:[function(require,module,exports){
var EmptyModalView = Marionette.ItemView.extend( {

    className : 'empty',

    template : '#tmpl-tailor-modal-empty'

} );

module.exports = EmptyModalView;
},{}],67:[function(require,module,exports){
var EmptySectionView = Marionette.ItemView.extend( {

    className : 'empty',

    template : '#tmpl-tailor-section-default-empty'

} );

module.exports = EmptySectionView;
},{}],68:[function(require,module,exports){
var SectionCollectionView = require( './sections' ),
    NavigationView = require( './tabs' ),
    ModalView;

ModalView = Marionette.LayoutView.extend( {

	className : 'modal',

	ui : {
		close : '.js-close',
		apply : '.js-apply'
	},

    behaviors : {
        Resizable : {
            ui : {
                handle : '.modal__title'
            }
        }
    },

    triggers : {
        'click @ui.close' : 'close',
        'click @ui.apply' : 'apply'
    },

    modelEvents : {
        'destroy' : 'destroy'
    },

	template : '#tmpl-tailor-modal',

	regions: {
        tabs : '#tailor-modal-tabs',
		sections : '#tailor-modal-sections'
	},

    /**
     * Initializes the modal window.
     *
     * @since 1.0.0
     */
	initialize : function() {
        this.isModified = false;
        this.settings = app.channel.request( 'sidebar:settings', this.model );
        this.addEventListeners();

        /**
         * Fires when the modal window is initialized.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:initialize', this, this.model );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChange );
    },

    /**
     * Renders the modal tabs and sections.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var model = this.model;
        var sections = app.channel.request( 'sidebar:sections', model );
        var controls = app.channel.request( 'sidebar:controls', model );
        
        this.showChildView( 'sections', new SectionCollectionView( {
            element : model,
            collection : sections,
            controls : controls
        } ) );

        if ( sections.length > 1 ) {
            this.showChildView( 'tabs', new NavigationView( {
                collection : sections
            } ) );
            this.el.classList.add( 'has-sections' );
        }

        model.collection.trigger( 'edit', model, true );
    },

    /**
     * Sets the initial focus and checks the position of the modal window when it is first shown.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.close.focus();
    },

    /**
     * Updates the modal window controls when an element setting is changed.
     *
     * @since 1.0.0
     */
    onChange : function( setting ) {
        this.isModified = true;
        this.ui.apply.attr( 'disabled', false );
        
        var model = this.model;
        if ( ! model.isTracking() ) {
            model.startTracking();
        }

        var update = setting.get( 'refresh' );
        var jsRefresh = update.hasOwnProperty( 'method' ) && 'js' == update['method'];
        
        // Check dependencies, if they exist
        if ( jsRefresh && update.hasOwnProperty( 'dependencies' ) ) {
            for ( var settingId in update['dependencies'] ) {
                if (
                    update['dependencies'].hasOwnProperty( settingId ) &&
                    _.has( update['dependencies'][ settingId ], 'condition' ) &&
                    _.has( update['dependencies'][ settingId ], 'value' )
                ) {
                    var targetSetting = setting.collection.get( settingId );
                    if ( targetSetting && ! Tailor.Helpers.checkCondition(
                            update['dependencies'][ settingId ]['condition'],
                            targetSetting.get( 'value' ),
                            update['dependencies'][ settingId ]['value']
                        )
                    ) {
                        jsRefresh = false;
                        break;
                    }
                }
            }
        }

        model.set( 'atts', this.atts(), { silent : jsRefresh } );
        
        if ( jsRefresh ) {

	        /**
	         * Triggers an event on the element model to inform it of a change to the setting.
             *
             * @since 1.5.0
             */
            model.trigger( 'change:setting', setting, model );
        }

        /**
         * Resets the canvas when previewing an element.
         *
         * @since 1.4.1
         */
        app.channel.trigger( 'canvas:reset' );
    },

    /**
     * Closes the modal window and applies changes.
     *
     * @since 1.0.0
     */
    onApply : function() {
        this.model.stopTracking();
	    this.model.set( 'atts', this.atts() );

        /**
         * Fires when element settings are applied.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:apply', this, this.model );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Closes the modal window.
     *
     * The user is prompted to apply changes, if changes have been made (and not already previewed).
     *
     * @since 1.0.0
     */
    onClose : function() {
        if ( this.isModified ) {
            var applyChanges = confirm( window._l10n.confirmElement );

            if ( true === applyChanges ) {
                this.triggerMethod( 'apply' );
            }
            else {
                this.model.resetAttributes();
            }
        }

        /**
         * Fires when the modal window is closed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:close', this );

        this.triggerMethod( 'destroy' );
    },

    /**
     * Triggers an event when the modal window is destroyed.
     *
     * @since 1.0.0
     */
    onDestroy : function() {
        this.model.collection.trigger( 'edit', this.model, false );

        /**
         * Fires when the modal window is destroyed.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:destroy', this, this.model );
    },

    /**
     * Returns the current setting values.
     *
     * @since 1.0.0
     *
     * @returns {{}}
     */
    atts : function() {
        var atts = {};
        this.settings.each( function( setting ) {
            var value = setting.get( 'value' );
            if ( null !== value ) {
                atts[ setting.get( 'id' ) ] = value;
            }
        }, this );
        return atts;
    }

} );

module.exports = ModalView;
},{"./sections":70,"./tabs":72}],69:[function(require,module,exports){
var ControlCollectionView = Marionette.CollectionView.extend( {

	tagName : 'ul',

    className : 'controls controls--modal',

    emptyView : require( './empty-section' ),

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return Tailor.lookup( child.get( 'type' ), false, 'Controls' );
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var options = { model : model };
        
        if ( 'list' === model.get( 'type' ) ) {
            options.element = this.element;
            options.collection = this.element.collection;
        }

        return options;
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
        return child.get( 'section' ) === this.model.get( 'id' )
    },

    /**
     * Initializes the modal section.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.model = options.model;
        this.element = options.element;

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.collection, 'select', this.onSelect );
    },

	/**
     * Toggles the section visibility when a section tab is selected.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSelect : function( model ) {
        this.$el.toggle( model === this.model );
    }

} );

module.exports = ControlCollectionView;
},{"./empty-section":67}],70:[function(require,module,exports){
var SectionCollectionView = Marionette.CollectionView.extend( {

    childView : require( './section' ),

    emptyView : require( './empty-modal' ),

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {

        return {
            model : model,
            element : this.element,
            collection : this.controls
        };
    },

    initialize : function( options ) {
        this.element = options.element;
        this.controls = options.controls;
    }

} );

module.exports = SectionCollectionView;
},{"./empty-modal":66,"./section":69}],71:[function(require,module,exports){
var NavigationItemView = Marionette.ItemView.extend( {

    tagName : 'li',

    className : 'tab',

    attributes : {
        'tabindex' : 0
    },

    events : {
        'click' : 'select',
        'keypress' : 'onKeyPress'
    },

    template : '#tmpl-tailor-modal-item',

    /**
     * Selects the tab.
     *
     * @since 1.0.0
     */
    select : function() {
        this.triggerMethod( 'select' );
    },

	/**
	 * Triggers a select event on the model.
	 *
	 * @since 1.0.0
	 */
    onSelect : function() {
        this.model.trigger( 'select', this.model );
        this.el.focus();
    },

    /**
     * Triggers select events, if the Enter key is pressed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
	        this.select();
        }
    }

} );

module.exports = NavigationItemView;
},{}],72:[function(require,module,exports){
var NavigationItemView = require( './tab' ),
    NavigationView;

NavigationView = Marionette.CollectionView.extend( {

    tagName : 'ul',

    className : 'tabs',

    childView : NavigationItemView,

    childEvents : {
        select : 'onSelect'
    },

	/**
     * Shows the first control section (tab).
     *
     * @since 1.0.0
     */
    onRender : function() {
        if ( this.collection.length > 0 ) {
            this.children.first().triggerMethod( 'select' );
        }
    },

	/**
     * Shows the selected control section (tab).
     *
     * @since 1.0.0
     *
     * @param view
     */
    onSelect : function( view ) {
        this.children.each( function( child ) {
            child.$el.toggleClass( 'is-active', view === child );
        } );
    }

} );

module.exports = NavigationView;
},{"./tab":71}],73:[function(require,module,exports){
var Notify = window.Tailor.Notify,
    NotificationsModule;

NotificationsModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        this.addEventListeners();

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:notifications:ready', this );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var l10n = window._l10n;
        
        // Trigger a notification when the page is saved
        this.listenTo( app.channel, 'sidebar:save', function() {
            Notify( l10n.savedPage, 'success' );
        } );
        
        // Trigger a notification when the canvas is restored
        this.listenTo( app.channel, 'elements:restore', function() {
            Notify( l10n.restoreElements, 'success' );
        } );
        
        // Trigger a notification when an element is deleted
        this.listenTo( app.channel, 'element:delete', function() {
            Notify( l10n.deletedElement, 'success' );
        } );
        
        // Trigger a notification when a template is saved
        this.listenTo( app.channel, 'template:save', function() {
            Notify( l10n.savedTemplate, 'success' );
        } );
        
        // Trigger a notification when a template is imported
        this.listenTo( app.channel, 'template:import', function() {
            Notify( l10n.importedTemplate, 'success' );
        } );
        
        // Trigger a notification when a template is added to the page
        this.listenTo( app.channel, 'template:add', function() {
            Notify( l10n.addedTemplate, 'success' );
        } );
        
        // Trigger a notification when a template is deleted
        this.listenTo( app.channel, 'template:delete', function() {
            Notify( l10n.deletedTemplate, 'success' );
        } );
    }

} );

module.exports = NotificationsModule;

},{}],74:[function(require,module,exports){
var PanelCollection = require( '../../entities/collections/panels' ),
    PanelLayoutView = require( './show/layout' ),
    PanelMenuItem = require( './show/panel-menu-item' ),
    PanelsModule;

Tailor.Items.Panels = PanelMenuItem;

PanelsModule = Marionette.Module.extend( {

    onBeforeStart : function( options ) {
        var module = this;

        module.collection = new PanelCollection( options.panels );

        var api = {

            /**
             * Returns a given panel if an ID is provided, otherwise the panel collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getPanels : function( id ) {
                if ( id ) {
                    return module.collection.findWhere( { id : id } )
                }
                return module.collection;
            }
        };

        app.channel.reply( 'sidebar:panels', api.getPanels );
    },

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function() {
        
        app.content.show( new PanelLayoutView( {
            panels :    app.channel.request( 'sidebar:panels' ),
            sections :  app.channel.request( 'sidebar:sections' ),
            controls :  app.channel.request( 'sidebar:controls' ),
            settings :  app.channel.request( 'sidebar:settings' )
        } ) );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:panels:ready', this );
    }

} );

module.exports = PanelsModule;

},{"../../entities/collections/panels":42,"./show/layout":75,"./show/panel-menu-item":76}],75:[function(require,module,exports){
var PanelsView = require( './panels' ),
    PanelLayoutView;

PanelLayoutView = Marionette.LayoutView.extend( {

    ui: {
        pageTitle : '.back-button'
    },

    className : 'tailor-sidebar__layout',

    regions : {
        panels : "#tailor-sidebar-home",
        panel : "#tailor-sidebar-panel",
        section : "#tailor-sidebar-section"
    },

    childEvents : {
        'show:panel' : 'showPanel',
        'show:section' : 'showSection',
        'back:home' : 'displayHome',
        'back:panel' : 'displayPanel'
    },

    template : function() {
        return document.getElementById( 'tmpl-tailor-sidebar-layout' ).innerHTML;
    },

    /**
     * Initializes the layout view.
     *
     * @since 1.0.0
     */
    initialize : function( options ) {
        this.panels = options.panels;
        this.sections = options.sections;
        this.controls = options.controls;
        this.settings = options.settings;
    },

	/**
     * Renders the panels.
     *
     * @since 1.0.0
     */
    onRender : function() {
        this.showChildView( 'panels', new PanelsView( {
            collection : this.panels
        } ) );
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showPanel : function( view ) {
        this.displayPanel();

        var collection = app.channel.request( 'sidebar:' + view.model.get( 'type' ) );
        var PanelView = Tailor.lookup( view.model.get( 'type' ), false, 'Panels' );
        
        this.showChildView( 'panel', new PanelView( {
            model : view.model,
            collection : collection
        } ) );
    },

	/**
     * Shows a given section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showSection : function( view ) {
        this.el.classList.add( 'section-visible' );
        this.el.classList.remove( 'panel-visible' );

        var SectionView = Tailor.lookup( view.model.get( 'type' ), false, 'Sections' );
        this.showChildView( 'section', new SectionView( {
            model : view.model,
            collection : this.controls,
            panel : this.panels.findWhere( { id : view.model.get( 'panel' ) } )
        } ) );
    },

	/**
     * Shows the initial Home view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayHome : function( view ) {
        this.el.classList.remove( 'panel-visible' );
        this.el.classList.remove( 'section-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayPanel : function( view ) {
        this.el.classList.remove( 'section-visible' );
        this.el.classList.add( 'panel-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    }

} );

module.exports = PanelLayoutView;

},{"./panels":78}],76:[function(require,module,exports){
var $ = Backbone.$,
	PanelItem;

PanelItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        focus : 'onFocus'
    },

    template : '#tmpl-tailor-panel-default-item',

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Displays the associated panel when the item is clicked.
	 *
	 * @since 1.0.0
	 */
    onClick : function() {
        this.triggerMethod( 'show:panel' );
    },

	/**
	 * Displays the associated panel when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'show:panel' );
        }
    },

	/**
	 * Sets focus on the list item.
	 *
	 * @since 1.0.0
	 */
    onFocus : function() {
        this.el.focus();
    }

} );

module.exports = PanelItem;

},{}],77:[function(require,module,exports){
var EmptyPanelView = Marionette.ItemView.extend( {

    className : 'empty',

    template : '#tmpl-tailor-home-empty'

} );

module.exports = EmptyPanelView;
},{}],78:[function(require,module,exports){
var PanelsView = Marionette.CompositeView.extend( {

    getChildView : function() {
        return Tailor.lookup( 'panels', false, 'Items' );
    },

    childViewContainer : '#items',

    emptyView : require( './panels-empty' ),

    behaviors : {
        Panel : {}
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-home'

} );

module.exports = PanelsView;
},{"./panels-empty":77}],79:[function(require,module,exports){

var SectionCollection = require( '../../entities/collections/sections' ),
    DefaultMenuItem = require( './show/default-menu-item' ),
    SectionsModule;

Tailor.Items.Default = DefaultMenuItem;

SectionsModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;

        module.collection = {
            sidebar : new SectionCollection( options.sections )
        };

		var api = {

            /**
             * Returns the collection of sections for a given element.
             *
             * If no element model is is provided, the sidebar sections collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSections : function( model ) {

                // Return the sidebar section collection if no element is provided
                if ( ! model ) {
                    return module.collection['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.collection.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var sections = itemDefinition.get( 'sections' ) || [];
                    module.collection[ cid ] = new SectionCollection( sections );
                }

                // Return the element control collection
                return module.collection[ cid ];
            }
		};

        app.channel.reply( 'sidebar:sections sidebar:default', api.getSections );
    },

    /**
     * Initializes the module.
     *
     * @since 1.5.0
     */
    onStart: function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:sections:ready', this );
    }

} );

module.exports = SectionsModule;
},{"../../entities/collections/sections":44,"./show/default-menu-item":80}],80:[function(require,module,exports){
var $ = Backbone.$,
    DefaultItem;

DefaultItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'focus' : 'onFocus'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-default-item',

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );
        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Displays the associated section when the item is clicked.
	 *
	 * @since 1.0.0
	 */
    onClick : function() {
        this.triggerMethod( 'show:section' );
    },

	/**
	 * Displays the associated section when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'show:section' );
        }
    },

	/**
	 * Sets focus on the list item.
	 *
	 * @since 1.0.0
	 */
	onFocus : function() {
		this.el.focus();
	}

} );

module.exports = DefaultItem;

},{}],81:[function(require,module,exports){

var SettingCollection = require( '../../entities/collections/settings' ),
    ControlCollection = require( '../../entities/collections/controls' ),
    SettingsModule;

SettingsModule = Marionette.Module.extend( {

    onBeforeStart : function( options ) {
        var module = this;

        module.settings = {
            sidebar : new SettingCollection( options.settings )
        };
        
        module.controls = {
            sidebar : new ControlCollection( options.controls, {
                silent : false,
                settings : module.settings['sidebar']
            } )
        };
        
        var api = {

            /**
             * Returns the collection of controls for a given element.
             *
             * If no element model is is provided, the sidebar control collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getControls : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.controls['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.controls.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var controls = itemDefinition.get( 'controls' ) || [];
                    var settings = api.getSettings( model );

                    module.controls[ cid ] = new ControlCollection( controls, {
                        silent : false,
                        settings : settings
                    } );
                }

                // Return the element control collection
                return module.controls[ cid ];
            },

            /**
             * Returns the collection of settings for a given element.
             *
             * If no element model is is provided, the sidebar settings collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSettings : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.settings['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.settings.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var settings = itemDefinition.get( 'settings' ) || [];

                    module.settings[ cid ] = new SettingCollection( settings, { element : model } );
                }

                module.settings[ cid ].load();

                // Return the element control collection
                return module.settings[ cid ];
            }
        };

        app.channel.reply( 'sidebar:controls', api.getControls );
        app.channel.reply( 'sidebar:settings', api.getSettings );

        this.listenTo( module.settings['sidebar'], 'change', this.onChangeSetting );
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
        app.channel.trigger( 'module:settings:ready', this );
    },

    /**
     * Triggers an event on the app communication channel when a sidebar setting changes.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    onChangeSetting : function( setting ) {

        /**
         * Fires when a sidebar setting changes.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'sidebar:setting:change', setting );
    }

} );

module.exports = SettingsModule;
},{"../../entities/collections/controls":40,"../../entities/collections/settings":45}],82:[function(require,module,exports){
var $ = Backbone.$,
    l10n = window._l10n,
    TemplateMenuItem;

TemplateMenuItem = Marionette.ItemView.extend( {

    ui : {
        'delete' : '.js-delete-template',
        'download' : '.js-download-template',
        'preview' : '.js-preview-template'
    },

    events : {
        'click' : 'onClick'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function( e ) {
        switch ( e.target ) {
            case this.ui.download.get( 0 ):
                this.download();
                break;

            case this.ui.delete.get( 0 ):
                this.delete();
                break;

            case this.ui.preview.get( 0 ):
                this.preview();
                break;

            default:
                var el = this.el;
                var onAnimationEnd = function( e ) {
                    el.removeEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.remove( 'shake' );
                };
                if ( Modernizr.cssanimations ) {
                    el.addEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.add( 'shake' );
                }
                Tailor.Notify( l10n.dragTemplate, 'warning' );
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-templates-item';
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

    /**
     * Downloads the template to a JSON file.
     *
     * @since 1.0.0
     */
    download : function() {
        var item = this;
        var id = item.model.get( 'id' );

        window.ajax.send( 'tailor_load_template', {
            data : {
                template_id : id,
                nonce : window._nonces.loadTemplate
            },

	        /**
             * Downloads the template to a JSON file.
             *
             * @since 1.0.0
             *
             * @param response
             */
            success : function( response ) {
                var model = item.model;
                var models = response.models;
                var label = model.get( 'label' );

                id = label.replace( ' ', '-' ).toLowerCase();

                var json = {
                    id : id,
                    label : label,
                    tag : model.get( 'tag' ),
                    type : model.get( 'type' ),
                    models : models
                };

                json = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( json ) );

                var a = document.getElementById( 'download-template' );
                a.setAttribute( 'href', json );
                a.setAttribute( 'download', 'tailor-template-' + id + '-' + Date.now() + '.json' );
                a.click();

                /**
                 * Fires when a template is downloaded.
                 *
                 * @since 1.5.0
                 */
                app.channel.trigger( 'template:download' );
            }
        } );
    },

    /**
     * Deletes the template.
     *
     * @since 1.0.0
     */
    delete : function() {
        var that = this;

        window.ajax.send( 'tailor_delete_template', {
            data : {
                id : that.model.get( 'id' ),
                nonce : window._nonces.deleteTemplate
            },

            /**
             * Destroys the template list item when the template is successfully deleted.
             *
             * @since 1.0.0
             */
            success : function() {
                that.$el.slideUp( function() {
                    that.model.trigger( 'destroy', that.model );
                } );

                /**
                 * Fires when a template is deleted.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:delete' );
            }
        } );
    },

    /**
     * Previews the template.
     *
     * @since 1.0.0
     */
    preview : function() {

        window._urls.view += ( window._urls.view.split('?')[1] ? '&':'?') + 'template_preview=1&template_id=' + this.model.get( 'id' );
        window.open( window._urls.view, '_blank' );

        /**
         * Fires when a template is previewed.
         *
         * @since 1.5.0
         */
        app.channel.trigger( 'template:preview' );
    },


    /**
     * Determines whether the template should be visible based on search terms entered in the template search bar.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = TemplateMenuItem;
},{}],83:[function(require,module,exports){
var l10n = window._l10n,
    TemplatesPanel;

TemplatesPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button',
        save : '.js-save-template',
        import : '.js-import-template',
        searchForm : '.search-form'
    },

    events : {
        'click @ui.save' : 'save',
        'click @ui.import' : 'import'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : Tailor.Panels.Empty,

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    template : '#tmpl-tailor-panel-templates',

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {*|exports|module.exports}
     */
    getChildView : function() {
        return Tailor.lookup( this.model.get( 'type' ), false, 'Items' );
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
        data.items = this.collection;
        return data;
    },

	/**
	 * Sets focus on the back button when the panel is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Shows the search form after a child is added.
	 *
	 * @since 1.0.0
	 */
    onAddChild : function() {
		this.ui.searchForm.show();
    },

	/**
	 * Hides the search form if there are no saved templates after a template is removed.
	 *
	 * @since 1.0.0
	 */
    onRemoveChild : function() {
        if ( 0 === this.collection.length ) {
            this.ui.searchForm.hide();
        }
    },

	/**
	 * Opens the Import Template dialog.
	 *
	 * @since 1.0.0
	 */
    import : function( e ) {
        var panel = this;
        var options = {
            title : l10n.importTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-import-template').innerHTML,
            button : l10n.import,

	        /**
	         * Sets focus on the template selection field.
             */
            onOpen : function() {
                this.el.querySelector( '#import-template' ).focus();
            },

	        /**
             * Returns true if the selected file is a JSON file.
             *
             * @returns {*|boolean}
             */
            onValidate : function() {
                var input = this.el.querySelector( '#import-template' );
                var re = /(?:\.([^.]+))?$/;
                return input.value && ( 'json' === re.exec( input.value )[1] );
            },

	        /**
             * Saves the selected JSON file as a template.
             */
            onSave : function() {
                var input = this.el.querySelector( '#import-template' );
                var file = input.files[0];
                if ( ! file || file.name.match( /.+\.json/ ) ) {
                    var reader = new FileReader();
                    reader.onload = function( e ) {
                        var defaults = {
                            label : '',
                            tag : '',
                            models : [],
                            nonce : window._nonces.saveTemplate
                        };
                        var data = _.extend( defaults, JSON.parse( reader.result ) );
                        data.models = JSON.stringify( data.models );
                        panel.createTemplate( data, 'import' );
                    };
                    try {
                        reader.readAsText( file );
                    }
                    catch( e ) {}
                }
            },

	        /**
	         * Sets focus back to the Import Template button.
             */
            onClose : function() {
                panel.ui.import.focus();
            }
        };

		/**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', options );
    },

	/**
	 * Opens the Save Template dialog.
	 *
	 * @since 1.0.0
	 */
    save : function() {
        var selected = app.channel.request( 'canvas:element:selected' );
        var elements = app.channel.request( 'canvas:elements' );
        var models = [];
        var tag;

        if ( selected && 'function' == typeof selected.get ) {
            var getChildren = function( id ) {
                _.each( elements.where( { parent : id } ), function( model ) {
                    models.push( model.toJSON() );
                    getChildren( model.get( 'id' ) );
                } );
            };

            if ( 'child' == selected.get( 'type' ) ) {
                selected = selected.collection.get( selected.get( 'parent' ) );
            }

            getChildren( selected.get( 'id' ) );

            selected = selected.toJSON();
            selected.parent = '';
            models.push( selected ) ;
            tag = selected.tag;
        }
        else {
            models = elements.models;
            tag = 'tailor_section';
        }

        var panel = this;

        /**
         * Fires when the dialog window is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'dialog:open', {
            title : l10n.saveTemplate,
            content : document.querySelector( '#tmpl-tailor-dialog-save-template').innerHTML,
            button : l10n.save,

	        /**
             * Sets focus on the template name field.
             */
            onOpen : function() {
                this.el.querySelector( '#save-template' ).focus();
            },

	        /**
             * Returns true if the template name is not empty.
             *
             * @returns {*}
             */
            onValidate : function() {
                var input = this.el.querySelector( '#save-template' );
                return input.value.trim();
            },

	        /**
             * Saves the current selection as a new template.
             */
            onSave : function() {
                var input = this.el.querySelector( '#save-template' );
                var data = {
                    label : input.value,
                    tag : tag,
                    models : JSON.stringify( models ),
                    nonce : window._nonces.saveTemplate
                };
                panel.createTemplate( data, 'save' );
            },

	        /**
             * Sets focus back to the Save Template button.
             */
            onClose : function() {
                panel.ui.save.focus();
            }
        } );
    },

    /**
     * Sends a request to the server to register a new template.
     *
     * Occurs after a template is saved or imported.
     *
     * @since 1.0.0
     *
     * @param data
     * @param action
     */
    createTemplate : function( data, action ) {

        action = action || 'save';

        var panel = this;
        var collection = panel.collection;

        panel.ui.save.prop( 'disabled', true );
        panel.ui.import.prop( 'disabled', true );

        window.ajax.send( 'tailor_save_template', {
            data : data,

	        /**
             * Adds the new template to the collection.
             *
             * @param response
             */
            success : function( response ) {
                collection.add( {
                    id : response.id,
                    label : response.label,
                    tag : response.tag,
                    type : response.type
                } );

                /**
                 * Fires when a template is saved or imported.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:' + action );
            },

	        /**
             * Update the UI upon completion.
             */
            complete : function() {
                panel.ui.save.prop( 'disabled', false );
                panel.ui.import.prop( 'disabled', false );
            }
        } );
    }

} );

module.exports = TemplatesPanel;
},{}],84:[function(require,module,exports){

var TemplateCollection = require( '../../entities/collections/templates' ),
	TemplatesPanel = require( './show/templates-panel' ),
	TemplateItem = require( './show/template-menu-item' ),
	TemplatesModule;

Tailor.Panels.Templates = TemplatesPanel;
Tailor.Items.Templates = TemplateItem;

TemplatesModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;
		
        this.collection = new TemplateCollection( options.templates );
		
		var api = {

            /**
             * Returns the template item collection.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getTemplates : function() {
                return module.collection;
            }
		};

        app.channel.reply( 'sidebar:templates', api.getTemplates );
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
		app.channel.trigger( 'module:templates:ready', this );
	}
	
} );

module.exports = TemplatesModule;
},{"../../entities/collections/templates":47,"./show/template-menu-item":82,"./show/templates-panel":83}],85:[function(require,module,exports){
/* window._l10n, window._mediaQueries */

var $ = jQuery;
var title = document.querySelector( '.tailor__home .title' );

Tailor.Api.Setting.onChange( 'sidebar:_post_title', function( to, from ) {
    if ( title.hasChildNodes() ) {
        var children = title.childNodes;
        for ( var i = 1; i < children.length; i++ ) {
            if ( 3 == children[ i ].nodeType && -1 !== children[ i ].nodeValue.indexOf( from ) ) {
                children[ i ].nodeValue = to;
            }
        }
    }

    document.title = window._l10n.tailoring + to;
} );
},{}]},{},[8]);
