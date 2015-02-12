/* Add to Homescreen v3.0.8 ~ (c) 2014 Matteo Spinelli ~ @license: http://cubiq.org/license */
(function (window, document) {
/*
       _   _ _____     _____
 ___ _| |_| |_   _|___|  |  |___ _____ ___ ___ ___ ___ ___ ___ ___
| .'| . | . | | | | . |     | . |     | -_|_ -|  _|  _| -_| -_|   |
|__,|___|___| |_| |___|__|__|___|_|_|_|___|___|___|_| |___|___|_|_|
                              by Matteo Spinelli ~ http://cubiq.org
*/

// Check if document is loaded, needed by autostart
var _DOMReady = false;
if ( document.readyState === 'complete' ) {
	_DOMReady = true;
} else {
	window.addEventListener('load', loaded, false);
}

function loaded () {
	window.removeEventListener('load', loaded, false);
	_DOMReady = true;
}

// regex used to detect if app has been added to the homescreen
var _reSmartURL = /\/ath(\/)?$/;
var _reQueryString = /([\?&]ath=[^&]*$|&ath=[^&]*(&))/;

// singleton
var _instance;
function ath (options) {
	_instance = _instance || new ath.Class(options);

	return _instance;
}

// message in all supported languages
ath.intl = {
	de_de: {
		message: 'Um diese Web-App zum Home-Bildschirm hinzuzufügen, tippen Sie auf %icon und dann <strong>%action</strong>.',
		action: { ios: 'Zum Home-Bildschirm', android: 'Zum Startbildschirm hinzufügen', windows: 'Auf Startseite' }
	},

	en_us: {
		message: 'To add this web app to the home screen: tap %icon and then <strong>%action</strong>.',
		action: { ios: 'Add to Home Screen', android: 'Add to homescreen', windows: 'pin to start' }
	},

	es_es: {
		message: 'Para añadir esta aplicación web a la pantalla de inicio: pulsa %icon y selecciona <strong>%action</strong>.',
		action: { ios: 'Añadir a pantalla de inicio', android: 'Añadir a pantalla de inicio', windows: 'Añadir a inicio' }
	},

	fr_fr: {
		message: 'Pour ajouter cette application web sur l\'écran d\'accueil : Appuyez %icon et sélectionnez <strong>%action</strong>.',
		action: { ios: 'Ajouter sur l\'écran d\'accueil', android: 'Ajouter à l\'écran d\'accueil', windows: 'Épingler à l\'écran d\'accueil' }
	},

	it_it: {
		message: 'Per Aggiungere questa web app alla schermata iniziale: premi %icon e poi <strong>%action</strong>.',
		action: { ios: 'Aggiungi a Home', android: 'Aggiungi alla homescreen', windows: 'aggiungi a start' }
	},

	nb_no: {
		message: 'For å installere denne appen på hjem-skjermen: trykk på %icon og deretter <strong>%action</strong>.',
		action: { ios: 'Legg til på Hjem-skjerm', android: 'Legg til på startsiden', windows: 'fest til start' }
	},

	nl_nl: {
		message: 'Om deze webapp op je telefoon te installeren, klik op %icon en dan <strong>%action</strong>.',
		action: { ios: 'Zet in beginscherm', android: 'Toevoegen aan startscherm', windows: 'Aan startscherm vastmaken' }
	},

	sv_se: {
		message: 'För att lägga till denna webbapplikation på hemskärmen: tryck på %icon och därefter <strong>%action</strong>.',
		action: { ios: 'Lägg till på hemskärmen', android: 'Lägg til på startskärmen', windows: 'fäst på startskärmen' }
	},

	zh_cn: {
		message: '如要把应用程式加至主屏幕,请点击%icon, 然后<strong>%action</strong>',
		action: { ios: '加至主屏幕', android: '加至主屏幕', windows: '按住启动' }
	},

	zh_tw: {
		message: '如要把應用程式加至主屏幕, 請點擊%icon, 然後<strong>%action</strong>.',
		action: { ios: '加至主屏幕', android: '加至主屏幕', windows: '按住啟動' }
	}
};

// Add 2 characters language support (Android mostly)
for ( var lang in ath.intl ) {
	ath.intl[lang.substr(0, 2)] = ath.intl[lang];
}

// default options
ath.defaults = {
	appID: 'org.cubiq.addtohome',		// local storage name (no need to change)
	fontSize: 15,				// base font size, used to properly resize the popup based on viewport scale factor
	debug: false,				// override browser checks
	modal: false,				// prevent further actions until the message is closed
	mandatory: false,			// you can't proceed if you don't add the app to the homescreen
	autostart: true,			// show the message automatically
	skipFirstVisit: false,		// show only to returning visitors (ie: skip the first time you visit)
	startDelay: 0,				// display the message after that many seconds from page load
	lifespan: 30,				// life of the message in seconds
	displayPace: 1440,			// minutes before the message is shown again (0: display every time, default 24 hours)
	maxDisplayCount: 0,			// absolute maximum number of times the message will be shown to the user (0: no limit)
	icon: true,					// add touch icon to the message
	message: '',				// the message can be customized
	validLocation: [],			// list of pages where the message will be shown (array of regexes)
	onInit: null,				// executed on instance creation
	onShow: null,				// executed when the message is shown
	onRemove: null,				// executed when the message is removed
	onAdd: null,				// when the application is launched the first time from the homescreen (guesstimate)
	onPrivate: null,			// executed if user is in private mode
	detectHomescreen: false		// try to detect if the site has been added to the homescreen (false | true | 'hash' | 'queryString' | 'smartURL')
};

// browser info and capability
var _ua = window.navigator.userAgent;

var _nav = window.navigator;
_extend(ath, {
	hasToken: document.location.hash == '#ath' || _reSmartURL.test(document.location.href) || _reQueryString.test(document.location.search),
	isRetina: window.devicePixelRatio && window.devicePixelRatio > 1,
	isIDevice: (/iphone|ipod|ipad/i).test(_ua),
	isMobileChrome: _ua.indexOf('Android') > -1 && (/Chrome\/[.0-9]*/).test(_ua),
	isMobileIE: _ua.indexOf('Windows Phone') > -1,
	language: _nav.language && _nav.language.toLowerCase().replace('-', '_') || ''
});

// falls back to en_us if language is unsupported
ath.language = ath.language && ath.language in ath.intl ? ath.language : 'en_us';

ath.isMobileSafari = ath.isIDevice && _ua.indexOf('Safari') > -1 && _ua.indexOf('CriOS') < 0;
ath.OS = ath.isIDevice ? 'ios' : ath.isMobileChrome ? 'android' : ath.isMobileIE ? 'windows' : 'unsupported';

ath.OSVersion = _ua.match(/(OS|Android) (\d+[_\.]\d+)/);
ath.OSVersion = ath.OSVersion && ath.OSVersion[2] ? +ath.OSVersion[2].replace('_', '.') : 0;

ath.isStandalone = window.navigator.standalone || ( ath.isMobileChrome && ( screen.height - document.documentElement.clientHeight < 40 ) );	// TODO: check the lame polyfill
ath.isTablet = (ath.isMobileSafari && _ua.indexOf('iPad') > -1) || (ath.isMobileChrome && _ua.indexOf('Mobile') < 0);

ath.isCompatible = (ath.isMobileSafari && ath.OSVersion >= 6) || ath.isMobileChrome;	// TODO: add winphone

var _defaultSession = {
	lastDisplayTime: 0,			// last time we displayed the message
	returningVisitor: false,	// is this the first time you visit
	displayCount: 0,			// number of times the message has been shown
	optedout: false,			// has the user opted out
	added: false				// has been actually added to the homescreen
};

ath.removeSession = function (appID) {
	try {
		localStorage.removeItem(appID || ath.defaults.appID);
	} catch (e) {
		// we are most likely in private mode
	}
};

ath.Class = function (options) {
	// merge default options with user config
	this.options = _extend({}, ath.defaults);
	_extend(this.options, options);

	// normalize some options
	this.options.mandatory = this.options.mandatory && ( 'standalone' in window.navigator || this.options.debug );
	this.options.modal = this.options.modal || this.options.mandatory;
	if ( this.options.mandatory ) {
		this.options.startDelay = -0.5;		// make the popup hasty
	}
	this.options.detectHomescreen = this.options.detectHomescreen === true ? 'hash' : this.options.detectHomescreen;

	// setup the debug environment
	if ( this.options.debug ) {
		ath.isCompatible = true;
		ath.OS = typeof this.options.debug == 'string' ? this.options.debug : ath.OS == 'unsupported' ? 'android' : ath.OS;
		ath.OSVersion = ath.OS == 'ios' ? '8' : '4';
	}

	// the element the message will be appended to
	this.container = document.documentElement;

	// load session
	this.session = localStorage.getItem(this.options.appID);
	this.session = this.session ? JSON.parse(this.session) : undefined;

	// user most likely came from a direct link containing our token, we don't need it and we remove it
	if ( ath.hasToken && ( !ath.isCompatible || !this.session ) ) {
		ath.hasToken = false;
		_removeToken();
	}

	// the device is not supported
	if ( !ath.isCompatible ) {
		return;
	}

	this.session = this.session || _defaultSession;

	// check if we can use the local storage
	try {
		localStorage.setItem(this.options.appID, JSON.stringify(this.session));
		ath.hasLocalStorage = true;
	} catch (e) {
		// we are most likely in private mode
		ath.hasLocalStorage = false;

		if ( this.options.onPrivate ) {
			this.options.onPrivate.call(this);
		}
	}

	// check if this is a valid location
	var isValidLocation = !this.options.validLocation.length;
	for ( var i = this.options.validLocation.length; i--; ) {
		if ( this.options.validLocation[i].test(document.location.href) ) {
			isValidLocation = true;
			break;
		}
	}

	// check compatibility with old versions of add to homescreen. Opt-out if an old session is found
	if ( localStorage.getItem('addToHome') ) {
		this.optOut();
	}

	// critical errors:
	// user opted out, already added to the homescreen, not a valid location
	if ( this.session.optedout || this.session.added || !isValidLocation ) {
		return;
	}

	// check if the app is in stand alone mode
	if ( ath.isStandalone ) {
		// execute the onAdd event if we haven't already
		if ( !this.session.added ) {
			this.session.added = true;
			this.updateSession();

			if ( this.options.onAdd && ath.hasLocalStorage ) {	// double check on localstorage to avoid multiple calls to the custom event
				this.options.onAdd.call(this);
			}
		}

		return;
	}

	// (try to) check if the page has been added to the homescreen
	if ( this.options.detectHomescreen ) {
		// the URL has the token, we are likely coming from the homescreen
		if ( ath.hasToken ) {
			_removeToken();		// we don't actually need the token anymore, we remove it to prevent redistribution

			// this is called the first time the user opens the app from the homescreen
			if ( !this.session.added ) {
				this.session.added = true;
				this.updateSession();

				if ( this.options.onAdd && ath.hasLocalStorage ) {	// double check on localstorage to avoid multiple calls to the custom event
					this.options.onAdd.call(this);
				}
			}

			return;
		}

		// URL doesn't have the token, so add it
		if ( this.options.detectHomescreen == 'hash' ) {
			history.replaceState('', window.document.title, document.location.href + '#ath');
		} else if ( this.options.detectHomescreen == 'smartURL' ) {
			history.replaceState('', window.document.title, document.location.href.replace(/(\/)?$/, '/ath$1'));
		} else {
			history.replaceState('', window.document.title, document.location.href + (document.location.search ? '&' : '?' ) + 'ath=');
		}
	}

	// check if this is a returning visitor
	if ( !this.session.returningVisitor ) {
		this.session.returningVisitor = true;
		this.updateSession();

		// we do not show the message if this is your first visit
		if ( this.options.skipFirstVisit ) {
			return;
		}
	}

	// we do no show the message in private mode
	if ( !ath.hasLocalStorage ) {
		return;
	}

	// all checks passed, ready to display
	this.ready = true;

	if ( this.options.onInit ) {
		this.options.onInit.call(this);
	}

	if ( this.options.autostart ) {
		this.show();
	}
};

ath.Class.prototype = {
	// event type to method conversion
	events: {
		load: '_delayedShow',
		error: '_delayedShow',
		orientationchange: 'resize',
		resize: 'resize',
		scroll: 'resize',
		click: 'remove',
		touchmove: '_preventDefault',
		transitionend: '_removeElements',
		webkitTransitionEnd: '_removeElements',
		MSTransitionEnd: '_removeElements'
	},

	handleEvent: function (e) {
		var type = this.events[e.type];
		if ( type ) {
			this[type](e);
		}
	},

	show: function (force) {
		// in autostart mode wait for the document to be ready
		if ( this.options.autostart && !_DOMReady ) {
			setTimeout(this.show.bind(this), 50);
			return;
		}

		// message already on screen
		if ( this.shown ) {
			return;
		}

		var now = Date.now();
		var lastDisplayTime = this.session.lastDisplayTime;

		if ( force !== true ) {
			// this is needed if autostart is disabled and you programmatically call the show() method
			if ( !this.ready ) {
				return;
			}

			// we obey the display pace (prevent the message to popup too often)
			if ( now - lastDisplayTime < this.options.displayPace * 60000 ) {
				return;
			}

			// obey the maximum number of display count
			if ( this.options.maxDisplayCount && this.session.displayCount >= this.options.maxDisplayCount ) {
				return;
			}
		}

		this.shown = true;

		// increment the display count
		this.session.lastDisplayTime = now;
		this.session.displayCount++;
		this.updateSession();

		// try to get the highest resolution application icon
		if ( !this.applicationIcon ) {
			if ( ath.OS == 'ios' ) {
				this.applicationIcon = document.querySelector('head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]');
			} else {
				this.applicationIcon = document.querySelector('head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]');
			}
			// this.applicationIcon = 'http://terrewebapp.univ.tf/image/design/apple-touch-icon-152x152-precomposed.png';
		}

		var message = '';

		if ( this.options.message in ath.intl ) {		// you can force the locale
			message = ath.intl[this.options.message].message.replace('%action', ath.intl[this.options.message].action[ath.OS]);
		} else if ( this.options.message !== '' ) {		// or use a custom message
			message = this.options.message;
		} else {										// otherwise we use our message
			message = ath.intl[ath.language].message.replace('%action', ath.intl[ath.language].action[ath.OS]);
		}

		// add the action icon
		message = '<p>' + message.replace('%icon', '<span class="ath-action-icon">icon</span>') + '</p>';

		// create the message container
		this.viewport = document.createElement('div');
		this.viewport.className = 'ath-viewport';
		if ( this.options.modal ) {
			this.viewport.className += ' ath-modal';
		}
		if ( this.options.mandatory ) {
			this.viewport.className += ' ath-mandatory';
		}
		this.viewport.style.position = 'absolute';

		// create the actual message element
		this.element = document.createElement('div');
		this.element.className = 'ath-container ath-' + ath.OS + ' ath-' + ath.OS + (ath.OSVersion + '').substr(0,1) + ' ath-' + (ath.isTablet ? 'tablet' : 'phone');
		this.element.style.cssText = '-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);transition-property:transform,opacity;transition-duration:0;transform:translate3d(0,0,0);-webkit-transition-timing-function:ease-out';
		this.element.style.webkitTransform = 'translate3d(0,-' + window.innerHeight + 'px,0)';
		this.element.style.webkitTransitionDuration = '0s';

		// add the application icon
		if ( this.options.icon && this.applicationIcon ) {
			this.element.className += ' ath-icon';
			this.img = document.createElement('img');
			this.img.className = 'ath-application-icon';
			this.img.addEventListener('load', this, false);
			this.img.addEventListener('error', this, false);

			this.img.src = this.applicationIcon.href;
			this.element.appendChild(this.img);
		}

		this.element.innerHTML += message;

		// we are not ready to show, place the message out of sight
		this.viewport.style.left = '-99999em';

		// attach all elements to the DOM
		this.viewport.appendChild(this.element);
		this.container.appendChild(this.viewport);

		// if we don't have to wait for an image to load, show the message right away
		if ( !this.img ) {
			this._delayedShow();
		}
	},

	_delayedShow: function (e) {
		setTimeout(this._show.bind(this), this.options.startDelay * 1000 + 500);
	},

	_show: function () {
		var that = this;

		// update the viewport size and orientation
		this.updateViewport();

		// reposition/resize the message on orientation change
		window.addEventListener('resize', this, false);
		window.addEventListener('scroll', this, false);
		window.addEventListener('orientationchange', this, false);

		if ( this.options.modal ) {
			// lock any other interaction
			document.addEventListener('touchmove', this, true);
		}

		// Enable closing after 1 second
		if ( !this.options.mandatory ) {
			setTimeout(function () {
				that.element.addEventListener('click', that, true);
			}, 1000);
		}

		// kick the animation
		setTimeout(function () {
			that.element.style.webkitTransform = 'translate3d(0,0,0)';
			that.element.style.webkitTransitionDuration = '0.5s';
		}, 0);

		// set the destroy timer
		if ( this.options.lifespan ) {
			this.removeTimer = setTimeout(this.remove.bind(this), this.options.lifespan * 1000);
		}

		// fire the custom onShow event
		if ( this.options.onShow ) {
			this.options.onShow.call(this);
		}
	},

	remove: function () {
		clearTimeout(this.removeTimer);

		// clear up the event listeners
		if ( this.img ) {
			this.img.removeEventListener('load', this, false);
			this.img.removeEventListener('error', this, false);
		}

		window.removeEventListener('resize', this, false);
		window.removeEventListener('scroll', this, false);
		window.removeEventListener('orientationchange', this, false);
		document.removeEventListener('touchmove', this, true);
		this.element.removeEventListener('click', this, true);

		// remove the message element on transition end
		this.element.addEventListener('transitionend', this, false);
		this.element.addEventListener('webkitTransitionEnd', this, false);
		this.element.addEventListener('MSTransitionEnd', this, false);

		// start the fade out animation
		this.element.style.webkitTransitionDuration = '0.3s';
		this.element.style.opacity = '0';
	},

	_removeElements: function () {
		this.element.removeEventListener('transitionend', this, false);
		this.element.removeEventListener('webkitTransitionEnd', this, false);
		this.element.removeEventListener('MSTransitionEnd', this, false);

		// remove the message from the DOM
		this.container.removeChild(this.viewport);

		this.shown = false;

		// fire the custom onRemove event
		if ( this.options.onRemove ) {
			this.options.onRemove.call(this);
		}
	},

	updateViewport: function () {
		if ( !this.shown ) {
			return;
		}

		this.viewport.style.width = window.innerWidth + 'px';
		this.viewport.style.height = window.innerHeight + 'px';
		this.viewport.style.left = window.scrollX + 'px';
		this.viewport.style.top = window.scrollY + 'px';

		var clientWidth = document.documentElement.clientWidth;

		this.orientation = clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait';

		var screenWidth = ath.OS == 'ios' ? this.orientation == 'portrait' ? screen.width : screen.height : screen.width;
		this.scale = screen.width > clientWidth ? 1 : screenWidth / window.innerWidth;

		this.element.style.fontSize = this.options.fontSize / this.scale + 'px';
	},

	resize: function () {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(this.updateViewport.bind(this), 100);
	},

	updateSession: function () {
		if ( ath.hasLocalStorage === false ) {
			return;
		}

		localStorage.setItem(this.options.appID, JSON.stringify(this.session));
	},

	clearSession: function () {
		this.session = _defaultSession;
		this.updateSession();
	},

	optOut: function () {
		this.session.optedout = true;
		this.updateSession();
	},

	optIn: function () {
		this.session.optedout = false;
		this.updateSession();
	},

	clearDisplayCount: function () {
		this.session.displayCount = 0;
		this.updateSession();
	},

	_preventDefault: function (e) {
		e.preventDefault();
		e.stopPropagation();
	}
};

// utility
function _extend (target, obj) {
	for ( var i in obj ) {
		target[i] = obj[i];
	}

	return target;
}

function _removeToken () {
	if ( document.location.hash == '#ath' ) {
		history.replaceState('', window.document.title, document.location.href.split('#')[0]);
	}

	if ( _reSmartURL.test(document.location.href) ) {
		history.replaceState('', window.document.title, document.location.href.replace(_reSmartURL, '$1'));
	}

	if ( _reQueryString.test(document.location.search) ) {
		history.replaceState('', window.document.title, document.location.href.replace(_reQueryString, '$2'));
	}
}

// expose to the world
window.addToHomescreen = ath;

})(window, document);

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

addToHomescreen({
  message: '<p class="proxima" style="z-index:9999;">Yo ajoute là comme une appli, on est bien ... Allez viens .. on est bien. Bien bien bien</p>'
});

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

function MAJScripts(){
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
        eval(scripts[i].innerHTML);
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

window.onload = function(){
    if(!WURFL.is_mobile || !(("standalone" in window.navigator) && !window.navigator.standalone))
        window.addEventListener("resize", function(){sizeBanieres();});
    window.addEventListener('orientationchange', function(){sizeBanieres();});
    sizeBanieres();
    scrollToElement("bloc-contenu");
    document.getElementById("bloc-body").style.opacity = "1";
    document.getElementById("bloc-chargement-general").style.opacity = "0";

    MAJScripts();
    switchDate();
}