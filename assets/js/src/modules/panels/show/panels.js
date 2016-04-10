module.exports = Marionette.CompositeView.extend( {

    getChildView : function() {
        return window.Tailor.Items.lookup( 'panels' );
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