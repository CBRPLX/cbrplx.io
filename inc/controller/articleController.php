<?php
namespace controller;

class articleController {

	public function __construct () {
		
    }

    public function genererArticle($id_article = null){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('article.html.twig');

        $article = new \classe\article();
        $article->load($id_article);

        if($article->get("projet") == "1"){

            $auteur = new \classe\user();
            $auteur->load($article->get('id_auteur'));

            $contribs = $article->getContributeurs();

            $contenu = $template->render(array(
                'article' => $article,
                'auteur' => $auteur,
                'contribs' => $contribs
            ));

            $controller = new \controller\generalController();

            return $controller->genererSquelette($contenu, true, $article);
        }else{
            header('Location:/404/');
        }
    }
}