var ControlCollectionView = Marionette.CollectionView.extend( {

	tagName : 'ul',

    className : 'controls controls--modal',

    emptyView : require( './empty-section' ),

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return Tailor.lookup( child.get( 'type' ), false, 'Controls' );
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var options = { model : model };
        
        if ( 'list' === model.get( 'type' ) ) {
            options.element = this.element;
            options.collection = this.element.collection;
        }

        return options;
    },

    /**
     * Filters the collection to ensure that only the appropriate children are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'section' ) === this.model.get( 'id' )
    },

    /**
     * Initializes the modal section.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.model = options.model;
        this.element = options.element;

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.collection, 'select', this.onSelect );
    },

	/**
     * Toggles the section visibility when a section tab is selected.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSelect : function( model ) {
        this.$el.toggle( model === this.model );
    }

} );

module.exports = ControlCollectionView;