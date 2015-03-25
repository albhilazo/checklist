# Checklist jQuery Plugin

A simple jQuery-based checklist plugin.

### [Options demos](http://jsfiddle.net/albhilazo/anby8wnw)
### [Methods demos](http://jsfiddle.net/albhilazo/0t0ejwzv)

## Setup
Just copy the JS and CSS files to your project and load them using:
```html
<link rel="stylesheet" type="text/css" href="path/to/albhilazo.checklist.css">
<script type="text/javascript" src="path/to/albhilazo.checklist.min.js"></script>
```


## Usage
This checklist only needs two things to work: a container element and a list of items.
To initialize it:
```js
$('#container').albhilazo_checklist({ items: ["item1", "item2"] });
```

There is a set of available options, this is a list with their default value:
```js
$('#container').albhilazo_checklist({
    // The items loaded in the checklist are defined with the option 'items'
    // The default use is an array and the items status will be defined with 'checked' ( ["item1", "item2"] )
    // Or the status for each item can be specified with a two-dimensional array ( [["item1",true], ["item2",false]] )
    // Both methods can be used at the same time ( ["item1", ["item2",true]] )
    // If the 'type' option is set to 'links' the format must be ( [["item1","url1"], ["item2","url2"]] )
    items:     [],
    itemHtml:  '{{item}}',      // Item HTML if type:'custom'. The placeholder '{{item}}' will be replaced with the value
    type:      'checkbox',      // Defines the type of the items (accepted: 'checkbox', 'link', 'custom')
    trigger:   'hover',         // Defines the event that will show the list (accepted: 'hover', 'click')
    checked:   false,           // Boolean. Default checked status if not specified in items (true = checked)
    checkAll:  false,           // Boolean. Enables "Check All" feature for type:'checkbox'
    placement: 'append',        // How it will be inserted in the container (accepted: 'replace', 'prepend', 'append')
    width:     '100%',          // Width value for the label, not the list
    height:    '300px',         // Max height before displaying a scrollbar

    onShow:         function(event, $chlist, onChangeParams) {},  // Callback when the list is shown
    onShowParams:   {},                                           // Extra parameters passed to 'onShow'
    onHide:         function(event, $chlist, onChangeParams) {},  // Callback when the list is hidden
    onHideParams:   {},                                           // Extra parameters passed to 'onHide'
    onChange:       function(event, $chlist, onChangeParams) {},  // Callback when an item is checked/unchecked
    onChangeParams: {},                                           // Extra parameters passed to 'onChange'

    labelAll:      'All',       // Text displayed for all checked
    labelFiltered: 'Filtered',  // Text displayed for some checked
    labelNone:     'None',      // Text displayed for none checked
    labelLinks:    'Links',     // Text displayed if type:'links'

    debug: false                // If enabled, the plugin will output any error or log message that occurs
});
```

To get a reference to an initialized instance do:
```js
$.fn.albhilazo.checklist('#container');
// or, also accepts a jQuery object
$.fn.albhilazo.checklist($('#container'));
```

This way you can get the instance's settings:
```js
$.fn.albhilazo.checklist('#container').settings;
```


### Methods
There's also a set of methods that can be called in both ways:
```js
$('#container').albhilazo_checklist('method', methodParam);
// or
$.fn.albhilazo.checklist('#container').method(methodParam);
```

The following methods are available:
```js
$('#container').albhilazo_checklist(
    'addItems', ["item1", "item2"]      // Adds the given items to the checklist (same format as options)
    'removeItems', ["item1", "item2"]   // Removes the matching items from the checklist (strings only)
    'destroy'                           // Destroys the checklist instance
);
```
