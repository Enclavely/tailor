/**
 * Tailor.Views.TailorHero
 *
 * Hero element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    HeroView;

HeroView = ContainerView.extend( {
    childViewContainer : '.tailor-hero__content'
} );

module.exports = HeroView;