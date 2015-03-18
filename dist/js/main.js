function file(fichier,url) {
	var xhr_object = getHttpRequest();
	xhr_object.open("POST", fichier, false);
	xhr_object.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xhr_object.send(url);
	if(xhr_object.readyState == 4){
		//alert('ok');
		return(xhr_object.responseText);
	}else{
		return(false);
	}
}

function fileXML(fichier,url) {
	fichier = fichier+'?'+url ;
	var xhr_object = getHttpRequest();
	xhr_object.open("GET", fichier, false);
	xhr_object.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xhr_object.send(null);
	if(xhr_object.readyState == 4){
		return(xhr_object.responseXML);
	}else{
		return(false);
	}
}


function fileasynch(fichier,url,callback) {
    var xhr = getHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        	if(callback!=null)
        	{
            	callback(xhr.responseText);
            }
        }
    };
    
    xhr.open("POST", fichier, true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xhr.send(url);
}


function getHttpRequest() {
    var xhr = null;
    
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet AJAX...");
        return null;
    }
    
    return xhr;
}

// function upload() {
//     // Analyse le fichier + création de la visualisation
//     var fileInput = document.getElementById('file').value;
//     alert(fileInput);
     
//     // Récupère le fichier spécifié et créer une requête XMLHttpRequest
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', 'upload.php');
//     xhr.onload = function() {
//         alert('Upload terminé de : '+fileInput);
//     };
//     // Upload du fichier…
//     var form = new FormData();
//     form.append('file', fileInput);
//     xhr.send(form); // envoie le fichier
 
// }
// /*
//     json2.js
//     2014-02-04

//     Public Domain.

//     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//     See http://www.JSON.org/js.html


//     This code should be minified before deployment.
//     See http://javascript.crockford.com/jsmin.html

//     USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//     NOT CONTROL.


//     This file creates a global JSON object containing two methods: stringify
//     and parse.

//         JSON.stringify(value, replacer, space)
//             value       any JavaScript value, usually an object or array.

//             replacer    an optional parameter that determines how object
//                         values are stringified for objects. It can be a
//                         function or an array of strings.

//             space       an optional parameter that specifies the indentation
//                         of nested structures. If it is omitted, the text will
//                         be packed without extra whitespace. If it is a number,
//                         it will specify the number of spaces to indent at each
//                         level. If it is a string (such as '\t' or '&nbsp;'),
//                         it contains the characters used to indent at each level.

//             This method produces a JSON text from a JavaScript value.

//             When an object value is found, if the object contains a toJSON
//             method, its toJSON method will be called and the result will be
//             stringified. A toJSON method does not serialize: it returns the
//             value represented by the name/value pair that should be serialized,
//             or undefined if nothing should be serialized. The toJSON method
//             will be passed the key associated with the value, and this will be
//             bound to the value

//             For example, this would serialize Dates as ISO strings.

//                 Date.prototype.toJSON = function (key) {
//                     function f(n) {
//                         // Format integers to have at least two digits.
//                         return n < 10 ? '0' + n : n;
//                     }

//                     return this.getUTCFullYear()   + '-' +
//                          f(this.getUTCMonth() + 1) + '-' +
//                          f(this.getUTCDate())      + 'T' +
//                          f(this.getUTCHours())     + ':' +
//                          f(this.getUTCMinutes())   + ':' +
//                          f(this.getUTCSeconds())   + 'Z';
//                 };

//             You can provide an optional replacer method. It will be passed the
//             key and value of each member, with this bound to the containing
//             object. The value that is returned from your method will be
//             serialized. If your method returns undefined, then the member will
//             be excluded from the serialization.

//             If the replacer parameter is an array of strings, then it will be
//             used to select the members to be serialized. It filters the results
//             such that only members with keys listed in the replacer array are
//             stringified.

//             Values that do not have JSON representations, such as undefined or
//             functions, will not be serialized. Such values in objects will be
//             dropped; in arrays they will be replaced with null. You can use
//             a replacer function to replace those with JSON values.
//             JSON.stringify(undefined) returns undefined.

//             The optional space parameter produces a stringification of the
//             value that is filled with line breaks and indentation to make it
//             easier to read.

//             If the space parameter is a non-empty string, then that string will
//             be used for indentation. If the space parameter is a number, then
//             the indentation will be that many spaces.

//             Example:

//             text = JSON.stringify(['e', {pluribus: 'unum'}]);
//             // text is '["e",{"pluribus":"unum"}]'


