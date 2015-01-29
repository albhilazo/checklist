/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.7
 *
 * @requires  jquery-1.6+
 *
 * @link      https://github.com/albhilazo/checklist
 * [Options demos]{@link http://jsfiddle.net/albhilazo/anby8wnw}
 * [Methods demos]{@link http://jsfiddle.net/albhilazo/0t0ejwzv}
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
        self.$nodeChecklist = '';

        // Private
        var _data = $(container).data(self.NAME);


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




        /* Private methods ************************************************************ */

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
            var $label = self.$nodeChecklist.children('.checklist-label');
            
            if (self.settings.type == 'link') {
                $label.html( self.settings.labelLinks );
            } else {
                var numChecks = self.$nodeChecklist.find('ul.list input').length;
                var $checked  = self.$nodeChecklist.find('ul.list input:checked');
    
                if ($checked.length === numChecks)
                    $label.html( self.settings.labelAll );
                else if ($checked.length > 0)
                    $label.html( self.settings.labelFiltered );
                else
                    $label.html( self.settings.labelNone );
            }
        };




        /**
         * Binds events to the checklist.
         */
        var _bindEvents = function() {
            // Trigger
            if (self.settings.trigger == 'click') {
                // Click
                self.$nodeChecklist.click(
                    function() { $(this).children('ul.list').toggle(); }
                );
                // Hide on outside click
                $(document).mouseup(function(e) {
                    if (!self.$nodeChecklist.is(e.target)
                        && self.$nodeChecklist.has(e.target).length === 0)
                        self.$nodeChecklist.children('ul.list').hide();
                });
            } else {
                // Check invalid and set default
                if (self.settings.trigger != 'hover')
                    _showError('trigger');

                // Hover
                self.$nodeChecklist.hover(
                    function() { $(this).children('ul.list').show(); },
                    function() { $(this).children('ul.list').hide(); }
                );
            }

            // onChange
            if (self.settings.type == 'checkbox') {
                self.$nodeChecklist.find('ul.list input:checkbox').change(function(e) {
                    self.settings.onChange(e, self.$nodeChecklist,
                                              self.settings.onChangeParams);
                    _updateLabel();
                });
            }
        };




        /**
         * Sets dimensions if specified.
         */
        var _resize = function() {
            if (self.settings.width)
                self.$nodeChecklist.css('width', self.settings.width);
            if (self.settings.height)
                self.$nodeChecklist.find('ul.list').css('max-height', self.settings.height);
        };




        /**
         * Places the checklist in the DOM.
         */
        var _place = function() {
            if (self.settings.placement == 'replace') {
                $(container).html(self.$nodeChecklist);
            } else if (self.settings.placement == 'prepend') {
                $(container).prepend(self.$nodeChecklist);
            } else {
                // Check invalid and set default
                if (self.settings.placement != 'append')
                    _showError('placement');

                $(container).append(self.$nodeChecklist);
            }
        };




        /**
         * Initializer.
         */
        var _init = function() {
            // Set and check settings
            self.settings = $.extend({}, _defaults, options);
            _checkSettingsTypes();

            // Prepare DOM node
            self.$nodeChecklist = $(_html.checklist
                                         .replace('{labelAll}', self.settings.labelAll));

            _resize();

            self.addItems(self.settings.items);

            _bindEvents();

            _updateLabel();

            _place();
        };




        /* Public methods ************************************************************* */

        /**
         * Adds the given items to the checklist.
         * @param {Array} items - Array of items that follows the same format as "settings.items".
         */
        self.addItems = function(items) {
            $.each(items, function(itemIndex, itemValue) {
                // Loop through given items
                if (self.settings.type == 'link') {
                    // ['item', 'url']
                    // Append new item
                    self.$nodeChecklist.children('ul.list')
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
                    self.$nodeChecklist.children('ul.list')
                                       .append(_html.checkboxItem
                                                    .replace('{item}', itemLabel)
                                                    .replace('{checked}', itemCheck));
                }
            });
        };




        /**
         * Removes the matching items from the checklist.
         * @param {Array} items - Array of strings that will be matched against the items names.
         */
        self.removeItems = function(items) {
            // Loop through checklist items
            self.$nodeChecklist.find('ul.list > li').each(function(itemIndex,itemElement) {
                // If item is in the array
                if (items.indexOf($(itemElement).text()) > -1)
                    $(itemElement).remove();
            });
        }




        /**
         * Destroys the checklist and the data associated to its instance.
         */
        self.destroy = function() {
            // Remove element
            $(container).children('div.checklist').remove();
            // Remove container data
            $(container).removeData(self.NAME);
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
    $.fn.albhilazo_checklist = function(options, methodParam) {
        return this.each(function() {
            var data = $(this).data('albhilazo.checklist');
            if (data == undefined)
                // Set instance data
                $(this).data('albhilazo.checklist', (new $.fn.albhilazo.checklist(this, options)));
            if (typeof options == 'string') {
                // Manage methods
                if (data[options])
                    data[options](methodParam);
                else
                    console.error('ERROR (albhilazo.checklist): "' + options
                                  + '" is not a supported method.');
            }
        });
    };

}(jQuery));
