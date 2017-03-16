var ContainerModel = require( './../element-container' ),
    TabsModel;

TabsModel = ContainerModel.extend( {

	/**
	 * Creates a new template based on the element.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();

		var $navigation = view.$el.find( '.tailor-tabs__navigation' );
		var $navigationItems = $navigation.children().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );

		$navigation.append( $navigationItems );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = TabsModel;