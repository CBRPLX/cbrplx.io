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

    public function getProjets(){
        global $pdo;

        $sql = "SELECT id_article, titre, date_publication FROM cbrplx_io_article WHERE projet = ? AND online = ? ORDER BY date_publication DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array('1', '1'));

        if($stmt->rowCount() > 0){
            $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            $projets = array();
            foreach ($res as $k => $v) {
                $a = new \classe\article();
                foreach ($v as $ka => $va) {
                    $a->$ka = $va;
                }
                $a->days_ago = $a->daysAgo($a->date_publication);
                $a->date = strftime("%d %B %Y", $a->date_publication);
                array_push($projets, $a);
            }
            return $projets;
        }else{
            return false;
        }
    }

    public function daysAgo($time){
        $time_tmp = new \DateTime();
        $time_tmp->setTimestamp($time);

        $today = new \DateTime();
        $today->setTimestamp(time());

        $interval = $today->diff($time_tmp);

        $days_ago = "";
        if($interval->y > 0){
            if($interval->y == 1){
                $days_ago .= $interval->y." an";
            }else{
                $days_ago .= $interval->y." ans";
            }

            if($interval->m > 0){
                $days_ago .= " & ".$interval->m." mois";
            }
        }elseif($interval->m > 0){
            $days_ago .= $interval->m." mois";

            if($interval->d > 0){
                if($interval->d == 1){
                    $days_ago .= " & ".$interval->d." jour";
                }else{
                    $days_ago .= " & ".$interval->d." jours";
                }
            }
        }elseif($interval->d > 0){
            if($interval->d == 1){
                $days_ago .= $interval->d." jour";
            }else{
                $days_ago .= $interval->d." jours";
            }

            if($interval->h > 0){
                if($interval->h == 1){
                    $days_ago .= " & ".$interval->h." heure";
                }else{
                    $days_ago .= " & ".$interval->h." heures";
                }
            }
        }elseif($interval->h > 0){
            if($interval->h == 1){
                $days_ago .= $interval->h." heure";
            }else{
                $days_ago .= $interval->h." heures";
            }

            if($interval->m > 0){
                if($interval->m > 0){
                    $days_ago .= " & ".$interval->m." minute";
                }else{
                    $days_ago .= " & ".$interval->m." minutes";
                }
            }
        }else{
            if($interval->m > 0){
                $days_ago .= $interval->m." minute";
            }else{
                $days_ago .= $interval->m." minutes";
            }
        }

        return $days_ago;
    }

    public function getCouverture(){
        $glob_couv = glob("assets/".$this->id_article."/".$this->id_article.".*");
        $couverture = "dist/images/default.jpg";
        if(count($glob_couv) > 0){
            $couverture = $glob_couv[0];
        }
        return $couverture;
    }

    public function getUrl(){
        return preg_replace("@ @", "-", strtolower($this->titre))."-".$this->id_article;
    }
}