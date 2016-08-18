var PanelsView = Marionette.CompositeView.extend( {

    getChildView : function() {
        return Tailor.lookup( 'panels', false, 'Items' );
    },

    childViewContainer : '#items',

    emptyView : require( './panels-empty' ),

    behaviors : {
        Panel : {}
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-home'

} );

module.exports = PanelsView;