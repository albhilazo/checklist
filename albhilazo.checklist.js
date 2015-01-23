/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.2
 *
 * @requires  jquery-1.6+
 *
 * @link      https://github.com/albhilazo/checklist
 * @link      http://jsfiddle.net/albhilazo/anby8wnw
 */


;(function($){

    // Check namespace
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
            items:     [],
            checked:   false,
            placement: 'replace',
            width:     '',
            height:    '',

            onChange: function() {},
            onChangeParams: {},

            labelAll:      'All',
            labelFiltered: 'Filtered',
            labelNone:     'None'
        }, options);
        
        /** String collection */
        self.strings = {
            errorType:      'ERROR (albhilazo.checklist): "{curtype}" is not a supported'
                            + ' value type for "{option}" option. Expected type "{exptype}".',
            errorPlacement: 'ERROR (albhilazo.checklist): "{placement}" is not a supported'
                            + ' value for "placement" option. Supported values are "replace",'
                            + ' "prepend" and "append".'
        };

        /** Injected HTML collection */
        self.html = {
            checklist:     "<div class='checklist'> \
                                <div class='checklist-label'>{labelAll}</div> \
                                <ul class='list'></ul> \
                            </div>",
            checklistItem: "<li><label><input type='checkbox' {checked}/>{item}</label></li>"
        };




        /**
         * Checks that the given option matches the given type.
         * @param {String} optName - Option name.
         * @param {Object} optValue - Option value.
         * @param {String} expType - Expected option type.
         */
        self.checkOptionType = function(optName, optValue, expType) {
            if (typeof optValue !== expType) {
                // Output error
                console.error(self.strings.errorType
                                  .replace('{curtype}', typeof optValue)
                                  .replace('{option}', optName)
                                  .replace('{exptype}', expType));
            }
        };




        /**
         * Checks that every option matches its correct type.
         * @see {@link http://javascript.info/tutorial/type-detection}
         */
        self.checkSettingsTypes = function() {
            self.checkOptionType('items', self.settings.items, 'object');
            self.checkOptionType('checked', self.settings.checked, 'boolean');
            self.checkOptionType('placement', self.settings.placement, 'string');
            self.checkOptionType('width', self.settings.width, 'string');
            self.checkOptionType('height', self.settings.height, 'string');
            
            self.checkOptionType('onChange', self.settings.onChange, 'function');
            self.checkOptionType('onChangeParams', self.settings.onChangeParams, 'object');
            
            self.checkOptionType('labelAll', self.settings.labelAll, 'string');
            self.checkOptionType('labelFiltered', self.settings.labelFiltered, 'string');
            self.checkOptionType('labelNone', self.settings.labelNone, 'string');
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
         * Creates the list items
         */
        self.createListItems = function() {
            $.each(self.settings.items, function(itemIndex, itemValue) {
                // Loop through given items
                var itemCheck, itemLabel;
                if (typeof itemValue === 'object' && itemValue.length > 1) {
                    // ['item', true]
                    itemCheck = (itemValue[1]) ? 'checked' : '';
                    itemLabel = itemValue[0];
                } else {
                    // ['item']
                    itemCheck = (self.settings.checked) ? 'checked' : '';
                    itemLabel = itemValue;
                }
                
                // Append <li>
                $nodeChecklist.children('ul.list')
                              .append(self.html.checklistItem
                                          .replace('{item}', itemLabel)
                                          .replace('{checked}', itemCheck));
            });
        }




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
                    console.error(self.strings.errorPlacement
                                      .replace('{placement}', self.settings.placement));
            }
        };




        /**
         * Initializer.
         */
        self.init = function() {
            // Check settings
            self.checkSettingsTypes();
            
            // Prepare DOM node
            $nodeChecklist = $(self.html.checklist
                                   .replace('{labelAll}', self.settings.labelAll));

            // Set dimensions if specified
            if (self.settings.width)
                $nodeChecklist.css('width', self.settings.width);
            if (self.settings.height)
                $nodeChecklist.find('ul.list').css('max-height', self.settings.height);

            // Create list items
            self.createListItems();

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
