<?php
namespace classe;

class user{

	private $id_user;
	private $login;
	private $password;
	private $nom;
	private $prenom;
	private $email;
	private $date_inscription;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function load($id_user = null){
    	global $pdo;

        if(!empty($id_article)){
            $sql = "SELECT * FROM cbrplx_io_user WHERE id_user = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_user));

            if($stmt->rowCount() > 0){
                $res = $stmt->fetch(\PDO::FETCH_ASSOC);
                foreach ($res as $k => $v) {
                    $this->$k = $v;
                }
                $img = glob("assets/users/".$this->id_user.".*");
                if(count($img) > 0){
                    $this->img = $img[0];
                }else{
                    $this->img = "assets/users/default.jpg";
                }
                return true;
            }else{
                return false;
            }
        }else{
            $sql = "SELECT * FROM cbrplx_io_user ORDER BY date_inscription ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $users = array();
                foreach ($res as $k => $v) {
                    $a = new \classe\user();
                    foreach ($v as $ka => $va) {
                        $a->$ka = $va;
                    }
                    $img = glob("assets/users/".$a->id_user.".*");
                    if(count($img) > 0){
                        $a->img = $img[0];
                    }else{
                        $a->img = "assets/users/default.jpg";
                    }
                    $a->getNbPost();
                    $a->getNbContrib();
                    array_push($users, $a);
                }
                return $users;
            }else{
                return false;
            }
        }
    }

    public function connexion($login, $mdp){
        global $pdo;

        $sql = "SELECT id_user FROM cbrplx_io_user WHERE login = ? AND password = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array(
            $login,
            sha1(md5($mdp))
        ));

        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            $this->load($res["id_user"]);
            return true;
        }else{
            return false;
        }
    }

    public function getNbPost(){
        global $pdo;

        $sql = "SELECT count(id_article) as nb_post FROM cbrplx_io_article WHERE id_auteur = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($this->id_user));

        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            $this->nb_post = $res["nb_post"];
            return true;
        }else{
            return false;
        }
    }

    public function getNbContrib(){
        global $pdo;

        $sql = "SELECT count(id_article) as nb_contrib FROM cbrplx_io_article WHERE ids_contributeurs LIKE ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array('%;'.$this->id_user.';%'));

        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            $this->nb_contrib = $res["nb_contrib"];
            return true;
        }else{
            return false;
        }
    }
}