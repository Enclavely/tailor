/**
 * The Sidebar Marionette application.
 */
var $ = Backbone.$,
    SidebarApplication;

SidebarApplication = Marionette.Application.extend( {

	el : document.querySelector( '#tailor' ),

    /**
     * Initializes the application.
     *
     * @since 1.0.0
     */
	initialize : function() {
        this._collapsed = false;
        this._unsavedChanges = false;
        this.saveButton = document.querySelector( '#tailor-save' );
        this.allowableEvents = [
            
            // Element actions
	        'element:add', 'element:move', 'element:resize', 'element:change:order', 'element:copy', 'element:delete',
            
            // Collection actions
	        'elements:restore', 'elements:reset',
            
            // Template actions
            'template:add',
            
            // Modal actions
            'modal:open', 'modal:destroy',
            
            // Setting actions
            'sidebar:settings'
        ];

        this.addEventListeners();
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
        var sidebarApp = this;

        /**
         * Updates the Save button and adds a confirmation prompt to the window when a change occurs.
         *
         * @since 1.0.0
         */
        sidebarApp.onSettingChange = function() {
            sidebarApp.saveButton.disabled = false;
            sidebarApp.saveButton.innerHTML = window._l10n.publish;
            sidebarApp._unsavedChanges = true;
        };

        sidebarApp.listenTo( sidebarApp.channel, 'sidebar:setting:change', sidebarApp.onSettingChange );
        sidebarApp.listenTo( sidebarApp.channel, _.without( sidebarApp.allowableEvents, 'modal:open', 'modal:destroy' ).join( ' ' ), sidebarApp.onSettingChange );
        sidebarApp.listenTo( sidebarApp.channel, [ 'modal:apply' ].join( ' ' ), sidebarApp.onSettingChange );

        /**
         * Collapses the Sidebar when the Collapse button is selected.
         *
         * @since 1.0.0
         */
        $( '#tailor-collapse' ).on( 'click', function() {
            sidebarApp._collapsed = ! sidebarApp._collapsed;
            sidebarApp.el.classList.toggle( 'is-collapsed', sidebarApp._collapsed );
            sidebarApp.saveButton.setAttribute( 'aria-expanded', ! sidebarApp._collapsed );

            /**
             * Fires before the application closes.
             *
             * @since 1.0.0
             */
            sidebarApp.triggerMethod( 'collapse:sidebar' );
        } );

        /**
         * Saves settings and models when the Save button is clicked.
         *
         * @since 1.0.0
         */
        $( sidebarApp.saveButton ).on( 'click', function() {
            sidebarApp.el.classList.add( 'is-saving' );
            sidebarApp.saveButton.setAttribute( 'disabled', true );

            var models = sidebarApp.channel.request( 'canvas:elements' );
            var settings = sidebarApp.channel.request( 'sidebar:settings' );
            var options = {
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
                    sidebarApp.saveButton.disabled = true;
                    sidebarApp.saveButton.innerHTML = window._l10n.saved;
                    sidebarApp._unsavedChanges = false;

                    /**
                     * Fires when changes are successfully saved.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'sidebar:save' );
                },

                error: function( response ) {

                    sidebarApp.saveButton.disabled = false;

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
                },

                /**
                 * Updates the sidebar after a save action is completed.
                 *
                 * @since 1.0.0
                 */
                complete : function( response ) {
                    sidebarApp.el.classList.remove( 'is-saving' );
                }
            };

            window.ajax.send( 'tailor_save', options );
        } );

        sidebarApp.listenToOnce( sidebarApp.channel, 'canvas:initialize', sidebarApp.registerRemoteChannel );

        /**
         * Restores the next history snapshot, if available.
         *
         * @since 1.0.0
         */
        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 89 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Y" is pressed.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'history:redo' );
                }
            }
        } );

	    /**
         * Restores the previous history snapshot, if available.
         *
         * @since 1.0.0
         */
        $( document ).on( 'keydown', function( e ) {
            if ( e.ctrlKey && 90 == e.keyCode ) {
                if ( ! _.contains( [ 'INPUT', 'SELECT', 'TEXTAREA' ], e.target.tagName ) ) {

                    /**
                     * Fires when a "CTRL-Z" is pressed.
                     *
                     * @since 1.0.0
                     */
                    sidebarApp.channel.trigger( 'history:undo' );
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
            app.channel.reply( 'canvas:elements', function( id ) {
                return remoteChannel.request( 'canvas:elements', id );
            } );

            /**
             * Returns the history entry collection from the remote window.
             *
             * @since 1.0.0
             */
            app.channel.reply( 'sidebar:history', function( id ) {
                return remoteChannel.request( 'sidebar:history', id );
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
             */
            remoteChannel.trigger( 'sidebar:initialize' );
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