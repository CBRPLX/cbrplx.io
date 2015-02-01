<?php
namespace controller;

class generalController {

	public function __construct () {
		
    }

    public function genererSquelette($contenu, $meta = false, $id_article = null){
    	global $twig;
    	global $dev;

        if($meta && !empty($id_article)){
            $template = $twig->loadTemplate('meta.html.twig');

            if($id_article == "a_propos"){
                $titre = "À propos de moi";
                $image = "http://cbrplx.io/dist/images/share.jpg";
                $url = "http://cbrplx.io/about/";
                $description = "Awesome guy with an awesome website !";
            }else if($id_article = "admin"){
                $titre = "Admin";
                $image = "http://cbrplx.io/dist/images/share.jpg";
                $url = "http://cbrplx.io/";
                $description = "Awesome guy with an awesome website !";
            }else{
                //On charge l'article
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

        $contenu = $template->render(array(
        ));

        return $this->genererSquelette($contenu, true, "a_propos");
    }
}