( function( Views ) {

    'use strict';
    
    Views.TailorSection = require( './components/elements/wrappers/view-section' );
	Views.TailorBox = require( './components/elements/wrappers/view-box' );
	Views.TailorCard = require( './components/elements/wrappers/view-card' );
	Views.TailorHero = require( './components/elements/wrappers/view-hero' );

    Views.TailorColumn = require( './components/elements/children/view-column' );
	Views.TailorTab = require( './components/elements/children/view-tab' );
	Views.TailorToggle = require( './components/elements/children/view-toggle' );
	Views.TailorListItem = require( './components/elements/children/view-list-item' );
	Views.TailorCarouselItem = require( './components/elements/children/view-carousel-item' );

	Views.TailorTabs = require( './components/elements/containers/view-tabs' );
    Views.TailorCarousel = require( './components/elements/containers/view-carousel' );
	
    Views.Element = require( './components/elements/view-element' );
    Views.Container = require( './components/elements/view-container' );
    Views.Wrapper = require( './components/elements/view-container' );
    Views.Child = require( './components/elements/view-container' );

    Views.lookup = function( tag, type ) {
        tag = tag.replace( /_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
            return key.toUpperCase().replace( /\s+/g, '' );
        } );

        if ( Views.hasOwnProperty( tag ) ) {
            return Views[ tag ];
        }

        if ( type ) {
            type = type.replace( /_/g, ' ' ).replace( /(?: |\b)(\w)/g, function( key ) {
                return key.toUpperCase().replace( /\s+/g, '' );
            } );

            if ( Views.hasOwnProperty( type ) ) {
                return Views[ type ];
            }
        }

        return Views.Element;
    };

    window.Tailor.Views = Views;

} ) ( window.Tailor.Views || {} );