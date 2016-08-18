var $ = Backbone.$,
    ElementMenuItem;

ElementMenuItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function() {
        var el = this.el;

        if ( el.classList.contains( 'is-inactive') ) {
            return;
        }

        var onAnimationEnd = function( e ) {
            el.removeEventListener( window.animationEndName, onAnimationEnd );
            el.classList.remove( 'shake' );
        };

        if ( Modernizr.cssanimations ) {
            el.addEventListener( window.animationEndName, onAnimationEnd );
            el.classList.add( 'shake' );
        }

        Tailor.Notify( window._l10n.dragElement, 'warning' );
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-library-item';
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );

        return this;
    },

	/**
     * Shows or hides the item based on whether it matches search criteria.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = ElementMenuItem;
