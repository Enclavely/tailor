/**
 * Tailor.Views.TailorToggle
 *
 * Toggles element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    ToggleView;

ToggleView = ContainerView.extend( {
    childViewContainer : '.tailor-toggle__body'
} );

module.exports = ToggleView;