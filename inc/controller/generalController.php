<?php
namespace controller;

class generalController {

	public function __construct () {
		
    }

    public function genererSquelette($contenu, $meta = false, $article = null, $displayHeader = true){
    	global $twig;
    	global $dev;

        if($meta && !empty($article)){
            $template = $twig->loadTemplate('meta.html.twig');

            $tags = "";
            if($article == "a_propos"){
                $titre = "À propos de Robin Pierrot";
                $image = "https://cbrplx.io/dist/images/share.jpg";
                $url = "https://cbrplx.io/about/";
                $description = "Awesome guy with an awesome website !";
            }elseif($article == "index"){
                $titre = "Nouveautés et astuces du web - Articles, blog et projets";
                $image = "https://cbrplx.io/dist/images/share.jpg";
                $url = "https://cbrplx.io/";
                $description = "Awesome guy with an awesome website !";
            }elseif($article == "admin"){
                $titre = "Admin";
                $image = "https://cbrplx.io/dist/images/share.jpg";
                $url = "https://cbrplx.io/";
                $description = "Awesome guy with an awesome website !";
            }elseif($article == "404"){
                $titre = "404";
                $image = "https://cbrplx.io/dist/images/404.jpg";
                $url = "https://cbrplx.io/";
                $description = "This page has been destroyed";
            }elseif($article == "403"){
                $titre = "403";
                $image = "https://cbrplx.io/dist/images/403.jpg";
                $url = "https://cbrplx.io/";
                $description = "Dude, you're lost ?";
            }else{
                //On charge l'article
                $titre = $article->get('titre');
                $image = "https://cbrplx.io/".$article->getCouverture();
                if($article->get('id_article') == 3)
                    $image .= "?v=1";

                $url = "https://cbrplx.io/articles/".$article->getUrl();
                if(isset($_GET["preview"]))
                    $url = "https://cbrplx.io/preview/".$article->getUrl();
                $description = $article->get('description');
                $tag = $article->get('tags');
                $tag = explode(";", $tag);

                foreach ($tag as $k => $v) {
                    $tags .= $v." ";
                }
            }

            return $template->render(array(
                "CONTENU" => $contenu,
                "DEV" => $dev,
                "TIME" => time(),
                "TITRE" => $titre,
                "IMAGE" => $image,
                "URL" => $url,
                "DESCRIPTION" => $description,
                "TAGS" => $tags,
                'displayHeader' => $displayHeader,
            ));
        }else{
           $template = $twig->loadTemplate('squelette.html.twig');

            return $template->render(array(
                "CONTENU" => $contenu,
                "DEV" => $dev,
                "TIME" => time(),
                'displayHeader' => $displayHeader,
            ));
        }
    }

    public function genererAPropos(){
        global $twig;
        global $dev;
        global $refresh;

        $template = $twig->loadTemplate('a_propos.html.twig');

        $projets = new \classe\article();
        $projets = $projets->getProjets();

        $contenu = $template->render(array(
            'projets' => $projets,
            'refresh' => $refresh
        ));

        return $this->genererSquelette($contenu, true, "a_propos");
    }

    public function generer404(){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('404.html.twig');
        $contenu = $template->render(array());

        return $this->genererSquelette($contenu, true, "404");
    }

    public function generer403(){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('403.html.twig');
        $contenu = $template->render(array());

        return $this->genererSquelette($contenu, true, "403");
    }

    public function genererIndex($id_article = null){
        global $twig;
        global $dev;

        if(empty($id_article)) 
            $id_article = 9999999;

        $article = new \classe\article();
        $article->load($id_article, true);
        $contenu = "";

        // foreach ($articles as $k => $article) {
            if($article->get("online") == "1"){

                $template = $twig->loadTemplate('article.html.twig');

                $article->oneMoreView();

                $auteur = new \classe\user();
                $auteur->load($article->get('id_auteur'));

                $contribs = $article->getContributeurs();

                $all_technos = new \classe\techno();
                $all_technos = $all_technos->load($article->get('id_article'));
                $tri_technos = array();

                if($all_technos !== false){
                    $technos = array();
                    $i = 0;
                    foreach ($all_technos as $k => $v) {
                        if($i < 3){ //Si on a pas besoin de créer une nouvelle ligne
                            array_push($technos, $v);
                            $i++;
                        }else{ //Si on doit créer une nouvelle ligne
                            array_push($tri_technos, $technos);
                            $technos = array();
                            array_push($technos, $v);
                            $i = 1;
                        }
                    }
                    if($i == 3){
                        array_push($tri_technos, $technos);
                        $technos = array();
                        $i = 0;
                    }

                    while ($i < 3) {
                        array_push($technos, "");
                        $i++;
                    }
                    array_push($tri_technos, $technos);
                }
            
                $root = true;

                $contenu = $template->render(array(
                    'article' => $article,
                    'auteur' => $auteur,
                    'contribs' => $contribs,
                    'tri_technos' => $tri_technos,
                    'root' => $root,
                    'dev' => $dev
                ));

            }

        if($id_article != 9999999){
            return $contenu;
        }else{
            $controller = new \controller\generalController();

            return $controller->genererSquelette($contenu, true, "index");
        }
    }
}