# js-calc
A responsive, lightweight and customizable JavaScript calculator.

More documentation is on its way. A live example can be found at [flynnbuckingham.com/projects/calculator](http://flynnbuckingham.com/project/calculator).

To use calc.js: include `calc.css`, `parser.js` and `calc.js` into your webpage or HTML application:

```html
<link rel="stylesheet" href="{path_to_file}/calc.css">
<script src="{path_to_file}/parser.js"></script>
<script src="{path_to_file}/calc.js"></script>
```

When the DOM is ready: create a new jsCalc with the following code:

```javascript
// note that all arguments are optional

var calc = new jsCalc({
  id: {string} || 'js-calc', // element.id to be added to the calculator to help prevent duplicate binding to a single calculator
  width: {string} || '400px', height: {string} || '800px', // css unit strings (percentage || pixels || viewportUnits || parentFontsize (em) || actual units (metric|imperial))
  themeClass: {string} || '', // class-names to add to the calculator for additional styling
  shiftEvent: {function} || function(advancedElement){}, // event to be fired after calculator updates while shifting
  clearEvent: {function} || function(displayElement){}, // event to be fired after calculator clears display
});

calc.create();
document.body.appendChild(calc.element);

setTimeout(function(){
    calc.uiScale(); // scales font to viewport - toDo: remove and automatically bind to object when added to DOM
}, 25);
```