//             text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
//             // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//             text = JSON.stringify([new Date()], function (key, value) {
//                 return this[key] instanceof Date ?
//                     'Date(' + this[key] + ')' : value;
//             });
//             // text is '["Date(---current time---)"]'


//         JSON.parse(text, reviver)
//             This method parses a JSON text to produce an object or array.
//             It can throw a SyntaxError exception.

//             The optional reviver parameter is a function that can filter and
//             transform the results. It receives each of the keys and values,
//             and its return value is used instead of the original value.
//             If it returns what it received, then the structure is not modified.
//             If it returns undefined then the member is deleted.

//             Example:

//             // Parse the text. Values that look like ISO date strings will
//             // be converted to Date objects.

//             myData = JSON.parse(text, function (key, value) {
//                 var a;
//                 if (typeof value === 'string') {
//                     a =
// /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                     if (a) {
//                         return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                             +a[5], +a[6]));
//                     }
//                 }
//                 return value;
//             });

//             myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//                 var d;
//                 if (typeof value === 'string' &&
//                         value.slice(0, 5) === 'Date(' &&
//                         value.slice(-1) === ')') {
//                     d = new Date(value.slice(5, -1));
//                     if (d) {
//                         return d;
//                     }
//                 }
//                 return value;
//             });


//     This is a reference implementation. You are free to copy, modify, or
//     redistribute.
// */

// /*jslint evil: true, regexp: true */

// /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
//     call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
//     getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
//     lastIndex, length, parse, prototype, push, replace, slice, stringify,
//     test, toJSON, toString, valueOf
// */


// // Create a JSON object only if one does not already exist. We create the
// // methods in a closure to avoid creating global variables.

// if (typeof JSON !== 'object') {
//     JSON = {};
// }

// (function () {
//     'use strict';

//     function f(n) {
//         // Format integers to have at least two digits.
//         return n < 10 ? '0' + n : n;
//     }

//     if (typeof Date.prototype.toJSON !== 'function') {

//         Date.prototype.toJSON = function () {

//             return isFinite(this.valueOf())
//                 ? this.getUTCFullYear()     + '-' +
//                     f(this.getUTCMonth() + 1) + '-' +
//                     f(this.getUTCDate())      + 'T' +
//                     f(this.getUTCHours())     + ':' +
//                     f(this.getUTCMinutes())   + ':' +
//                     f(this.getUTCSeconds())   + 'Z'
//                 : null;
//         };

//         String.prototype.toJSON      =
//             Number.prototype.toJSON  =
//             Boolean.prototype.toJSON = function () {
//                 return this.valueOf();
//             };
//     }

//     var cx,
//         escapable,
//         gap,
//         indent,
//         meta,
//         rep;


//     function quote(string) {

// // If the string contains no control characters, no quote characters, and no
// // backslash characters, then we can safely slap some quotes around it.
// // Otherwise we must also replace the offending characters with safe escape
// // sequences.

//         escapable.lastIndex = 0;
//         return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
//             var c = meta[a];
//             return typeof c === 'string'
//                 ? c
//                 : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
//         }) + '"' : '"' + string + '"';
//     }


//     function str(key, holder) {

// // Produce a string from holder[key].

//         var i,          // The loop counter.
//             k,          // The member key.
//             v,          // The member value.
//             length,
//             mind = gap,
//             partial,
//             value = holder[key];

// // If the value has a toJSON method, call it to obtain a replacement value.

//         if (value && typeof value === 'object' &&
//                 typeof value.toJSON === 'function') {
//             value = value.toJSON(key);
//         }

// // If we were called with a replacer function, then call the replacer to
// // obtain a replacement value.

//         if (typeof rep === 'function') {
//             value = rep.call(holder, key, value);
//         }

// // What happens next depends on the value's type.

//         switch (typeof value) {
//         case 'string':
//             return quote(value);

//         case 'number':

// // JSON numbers must be finite. Encode non-finite numbers as null.

//             return isFinite(value) ? String(value) : 'null';

//         case 'boolean':
//         case 'null':

// // If the value is a boolean or null, convert it to a string. Note:
// // typeof null does not produce 'null'. The case is included here in
// // the remote chance that this gets fixed someday.

//             return String(value);

// // If the type is 'object', we might be dealing with an object or an array or
// // null.

//         case 'object':

// // Due to a specification blunder in ECMAScript, typeof null is 'object',
// // so watch out for that case.

//             if (!value) {
//                 return 'null';
//             }

// // Make an array to hold the partial results of stringifying this object value.

