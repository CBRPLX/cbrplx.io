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

    public function getInfoLatestVersion($nomExtension) {
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
        }
    }

    public static function getInfoLatestVersionJSON($nomExtension) {
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

            return json_encode($res);
        } else {
            return json_encode(array());
        }
    }

    public static function incrementDownloadLatestVersion($table) {
        global $pdo;

        $extension = new \classe\extension();
        $extension->getInfoLatestVersion($table);

        $sql = 'UPDATE extension.' . $table . '
                SET downloads = downloads + 1, dateLastDownload = ?
                WHERE id_extension = ?;';
        $stmt = $pdo->prepare($sql);

        $stmt->execute(array(
            time(),
            $extension->get('id_extension'),
        ));

        return ($stmt->rowCount() > 0);
    }
}