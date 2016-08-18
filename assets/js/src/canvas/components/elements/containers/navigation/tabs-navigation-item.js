module.exports = Marionette.ItemView.extend( {

    tagName : 'li',

	className : function() {
        return  'tailor-tabs__navigation-item tailor-' + this.model.get( 'id' );
    },

    modelEvents : {
        'change:atts' : 'onChangeAttributes'
    },

    /**
     * Adds the view ID to the element for use by the tab script.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
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
        return _.template( '<%= title || "Tab" %>' );
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
        var atts = this.model.get( 'atts' );
        data.title = atts.title;

        return data;
    },

    /**
     * Update the title when the attributes are updated.
     *
     * @since 1.0.0
     *
     * @param model
     * @param atts
     */
    onChangeAttributes : function( model, atts ) {
        this.el.innerHTML = atts.title || 'Tab';
    }

} );
