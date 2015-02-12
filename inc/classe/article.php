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
    private $ids_contributeurs;
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

    public function load($id_article = null){
    	global $pdo;

        if(!empty($id_article)){
            $sql = "SELECT * FROM cbrplx_io_article WHERE id_article = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_article));

            if($stmt->rowCount() > 0){
                $res = $stmt->fetch(\PDO::FETCH_ASSOC);
                foreach ($res as $k => $v) {
                    if($k == "ids_contributeurs")
                        $v = explode(";", $v);
                    $this->$k = $v;
                }
                return true;
            }else{
                return false;
            }
        }else{
            $sql = "SELECT * FROM cbrplx_io_article ORDER BY date_publication DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $article = array();
                foreach ($res as $k => $v) {
                    $a = new \classe\article();
                    foreach ($v as $ka => $va) {
                        if($ka == "ids_contributeurs")
                            $va = explode(";", $va);
                        $a->$ka = $va;
                    }
                    array_push($article, $a);
                }
                return $article;
            }else{
                return false;
            }
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
            $collegue = implode(";", $collegue);
            $params["ids_contributeurs"] = ";".$collegue.";";
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

    public function del(){
        global $pdo;

        $sql = "DELETE FROM cbrplx_io.cbrplx_io_article WHERE cbrplx_io_article.id_article = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($this->id_article));

        if($stmt->rowCount() > 0){
            $dir = "assets/".$this->id_article;
            if(is_dir($dir)){
                $it = new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS);
                $files = new \RecursiveIteratorIterator($it,
                             \RecursiveIteratorIterator::CHILD_FIRST);
                foreach($files as $file) {
                    if ($file->isDir()){
                        rmdir($file->getRealPath());
                    } else {
                        unlink($file->getRealPath());
                    }
                }
                rmdir($dir);
            }
            return true;
        }else{
            return false;
        }
    }
}