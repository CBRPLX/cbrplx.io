<?php

require 'inc/php/config.php';

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/', 'index');

    $r->addRoute('GET', '/index.php', 'redir-index');
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
        echo "404";
        break;

    // Si la route est interdite
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        echo "405";
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
        }

        break;
}