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