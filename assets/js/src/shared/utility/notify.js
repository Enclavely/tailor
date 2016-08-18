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
