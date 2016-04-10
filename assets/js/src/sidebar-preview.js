
( function( Api, $ ) {

    var title = document.querySelector( '.tailor__home .title' );

    Api( '_post_title', function( to, from ) {
        if ( title.hasChildNodes() ) {
            var children = title.childNodes;
            for ( var i = 0; i < children.length; i++ ) {
                if ( 3 == children[ i ].nodeType && from == children[ i ].nodeValue.trim() ) {
                    children[ i ].nodeValue = to
                }
            }
        }
        document.title = document.title.replace( from, to );
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

} ) ( Tailor.Api, jQuery );