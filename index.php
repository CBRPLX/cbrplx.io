<?php

require 'inc/php/config.php';

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/', 'index');

    $r->addRoute('GET', '/index.php', 'redir-index');

    $r->addRoute('GET', '/about/', 'about');

    $r->addRoute('GET', '/articles/{nom_article:.*}-{id_article:[0-9]+}', 'article');

    $r->addRoute('GET', '/users/{pseudo:.*}-{id_user:[0-9]+}', 'user');

    $r->addRoute('GET', '/recherche/{keywords:.*}', 'recherche');

    $r->addRoute('GET', '/admin/', 'admin');

    $r->addRoute('GET', '/preview/{nom_article:.*}-{id_article:[0-9]+}', 'preview');

    $r->addRoute('GET', '/403/', '403');

    $r->addRoute('GET', '/404/', '404');
});

// On récupère la methode HTTP et l'url
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// On enlève les paramètres après ? puis on décode l'url
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

//On envoie l'url au dispatcher
$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {

    // Si la route n'existe pas
    case FastRoute\Dispatcher::NOT_FOUND:
        header("Location:/404/");
        break;

    // Si la route est interdite
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        header("Location:/403/");
        break;

    // Si la route est bonne
    case FastRoute\Dispatcher::FOUND:
        // On récupère le nom de la route + ses paramètres
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];

        // On appelle les bonnes methodes en fonction de la route
        switch ($handler) {

            // Index
            case 'index':
                $pageController = new \controller\generalController();
                echo $pageController->genererIndex();
                break;

            // Redirection sur l'index
            case 'redir-index':
                header("Location:/");
                break;

            // About
            case 'about':
                $pageController = new \controller\generalController();
				echo $pageController->genererAPropos();
                break;

            // Article
            case 'article':
                $pageController = new \controller\articleController();
				echo $pageController->genererArticle($vars["id_article"]);
                break;

            // User
            case 'user':
                $pageController = new \controller\userController();
				echo $pageController->genererUserPage($vars["id_user"]);
                break;

            // Recherche
            case 'recherche':
                $pageController = new \controller\rechercheController();
				echo $pageController->genererRecherche($vars["keywords"]);
                break;

            // Admin
            case 'admin':
                $pageController = new \controller\adminController();

                // Si l'utilisateur est déjà connecté
				if(isset($_SESSION["user"]) && !empty($_SESSION["user"])){
					$contenu = $pageController->genererAdmin();
				}else{
					$contenu = $pageController->genererAdminConnexion();
				}
				echo $contenu;
                break;

            // Preview
            case 'preview':
                $pageController = new \controller\articleController();
				echo $pageController->genererArticle($vars["id_article"], true);
                break;

            // 403
            case '403':
                $pageController = new \controller\generalController();
				echo $pageController->generer403();
                break;

            // 404
            case '404':
                $pageController = new \controller\generalController();
				echo $pageController->generer404();
                break;
        }

        break;
}