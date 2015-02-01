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