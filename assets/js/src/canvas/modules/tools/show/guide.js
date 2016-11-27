var GuideView = Marionette.ItemView.extend( {

	template : false,

	/**
     * Positions the insertion guide over a given element.
     *
     * @since 1.0.0
     *
     * @param view
     * @param drop
     */
    position : function( view, drop ) {
        var $el = view.$el;
        var offset = $el.offset();
        var parentOffset = this.$el.offsetParent().offset();

        this.el.style.visibility = 'visible';
        this.el.className = 'guide guide--' + drop + ' guide--' + view.model.get( 'tag' );
        this.el.style.left = offset.left - parentOffset.left + 'px';
        this.el.style.top = offset.top - parentOffset.top + 'px';
        this.el.style.width = $el.outerWidth() + 'px';
        this.el.style.height = $el.outerHeight() + 'px';
        this.el.style.opacity = 1;
    },

	/**
     * Resets the insertion guide.
     *
     * @since 1.0.0
     */
    reset : function() {
        this.el.style = '';
        this.el.style.visibility = 'hidden';
        this.el.style.opacity = 0;
    }

} );

module.exports = GuideView;