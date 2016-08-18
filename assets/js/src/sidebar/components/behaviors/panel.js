var PanelBehavior = Marionette.Behavior.extend( {

    ui: {
        backButton : '.back-button',
        helpButton : '.help-button',
        helpDescription : '.help-description',
        searchBar : '.search'
    },

    events : {
        'click @ui.helpButton': 'toggleHelp',
        'change @ui.searchBar' : 'doSearch',
        'input @ui.searchBar': 'doSearch',
        'keyup @ui.searchBar': 'doSearch',
        'search @ui.searchBar': 'doSearch'
    },

    triggers : {
        'click @ui.backButton': 'back'
    },

    /**
     * Toggles the help text when the Help button is pressed.
     *
     * @since 1.0.0
     */
    toggleHelp : function() {
        this.ui.helpButton.toggleClass( 'is-open' );
        this.ui.helpDescription.slideToggle( 150 );
    },

    /**
     * Performs a collection search based on the search criteria provided.
     *
     * @since 1.0.0
     *
     * @param e
     */
    doSearch : function( e ) {
        this.view.collection.doSearch( e.target.value );
    }

} );

module.exports = PanelBehavior;