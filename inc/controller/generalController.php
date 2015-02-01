<?php
namespace controller;

class generalController {

	public function __construct () {
		
    }

    public function genererSquelette($contenu, $meta = false){
    	global $twig;
    	global $dev;

        if(!$meta){
    	   $template = $twig->loadTemplate('squelette.html.twig');
        }else{
            $template = $twig->loadTemplate('meta.html.twig');
        }

    	return $template->render(array(
    		"CONTENU" => $contenu,
    		"DEV" => $dev,
            "TIME" => time()
    	));
    }

    public function genererAPropos(){
        global $twig;
        global $dev;
        $template = $twig->loadTemplate('a_propos.html.twig');

        return $template->render(array(
        ));
    }
}