/**
 * Makes animation and transition support status and end names available as global variables.
 */
( function( window ) {

    'use strict';

    var el = document.createElement( 'fakeelement' );

    function getAnimationEvent(){
        var t,
            animations = {
                'animation' : 'animationend',
                'OAnimation' : 'oAnimationEnd',
                'MozAnimation' : 'animationend',
                'WebkitAnimation' : 'webkitAnimationEnd'
            };

        for ( t in animations ) {
            if ( animations.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return animations[ t ];
            }
        }

        return false;
    }

    function getTransitionEvent(){
        var t,
            transitions = {
                'transition' : 'transitionend',
                'OTransition' : 'oTransitionEnd',
                'MozTransition' : 'transitionend',
                'WebkitTransition' : 'webkitTransitionEnd'
            };

        for ( t in transitions ) {
            if ( transitions.hasOwnProperty( t ) && 'undefined' !== typeof el.style[ t ] ) {
                return transitions[ t ];
            }
        }

        return false;
    }

    window.animationEndName = getAnimationEvent();
    window.transitionEndName = getTransitionEvent();

} ) ( window );
