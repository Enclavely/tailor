var ContainerView = require( './../element-container' ),
	ColumnView;

ColumnView = ContainerView.extend( {

    ui : {
        'sizer' : '.tailor-column__sizer'
    },

    events : {
        'mousedown @ui.sizer' : 'onResize'
    },

    modelEvents : {
        'change:atts' : 'onChangeAttributes',
        'change:width' : 'onChangeWidth',
        'change:setting' : 'onChangeSetting'
    },

    /**
     * Appends the column handle to the element after child elements have been rendered.
     *
     * @since 1.0.0
     */
    onRenderCollection : function() {
        this.updateClassName( this.model.get( 'atts' ).width );
        this.$el
            .attr( 'draggable', true )
            .prepend(
	            '<div class="tailor-column__helper">' +
	                '<div class="tailor-column__sizer"></div>' +
	            '</div>'
	        );
    },

    /**
     * Handles resizing of the column when the resize handle is dragged.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onResize : function( e ) {
		var columnView = this;
		var model = columnView.model;
		var nextModel = model.collection.findWhere( {
            parent : model.get( 'parent' ),
            order : model.get( 'order' ) + 1 }
        );

        var originalWidth = model.get( 'atts' ).width;

	    /**
	     * Handles the resizing of columns.
	     *
	     * @since 1.0.0
	     *
	     * @param e
	     */
		function onResize( e ) {
			document.body.classList.add( 'is-resizing' );
			document.body.style.cursor = 'col-resize';

			var rect = columnView.el.getBoundingClientRect();
            var atts = _.clone( model.get( 'atts' ) );
            var nextAtts = _.clone( nextModel.get( 'atts' ) );
			var width = parseInt( atts.width );
            var nextWidth = parseInt( nextAtts.width );
			var newWidth = Math.round( ( e.clientX - rect.left ) / ( rect.width ) * width );
			if ( newWidth < 1 || ( newWidth + 1 ) > ( width + nextWidth ) || newWidth == width ) {
				return;
			}

            atts.width = newWidth;
            nextAtts.width =  nextWidth - ( newWidth - width );

            model.set( 'atts', atts, { silent : true } );
            nextModel.set( 'atts', nextAtts, { silent : true } );

            model.trigger( 'change:width', model, atts.width );
		    nextModel.trigger( 'change:width', nextModel, nextAtts.width );
        }

	    /**
	     * Maybe update the widths of affected columns after resizing ends.
	     *
	     * @since 1.0.0
	     *
	     * @param e
	     */
		function onResizeEnd( e ) {
			document.removeEventListener( 'mousemove', onResize, false );
			document.removeEventListener( 'mouseup', onResizeEnd, false );

            document.body.classList.remove( 'is-resizing' );
            document.body.style.cursor = 'default';

            if ( originalWidth != model.get( 'atts' ).width ) {

                /**
                 * Fires after the column has been resized.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'element:resize', model );
            }
        }

        document.addEventListener( 'mousemove', onResize, false );
        document.addEventListener( 'mouseup', onResizeEnd, false );

	    /**
	     * Resets the canvas when dragging of a column begins.
	     *
	     * @since 1.0.0
	     */
        app.channel.trigger( 'canvas:reset' );

        return false;
	},

    /**
     * Updates the column class name when the width changes.
     *
     * @since 1.0.0
     *
     * @param model
     * @param width
     */
	onChangeWidth : function( model, width ) {
        this.updateClassName( width );

	    /**
	     * Fires after the column width has changed.
	     *
	     * @since 1.0.0
	     */
	    this.triggerAll( 'element:parent:change', this );
	},

    /**
     * Updates the class name following a change to the column width.
     *
     * @since 1.0.0
     *
     * @param width
     */
    updateClassName : function( width ) {
        this.$el.removeClass( function( index, css ) {
            return ( css.match( /(^|\s)columns-\S+/g) || [] ).join( ' ' );
        } );

        this.el.classList.add( 'columns-' + width );
    }

} );

module.exports = ColumnView;