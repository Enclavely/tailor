var NavigationItemView = Marionette.ItemView.extend( {

    tagName : 'li',

    className : 'tab',

    attributes : {
        'tabindex' : 0
    },

    events : {
        'click' : 'select',
        'keypress' : 'onKeyPress'
    },

    template : '#tmpl-tailor-modal-item',

    /**
     * Selects the tab.
     *
     * @since 1.0.0
     */
    select : function() {
        this.triggerMethod( 'select' );
    },

	/**
	 * Triggers a select event on the model.
	 *
	 * @since 1.0.0
	 */
    onSelect : function() {
        this.model.trigger( 'select', this.model );
        this.el.focus();
    },

    /**
     * Triggers select events, if the Enter key is pressed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
	        this.select();
        }
    }

} );

module.exports = NavigationItemView;