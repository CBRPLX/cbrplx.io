<?php
namespace classe;
// require_once ("/inc/php/config.php");

class social{

	private $id_social;
	private $nom_social;
	private $icone_social;
    private $ordre;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function load($id_social= null){
    	global $pdo;

        if(!empty($id_social)){
            $sql = "SELECT *
                    FROM cbrplx_io_social s
                    WHERE s.id_social = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_social));

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                foreach ($res as $k => $v) {
                    foreach ($v as $ka => $va) {
                        $this->$ka = $va;
                    }
                }
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public function loadAll(){
        global $pdo;

        $sql = "SELECT *
                FROM cbrplx_io_social s
                WHERE 1
                ORDER BY s.ordre";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array());

        if($stmt->rowCount() > 0){
            $array_social = array();
            $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            foreach ($res as $k => $v) {
                $social = new \classe\social();
                foreach ($v as $ka => $va) {
                    $social->$ka = $va;
                }
                array_push($array_social, $social);
            }
            return $array_social;
        }else{
            return false;
        }
    }

    public function loadFromUser($id_user = null){
        global $pdo;

        if(!empty($id_user)){
            $sql = "SELECT s.nom_social, s.icone_social, us.link
                    FROM cbrplx_io_social s, cbrplx_io_user_social us, cbrplx_io_user u
                    WHERE s.id_social = us.id_social
                    AND us.id_user = u.id_user
                    AND u.id_user = ?
                    ORDER BY s.ordre";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_user));

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                return $res;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}