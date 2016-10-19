var $ = Backbone.$,
    l10n = window._l10n,
    TemplateMenuItem;

TemplateMenuItem = Marionette.ItemView.extend( {

    ui : {
        'delete' : '.js-delete-template',
        'download' : '.js-download-template',
        'preview' : '.js-preview-template'
    },

    events : {
        'click' : 'onClick'
    },

    modelEvents : {
        'change:match' : 'onSearch'
    },

    behaviors : {
        Draggable : {}
    },

    onClick : function( e ) {
        switch ( e.target ) {
            case this.ui.download.get( 0 ):
                this.download();
                break;

            case this.ui.delete.get( 0 ):
                this.delete();
                break;

            case this.ui.preview.get( 0 ):
                this.preview();
                break;

            default:
                var el = this.el;
                var onAnimationEnd = function( e ) {
                    el.removeEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.remove( 'shake' );
                };
                if ( Modernizr.cssanimations ) {
                    el.addEventListener( window.animationEndName, onAnimationEnd );
                    el.classList.add( 'shake' );
                }
                Tailor.Notify( l10n.dragTemplate, 'warning' );
        }
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    getTemplate : function() {
        return '#tmpl-tailor-panel-templates-item';
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
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

    /**
     * Downloads the template to a JSON file.
     *
     * @since 1.0.0
     */
    download : function() {
        var item = this;
        var id = item.model.get( 'id' );

        window.ajax.send( 'tailor_load_template', {
            data : {
                template_id : id,
                nonce : window._nonces.loadTemplate
            },

	        /**
             * Downloads the template to a JSON file.
             *
             * @since 1.0.0
             *
             * @param response
             */
            success : function( response ) {
                var model = item.model;
                var models = response.models;
                var label = model.get( 'label' );

                id = label.replace( ' ', '-' ).toLowerCase();

                var json = {
                    id : id,
                    label : label,
                    tag : model.get( 'tag' ),
                    type : model.get( 'type' ),
                    models : models
                };

                json = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( json ) );

                var a = document.getElementById( 'download-template' );
                a.setAttribute( 'href', json );
                a.setAttribute( 'download', 'tailor-template-' + id + '-' + Date.now() + '.json' );
                a.click();

                /**
                 * Fires when a template is downloaded.
                 *
                 * @since 1.5.0
                 */
                app.channel.trigger( 'template:download' );
            }
        } );
    },

    /**
     * Deletes the template.
     *
     * @since 1.0.0
     */
    delete : function() {
        var that = this;

        window.ajax.send( 'tailor_delete_template', {
            data : {
                id : that.model.get( 'id' ),
                nonce : window._nonces.deleteTemplate
            },

            /**
             * Destroys the template list item when the template is successfully deleted.
             *
             * @since 1.0.0
             */
            success : function() {
                that.$el.slideUp( function() {
                    that.model.trigger( 'destroy', that.model );
                } );

                /**
                 * Fires when a template is deleted.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'template:delete' );
            }
        } );
    },

    /**
     * Previews the template.
     *
     * @since 1.0.0
     */
    preview : function() {

        window._urls.view += ( window._urls.view.split('?')[1] ? '&':'?') + 'template_preview=1&template_id=' + this.model.get( 'id' );
        window.open( window._urls.view, '_blank' );

        /**
         * Fires when a template is previewed.
         *
         * @since 1.5.0
         */
        app.channel.trigger( 'template:preview' );
    },


    /**
     * Determines whether the template should be visible based on search terms entered in the template search bar.
     *
     * @since 1.0.0
     *
     * @param model
     */
    onSearch : function( model ) {
        this.el.style.display = ! model.get( 'match' ) ? 'none' : 'block';
    }

} );

module.exports = TemplateMenuItem;