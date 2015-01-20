/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.1
 *
 * @requires  jquery-1.6+
 *
 * @link      https://github.com/albhilazo/checklist
 * @link      http://jsfiddle.net/albhilazo/anby8wnw
 */


;(function($){

    if(!$.fn.albhilazo) {
        $.fn.albhilazo = {};
    }




    /**
     * @param {Object} container - DOM node that will contain the checklist.
     * @param {Object} options - Specified options that will overwrite the default settings.
     */
    $.fn.albhilazo.checklist = function(container, options) {

        // Avoid scope issues
        var self = this;
        var $nodeChecklist;

        /** Default settings */
        self.settings = $.extend({
            labelAll:      'All',
            labelFiltered: 'Filtered',
            labelNone:     'None',

            placement: 'replace',
            width:     '',
            height:    '',
            items:     [],

            onChange: function() {},
            onChangeParams: {}
        }, options);

        /** Injected HTML collection */
        self.html = {
            'checklist':            "<div class='checklist'> \
                                         <div class='checklist-label'>"
                                         + self.settings.labelAll +
                                         "</div> \
                                         <ul class='list'></ul> \
                                     </div>",
            'checklist-item-open':  "<li><label><input type='checkbox' checked/>",
            'checklist-item-close': "</label></li>"
        };




        /**
         * Updates the checklist's label according to the checked items.
         */
        self.updateLabel = function() {
            var $label    = $nodeChecklist.children('.checklist-label');
            var numChecks = $nodeChecklist.find('ul.list input').length;
            var $checked  = $nodeChecklist.find('ul.list input:checked');

            if ($checked.length === numChecks)
                $label.html( self.settings.labelAll );
            else if ($checked.length > 0)
                $label.html( self.settings.labelFiltered );
            else
                $label.html( self.settings.labelNone );
        };




        /**
         * onChange event handler.
         * Will call specified "onChange" function in {@link self.settings}.
         * @param {Event} e - Change event object.
         */
        self.eventChange = function(e) {
            self.updateLabel();

            self.settings.onChange(e, $nodeChecklist, self.settings.onChangeParams);
        };




        /**
         * Places the checklist in the DOM.
         */
        self.place = function() {
            switch (self.settings.placement) {
                case 'replace':
                    $(container).html($nodeChecklist); break;
                case 'prepend':
                    $(container).prepend($nodeChecklist); break;
                case 'append':
                    $(container).append($nodeChecklist); break;
                default:
                    console.error('ERROR (albhilazo.checklist): "' + self.settings.placement
                                  + '" is not a supported value for "placement" option.'
                                  + ' Supported values are "replace", "prepend" and "append".');
            }
        };




        /**
         * Initializer.
         */
        self.init = function() {
            $nodeChecklist = $(self.html['checklist']);

            // Set dimensions if specified
            if (self.settings.width)
                $nodeChecklist.css('width', self.settings.width);
            if (self.settings.height)
                $nodeChecklist.find('ul.list').css('max-height', self.settings.height);

            // Generate list items
            $.each(self.settings.items, function(itemIndex, itemValue) {
                // Loop through given items
                $nodeChecklist.children('ul.list')
                              .append(self.html['checklist-item-open']
                                      + itemValue
                                      + self.html['checklist-item-close']);
            });

            // Assign checklist hover event
            $nodeChecklist.hover(
                function() { $(this).children('ul.list').show(); },
                function() { $(this).children('ul.list').hide(); }
            );

            // Assign checklist change event
            $nodeChecklist.find('ul.list input:checkbox')
                          .change(self.eventChange);

            // Update label before placing
            self.updateLabel();

            // Place it in the DOM
            self.place();
        };


        // Initialize
        self.init();

    };




    /**
     * Redirects to {@link $.fn.albhilazo.checklist} adding the chained selector as a container.
     * @param {Object} options - Specified options that will overwrite the default settings.
     */
    $.fn.albhilazo_checklist = function(options) {
        return this.each(function() {
            (new $.fn.albhilazo.checklist(this, options));
        });
    };

}(jQuery));
