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

window.onload = function(){
    if(!WURFL.is_mobile || !(("standalone" in window.navigator) && !window.navigator.standalone))
        window.addEventListener("resize", function(){sizeBanieres();});
    window.addEventListener('orientationchange', function(){sizeBanieres();});
    sizeBanieres();
    scrollToElement("bloc-contenu");
    document.getElementById("bloc-body").style.opacity = "1";
    document.getElementById("bloc-chargement-general").style.opacity = "0";

    MAJScripts();
    
}