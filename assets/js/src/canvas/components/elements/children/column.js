var $ = window.jQuery,
	ContainerView = require( './../element-container' ),
	ColumnView,
	cssModule;

app.channel.on( 'module:css:stylesheets:ready', function( module ) {
	cssModule = module;
} );

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

	    if ( 'undefined' != typeof cssModule ) {
		    this.updateCSS( this.model.get( 'id' ), this.model.get( 'atts' ) );
	    }

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
	    var device = app.channel.request( 'sidebar:device' );
	    var setting = ( 'desktop' == device ) ? 'width' : ( 'width_' + device );

	    var model = columnView.model;
	    var nextModel = model.collection.findWhere( {
		    parent : model.get( 'parent' ),
		    order : model.get( 'order' ) + 1
	    } );

	    var atts = model.get( 'atts' );
	    var nextAtts = nextModel.get( 'atts' );

	    var width = parseFloat( atts[ setting ] || atts.width );
	    var nextWidth = parseFloat( nextAtts[ setting ] || nextAtts.width );
	    var columnsWidth = width + nextWidth;
	    
	    var column = columnView.el.getBoundingClientRect();

	    // Add visual indicators
	    var $first = $( '<span class="tailor-column__width tailor-column__width--right">' + width + '%</span>' );
	    var $second = $( '<span class="tailor-column__width tailor-column__width--left">' + nextWidth + '%</span>' );

	    $first.prependTo( columnView.$el );
	    $second.prependTo( columnView.$el.next() );

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

		    var columnWidth = Math.min( columnsWidth - 10, Math.max( 10, Math.round( parseFloat( ( ( e.clientX - column.left ) / column.width ) * width ) * 10 ) / 10 ) );
		    var nextColumnWidth = Math.round( parseFloat( columnsWidth - columnWidth ) * 10 ) / 10;

		    columnWidth += '%';
		    nextColumnWidth += '%';

		    // Update the UI
		    $first.html( columnWidth );
		    $second.html( nextColumnWidth );

		    // Update the attributes
		    var atts = _.clone( model.get( 'atts' ) );
		    var nextAtts = _.clone( nextModel.get( 'atts' ) );
		    atts[ setting ] = columnWidth;
		    nextAtts[ setting ] = nextColumnWidth;
		    model.set( 'atts', atts, { silent : true } );
		    nextModel.set( 'atts', nextAtts, { silent : true } );

		    // Trigger change events on the models
		    model.trigger( 'change:width', model, atts );
		    nextModel.trigger( 'change:width', nextModel, nextAtts );
        }

	    /**
	     * Maybe update the widths of affected columns after resizing ends.
	     *
	     * @since 1.0.0
	     */
		function onResizeEnd() {
			document.removeEventListener( 'mousemove', onResize, false );
			document.removeEventListener( 'mouseup', onResizeEnd, false );
            document.body.classList.remove( 'is-resizing' );
            document.body.style.cursor = 'default';

		    $first.remove();
		    $second.remove();

		    var atts = model.get( 'atts' );
            if ( width != atts[ setting ] ) {

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
     */
	onChangeWidth : function( model, atts ) {
	    this.updateCSS( model.get( 'id' ), atts );

	    /**
	     * Fires after the column width has changed.
	     *
	     * @since 1.7.5
	     */
	    this.triggerAll( 'element:refresh', this );
	},

	updateCSS : function( elementId, atts ) {
		var ruleSet = {};
		var width = atts['width'];
		var tabletWidth = atts['width_tablet'] || atts['width'];
		var mobileWidth = atts['width_mobile'] || atts['width'];

		// Desktop width
		ruleSet['desktop'] = {};
		ruleSet['desktop'][ elementId ] = [ {
			selectors: [],
			declarations:  { 'width' : width },
			setting: 'width'
		} ];

		// Tablet width
		ruleSet['tablet'] = {};
		ruleSet['tablet'][ elementId ] = [ {
			selectors: [ '.mobile-columns &', '.tablet-columns &' ],
			declarations:  { 'width' : tabletWidth },
			setting: 'width_tablet'
		} ];

		// Mobile width
		ruleSet['mobile'] = {};
		ruleSet['mobile'][ elementId ] = [ {
			selectors: [ '.mobile-columns &' ],
			declarations:  { 'width' : mobileWidth },
			setting: 'width_mobile'
		} ];

		cssModule.deleteRules( elementId, 'width' );
		cssModule.deleteRules( elementId, 'width_tablet' );
		cssModule.deleteRules( elementId, 'width_mobile' );
		cssModule.addRules( ruleSet );
	}

} );

module.exports = ColumnView;