var DroppableBehaviors = Marionette.Behavior.extend( {

	events : {
		'dragover' : 'onDragOver',
        'drop' : 'onDrop'
	},

    /**
     * Triggers an event when the item is dragged over another item.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDragOver: function( e ) {
        app.channel.trigger( 'canvas:dragover', e.originalEvent, this.view );
	},

    /**
     * Triggers an event when the item is dropped.
     *
     * @since 1.0.0
     *
     * @param e
     */
	onDrop : function( e ) {
        app.channel.trigger( 'canvas:drop', e.originalEvent, this.view );
	}

} );

module.exports = DroppableBehaviors;