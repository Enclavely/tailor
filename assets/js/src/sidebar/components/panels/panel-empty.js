var EmptyPanelView = Marionette.ItemView.extend( {

    className : 'empty',

    initialize : function( options ) {
        this.type = options.type;
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.type || 'default';
        return '#tmpl-tailor-panel-' + type + '-empty';
    }

} );

module.exports = EmptyPanelView;