//             gap += indent;
//             partial = [];

// // Is the value an array?

//             if (Object.prototype.toString.apply(value) === '[object Array]') {

// // The value is an array. Stringify every element. Use null as a placeholder
// // for non-JSON values.

//                 length = value.length;
//                 for (i = 0; i < length; i += 1) {
//                     partial[i] = str(i, value) || 'null';
//                 }

// // Join all of the elements together, separated with commas, and wrap them in
// // brackets.

//                 v = partial.length === 0
//                     ? '[]'
//                     : gap
//                     ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
//                     : '[' + partial.join(',') + ']';
//                 gap = mind;
//                 return v;
//             }

// // If the replacer is an array, use it to select the members to be stringified.

//             if (rep && typeof rep === 'object') {
//                 length = rep.length;
//                 for (i = 0; i < length; i += 1) {
//                     if (typeof rep[i] === 'string') {
//                         k = rep[i];
//                         v = str(k, value);
//                         if (v) {
//                             partial.push(quote(k) + (gap ? ': ' : ':') + v);
//                         }
//                     }
//                 }
//             } else {

// // Otherwise, iterate through all of the keys in the object.

//                 for (k in value) {
//                     if (Object.prototype.hasOwnProperty.call(value, k)) {
//                         v = str(k, value);
//                         if (v) {
//                             partial.push(quote(k) + (gap ? ': ' : ':') + v);
//                         }
//                     }
//                 }
//             }

// // Join all of the member texts together, separated with commas,
// // and wrap them in braces.

//             v = partial.length === 0
//                 ? '{}'
//                 : gap
//                 ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
//                 : '{' + partial.join(',') + '}';
//             gap = mind;
//             return v;
//         }
//     }

// // If the JSON object does not yet have a stringify method, give it one.

//     if (typeof JSON.stringify !== 'function') {
//         escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
//         meta = {    // table of character substitutions
//             '\b': '\\b',
//             '\t': '\\t',
//             '\n': '\\n',
//             '\f': '\\f',
//             '\r': '\\r',
//             '"' : '\\"',
//             '\\': '\\\\'
//         };
//         JSON.stringify = function (value, replacer, space) {

// // The stringify method takes a value and an optional replacer, and an optional
// // space parameter, and returns a JSON text. The replacer can be a function
// // that can replace values, or an array of strings that will select the keys.
// // A default replacer method can be provided. Use of the space parameter can
// // produce text that is more easily readable.

//             var i;
//             gap = '';
//             indent = '';

// // If the space parameter is a number, make an indent string containing that
// // many spaces.

//             if (typeof space === 'number') {
//                 for (i = 0; i < space; i += 1) {
//                     indent += ' ';
//                 }

// // If the space parameter is a string, it will be used as the indent string.

//             } else if (typeof space === 'string') {
//                 indent = space;
//             }

// // If there is a replacer, it must be a function or an array.
// // Otherwise, throw an error.

//             rep = replacer;
//             if (replacer && typeof replacer !== 'function' &&
//                     (typeof replacer !== 'object' ||
//                     typeof replacer.length !== 'number')) {
//                 throw new Error('JSON.stringify');
//             }

// // Make a fake root object containing our value under the key of ''.
// // Return the result of stringifying the value.

//             return str('', {'': value});
//         };
//     }


// // If the JSON object does not yet have a parse method, give it one.

//     if (typeof JSON.parse !== 'function') {
//         cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
//         JSON.parse = function (text, reviver) {

// // The parse method takes a text and an optional reviver function, and returns
// // a JavaScript value if the text is a valid JSON text.

//             var j;

//             function walk(holder, key) {

// // The walk method is used to recursively walk the resulting structure so
// // that modifications can be made.

//                 var k, v, value = holder[key];
//                 if (value && typeof value === 'object') {
//                     for (k in value) {
//                         if (Object.prototype.hasOwnProperty.call(value, k)) {
//                             v = walk(value, k);
//                             if (v !== undefined) {
//                                 value[k] = v;
//                             } else {
//                                 delete value[k];
//                             }
//                         }
//                     }
//                 }
//                 return reviver.call(holder, key, value);
//             }


// // Parsing happens in four stages. In the first stage, we replace certain
// // Unicode characters with escape sequences. JavaScript handles many characters
// // incorrectly, either silently deleting them, or treating them as line endings.

//             text = String(text);
//             cx.lastIndex = 0;
//             if (cx.test(text)) {
//                 text = text.replace(cx, function (a) {
//                     return '\\u' +
//                         ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
//                 });
//             }

