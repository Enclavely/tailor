app.channel.on( 'debug', function() {

    function printCollectionLevel( collection, parent, depth ) {
        depth = depth + 1;
        var children = collection.where( { parent : parent } );
        var level = depth;

        if ( 0 === children.length ) {
            return;
        }

        var spacing = Array( depth ).join( "\t" );
        _.each( children, function( child ) {
            console.log( spacing + ' ' + child.get( 'label' ) + ' (id: ' + child.get( 'id' ) + ', order: ' + child.get( 'order' ) + ')' );
            printCollectionLevel( collection, child.get( 'id' ), level );

        } );
    }

    function printIndexLevel( view, depth ) {
        depth = depth + 1;
        var level = depth;

        if ( ! view.children ) {
            return;
        }

        var spacing = Array( depth ).join( "\t" );

        view.children.each( function( child ) {
            console.log( spacing + ' ' + child.model.get( 'label' ) + ' (id: ' + child.model.get( 'id' ) + ', order: ' + child._index + ')' );
            printIndexLevel( child, level );
        } );
    }

    function printCollection() {

        var models = app.channel.request( 'canvas:elements' );

        console.log( models );

        //models.sort( { silent : true } );
        printCollectionLevel( models, '', 0 );
    }

    function printIndices() {
        var canvas = app.canvasRegion.currentView;
        printIndexLevel( canvas, 0 );
    }

    console.log('\n Collection:');
    printCollection();

    console.log('\n Indices:');
    printIndices();

} );
