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