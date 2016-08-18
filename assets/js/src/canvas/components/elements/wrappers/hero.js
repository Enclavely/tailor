var ContainerView = require( './../element-container' ),
    HeroView;

HeroView = ContainerView.extend( {
    childViewContainer : '.tailor-hero__content'
} );

module.exports = HeroView;