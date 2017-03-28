/**
 * Created by flynnbuckingham on 2015-05-01.
 */

function jsCalc(args){
    var self = this,
        cacheMinSize = 0;

    args = (typeof args === "object") ? args : {};
    args.id = (typeof args.id === "string") ? args.id : 'js-calc';

    if (document.getElementById(args.id)) return null; // element already exists

    args.width = (typeof args.width === "string") ? args.width : '400px';
    args.height = (typeof args.height === "string") ? args.height : '800px';
    args.mode = (typeof args.mode === "string") ? (['DEG', 'RAD'].indexOf(args.mode) > -1 ? args.mode : 'DEG') : 'DEG';
    args.shiftEvent = (typeof args.shiftEvent === "function") ? args.shiftEvent : function(){};
    args.clearEvent = (typeof args.clearEvent === "function") ? args.clearEvent : function(){};

    args.themeClass = (typeof args.themeClass === "string") ? args.themeClass : '';

    self.error = false;
    self.answer = 0;

    self.uiScale = function(){
        var minSize = Math.min(self.element.clientWidth, self.element.clientHeight)
        if (cacheMinSize !== minSize){
            cacheMinSize = minSize;
            self.element.style.fontSize = Math.min(self.element.clientWidth, self.element.clientHeight) / 10 + 'px';
            self.display.style.paddingTop = self.display.clientHeight/4 + 'px';
            self.display.style.lineHeight = self.element.style.fontSize;
        }
    }

    self.displayScale = function(){
        var display = self.display,
            fsize = self.fsize,
            fscale = (display.clientWidth - 52) / (fsize.clientWidth * display.innerHTML.length);

        if (fscale < 1) display.style.fontSize = fscale + 'em';
    }

    self.clear = function(){
        self.display.innerHTML = '';
        self.display.style.fontSize = '';
        self.error = false;
        args.clearEvent(self.display); //einkRefresh(display);
        return true;
    }

    self.isConst = function (str) {
        return (
        str === String.fromCharCode(960) ||
        str === 'e' || str === 'E' || str === ')'
        );
    }

    self.numpadClickEvent = function(e){
        e.preventDefault();

        self.error && self.clear();
        if (e.target.tagName === "SPAN") self.display.innerHTML += e.target.innerHTML;
        else if (e.target.parentNode.classList.contains('js-calc-btn-container')) self.display.innerHTML += e.target.children[0].innerHTML;

        self.displayScale();
        self.uiScale();
    }

    self.opadClickevent = function(e){
        e.preventDefault();

        var target = e.target,
            value = null;

        if (target.tagName === "SPAN") value = target.innerHTML;
        else if (e.target.parentNode.classList.contains('js-calc-btn-container')) value = target.children[0].innerHTML;

        if (value) {
            if (value == 'AC') return self.clear();

            var display = self.display,
                rawDisplay = display.innerHTML
                    .split(String.fromCharCode(960)).join('(PI)')
                    .split('E').join('(E)'),
                lastChar = rawDisplay.slice(-1),
                multiply = (!isNaN(lastChar) || self.isConst(lastChar) || rawDisplay.substr(-3) === 'ANS');

            switch (value) {
                case '=':
                    mMath.unitMode
                    rawDisplay = rawDisplay
                        .split('ANS').join(self.answer.toString())
                        .split(String.fromCharCode(8730)).join('sqrt')
                        .replace(/(\d+(?=%))/g, '($1/100)').split('%').join('')
                        .replace(/(\d(?=\())/g, '$1*')
                        .replace(/(\)(?=\d|\())/g, '$1*');

                    rawDisplay = rawDisplay.split('');

                    rawDisplay[0] === '*' && rawDisplay.shift();
                    rawDisplay[rawDisplay.length - 1] === '*' && rawDisplay.pop();

                    rawDisplay = rawDisplay.join('');

                    var equate;

                    try {
                        equate = Parser.parse(rawDisplay);
                        self.answer = equate.evaluate();
                    }
                    catch (e) {
                        self.answer = 'ERROR!';
                        self.error = true
                    }

                    display.innerHTML = self.answer;
                    break;
                case 'DEL':
                    if (display.innerHTML !== '') {
                        var rawDisplay = display.innerHTML.split('');
                        rawDisplay.pop();
                        display.innerHTML = rawDisplay.join('');
                    }
                    break;
                case String.fromCharCode(247): // divide
                    display.innerHTML += '/';
                    break;
                case '(':
                case 'ANS':
                    display.innerHTML += ((multiply && display.innerHTML !== '') ? '*' : '') + value;
                    break;
                default:
                    display.innerHTML += value;
                    break;
            }
            if (display.innerHTML === '') self.clear();
            else display.innerHTML = display.innerHTML.split('**').join('^').split('<br></br>').join('');

            self.displayScale();
            self.uiScale();
        }
    }

    self.advancedClickEvent = function(e){
        e.preventDefault();

        var target = e.target,
            value = null;

        if (target.tagName === "SPAN") value = target.innerHTML;
        else if (e.target.parentNode.classList.contains('js-calc-btn-container')) value = target.children[0].innerHTML;

        if (value) {
            var display = self.display,
                rawDisplay = display.innerHTML,
                lastChar = rawDisplay.slice(-1),
                multiply = (rawDisplay !== '') && (!isNaN(lastChar) || self.isConst(lastChar));

            switch (value) {
                case 'SHIFT':
                    self.advanced.classList.toggle('shifted');
                    args.shiftEvent(self.advanced);
                    break;
                case 'MODE':
                    self.mode.innerHTML = mMath.unitMode = (self.mode.innerHTML == 'DEG') ? 'RAD' : 'DEG';
                    break;
                case 'sin':
                case 'asin':
                case 'tan':
                case 'atan':
                case 'cos':
                case 'acos':
                case 'log':
                case String.fromCharCode(8730):
                    display.innerHTML += (multiply ? '*' : '') + value + '(';
                    break;
                case 'x!':
                    display.innerHTML += (multiply ? '*' : '') + 'fac(';
                    break;
                case 'x<sup>2</sup>':
                    display.innerHTML += '^2';
                    break;
                case 'x<sup>y</sup>':
                    display.innerHTML += '^';
                    break;
                case '10<sup>x</sup>':
                    display.innerHTML += (multiply ? '*' : '') + '10^';
                    break;
                case '<sup>y</sup>' + String.fromCharCode(8730) + 'x':
                    display.innerHTML += '^(1/';
                    break;
                case 'E':
                    display.innerHTML += (multiply ? '*' : '') + 'E';
                    break;
                default:
                    break;
            }
            self.displayScale();
            self.uiScale();
        }
    };

    self.create = function(){
        var elem, display, mode, panel, fsize, wrap, numpad, opad, advanced, basic,
            make = function(cname, ihtml){
                var elem = document.createElement('div');
                elem.className = 'js-calc-' + cname;
                elem.innerHTML = (typeof ihtml === "string") ? ihtml : '';
                return elem;
            };

        elem = document.createElement('div');
        elem.id = args.id;
        elem.className = 'js-calc' + ((args.themeClass.length > 0) ? ' ' + args.themeClass : '');
        elem.style.width = args.width;
        elem.style.height = args.height;

        elem.appendChild(fsize = make('fsize', 'X'));
        elem.appendChild(mode = make('mode', args.mode));

        display = document.createElement('div');
        display.className = 'js-calc-display';

        elem.appendChild(display);
        elem.appendChild(panel = make('panel'));

        wrap = document.createElement('div');

        wrap.appendChild(advanced = make('advanced',
            '<div class="js-calc-primary js-calc-btn-container">'+
                '<div class="l"><span>SHIFT</span></div><div><span>sin</span></div><div><span>cos</span></div><div><span>tan</span></div><div><span>x!</span></div><div><span>E</span></div>' +
                '<div class="l"><span>MODE</span></div><div><span>log</span></div><div><span>ln</span></div><div><span>&radic;</span></div><div><span>x<sup>y</sup></span></div><div><span>e</span></div>' +
            '</div>' +
            '<div class="js-calc-shift js-calc-btn-container">'+
                '<div class="l"><span>SHIFT</span></div><div><span>asin</span></div><div><span>acos</span></div><div><span>atan</span></div><div><span>x!</span></div><div><span>E</span></div>' +
                '<div class="l"><span>MODE</span></div><div><span>10<sup>x</sup></span></div><div><span>e<sup>x</sup></span></div><div><span>x<sup>2</sup></span></div><div><span><sup>y</sup>&radic;x</span></div><div><span>e</span></div>' +
            '</div>'
        ));
        wrap.appendChild(basic = make('basic'));

        basic.appendChild(numpad = make('numpad js-calc-btn-container',
            '<div><span>7</span></div><div><span>8</span></div><div><span>9</span></div>' +
            '<div><span>4</span></div><div><span>5</span></div><div><span>6</span></div>' +
            '<div><span>1</span></div><div><span>2</span></div><div><span>3</span></div>' +
            '<div><span>0</span></div><div><span>.</span></div><div><span>&pi;</span></div>'
        ));

        basic.appendChild(opad = make('opad js-calc-btn-container',
            '<div><span>(</span></div><div><span>)</span></div><div><span>%</span></div>' +
            '<div><span>*</span></div><div><span>&divide;</span></div><div class="l"><span>AC</span></div>' +
            '<div><span>+</span></div><div><span>-</span></div><div class="l"><span>DEL</span></div>' +
            '<div class="js-calc-eq"><span>=</span></div><div class="l"><span>ANS</span></div>'
        ));

        panel.appendChild(wrap);
        elem.appendChild(panel);

        self.mode = mode;
        self.display = display;
        self.panel = panel;
        self.advanced = advanced;
        self.fsize = fsize;

        advanced.addEventListener('click', self.advancedClickEvent, false);
        numpad.addEventListener('click', self.numpadClickEvent, false);
        opad.addEventListener('click', self.opadClickevent, false);
        self.element = elem;
    };

    return self;
};
