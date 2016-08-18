var ContainerView = require( './../element-container' ),
    BoxView;

BoxView = ContainerView.extend( {
    childViewContainer : '.tailor-box__content'
} );

module.exports = BoxView;