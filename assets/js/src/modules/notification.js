module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'sidebar:save', this.onSave );

        this.listenTo( app.channel, 'elements:restore', this.onRestoreElements );

        this.listenTo( app.channel, 'element:delete', this.onDeleteElement );

        this.listenTo( app.channel, 'template:save', this.onSaveTemplate );
        this.listenTo( app.channel, 'template:import', this.onImportTemplate );
        this.listenTo( app.channel, 'template:add', this.onAddTemplate );
        this.listenTo( app.channel, 'template:delete', this.onDeleteTemplate );
    },

    /**
     * Triggers a notification when the page is saved.
     *
     * @since 1.0.0
     */
    onSave : function() {
        Tailor.Notify( window._l10n.savedPage, 'success' );
    },

    /**
     * Triggers a notification when the canvas is restored (e.g., from a history entry).
     *
     * @since 1.0.0
     */
    onRestoreElements : function() {
        Tailor.Notify( window._l10n.restoreElements, 'success' );
    },

    /**
     * Triggers a notification when an element is deleted.
     *
     * @since 1.0.0
     */
    onDeleteElement : function() {
        Tailor.Notify( window._l10n.deletedElement, 'success' );
    },

    /**
     * Triggers a notification when a new template is saved.
     *
     * @since 1.0.0
     */
    onSaveTemplate : function() {
        Tailor.Notify( window._l10n.savedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is imported from a JSON file.
     *
     * @since 1.0.0
     */
    onImportTemplate : function() {
        Tailor.Notify( window._l10n.importedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is added to the page.
     *
     * @since 1.0.0
     */
    onAddTemplate : function() {
        Tailor.Notify( window._l10n.addedTemplate, 'success' );
    },

    /**
     * Triggers a notification when a template is deleted.
     *
     * @since 1.0.0
     */
    onDeleteTemplate : function() {
        Tailor.Notify( window._l10n.deletedTemplate, 'success' );
    }

} );