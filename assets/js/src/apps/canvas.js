/**
 * The Canvas Marionette application.
 */
var $ = Backbone.$,
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
        this.allowableEvents = [
	        'canvas:dragstart', 'canvas:drag', 'canvas:dragend',
	        'history:restore', 'history:undo', 'history:redo',
            'modal:apply',
	        'css:add', 'css:delete', 'css:update', 'css:clear',
            'sidebar:setting:change',
            'template:load'
        ];
        this.addEventListeners();
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        var canvasApp = this;
        var resetCanvas = function() {

            /**
             * Fires when the canvas is reset.
             *
             * @since 1.0.0
             */
            canvasApp.channel.trigger( 'canvas:reset' );
        };

        document.addEventListener( 'click', resetCanvas, false );
        document.addEventListener( 'dragover', resetCanvas, false );
        window.addEventListener( 'resize', resetCanvas, false );

        $( 'a' ).attr( { draggable : false, target : '_blank' } );

        $( 'img' ).attr( { draggable : false } );

        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 89 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Y" is pressed.
                     *
                     * @since 1.0.0
                     */
                    canvasApp.channel.trigger( 'history:redo' );
                }
            }
        } );

        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 90 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Z" is pressed.
                     *
                     * @since 1.0.0
                     */
                    canvasApp.channel.trigger( 'history:undo' );
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
        var getLibrary = function( id ) {
            return remoteChannel.request( 'sidebar:library', id );
        };

        this.channel.reply( 'sidebar:library', getLibrary );
	    this.listenTo( remoteChannel, 'all', this.forwardRemoteEvent );

        /**
         * Fires when the canvas is initialized.
         *
         * @since 1.0.0
         */
        remoteChannel.trigger( 'canvas:initialize' );
    },

    /**
     * Forwards specific events from the remote communication channel.
     *
     * @since 1.0.0
     */
    forwardRemoteEvent : function( eventName ) {
        var validEvent = _.contains( this.allowableEvents, eventName );
        if ( validEvent ) {
            this.channel.trigger.apply( this.channel, arguments );
        }
    }

} );

module.exports = CanvasApplication;