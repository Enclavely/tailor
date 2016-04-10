/**
 * Tailor.Views.TailorCard
 *
 * Card element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    CardView;

CardView = ContainerView.extend( {
    childViewContainer : '.tailor-card__content'
} );

module.exports = CardView;