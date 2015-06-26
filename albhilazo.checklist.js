/**
 * Checklist jQuery plugin
 * @author    Albert Hilazo
 * @version   1.0.12
 *
 * @requires  jquery-1.6+
 *
 * @link      https://github.com/albhilazo/checklist
 * [Options demos]{@link http://jsfiddle.net/albhilazo/anby8wnw}
 * [Methods demos]{@link http://jsfiddle.net/albhilazo/0t0ejwzv}
 */


;(function($) {
    "use strict";

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
            itemHtml:  '{{item}}',
            type:      'checkbox',
            trigger:   'hover',
            checked:   false,
            checkAll:  false,
            placement: 'append',
            width:     '',
            height:    '',

            onShow:         function() {},
            onShowParams:   {},
            onHide:         function() {},
            onHideParams:   {},
            onChange:       function() {},
            onChangeParams: {},

            labelAll:      'All',
            labelFiltered: 'Filtered',
            labelNone:     'None',
            labelLinks:    'Links',

            debug: false
        };
        
        /** String collection */
        var _strings = {
            error: {
                optType:   'ERROR ('+self.NAME+'): "{{curtype}}" is not a supported value type for "{{option}}" option. Expected type "{{exptype}}". Using default value.',
                type:      'ERROR ('+self.NAME+'): "{{type}}" is not a supported value for "type" option. Supported values are "checkbox", "link" and "custom". Using default value.',
                trigger:   'ERROR ('+self.NAME+'): "{{trigger}}" is not a supported value for "trigger" option. Supported values are "hover" and "click". Using default value.',
                placement: 'ERROR ('+self.NAME+'): "{{placement}}" is not a supported value for "placement" option. Supported values are "replace", "prepend" and "append". Using default value.'
            }
        };

        /** Injected HTML collection */
        var _html = {
            checklist:    "<div class='checklist'> <div class='checklist-label-wrapper'><div class='checklist-label'>{{label}}</div></div> <ul class='list'></ul> </div>",
            checkAll:     "<span class='checklist-checkall-icon' title='Check all'></span>",
            checkboxItem: "<li><label><input type='checkbox' {{checked}}/>{{item}}</label></li>",
            linkItem:     "<li><a href='{{url}}'>{{item}}</a></li>",
            customItem:   "<li>{{html}}</li>"
        };




        /* Private methods ************************************************************ */

        /**
         * Outputs a console message only if settings.debug is enabled.
         * @param {String} msj - Message to output.
         * @param {Boolean} isError - Optional, defaults to FALSE. If TRUE outputs as error.
         */
        var _debug = function(msj, isError) {
            if (self.settings.debug) {
                if (typeof isError !== 'boolean') { isError = false; }

                if (isError) { console.error(msj); }
                else         { console.log(msj); }
            }
        };




        /**
         * Outputs a debug error for the given option and resets it to its default value.
         * @param {String} optName - Option name.
         */
        var _optionError = function(optName) {
            _debug(_strings.error[optName]
                           .replace('{{'+optName+'}}', self.settings[optName]), true);
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
                _debug(_strings.error.optType
                                     .replace('{{curtype}}', typeof optValue)
                                     .replace('{{option}}', optName)
                                     .replace('{{exptype}}', expType), true);
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
            _checkOptionType('itemHtml', self.settings.itemHtml, 'string');
            _checkOptionType('type', self.settings.type, 'string');
            _checkOptionType('trigger', self.settings.trigger, 'string');
            _checkOptionType('checked', self.settings.checked, 'boolean');
            _checkOptionType('checkAll', self.settings.checkAll, 'boolean');
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
         * Prepares the DOM node structure
         */
        var _prepare = function() {
            // Basic structure
            self.$nodeChecklist = $(_html.checklist
                                         .replace('{{label}}', self.settings.labelNone));

            // checkAll
            if (self.settings.type == 'checkbox' && self.settings.checkAll == true) {
                self.$nodeChecklist.addClass('checklist-checkall')
                                   .find('.checklist-label-wrapper').append(_html.checkAll);
            }
        };




        /**
         * Updates the checklist's label according to the checked items.
         */
        var _updateLabel = function() {
            var $label = self.$nodeChecklist.find('.checklist-label');
            
            if (self.settings.type == 'link') {
                $label.html( self.settings.labelLinks );
            } else {
                var numChecks = self.$nodeChecklist.find('ul.list input').length;
                var $checked  = self.$nodeChecklist.find('ul.list input:checked');
    
                if ($checked.length === numChecks) {
                    $label.html( self.settings.labelAll );
                } else if ($checked.length > 0) {
                    $label.html( self.settings.labelFiltered );
                } else {
                    $label.html( self.settings.labelNone );
                }
            }
        };




        /**
         * Binds events to the checklist.
         */
        var _bindEvents = function() {
            var $list = self.$nodeChecklist.children('ul.list');

            // Trigger
            if (self.settings.trigger == 'click') {
                // Click
                self.$nodeChecklist.addClass('clclick').click(function() {
                    self.$nodeChecklist.toggleClass('clactive', !($list.is(':visible')));
                });
                // Hide on outside click
                $(document).mouseup(function(e) {
                    if (!self.$nodeChecklist.is(e.target)
                        && self.$nodeChecklist.has(e.target).length === 0) {
                        self.$nodeChecklist.removeClass('clactive');
                    }
                });
            } else {
                // Check invalid and set default
                if (self.settings.trigger != 'hover') {
                    _optionError('trigger');
                }

                // Hover
                self.$nodeChecklist.hover(
                    function(e) {
                        self.settings.onShow(e, self.$nodeChecklist, self.settings.onShowParams);
                    },
                    function(e) {
                        self.settings.onHide(e, self.$nodeChecklist, self.settings.onHideParams);
                    }
                );
            }
            
            // checkAll
            if (self.settings.type == 'checkbox' && self.settings.checkAll == true) {
                self.$nodeChecklist.find('span.checklist-checkall-icon').click(function(e) {
                    // Avoid propagation for trigger:'click'
                    e.stopPropagation();

                    var $checkboxes = $list.find('input:checkbox');
                    if ($checkboxes.length != $checkboxes.filter(':checked').length) {
                        // Check all if any unchecked
                        $checkboxes.prop('checked', true).trigger('change');
                    } else {
                        // Uncheck all if all checked
                        $checkboxes.prop('checked', false).trigger('change');
                    }

                    _updateLabel();
                });
            }

            // onChange
            if (self.settings.type == 'checkbox') {
                $list.find('input:checkbox').change(function(e) {
                    self.settings.onChange(e, self.$nodeChecklist, self.settings.onChangeParams);
                    _updateLabel();
                });
            }
        };




        /**
         * Sets dimensions if specified.
         */
        var _resize = function() {
            if (self.settings.width) {
                self.$nodeChecklist.css('width', self.settings.width);
            }
            if (self.settings.height) {
                self.$nodeChecklist.find('ul.list').css('max-height', self.settings.height);
            }
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
                if (self.settings.placement != 'append') {
                    _optionError('placement');
                }

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

            _prepare();

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
                                                    .replace('{{item}}', itemValue[0])
                                                    .replace('{{url}}', itemValue[1]));
                } else if (self.settings.type == 'custom') {
                    self.$nodeChecklist.children('ul.list')
                                       .append(_html.customItem
                                                    .replace('{{html}}', self.settings.itemHtml)
                                                    .replace('{{item}}', itemValue));
                } else {
                    // Check invalid and set default
                    if (self.settings.type != 'checkbox') {
                        _optionError('type');
                    }

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
                                                    .replace('{{item}}', itemLabel)
                                                    .replace('{{checked}}', itemCheck));
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
                if (items.indexOf($(itemElement).text()) > -1) {
                    $(itemElement).remove();
                }
            });
        }




        /**
         * Reinitializes the checklist with the original options and checkbox state.
         */
        self.reset = function() {
            self.destroy();
            _init();
        };




        /**
         * Destroys the checklist and the data associated to its instance.
         */
        self.destroy = function() {
            // Remove element
            $(container).children('div.checklist').remove();
            // Remove container data
            $(container).removeData(self.NAME);
        };




        if (_data == undefined && typeof options == 'object' && options ) {
            _init();         // Initialize
        } else {
            return _data;    // Instance data
        }

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
            if (data == undefined) {
                // Set instance data
                $(this).data('albhilazo.checklist', (new $.fn.albhilazo.checklist(this, options)));
            }
            if (typeof options == 'string') {
                // Manage methods
                if (data[options]) {
                    data[options](methodParam);
                } else {
                    console.error('ERROR (albhilazo.checklist): "'+options+'" is not a supported method.');
                }
            }
        });
    };

}(jQuery));
