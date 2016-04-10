/**
 * Tailor.Panels.Default
 *
 * A default panel.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
	DefaultPanel;

DefaultPanel = Marionette.CompositeView.extend( {

    ui : {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:home'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './panel-empty' ),

    emptyViewOptions : function() {
        return {
            type : this.model.get( 'type' )
        };
    },

    childViewContainer : '#items',

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Items.lookup( this.model.get( 'type' ) );
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
        switch ( this.model.get( 'type' ) ) {

            case 'library':
                return ! _.contains( [ 'tailor_row' ], child.get( 'tag' ) ) && ! _.contains( [ 'child', 'inline' ], child.get( 'type' ) );
                break;

            case 'default':
                return child.get( 'panel' ) === this.model.get( 'id' );
                break;

            default:
                return true;
                break;
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-panel-' + type;
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.items = this.collection;
        return data;
    },

	/**
     * Sets focus on the back button when the panel is displayed.
     *
     * @since 1.0.0
     */
    onShow : function() {
        this.ui.backButton.get(0).focus();
    }

} );

module.exports = DefaultPanel;