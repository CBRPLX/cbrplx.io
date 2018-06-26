<?php
namespace controller;

class userController {

	public function __construct () {
		
    }

    public function genererUserPage($id_user = null){
        global $twig;
        global $dev;
        global $refresh;
        $template = $twig->loadTemplate('user.html.twig');

        $user = new \classe\user();
        $user->load($id_user);

        $articles = $user->getArticles();

        $social = new \classe\social();
        $socials = $social->loadFromUser($user->get('id_user'));

        $user_id = $user->get('id_user');
        if(!empty($user_id)){
            // Si on est sur la page de l'utilisateur 1
            if ($user_id == 1) {
                $displayHeader = false;
            }

            $contenu = $template->render(array(
                'user' => $user,
                'articles' => $articles,
                'socials' => $socials,
                'refresh' => $refresh,
                'dev' => $dev
            ));

            $controller = new \controller\generalController();

            return $controller->genererSquelette($contenu, true, "index", false);
        }else{
            header('Location:/404/');
        }
    }
}