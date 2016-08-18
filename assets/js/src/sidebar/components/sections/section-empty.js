var EmptySectionView = Marionette.ItemView.extend( {

    className : 'empty',

    /**
     * Returns the appropriate template based on the section type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        var type = this.model.get( 'type' ) || 'default';
        return '#tmpl-tailor-section-' + type + '-empty';
    }

} );

module.exports = EmptySectionView;