// // In the second stage, we run the text against regular expressions that look
// // for non-JSON patterns. We are especially concerned with '()' and 'new'
// // because they can cause invocation, and '=' because it can cause mutation.
// // But just to be safe, we want to reject all unexpected forms.

// // We split the second stage into 4 regexp operations in order to work around
// // crippling inefficiencies in IE's and Safari's regexp engines. First we
// // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// // replace all simple value tokens with ']' characters. Third, we delete all
// // open brackets that follow a colon or comma or that begin the text. Finally,
// // we look to see that the remaining characters are only whitespace or ']' or
// // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

//             if (/^[\],:{}\s]*$/
//                     .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
//                         .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
//                         .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// // In the third stage we use the eval function to compile the text into a
// // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// // in JavaScript: it can begin a block or an object literal. We wrap the text
// // in parens to eliminate the ambiguity.

//                 j = eval('(' + text + ')');

// // In the optional fourth stage, we recursively walk the new structure, passing
// // each name/value pair to a reviver function for possible transformation.

//                 return typeof reviver === 'function'
//                     ? walk({'': j}, '')
//                     : j;
//             }

// // If the text is not JSON parseable, then a SyntaxError is thrown.

//             throw new SyntaxError('JSON.parse');
//         };
//     }
// }());
function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}

function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
    return false;
}

function scrollToElement(bloc){
	element = document.getElementById(bloc);
	var bodyRect = document.body.getBoundingClientRect(),
		elemRect = element.getBoundingClientRect(),
		offset   = elemRect.top - bodyRect.top;
	window.scrollTo(0,offset);
}


function displayNav(){
    if(currentYPosition() > document.getElementsByClassName('bloc-titre')[0].offsetTop){
        if(document.getElementById('go-back').style.display != 'block')
            document.getElementById('go-back').style.display = 'block';

        if(currentYPosition() > document.getElementById('go-back-bloc').offsetTop){
            if(document.getElementById('go-back').style.display != 'none')
                document.getElementById('go-back').style.display = 'none';

            if(document.getElementById('go-back-bloc').style.opacity != '1')
                document.getElementById('go-back-bloc').style.opacity = '1';
        }else{
            if(document.getElementById('go-back').style.display != 'block')
                document.getElementById('go-back').style.display = 'block';

            if(document.getElementById('go-back-bloc').style.opacity != '0')
                document.getElementById('go-back-bloc').style.opacity = '0';
        }
    }else{
        if(document.getElementById('go-back').style.display != 'none')
            document.getElementById('go-back').style.display = 'none';
    }
}

function testGoBack(){
    if(document.getElementsByClassName('go-back').length > 0){
        if(("standalone" in window.navigator) && window.navigator.standalone && location.pathname != "/"){

            window.addEventListener("scroll", function(){
                displayNav()
            }, false);
        }else{
            document.getElementById('go-back').style.setProperty("display", "none", "important");
            document.getElementById('go-back-bloc').style.setProperty("display", "none", "important");
        }
    }
}

testGoBack();
if(("standalone" in window.navigator) && window.navigator.standalone){

    var noddy, remotes = false;

    document.addEventListener('click', function(event) {

        noddy = event.target;

        while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML" /*&& noddy.nodeName !== "FORM"*/) {
            noddy = noddy.parentNode;
        }

        if(noddy.hasAttribute('new-window')){
            //Si ce n'est pas un formulaire
            // if(noddy.nodeName !== "FORM"){
                event.preventDefault();

                var a = document.createElement('a');

                //creation d'un nouveau lien
                a.setAttribute("href", noddy.href);
                a.setAttribute("target", "_blank");

                var dispatch = document.createEvent("HTMLEvents");
                dispatch.initEvent("click", true, true);
                a.dispatchEvent(dispatch);
            // }
        }
        else if('href' in noddy && noddy.href.indexOf('http') !== -1
            && (noddy.href.indexOf(document.location.host) !== -1 || remotes))
        {
            event.preventDefault();
            if(!noddy.hasAttribute("btn-js"))
                document.location.href = noddy.href;
        }

    }, false);
}

document.getElementById("icone-fleche-bas").addEventListener("click", function(){
  smoothScroll('bloc-contenu');
});

function sizeBanieres(){
    var banieres = document.getElementsByClassName("bloc-baniere");
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    var demi_ecran = y/2;
    for (var i = banieres.length - 1; i >= 0; i--) {
        banieres[i].style.height = demi_ecran+"px";
    };
}

