( function( $ ) {

    'use strict';

    var $doc = $( document );
    var $win = $( window );
    var mediaQueries = {
        xs: {
            from: 0,
            to: 543
        },
        sm: {
            from: 544,
            to: 767
        },
        md: {
            from: 768,
            to: 991
        },
        lg: {
            from: 992,
            to: 1199
        },
        xl: {
            from: 1200,
            to: 'all'
        }
    };

    $doc.ready( function( $ ) {
        var $header = $( '#header' );
        var $heroBlock = $( '.hero.block' );
        var ticking = false;

        function update() {
            var el = document.documentElement,
                body = document.getElementsByTagName( 'body' )[0],
                x = window.innerWidth || el.clientWidth || body.clientWidth,
                y = window.innerHeight || el.clientHeight || body.clientHeight;

            var wScrollTop = $win.scrollTop();

            if ( $header.hasClass( 'is-fixed' ) ) {
                $header.toggleClass( 'is-small', wScrollTop > $header.outerHeight() );
            }

            var heroHeight = $heroBlock.find( '.container' ).outerHeight();

            if ( wScrollTop < y && x > mediaQueries.md.from ){
                $heroBlock.css( {
                    opacity: Math.max( Math.min( ( heroHeight - wScrollTop ) / ( heroHeight ), 1 ), 0 )
                } );
            }

            var section = document.querySelector( '.features.dark-theme' );
            if ( section ) {
                $header.toggleClass( 'is-light', section.getBoundingClientRect().top < 40 );
            }

            ticking = false;
        }

        function onScroll() {
            requestTick();
        }

        function requestTick() {
            if ( ! ticking ) {
                requestAnimationFrame( update );
            }
            ticking = true;
        }

        $win
           .scroll( onScroll )
           .resize( onScroll );

        onScroll();

    } );
} ) ( jQuery );