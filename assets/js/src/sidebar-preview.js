( function( Api, $ ) {

    var title = document.querySelector( '.tailor__home .title' );

    Api( '_post_title', function( to, from ) {

        if ( title.hasChildNodes() ) {
            var children = title.childNodes;
            for ( var i = 1; i < children.length; i++ ) {
                if ( 3 == children[ i ].nodeType && -1 !== children[ i ].nodeValue.indexOf( from ) ) {
                    children[ i ].nodeValue = to;
                }
            }
        }

        document.title = window._l10n.tailoring + to;
    } );

    $( '.preview__control' ).on( 'change', function( e ) {
        var size = this.value;
        var preview = document.querySelector( '.tailor-preview' );
        var viewport = document.querySelector( '.tailor-preview__viewport' );

        viewport.classList.remove( 'is-loaded' );

        setTimeout( function() {
            preview.className = 'tailor-preview ' + size + '-screens';
        }, 250 );

        setTimeout( function() {
            viewport.classList.add( 'is-loaded' );
        }, 1000 );

    } );

    var $buttons = $( '.devices button' );

    $buttons.on( 'click', function( e ) {
        var button = e.target;
        var preview = document.querySelector( '.tailor-preview' );

        $buttons.each( function() {
            if ( this == button ) {
                this.classList.add( 'is-active' );
                this.setAttribute( 'aria-pressed', 'true' );
                preview.className = 'tailor-preview ' + button.getAttribute( 'data-device' ) + '-screens';
            }
            else {
                this.classList.remove( 'is-active' );
                this.setAttribute( 'aria-pressed', 'false' );
            }
        } );

    } );

    $buttons.first().click();

} ) ( Tailor.Api, jQuery );