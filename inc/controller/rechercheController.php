<?php
namespace controller;

class rechercheController {

	public function __construct () {
		
    }

    public function genererRecherche($keywords){
        global $twig;
        global $dev;
        global $refresh;
        
        $template = $twig->loadTemplate('recherche.html.twig');

        $articles = \classe\article::recherche($keywords);

        $contenu = $template->render(array(
            'keywords' => $keywords,
            'refresh' => $refresh,
            'dev' => $dev,
            'articles' => $articles
        ));

        $controller = new \controller\generalController();

        return $controller->genererSquelette($contenu, true, "index");
    }
}