# Checklist jQuery Plugin

A simple jQuery-based checklist plugin.

## [Demo](http://jsfiddle.net/albhilazo/anby8wnw)

## Setup
Just copy the JS and CSS files to your project and load them using:
```
#!html
<link rel="stylesheet" href="path/to/albhilazo.checklist.css" type="text/css">
<script type="text/javascript" src="path/to/albhilazo.checklist.js"></script>
```

## Usage
This checklist only needs two things to work: a container node and a list of items.
It can be initialized in two ways:
```
#!js
$('#container').albhilazo_checklist({ items: ["item1", "item2"] });
$.fn.albhilazo.checklist('#container', { items: ["item1", "item2"] });
```

This is the full set of options and their default value:
```
#!js
$('#container').albhilazo_checklist({
    items:     [],                  // Array of items to load
    placement: 'replace',           // How it will be inserted in the container (accepted: 'replace', 'prepend', 'append')
    width:     '100%',              // Width value for the label, not the list
    height:    '300px',             // Max height before displaying a scrollbar

    onChange: function(e, $chlist, onChangeParams) {},  // Callback when an item is checked/unchecked
    onChangeParams: {}                                  // Extra parameters that will be passed to 'onChange'

    labelAll:      'All',           // Text displayed for all checked
    labelFiltered: 'Filtered',      // Text displayed for some checked
    labelNone:     'None',          // Text displayed for none checked
});
```