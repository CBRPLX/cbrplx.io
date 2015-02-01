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

    public function load($id_user){
    	global $pdo;

        $sql = "SELECT * FROM cbrplx_io_user WHERE id_user = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($id_user));

        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            foreach ($res as $k => $v) {
                $this->$k = $v;
            }
            return true;
        }else{
            return false;
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
}