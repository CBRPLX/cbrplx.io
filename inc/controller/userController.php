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
            $contenu = $template->render(array(
                'user' => $user,
                'articles' => $articles,
                'socials' => $socials,
                // 'contribs' => $contribs,
                // 'tri_technos' => $tri_technos,
                // 'root' => $root,
                // 'before' => $before,
                // 'after' => $after,
                'refresh' => $refresh,
                'dev' => $dev
            ));

            $controller = new \controller\generalController();

            return $controller->genererSquelette($contenu, true, "index");
        }else{
            header('Location:/404/');
        }
    }
}