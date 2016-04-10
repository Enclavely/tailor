module.exports = Marionette.CollectionView.extend( {

    tagName : 'ul',

    className : 'tabs',

    childView : require( './tab' ),

    childEvents : {
        select : 'onSelect'
    },

	/**
     * Shows the first control section (tab).
     *
     * @since 1.0.0
     */
    onRender : function() {
        if ( this.collection.length > 0 ) {
            this.children.first().triggerMethod( 'select' );
        }
    },

	/**
     * Shows the selected control section (tab).
     *
     * @since 1.0.0
     *
     * @param view
     */
    onSelect : function( view ) {
        this.children.each( function( child ) {
            child.$el.toggleClass( 'is-active', view === child );
        } );
    }

} );