function afficherAlerte(id, hide){
    if(hide == "hide"){
        document.getElementById(id).style.display = "none";
    }else{
        document.getElementById(id).style.display = "block";
    }
}

function hideAllAlert(){
    var alerts = document.getElementsByClassName("alert");
    for (var i = alerts.length - 1; i >= 0; i--) {
        alerts[i].style.display = "none";
    };
}

function afficherNotif(id, hide){
    if(hide == "hide"){
        document.getElementById(id).style.display = "none";
    }else{
        document.getElementById(id).style.display = "block";
    }
}

function hideAllNotif(){
    var notifs = document.getElementsByClassName("notif");
    for (var i = notifs.length - 1; i >= 0; i--) {
        notifs[i].style.display = "none";
    };
}

function afficherChargement(id, hide){
    if(hide == "hide"){
        document.getElementById(id).style.display = "none";
    }else{
        document.getElementById(id).style.display = "block";
    }
}

function hideAllChargement(){
    var alerts = document.getElementsByClassName("chargement");
    for (var i = alerts.length - 1; i >= 0; i--) {
        alerts[i].style.display = "none";
    };
}

function getValueMulti(select){
    var tab = [];
    for (var i = select.children.length - 1; i >= 0; i--) {
        if(select.children[i].selected)
            tab.push(select.children[i].value);
    }
    return tab;
}

function getJSONValuesForm(inputs){
    var values = {};
    for (var i = inputs.length - 1; i >= 0; i--) {

        if((inputs[i].nodeName == "SELECT" || inputs[i].nodeName == "select") && inputs[i].multiple){
            values[inputs[i].id] = getValueMulti(inputs[i]);
        }else if((inputs[i].nodeName == "INPUT" || inputs[i].nodeName == "input") && inputs[i].type == "checkbox"){
            if(inputs[i].checked){
                values[inputs[i].id] = "1";
            }else{
                values[inputs[i].id] = "0";
            }
        }else{
            values[inputs[i].id] = inputs[i].value;
        }
    };
    return values;
}

function delPhoto(chemin){
    var retour = file("/inc/ajax/admin/del_photo.php", "chemin="+chemin);
    console.log(retour);
    if(retour == "no_image"){
        alert('No image');
    }else if(retour == "del"){
        document.getElementById(chemin).parentNode.innerHTML = "";
    }else{
        alert("Error : "+retour);
    }
}

function afficherNomPhoto(nom, couverture){
    var retour = JSON.parse(nom);
    nom = retour.img;

    var html = '<img src="/'+nom+'?'+ new Date().getTime()+'" />';
    html += '<div class="preview-photo-options pas" id="'+nom+'">';
    html += '<span class="txtwhite lh1">'+nom+'</span>';
    html += '<span class="icone-cross-white right" title="Supprimer la photo" onclick="delPhoto(\''+nom+'\')"></span>';
    html += '</div>';

    if(couverture == "1"){
        document.getElementById("couverture").value = "";
        var element = document.getElementsByClassName("preview-couverture")[0];
    }else{
        document.getElementById("image").value = "";
        var element = document.getElementsByClassName("preview-photo-article")[retour.nb_img];
        console.log(retour.nb_img);
        if(retour.nb_img == 2){
            var last_photo = document.getElementsByClassName("preview-photo-article")[document.getElementsByClassName("preview-photo-article").length -1];
            last_photo.parentNode.parentNode.insertAdjacentHTML("afterend",retour.new_row);
        }
    }

    element.innerHTML = html;
}

function changeInputPhoto(couv){
    if(couv == "couverture"){
        var retour = uploadPhoto(couv,'id_article', true);
    }else{
        var retour = uploadPhoto(couv,'id_article', false);
    }

    if(retour == "fermé") alert("L'article est fermé");
}

function uploadPhoto(id, id_article, couverture){
    var id_article = document.getElementById(id_article).value;
    if(id_article != ""){
        var c = "0";
        if(couverture) c = "1";

        var img = document.getElementById(id).files[0];

        var xhr = getHttpRequest();

        var formData = new FormData();
        formData.append(c, img);
        formData.append('couverture', c);
        formData.append('id_article', id_article);
        xhr.open("POST", "/inc/ajax/admin/upload_photo.php");
        // xhr.setRequestHeader('Content-type','multipart/form-data');
        xhr.onload = function(){afficherNomPhoto(xhr.responseText, c)};
        // xhr.onload = function(){console.log(xhr.responseText)};
        xhr.send(formData);
        return "ok";
    }else{
        return "fermé";
    }
}

