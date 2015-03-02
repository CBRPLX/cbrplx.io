<?php
namespace controller;

class generalController {

	public function __construct () {
		
    }

    public function genererSquelette($contenu, $meta = false, $article = null){
    	global $twig;
    	global $dev;

        if($meta && !empty($article)){
            $template = $twig->loadTemplate('meta.html.twig');

            if($article == "a_propos"){
                $titre = "À propos de moi";
                $image = "http://cbrplx.io/dist/images/share.jpg";
                $url = "http://cbrplx.io/about/";
                $description = "Awesome guy with an awesome website !";
            }elseif($article == "admin"){
                $titre = "Admin";
                $image = "http://cbrplx.io/dist/images/share.jpg";
                $url = "http://cbrplx.io/";
                $description = "Awesome guy with an awesome website !";
            }elseif($article == "404"){
                $titre = "404";
                $image = "http://cbrplx.io/dist/images/share.jpg";
                $url = "http://cbrplx.io/";
                $description = "Awesome guy with an awesome website !";
            }else{
                //On charge l'article
                $titre = $article->get('titre');
                $image = "http://cbrplx.io/".$article->getCouverture();
                $url = "http://www.cbrplx.io/articles/".$article->getUrl();
                $description = "ok ça va arriver";
            }

            return $template->render(array(
                "CONTENU" => $contenu,
                "DEV" => $dev,
                "TIME" => time(),
                "TITRE" => $titre,
                "IMAGE" => $image,
                "URL" => $url,
                "DESCRIPTION" => $description
            ));
        }else{
           $template = $twig->loadTemplate('squelette.html.twig');

            return $template->render(array(
                "CONTENU" => $contenu,
                "DEV" => $dev,
                "TIME" => time()
            ));
        }
    }

    public function genererAPropos(){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('a_propos.html.twig');

        $projets = new \classe\article();
        $projets = $projets->getProjets();

        $contenu = $template->render(array(
            'projets' => $projets
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
}