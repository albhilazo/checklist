/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.6
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
        self.settings = {};

        // Private
        var _data = $(container).data(self.NAME);
        var _$nodeChecklist;


        /** Default settings */
        var _defaults = {
            items:     [],
            type:      'checkbox',
            trigger:   'hover',
            checked:   false,
            placement: 'append',
            width:     '',
            height:    '',

            onChange: function() {},
            onChangeParams: {},

            labelAll:      'All',
            labelFiltered: 'Filtered',
            labelNone:     'None',
            labelLinks:    'Links'
        };
        
        /** String collection */
        var _strings = {
            error: {
                optType:    'ERROR (' + self.NAME + '): "{curtype}" is not a supported'
                            + ' value type for "{option}" option. Expected type "{exptype}".'
                            + ' Using default value.',
                type:       'ERROR (' + self.NAME + '): "{type}" is not a supported'
                            + ' value for "type" option. Supported values are "checkbox" and'
                            + ' "link". Using default value.',
                trigger:    'ERROR (' + self.NAME + '): "{trigger}" is not a supported'
                            + ' value for "trigger" option. Supported values are "hover" and'
                            + ' "click". Using default value.',
                placement:  'ERROR (' + self.NAME + '): "{placement}" is not a supported'
                            + ' value for "placement" option. Supported values are "replace",'
                            + ' "prepend" and "append". Using default value.'
            }
        };

        /** Injected HTML collection */
        var _html = {
            checklist:    "<div class='checklist'> <div class='checklist-label'>{labelAll}</div> <ul class='list'></ul> </div>",
            checkboxItem: "<li><label><input type='checkbox' {checked}/>{item}</label></li>",
            linkItem:     "<li><a href='{url}'>{item}</a></li>"
        };




        /**
         * Outputs a console error for the given option and resets it to its default value.
         * @param {String} optName - Option name.
         */
        var _showError = function(optName) {
            console.error(_strings.error[optName]
                                  .replace('{'+optName+'}', self.settings[optName]));
            self.settings[optName] = _defaults[optName];
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
                console.error(_strings.error.optType
                                      .replace('{curtype}', typeof optValue)
                                      .replace('{option}', optName)
                                      .replace('{exptype}', expType));
                // Set default
                self.settings[optName] = _defaults[optName];
            }
        };




        /**
         * Checks that every option matches its correct type.
         * @see {@link http://javascript.info/tutorial/type-detection}
         */
        var _checkSettingsTypes = function() {
            _checkOptionType('items', self.settings.items, 'object');
            _checkOptionType('type', self.settings.type, 'string');
            _checkOptionType('trigger', self.settings.trigger, 'string');
            _checkOptionType('checked', self.settings.checked, 'boolean');
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
                    // Check invalid and set default
                    if (self.settings.type != 'checkbox')
                        _showError('type');

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
                    
                    // Append new item
                    _$nodeChecklist.children('ul.list')
                                   .append(_html.checkboxItem
                                                .replace('{item}', itemLabel)
                                                .replace('{checked}', itemCheck));
                }
            });
        };




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
         * Binds events to the checklist.
         */
        var _bindEvents = function() {
            // Trigger
            if (self.settings.trigger == 'click') {
                // Click
                _$nodeChecklist.click(
                    function() { $(this).children('ul.list').toggle(); }
                );
            } else {
                // Check invalid and set default
                if (self.settings.trigger != 'hover')
                    _showError('trigger');

                // Hover
                _$nodeChecklist.hover(
                    function() { $(this).children('ul.list').show(); },
                    function() { $(this).children('ul.list').hide(); }
                );
            }

            // onChange
            if (self.settings.type == 'checkbox') {
                _$nodeChecklist.find('ul.list input:checkbox')
                              .change(_eventChange);
            }
        };




        /**
         * Sets dimensions if specified
         */
        var _resize = function() {
            if (self.settings.width)
                _$nodeChecklist.css('width', self.settings.width);
            if (self.settings.height)
                _$nodeChecklist.find('ul.list').css('max-height', self.settings.height);
        };




        /**
         * Places the checklist in the DOM.
         */
        var _place = function() {
            if (self.settings.placement == 'replace') {
                $(container).html(_$nodeChecklist);
            } else if (self.settings.placement == 'prepend') {
                $(container).prepend(_$nodeChecklist);
            } else {
                // Check invalid and set default
                if (self.settings.placement != 'append')
                    _showError('placement');

                $(container).append(_$nodeChecklist);
            }
        };




        /**
         * Destroys the checklist and the data associated to its instance
         */
        self.destroy = function() {
            // Remove element
            $(container).children('div.checklist').remove();
            // Remove container data
            $(container).removeData(self.NAME);
        };




        /**
         * Initializer.
         */
        var _init = function() {
            // Set and check settings
            self.settings = $.extend({}, _defaults, options);
            _checkSettingsTypes();

            // Prepare DOM node
            _$nodeChecklist = $(_html.checklist
                                     .replace('{labelAll}', self.settings.labelAll));

            _resize();

            _createListItems();

            _bindEvents();

            _updateLabel();

            _place();
        };

        if (_data == undefined && typeof options == 'object' && options )
            _init();         // Initialize
        else
            return _data;    // Instance data

    };




    /**
     * Creates a new instance of {@link $.fn.albhilazo.checklist}
     *   adding the chained selector as a container.
     * If "options" is a method name, tries to call it.
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
