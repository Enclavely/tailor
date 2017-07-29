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