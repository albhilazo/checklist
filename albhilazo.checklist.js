/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.4
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

        // Public
        self.NAME = 'albhilazo.checklist';

        // Private
        var _data = $(container).data(self.NAME);
        var _$nodeChecklist;


        /** Default settings */
        self.settings = $.extend({
            items:     [],
            type:      'checkbox',
            checked:   false,
            placement: 'replace',
            width:     '',
            height:    '',

            onChange: function() {},
            onChangeParams: {},

            labelAll:      'All',
            labelFiltered: 'Filtered',
            labelNone:     'None',
            labelLinks:    'Links'
        }, options);
        
        /** String collection */
        var _strings = {
            errorType:      'ERROR (' + self.NAME + '): "{curtype}" is not a supported'
                            + ' value type for "{option}" option. Expected type "{exptype}".',
            errorPlacement: 'ERROR (' + self.NAME + '): "{placement}" is not a supported'
                            + ' value for "placement" option. Supported values are "replace",'
                            + ' "prepend" and "append".'
        };

        /** Injected HTML collection */
        var _html = {
            checklist:    "<div class='checklist'> <div class='checklist-label'>{labelAll}</div> <ul class='list'></ul> </div>",
            checkboxItem: "<li><label><input type='checkbox' {checked}/>{item}</label></li>",
            linkItem:     "<li><a href='{url}'>{item}</a></li>"
        };




        /**
         * Checks that the given option matches the given type.
         * @param {String} optName - Option name.
         * @param {Object} optValue - Option value.
         * @param {String} expType - Expected option type.
         */
        var _checkOptionType = function(optName, optValue, expType) {
            if (typeof optValue !== expType) {
                // Output error
                console.error(_strings.errorType
                                      .replace('{curtype}', typeof optValue)
                                      .replace('{option}', optName)
                                      .replace('{exptype}', expType));
            }
        };




        /**
         * Checks that every option matches its correct type.
         * @see {@link http://javascript.info/tutorial/type-detection}
         */
        var _checkSettingsTypes = function() {
            _checkOptionType('items', self.settings.items, 'object');
            _checkOptionType('checked', self.settings.checked, 'boolean');
            _checkOptionType('type', self.settings.type, 'string');
            _checkOptionType('placement', self.settings.placement, 'string');
            _checkOptionType('width', self.settings.width, 'string');
            _checkOptionType('height', self.settings.height, 'string');
            
            _checkOptionType('onChange', self.settings.onChange, 'function');
            _checkOptionType('onChangeParams', self.settings.onChangeParams, 'object');
            
            _checkOptionType('labelAll', self.settings.labelAll, 'string');
            _checkOptionType('labelFiltered', self.settings.labelFiltered, 'string');
            _checkOptionType('labelNone', self.settings.labelNone, 'string');
            _checkOptionType('labelLinks', self.settings.labelLinks, 'string');
        };




        /**
         * Updates the checklist's label according to the checked items.
         */
        var _updateLabel = function() {
            var $label    = _$nodeChecklist.children('.checklist-label');
            
            if (self.settings.type == 'link') {
                $label.html( self.settings.labelLinks );
            } else {
                var numChecks = _$nodeChecklist.find('ul.list input').length;
                var $checked  = _$nodeChecklist.find('ul.list input:checked');
    
                if ($checked.length === numChecks)
                    $label.html( self.settings.labelAll );
                else if ($checked.length > 0)
                    $label.html( self.settings.labelFiltered );
                else
                    $label.html( self.settings.labelNone );
            }
        };
        
        
        
        
        /**
         * Creates the list items
         */
        var _createListItems = function() {
            $.each(self.settings.items, function(itemIndex, itemValue) {
                // Loop through given items
                if (self.settings.type == 'link') {
                    // ['item', 'url']
                    _$nodeChecklist.children('ul.list')
                                  .append(_html.linkItem
                                               .replace('{item}', itemValue[0])
                                               .replace('{url}', itemValue[1]));
                } else {
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
                    _$nodeChecklist.children('ul.list')
                                  .append(_html.checkboxItem
                                               .replace('{item}', itemLabel)
                                               .replace('{checked}', itemCheck));
                }
            });
        }




        /**
         * onChange event handler.
         * Will call specified "onChange" function in {@link self.settings}.
         * @param {Event} e - Change event object.
         */
        var _eventChange = function(e) {
            self.settings.onChange(e, _$nodeChecklist, self.settings.onChangeParams);

            _updateLabel();
        };




        /**
         * Places the checklist in the DOM.
         */
        var _place = function() {
            switch (self.settings.placement) {
                case 'replace':
                    $(container).html(_$nodeChecklist); break;
                case 'prepend':
                    $(container).prepend(_$nodeChecklist); break;
                case 'append':
                    $(container).append(_$nodeChecklist); break;
                default:
                    console.error(_strings.errorPlacement
                                          .replace('{placement}', self.settings.placement));
            }
        };




        /**
         * Initializer.
         */
        self.init = function() {
            // Check settings
            _checkSettingsTypes();
            
            // Prepare DOM node
            _$nodeChecklist = $(_html.checklist
                                   .replace('{labelAll}', self.settings.labelAll));

            // Set dimensions if specified
            if (self.settings.width)
                _$nodeChecklist.css('width', self.settings.width);
            if (self.settings.height)
                _$nodeChecklist.find('ul.list').css('max-height', self.settings.height);

            // Create list items
            _createListItems();

            // Assign checklist hover event
            _$nodeChecklist.hover(
                function() { $(this).children('ul.list').show(); },
                function() { $(this).children('ul.list').hide(); }
            );

            // Assign checklist change event
            if (self.settings.type != 'link') {
                _$nodeChecklist.find('ul.list input:checkbox')
                              .change(_eventChange);
            }

            // Update label before placing
            _updateLabel();

            // Place it in the DOM
            _place();

            // Set instance data
            $(container).data(self.NAME, self);
        };


        if (_data == undefined)
            self.init();    // Initialize
        else
            return _data;    // Instance data

    };




    /**
     * Redirects to {@link $.fn.albhilazo.checklist} adding the chained selector as a container.
     * @param {Object} options - Specified options that will overwrite the default settings.
     */
    $.fn.albhilazo_checklist = function(options) {
        return this.each(function() {
            var data = $(this).data('albhilazo.checklist');
            if (data == undefined)
                // Set instance data
                $(this).data('albhilazo.checklist', (new $.fn.albhilazo.checklist(this, options)));
            if (typeof options == 'string') {
                // Manage methods
                if (data[options])
                    data[options]();
                else
                    console.error('ERROR (albhilazo.checklist): "' + options
                                  + '" is not a supported method.');
            }
        });
    };

}(jQuery));
