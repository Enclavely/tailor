var SelectMenuItemView = Marionette.ItemView.extend( {

    tagName : 'div',

	className : 'select__item',

	events : {
		'click' : 'onClick'
	},

	getTemplate : function() {
		return _.template( '<span><%= label %></span>' );
	},

	/**
	 * Toggles the breadcrumb list, or selects a breadcrumb.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
	onClick : function( e ) {
		if ( 0 === this._index ) {

            /**
             * Toggles the breadcrumbs.
             *
             * @since 1.0.0
             */
			this.triggerMethod( 'toggle' );
		}
		else {

            /**
             * Triggers a select event on the model.
             *
             * @since 1.0.0
             */
			this.model.trigger( 'select' );
		}

		e.stopPropagation();
	}

} );

module.exports = SelectMenuItemView;