function switchDate(){
    if(document.getElementsByClassName("date-mois").length > 0){
        var dates = document.getElementsByClassName("date-mois");
        for (var i = dates.length - 1; i >= 0; i--) {
            dates[i].addEventListener("mouseover", function(){
                this.nextSibling.nextElementSibling.style.display = "inline";
                this.style.display = "none";
            });
        };
    }

    if(document.getElementsByClassName("date-jour").length > 0){
        var dates = document.getElementsByClassName("date-jour");
        for (var i = dates.length - 1; i >= 0; i--) {
            dates[i].addEventListener("mouseout", function(){
                this.previousSibling.previousElementSibling.style.display = "inline";
                this.style.display = "none";
            });
        };
    }
}

var nb_article_loaded = [];

function getIdArticle(id){
    var id_article = id;
    id_article = id_article.split("-");
    id_article = id_article[id_article.length-1];

    return id_article;
}

function shareEvent(){
    var btn_share = document.getElementsByClassName("btn-share");
    for (var i = btn_share.length - 1; i >= 0; i--) {
        btn_share[i].removeEventListener("click", function(){});
        btn_share[i].addEventListener("click", function(e){
            var plateforme = this.getAttribute('plateforme');
            var id_article = this.parentNode.parentNode.getAttribute('id');
            file('/inc/ajax/partage/add_partage.php', "plateforme="+plateforme+"&id_article="+id_article+"&timestamp="+Math.floor(Date.now() / 1000));
        });
    };
}

function chargerArticleIndex(){

    if(currentYPosition()+window.innerHeight > 
        document.getElementsByClassName('bloc-auteur')[document.getElementsByClassName('bloc-auteur').length-1].offsetTop){

        var id_article = document.getElementsByClassName("bloc-container")[document.getElementsByClassName("bloc-container").length-1].id;
        id_article = getIdArticle(id_article);

        if(nb_article_loaded.indexOf(id_article) == -1){
            nb_article_loaded[nb_article_loaded.length] = id_article;

            var retour = file("/inc/ajax/index/charger_article_index.php", "id_article="+id_article);

            var new_article = document.createElement('div');
            new_article.setAttribute('class', 'bloc-article');
            new_article.innerHTML = retour;
            document.getElementsByClassName("bloc-article")[document.getElementsByClassName("bloc-article").length-1].appendChild(new_article);
            sizeBanieres();
            testGoBack();
            shareEvent();
        }
    }
}

window.onload = function(){
    if(!WURFL.is_mobile || !(("standalone" in window.navigator) && !window.navigator.standalone))
        window.addEventListener("resize", function(){sizeBanieres();});
    window.addEventListener('orientationchange', function(){sizeBanieres();});
    sizeBanieres();
    scrollToElement("bloc-contenu");
    document.getElementById("bloc-body").style.opacity = "1";
    document.getElementById("bloc-chargement-general").style.opacity = "0";

    // MAJScripts();
    switchDate();
    shareEvent();

    if(location.pathname == "/"){
        window.addEventListener("scroll", function(){
            chargerArticleIndex()
        }, false);
    }
}

function exec_body_scripts(body_el) {
  // Finds and executes scripts in a newly added element's body.
  // Needed since innerHTML does not run scripts.
  //
  // Argument body_el is an element in the dom.

  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toUpperCase() ===
              name.toUpperCase();
  };

  function evalScript(elem) {
    var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
        head = document.getElementsByTagName("head")[0] ||
                  document.documentElement,
        script = document.createElement("script");

    script.type = "text/javascript";
    try {
      // doesn't work on ie...
      script.appendChild(document.createTextNode(data));      
    } catch(e) {
      // IE has funky script nodes
      script.text = data;
    }

    head.insertBefore(script, head.firstChild);
    head.removeChild(script);
  };

  // main section of function
  var scripts = [],
      script,
      children_nodes = body_el.childNodes,
      child,
      i;

  for (i = 0; children_nodes[i]; i++) {
    child = children_nodes[i];
    if (nodeName(child, "script" ) &&
      (!child.type || child.type.toLowerCase() === "text/javascript")) {
          scripts.push(child);
      }
  }

  for (i = 0; scripts[i]; i++) {
    script = scripts[i];
    if (script.parentNode) {script.parentNode.removeChild(script);}
    evalScript(scripts[i]);
  }
};