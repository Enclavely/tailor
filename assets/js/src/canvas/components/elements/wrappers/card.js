var ContainerView = require( './../element-container' ),
    CardView;

CardView = ContainerView.extend( {
    childViewContainer : '.tailor-card__content'
} );

module.exports = CardView;