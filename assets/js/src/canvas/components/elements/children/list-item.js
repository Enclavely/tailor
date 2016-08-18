var ContainerView = require( './../element-container' ),
    ListItemView;

ListItemView = ContainerView.extend( {
    childViewContainer : '.tailor-list__content'
} );

module.exports = ListItemView;