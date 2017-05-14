<?php
namespace classe;
// require_once ("/inc/php/config.php");

class extension{

	private $id_extension;
	private $name;
    private $version;
    private $description;
	private $link;
    private $googleWebStoreId;
    private $googleWebStoreLink;
    private $downloads;
    private $datelastDownload;
    private $dateCreation;

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

    public function getInfoLastestVersion($nomExtension) {
        global $pdo;

        $sql = 'SELECT e.*
                FROM extension.' . $nomExtension . ' e
                WHERE 1
                ORDER BY e.version DESC
                LIMIT 0, 1;';
        $stmt = $pdo->prepare($sql);

        $stmt->execute();

        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);

            foreach ($res as $k => $v) {
                $this->set($k, $v);
            }

            return $obj;
        } else {
            return false;
        }
    }

    public static function incrementDownload($table, $version) {
        global $pdo;

        $sql = 'UPDATE extension.' . $table . '
                SET downloads = downloads + 1, dateLastDownload = ?
                WHERE version = ?';
        $stmt = $pdo->prepare($sql);

        $stmt->execute(array(
            time(),
            $version,
        ));

        return ($stmt->rowCount() > 0);
    }
}