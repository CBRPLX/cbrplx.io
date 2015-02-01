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
}