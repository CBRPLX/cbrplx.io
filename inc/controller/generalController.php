<?php
namespace controller;

class generalController {

	public function __construct () {
		
    }

    public function genererSquelette($contenu){
    	global $twig;
    	global $dev;
    	$template = $twig->loadTemplate('squelette.html.twig');

    	return $template->render(array(
    		"CONTENU" => $contenu,
    		"DEV" => $dev,
            "TIME" => time()
    	));
    }
}