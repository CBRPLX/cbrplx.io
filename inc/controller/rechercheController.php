<?php
namespace controller;

class rechercheController {

	public function __construct () {
		
    }

    public function genererRecherche($keywords){
        global $twig;
        global $dev;
        
        $template = $twig->loadTemplate('recherche.html.twig');

        // $article = new \classe\article();
        // $article->load($id_article);

        $articles = \classe\article::recherche($keywords);
        // var_dump($articles);

        $contenu = $template->render(array(
            'keywords' => $keywords,
            'refresh' => $refresh,
            'dev' => $dev
        ));

        $controller = new \controller\generalController();

        return $controller->genererSquelette($contenu, true);
    }
}