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
