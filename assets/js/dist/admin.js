(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Admin scripts to facilitate dismissible notices and icon kit management.
 *
 * @since 1.0.0
 */
window.ajax = require( './utility/ajax' );
window.notify = require( './utility/notify' );

( function( ajax, $ ) {

    'use strict';

    $( document ).ready( function() {

        var $iconKitField = $( '.tailor-icon-kits' );

        $( '.notice.is-dismissible' ).on( 'click', '.notice-dismiss', function( event ) {
            $( this ).slideUp();
        } );

        var frame = wp.media( {
            button: {
                text : 'Select kit'
            },
            states: [
                new wp.media.controller.Library({
                    title : 'Select kit',
                    library : wp.media.query( { type : [ 'application/zip' ] } ),
                    multiple : false,
                    date : false
                } )
            ]
        } );

        frame.on( 'select', function( e ) {
            var selection = frame.state().get( 'selection' ).toJSON();
            var id = _.pluck( selection, 'id' );
            var name = $iconKitField.data( 'name' );

            $iconKitField.find( '.spinner' ).addClass( 'is-active' );

            var options = {

                data : {
                    id : id[0],
                    name : name,
                    nonce : window.iconKitNonce
                },

                error : function( response ) {

                    var $notice = $( _.template( document.getElementById( 'tmpl-tailor-notice' ).innerHTML, { message : response.message } ) );

                    $iconKitField.closest( '.form-table' ).before( $notice );

                    $notice.on( 'click', function() {
                        $notice
                            .hide()
                            .off();
                    } );
                },

                success : function( response ) {
                    $iconKitField.html( $( response ).html() );
                },

                complete : function() {
                    $iconKitField.find( '.spinner' ).removeClass( 'is-active' );
                }
            };

            ajax( 'tailor_add_icon_kit', options );
        } );

        $iconKitField.on( 'click', '.js-select', function( e ) {
            frame.open();
        } );

        $iconKitField.on( 'click', '.js-delete', function( e ) {
            var name = $iconKitField.data( 'name' );
            $iconKitField.find( '.spinner' ).addClass( 'is-active' );

            var options = {
                data : {
                    id : this.getAttribute( 'data-id' ),
                    name : name,
                    nonce : window.iconKitNonce
                },

                success : function( response ) {
                    $iconKitField.html( $( response ).html() );
                }
            };

            ajax( 'tailor_delete_icon_kit', options );

            e.preventDefault();
        } );
    } );

} )( window.ajax.send, jQuery );
},{"./utility/ajax":2,"./utility/notify":3}],2:[function(require,module,exports){
/**
 * window.ajax
 *
 * Simple AJAX utility module.
 *
 * @class
 */
var $ = jQuery,
    Ajax;

var Ajax = {

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
        if ( response && response.hasOwnProperty( 'message' ) ) {

            // Display the error from the server
            Tailor.Notify( response.message );
        }
        else if ( '0' == response ) {

            // Session expired
            Tailor.Notify( window._l10n.expired );
        }
        else if ( '-1' == response ) {

            // Invalid nonce
            Tailor.Notify( window._l10n.invalid );
        }
        else {

            // General error condition
            Tailor.Notify( window._l10n.error );
        }
    }
};

module.exports = Ajax;
},{}],3:[function(require,module,exports){
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
},{"./polyfills/transitions":4}],4:[function(require,module,exports){
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
