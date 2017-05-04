# js-calc

A responsive, lightweight and customizable JavaScript calculator.

Js-calc is a small and easily scalable JavaScript calculator utilizing many new aspects available in the CSS3 spec. Due to it’s constructive design, the calculator can be created in multiple instances and within multiple object in the DOM. (Documentation coming soon). A live example can be found at [flynnbuckingham.com/projects/calculator](http://flynnbuckingham.com/projects/calculator).

To use js-calc: include `calc.min.css`, `parser.min.js` and `calc.min.js` into your webpage or HTML application:

```html
<link rel="stylesheet" href="{path_to_file}/calc.min.css">
<script src="{path_to_file}/parser.min.js"></script>
<script src="{path_to_file}/calc.min.js"></script>
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
