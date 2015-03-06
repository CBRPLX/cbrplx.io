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

if(document.getElementsByClassName('go-back').length > 0){

    if(("standalone" in window.navigator) && window.navigator.standalone){

        function displayNav(){
            if(window.scrollY > document.getElementsByClassName('bloc-titre')[0].offsetTop){
                if(document.getElementById('go-back').style.display != 'block')
                    document.getElementById('go-back').style.display = 'block';

                if(window.scrollY > document.getElementById('go-back-bloc').offsetTop){
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

        window.addEventListener("scroll", function(){
            displayNav()
        }, false);
    }else{
        document.getElementById('go-back').style.setProperty("display", "none", "important");
        document.getElementById('go-back-bloc').style.setProperty("display", "none", "important");
    }
}