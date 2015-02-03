<?php
namespace classe;
// require_once ("/inc/php/config.php");

class article{

	private $id_article;
	private $titre;
	private $id_auteur;
    private $date_publication;
    private $date_modif;
	private $text;
	private $projet;
	private $online;
    private $tags;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function load($id_article){
    	global $pdo;

        $sql = "SELECT * FROM cbrplx_io_article WHERE id_article = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($id_article));

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

    public function add(){
        global $pdo;

        $sql = "INSERT INTO cbrplx_io_article (date_publication, date_modif) 
                VALUES (?,?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array(time(), time()));
        if($stmt->rowCount() > 0){
            return $pdo->lastInsertId();
        }else{
            return false;
        }
    }

    public function save($id_article, $params){
        global $pdo;
        // var_dump($params);
        $sql = "UPDATE cbrplx_io_article SET ";
        $i = 0;
        $tab = array();
        if(isset($params["collegue"])){
            $collegue = $params["collegue"];
            unset($params["collegue"]);
        }
        foreach ($params as $k => $v) {
            if($i > 0) $sql .= ", ";
            $sql .= "`".$k."` = ?";
            array_push($tab, $v);
            $i++;
        }
        $sql .= ", `date_modif` = ? ";
        $sql .= "WHERE `id_article` = ?";
        // return $sql;
        array_push($tab, time());
        array_push($tab, $id_article);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($tab);
        // var_dump($stmt);

        if($stmt->rowCount() > 0){
            return true;
        }else{
            return false;
        }
    }
}