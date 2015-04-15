<?php
namespace classe;
// require_once ("/inc/php/config.php");

class recherche{

	private $id_recherche;
	private $keyword;
	private $timestamp;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function add($keywords){
        global $pdo;

        $keywords = strtolower($keywords);
        $keywords = explode(" ", $keywords);

        foreach ($keywords as $k => $v) {
            $sql = "INSERT INTO cbrplx_io_search (keyword, timestamp) 
                    VALUES (?,?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($v, time()));
        }
    }
}