/**
 * Tailor.Views.TailorListItem
 *
 * List item element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    ListItemView;

ListItemView = ContainerView.extend( {
    childViewContainer : '.tailor-list__content'
} );

module.exports = ListItemView;