module.exports = Marionette.CollectionView.extend( {

	behaviors : {
		Container : {}
	},

    /**
     * Returns the appropriate child view based on the element tag.
     *
     * @since 1.0.0
     *
     * @returns {*|exports|module.exports}
     */
    getChildView : function() {
        return Tailor.lookup( 'tailor_section', 'wrapper', 'Views' );
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend( {
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return ! child.get( 'parent' );
    },

    /**
     * Updated Marionette function : changed to update the 'order' attribute along with the view _index.
     *
     * @since 1.0.0
     *
     * @param view
     * @param increment
     * @param index
     * @private
     */
    _updateIndices : function( view, increment, index ) {

        if ( increment ) {
            view._index = index;

            //console.log( '\n Updated index of view ' + view.model.get( 'id' ) + ' to ' + index );

            view.model._changing = false;
            view.model.set( 'order', index );
        }

        this.children.each( function( laterView ) {
            if ( laterView._index >= view._index ) {
                laterView._index += increment ? 1 : -1;

                //console.log( '\n Updated index of view ' + laterView.model.get( 'id' ) + ' to ' + laterView._index );

                laterView.model.set( 'order', laterView._index );
            }
        }, this );
    },

    /**
     * Triggers events and methods during a given event in the lifecycle.
     *
     * @since 1.0.0
     *
     * @param event
     * @param view
     * @param atts
     */
    triggerAll : function( event, view, atts ) {
        this.$el.trigger( event, view );
        this.triggerMethod( event, view );

        if ( atts ) {
            app.channel.trigger( event, this, atts);
        }
        else {
            app.channel.trigger( event, this );
        }
    }

} );
