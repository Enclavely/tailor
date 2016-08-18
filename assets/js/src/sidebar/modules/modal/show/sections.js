var SectionCollectionView = Marionette.CollectionView.extend( {

    childView : require( './section' ),

    emptyView : require( './empty-modal' ),

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

        return {
            model : model,
            element : this.element,
            collection : this.controls
        };
    },

    initialize : function( options ) {
        this.element = options.element;
        this.controls = options.controls;
    }

} );

module.exports = SectionCollectionView;