# js-calc
A responsive, lightweight and customizable JavaScript calculator.

More documentation is on its way. A live example can be found at [flynnbuckingham.com/calculator](http://flynnbuckingham.com/calculator).

To use calc.js: include parser.js and calc.js into your webpage or HTML application:

```html
<script src="{path_to_file}/parser.js"></script>
<script src="{path_to_file}/calc.js"></script>
```

When the DOM is ready: create a new jsCalc with the following code:

```javascript
// note that all arguments are optional

var calc = new jsCalc({
  id: {string} || 'js-calc', // element.id to be added to the calulator to help prevent duplicate binding to a single calculator
  width: {string} || '400px', height: {string} || '800px', // css unit strings (percentage || pixels || viewportUnits || parentFontsize (em) || actual units (metric|imperial))
  themeClass: {string} || '', // class-names to add to the calulator for additional styling
  shiftEvent: {function} || funcion(advancedElement){}, // event to be fired after calulator updates while shifting
  clearEvent: {function} || funcion(displayElement){}, // event to be fired after calculator clears display
});

calc.create();
document.body.appendChild(calc.element);

setTimeout(function(){
    calc.uiScale(); // scales font to viewport - toDo: remove and automatically bind to object when added to DOM
}, 25);
```