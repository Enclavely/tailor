/**
 * Tailor.Sections.Default
 *
 * A default section.
 *
 * @augments Marionette.CompositeView
 */
var $ = Backbone.$,
    DefaultSection;

DefaultSection = Marionette.CompositeView.extend( {

    ui: {
        backButton : '.back-button'
    },

    triggers : {
        'click @ui.backButton': 'back:panel'
    },

    behaviors : {
        Panel : {}
    },

    emptyView : require( './section-empty' ),

    childViewContainer : '#controls',

    /**
     * Initializes the section view.
     *
     * @since 1.0.0
     * @param options
     */
    initialize : function( options ) {
        this.panel = options.panel;
    },

    /**
     * Returns the appropriate child view based on the control type.
     *
     * @since 1.0.0
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView : function( child ) {
        return window.Tailor.Controls.lookup( child.get( 'type' ) );
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
        if ( 'default' === this.model.get( 'type' ) ) {
            return child.get( 'section' ) === this.model.get( 'id' )
        }
        return true;
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-section-' + this.model.get( 'type' );
    },

    /**
     * Serializes the data that is provided to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.panel = this.panel.get( 'title' );
        return data;
    },

	/**
	 * Sets focus on the back button and refreshes code editors when the section is displayed.
	 *
	 * @since 1.0.0
	 */
    onShow : function() {
        this.ui.backButton.get(0).focus();
        this.children.each( function( control ) {
            if ( 'code' === control.model.get( 'type' ) ) {
                control.editor.refresh();
            }
        }, this );
    }

} );

module.exports = DefaultSection;