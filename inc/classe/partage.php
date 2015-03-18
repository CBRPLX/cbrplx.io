<?php
namespace classe;
// require_once ("/inc/php/config.php");

class partage{

	private $id_partage_article;
	private $id_article;
	private $facebook;
    private $twitter;
    private $google;
    private $pinterest;
    private $last_partage;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function load($id_article = null){
    	global $pdo;

        if(!empty($id_article)){
            $sql = "SELECT *
                    FROM cbrplx_io_partage_article pa
                    WHERE pa.id_article = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_article));

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

    public function add($plateforme, $id_article){
        global $pdo;

        $p = new \classe\partage();

        if($p->load($id_article)){
            $sql = "UPDATE SET ? = ? WHERE id_article = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($plateforme, $p->get($plateforme)+1, $id_article));
            if($stmt->rowCount() > 0){
                return true;
            }else{
                return false;
            }
        }else{
            $sql = "INSERT INTO cbrplx_io_partage_article(id_article,?) VALUES (?,1)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($plateforme, $id_article));
            if($stmt->rowCount() > 0){
                return true;
            }else{
                return false;
            }
        }
    }
}