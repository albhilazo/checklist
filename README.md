# Checklist jQuery Plugin

A simple jQuery-based checklist plugin.

## [Demos](http://jsfiddle.net/albhilazo/anby8wnw)

## Setup
Just copy the JS and CSS files to your project and load them using:
```html
<link rel="stylesheet" href="path/to/albhilazo.checklist.css" type="text/css">
<script type="text/javascript" src="path/to/albhilazo.checklist.js"></script>
```

## Usage
This checklist only needs two things to work: a container node and a list of items.
It can be initialized in two ways:
```js
$('#container').albhilazo_checklist({ items: ["item1", "item2"] });
// or
$.fn.albhilazo.checklist('#container', { items: ["item1", "item2"] });
```

This is the full set of options and their default value:
```js
$('#container').albhilazo_checklist({
    // The items loaded in the checklist are defined with the option 'items'
    // The default use is an array and the items status will be defined with 'checked' ( ["item1", "item2"] )
    // Or the status for each item can be specified with a two-dimensional array ( [["item1",true], ["item2",false]] )
    // Both methods can be used at the same time ( ["item1", ["item2",true]] )
    // If the 'type' option is set to 'links' the format must be ( [["item1","url1"], ["item2","url2"]] )
    items:     [],
    type:      'checkbox'         // Defines the type of the items (accepted: 'checkbox', 'links')
    checked:   false,             // Boolean. Default checked status if not specified in items (true = checked)
    placement: 'replace',         // How it will be inserted in the container (accepted: 'replace', 'prepend', 'append')
    width:     '100%',            // Width value for the label, not the list
    height:    '300px',           // Max height before displaying a scrollbar

    onChange: function(e, $chlist, onChangeParams) {},  // Callback when an item is checked/unchecked
    onChangeParams: {},                                  // Extra parameters that will be passed to 'onChange'

    labelAll:      'All',         // Text displayed for all checked
    labelFiltered: 'Filtered',    // Text displayed for some checked
    labelNone:     'None',        // Text displayed for none checked
    labelLinks:    'Links'        // Text displayed if 'type'='links'
});
```