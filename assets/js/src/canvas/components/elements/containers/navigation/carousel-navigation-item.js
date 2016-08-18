module.exports = Marionette.ItemView.extend( {

    tagName : 'li',

    attributes : function() {
        return {
            'data-id' : this.model.cid
        };
    },

    /**
     * Returns the element template.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
	getTemplate : function() {
        return _.template( '<button data-role="none" role="button" aria-required="false" tabindex="0"></button>' );
    }

} );
