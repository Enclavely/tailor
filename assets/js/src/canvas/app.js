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

            // Used when dragging library items and templates from the sidebar
	        'canvas:dragstart', 'canvas:drag', 'canvas:dragend',

            // Used when loading a template
            'template:load',

            // History actions
	        //'history:restore', 'history:undo', 'history:redo',

            // Modal actions
            'modal:apply',

            // CSS actions
	        //'css:add', 'css:delete', 'css:update', 'css:clear',

            // Used by the setting API to respond to sidebar setting changes
            'sidebar:setting:change',

            // Used to allow the sidebar to reset the canvas
            'canvas:reset',

            // Used by the History module to reset the element collection
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
            if ( e.ctrlKey && 89 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Y" is pressed.
                     *
                     * @since 1.0.0
                     */
                    canvas.channel.trigger( 'history:redo' );
                }
            }
        } );

        $doc.on( 'keydown', function( e ) {
            if ( e.ctrlKey && 90 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Z" is pressed.
                     *
                     * @since 1.0.0
                     */
                    canvas.channel.trigger( 'history:undo' );
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