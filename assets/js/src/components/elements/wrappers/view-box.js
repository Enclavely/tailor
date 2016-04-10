/**
 * Tailor.Views.TailorBox
 *
 * Box element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    BoxView;

BoxView = ContainerView.extend( {
    childViewContainer : '.tailor-box__content'
} );

module.exports = BoxView;