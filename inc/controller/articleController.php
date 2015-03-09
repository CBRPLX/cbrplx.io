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

        if($article->get("online") == "1"){

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

            $root = false;

            $before = $article->getBefore();
            $after = $article->getAfter();

            $contenu = $template->render(array(
                'article' => $article,
                'auteur' => $auteur,
                'contribs' => $contribs,
                'tri_technos' => $tri_technos,
                'root' => $root,
                'before' => $before,
                'after' => $after
            ));

            $controller = new \controller\generalController();

            return $controller->genererSquelette($contenu, true, $article);
        }else{
            header('Location:/404/');
        }
    }
}