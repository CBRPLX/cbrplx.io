<?php
namespace controller;

class adminController {

	public function __construct () {
		
    }

    public function genererAdmin($squelette = true){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('admin.html.twig');

        $contenu = $template->render(array());

        $generalController = new \controller\generalController();
        if($squelette){
            return $generalController->genererSquelette($contenu, true, "admin");
        }else{
            return $contenu;
        }
    }

    public function genererAdminConnexion(){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('admin_connexion.html.twig');

        $contenu = $template->render(array());

        $generalController = new \controller\generalController();
        return $generalController->genererSquelette($contenu, true, "admin");
    }

    public function genererOnglet($name, $id = null){
        $code = "";
        switch ($name) {
            case 'add_article':
                $code = $this->genererAddArticle();
                break;
            case 'list_article':
                $code = $this->genererListArticle();
                break;
            case 'modify_article':
                $code = $this->genererModifyArticle($id);
                break;
            
            default:
                $code = $this->genererAddArticle();
                break;
        }

        return $code;
    }

    public function genererAddArticle(){
        global $twig;
        global $dev;

        $template = $twig->loadTemplate('add_article.html.twig');

        $contenu = $template->render(array());
        return $contenu;
    }

    public function genererListArticle(){
        global $twig;
        global $dev;

        $template = $twig->loadTemplate('list_article.html.twig');

        $articles = new \classe\article();
        $articles = $articles->load();

        $contenu = $template->render(array('articles' => $articles));
        return $contenu;
    }

    public function genererModifyArticle($id){
        global $twig;
        global $dev;

        $template = $twig->loadTemplate('modify_article.html.twig');

        $article = new \classe\article();
        $article->load($id);

        $couverture = false;
        $glob_couv = glob("assets/".$id."/".$id.".*");
        if(count($glob_couv) > 0){
            $couverture = $glob_couv[0];
        }

        $glob_photos = glob("assets/".$id."/".$id."_*.*");
        $all_photos = array();
        $i = 0;
        $photos = array();

        foreach ($glob_photos as $k => $v) {
            if($i < 3){ //Si on n'a pas besoin de créer une ligne
                array_push($photos, $v);
                $i++;
            }else{ //Si on a besoin de créer une nouvelle ligne
                array_push($all_photos, $photos);
                $photos = array();
                array_push($photos, $v);
                $i = 1;
            }
        }

        while ($i < 3) {
            array_push($photos, "");
            $i++;
        }
        array_push($all_photos, $photos);

        $contenu = $template->render(array(
            'article' => $article, 
            'couverture' => $couverture,
            'all_photos' => $all_photos
        ));
        return $contenu;
    }
}