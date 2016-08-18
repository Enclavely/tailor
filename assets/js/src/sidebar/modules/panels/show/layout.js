var PanelsView = require( './panels' ),
    PanelLayoutView;

PanelLayoutView = Marionette.LayoutView.extend( {

    ui: {
        pageTitle : '.back-button'
    },

    className : 'tailor-sidebar__layout',

    regions : {
        panels : "#tailor-sidebar-home",
        panel : "#tailor-sidebar-panel",
        section : "#tailor-sidebar-section"
    },

    childEvents : {
        'show:panel' : 'showPanel',
        'show:section' : 'showSection',
        'back:home' : 'displayHome',
        'back:panel' : 'displayPanel'
    },

    template : function() {
        return document.getElementById( 'tmpl-tailor-sidebar-layout' ).innerHTML;
    },

    /**
     * Initializes the layout view.
     *
     * @since 1.0.0
     */
    initialize : function( options ) {
        this.panels = options.panels;
        this.sections = options.sections;
        this.controls = options.controls;
        this.settings = options.settings;
    },

	/**
     * Renders the panels.
     *
     * @since 1.0.0
     */
    onRender : function() {
        this.showChildView( 'panels', new PanelsView( {
            collection : this.panels
        } ) );
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showPanel : function( view ) {
        this.displayPanel();

        var collection = app.channel.request( 'sidebar:' + view.model.get( 'type' ) );
        var PanelView = Tailor.lookup( view.model.get( 'type' ), false, 'Panels' );
        
        this.showChildView( 'panel', new PanelView( {
            model : view.model,
            collection : collection
        } ) );
    },

	/**
     * Shows a given section.
     *
     * @since 1.0.0
     *
     * @param view
     */
    showSection : function( view ) {
        this.el.classList.add( 'section-visible' );
        this.el.classList.remove( 'panel-visible' );

        var SectionView = Tailor.lookup( view.model.get( 'type' ), false, 'Sections' );
        this.showChildView( 'section', new SectionView( {
            model : view.model,
            collection : this.controls,
            panel : this.panels.findWhere( { id : view.model.get( 'panel' ) } )
        } ) );
    },

	/**
     * Shows the initial Home view.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayHome : function( view ) {
        this.el.classList.remove( 'panel-visible' );
        this.el.classList.remove( 'section-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    },

	/**
     * Shows a given panel.
     *
     * @since 1.0.0
     *
     * @param view
     */
    displayPanel : function( view ) {
        this.el.classList.remove( 'section-visible' );
        this.el.classList.add( 'panel-visible' );

        if ( view ) {
            view.model.trigger( 'focus' );
        }
    }

} );

module.exports = PanelLayoutView;
