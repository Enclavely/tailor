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