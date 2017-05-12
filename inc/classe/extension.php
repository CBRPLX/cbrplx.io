<?php
namespace classe;
// require_once ("/inc/php/config.php");

class extension{

	private $id_extension;
	private $version;
	private $link;
    private $downloads;
    private $date_creation;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function load($idExtention){
    }

    public static function incrementDownload($table, $version) {
        global $pdo;

        $sql = 'UPDATE ? 
                SET downloads = downloads + 1
                WHERE version = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array(
            $table,
            $version,
        ));

        return ($stmt->rowCount() > 0);
    }
}