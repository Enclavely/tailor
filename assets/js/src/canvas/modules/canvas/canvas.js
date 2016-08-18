var $ = Backbone.$,
    $win = $( window ),
    $doc = $( document ),
    CanvasCollectionView = require( './show/canvas-view' ),
    CanvasModule;

CanvasModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
		this._model = null;
		this._isDragging = false;
        this.collection = app.channel.request( 'canvas:elements' );

        this.addEventListeners();
        this.showCanvas();

        /**
         * Fires when the Canvas module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:canvas:ready', this );
	},

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'canvas:dragstart', this.onDragStart );
        this.listenTo( app.channel, 'canvas:dragover', this.onDragOver );
        this.listenTo( app.channel, 'canvas:dragend', this.onDragEnd );
        this.listenTo( app.channel, 'canvas:drop', this.onDrop );

        $doc.on( 'click dragover', this.reset.bind( this ) );
        $win.on( 'resize', this.reset.bind( this ) );
    },

    /**
     * Displays elements on the canvas.
     *
     * @since 1.0.0
     */
    showCanvas : function() {
        app.canvasRegion.show( new CanvasCollectionView( {
            collection : this.collection
        } ) );
    },

    /**
     * Records information about the drag target when dragging begins.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragStart : function( e, view ) {
        var collection = view.model.collection;

        // Do nothing if this is an element with a selected parent
        if ( 'function' === typeof collection.hasSelectedParent && collection.hasSelectedParent( view.model ) ) {
            return;
        }

		this._view = view;
		this._model = view.model;
		this._isDragging = true;

        view.el.classList.add( 'is-dragging' );

        // Use an empty drag image for elements to improve performance
        if ( 'element' == view.model.get( 'collection' ) ) {
            var testVar = window.DataTransfer || window.Clipboard;
            if ( 'setDragImage' in testVar.prototype ) {
                var dragImage = document.createElement( 'img' );
                dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                e.dataTransfer.setDragImage( dragImage, 0, 0 );
            }
        }

        e.dataTransfer.effectAllowed = "copyMove";
        e.dataTransfer.setData( 'Text', this._model.cid );

		e.stopPropagation();
	},

    /**
     * Validates the drop target and updates the insertion guide when the drag target is dragged over an element.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragOver : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

	    // Maybe scroll the window while dragging
	    if ( e.pageY ) {
		    var scrollY = window.scrollY || document.documentElement.scrollTop;
		    if ( ( e.pageY - scrollY ) < 40 ) {
			    window.scrollTo( 0, scrollY - 20 );
		    }
		    else if ( ( ( scrollY + window.innerHeight ) - e.pageY ) < 40 ) {
			    window.scrollTo( 0, scrollY + 20 );
		    }
	    }

        var action = ( 'element' === this._model.get( 'collection' ) && e.shiftKey ) ? 'copy' : 'move';

        if ( 'move' === action && view.model === this._model ) {
            this.reset();
            e.stopPropagation();
            return;
        }

        var region = this._getDropRegion( e, view );
        if ( ! view.model.validTarget( this._model, region ) ) {
            return;
        }

        e.dataTransfer.dropEffect = action;

        app.channel.trigger( 'canvas:guide', view, region );

        e.preventDefault();
        e.stopPropagation();
	},

    /**
     * Validates the drop target and updates the canvas the drag target is dropped on an element.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDrop : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

        var model = this._model;
        var region = this._getDropRegion( e, view );
        if ( ! view.model.validTarget( model, region ) ) {
            return;
        }

        var action;
        if ( 'element' === model.get( 'collection' ) ) {
           action = e.shiftKey ? 'copy' : 'move';
            if ( 'move' === action && view.model === model ) {
                return;
            }
        }
        else {
            action = 'add';
        }

        /**
         * Fires after an action has been taken on the canvas.
         *
         * @since 1.0.0
         */
        model.trigger( 'element:' + action + ':' + region, view, this._view );

        /**
         * Fires after an action has been taken on the canvas.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'element:' + action, model );

        this.collection.sort( { silent : true } );

        e.preventDefault();
        e.stopPropagation();
	},

    /**
     * Cleans up the canvas when dragging of the drag target ends.
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     */
	onDragEnd : function( e, view ) {
        if ( ! this._isDragging ) {
            return;
        }

 		this._isDragging = false;
		this._view.el.classList.remove( 'is-dragging' );
        this.reset();

        //app.channel.trigger( 'debug' );
    },

    /**
     * Resets the canvas.
     *
     * @since 1.0.0
     */
    reset : function() {

        /**
         * Fires when the canvas is reset.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'canvas:reset' );
    },

    /**
     * Returns the current point (x,y coordinates).
     *
     * @since 1.0.0
     *
     * @param e
     * @returns {{x: (*|number|Number), y: (*|number|Number)}}
     * @private
     */
    _getPoint : function( e ) {
        if ( e.targetTouches ) { // Prefer Touch Events
            return {
                x : e.targetTouches[0].clientX,
                y : e.targetTouches[0].clientY
            };
        }
        return {
            x : e.clientX,
            y : e.clientY
        };
    },

    /**
     * Returns the region of the element currently occupied by the drag target (top, right, bottom, left, center).
     *
     * @since 1.0.0
     *
     * @param e
     * @param view
     * @returns string
     * @private
     */
    _getDropRegion : function( e, view ) {
        var point = this._getPoint( e );
        var rect = view.el.getBoundingClientRect();
        var width = rect.width / 2;
        var height = rect.height / 2;
        var top = rect.top + ( rect.height - height ) / 2;
        var left = rect.left + ( rect.width - width ) / 2;

        if (
            ( left <= point.x ) && ( point.x <= ( left + width ) ) &&
            ( top <= point.y ) && ( point.y <= ( top + height ) )
        ) {
            return 'center';
        }
        else {
            var x = ( point.x - ( rect.left + width ) ) / ( width );
            var y = ( point.y - ( rect.top + height ) ) / ( height );
            
            if ( Math.abs( x ) > Math.abs( y ) ) {
                return x > 0 ? 'right' : 'left';
            }
            return y > 0 ? 'bottom' : 'top';
        }
    }

} );

module.exports = CanvasModule;