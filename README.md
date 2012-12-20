## Quick start

### Example Html

    <div class="products">
    	<ul class="product-set">
    		<li class="product">
	    		<img data-src="/path/to/image.jpg" width="170" height="300" class="ctg-lazyload-img" />
		        <noscript>
		            <img src="/path/to/image.jpg" width="170" height="300" />
		        </noscript>
	        </li>
	        <li class="product">
	    		<div data-src="/path/to/image.jpg" class="ctg-lazyload-img"></div>
		        <noscript>
		            <div style="background-image: url('/path/to/image.jpg');"></div>
		        </noscript>
	        </li>
    	</ul>
    </div>
	
### JavaScript

    // doc ready
    $('.products').lazyload();

## DOCS

### Options
#### selector: '.ctg-lazyload-img' (string)
jQuery selector used to match img elements within element.

#### offset: 200 (number)
Images that appear below the window height + offset will be loaded in.

#### transitionSpeed: 500 (number)
Sets the speed of image fade.

#### afterLoad: $.noop (function)
Callback runs as each image has loaded. The loaded image/element is passed to this function.

#### autoDestroy: true (boolean)
When set to true the lazyload widget will be destroyed once the page has been scrolled to the bottom.

### Methods
#### refresh .lazyload('refresh', [live])
Refreshes internally calculated offsets of images, passing in `live` as true will re-query the DOM for images.

#### destroy .lazyload('destroy')
Cleans up after itself by unbinding scroll events etc.