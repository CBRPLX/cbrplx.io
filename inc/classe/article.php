<?php
namespace classe;
// require_once ("/inc/php/config.php");

class article{

	private $id_article;
	private $titre;
	private $id_auteur;
    private $date_publication;
    private $date_modif;
    private $description;
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

    public function load($id_article = null, $last = null, $admin = null){
    	global $pdo;

        if(!empty($id_article)){
            $sql = "SELECT * FROM cbrplx_io_article WHERE id_article = ?";

            if(!empty($last))
                $sql = "SELECT * FROM cbrplx_io_article WHERE online = ? AND id_article < ? 
                        ORDER BY date_publication DESC LIMIT 0,1";

            $stmt = $pdo->prepare($sql);
            if($last){
                $stmt->execute(array("1", $id_article));
            }else{
                $stmt->execute(array($id_article));
            }
            
            if($stmt->rowCount() > 0){
                $res = $stmt->fetch(\PDO::FETCH_ASSOC);
                foreach ($res as $k => $v) {
                    if($k == "ids_contributeurs")
                        $v = explode(";", $v);
                    $this->$k = $v;
                }
                $this->days_ago = $this->daysAgo($this->date_publication);
                $this->date = strftime("%d %B %Y", $this->date_publication);
                if(empty($admin))
                    $this->text = preg_replace('@\[<\]@', '&lt;', $this->text);
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
                    $a->days_ago = $a->daysAgo($a->date_publication);
                    $a->date = strftime("%d %B %Y", $a->date_publication);
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

        //On enlève les technos qui seront traitées par une autre requete
        if(isset($params["technos"])){
            $technos = $params["technos"];
            unset($params["technos"]);
            if(!empty($technos)){
                $techno = new \classe\techno();
                $techno->add($technos, $id_article);
            }
        }

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
        // var_dump($params);
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

        $technos = new \classe\techno();
        $technos->delFromArticle($article->id_article);

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

        $sql = "SELECT id_article, titre, date_publication FROM cbrplx_io_article WHERE projet = ? 
                AND online = ? AND id_auteur = ? ORDER BY date_publication DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array('1', '1', '1'));

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

            // if($interval->m > 0){
            //     $days_ago .= " & ".$interval->m." mois";
            // }
        }elseif($interval->m > 0){
            $days_ago .= $interval->m." mois";

            // if($interval->d > 0){
            //     if($interval->d == 1){
            //         $days_ago .= " & ".$interval->d." jour";
            //     }else{
            //         $days_ago .= " & ".$interval->d." jours";
            //     }
            // }
        }elseif($interval->d > 0){
            if($interval->d == 1){
                $days_ago .= $interval->d." jour";
            }else{
                $days_ago .= $interval->d." jours";
            }

            if($interval->h > 12){
                $days_ago = ($interval->d+1)." jours";
                // if($interval->h == 1){
                //     $days_ago .= " & ".$interval->h." heure";
                // }else{
                //     $days_ago .= " & ".$interval->h." heures";
                // }
            }
        }elseif($interval->h > 0){
            if($interval->h == 1){
                $days_ago .= $interval->h." heure";
            }else{
                $days_ago .= $interval->h." heures";
            }

            if($interval->i > 30){
                $days_ago = ($interval->h+1)." heures";
                // if($interval->i == 1){
                //     $days_ago .= " & ".$interval->i." minute";
                // }else{
                //     $days_ago .= " & ".$interval->i." minutes";
                // }
            }
        }else{
            if($interval->i > 0){
                if($interval->i == 1){
                    $days_ago .= $interval->i." minute";
                }else{
                    $days_ago .= $interval->i." minutes";
                }
            }
        }
        return "IL Y A ".$days_ago;
    }

    public function getCouverture(){
        $glob_couv = glob("assets/".$this->id_article."/".$this->id_article.".*");
        $couverture = "assets/0/0.jpg";
        if(count($glob_couv) > 0){
            $couverture = $glob_couv[0];
        }
        return $couverture;
    }

    public function getUrl(){
        $url = preg_replace("@ @", "-", strtolower($this->titre))."-".$this->id_article;
        $url = preg_replace("@&@", "et", $url);
        $url = preg_replace("@é@", "e", $url);
        return $url;
    }

    public function getContributeurs(){
        $contrib = array();
        $this->ids_contributeurs = array_reverse($this->ids_contributeurs);
        foreach ($this->ids_contributeurs as $k => $v) {
            if(!empty($v)){
                $c = new \classe\user();
                $c->load($v);
                array_push($contrib, $c);
            }
        }
        return $contrib;
    }

    public function oneMoreView(){
        global $pdo;

        if(!isset($_GET["preview"])){

            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
            }

            $sql = "INSERT INTO cbrplx_io_article_view (id_article, timestamp, ip) 
                    VALUES (?,?,?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($this->id_article, time(), $ip));
        }
    }

    public function getNbViews(){
        global $pdo;

        $sql = "SELECT COUNT(id_article_view) as nb_views FROM cbrplx_io_article_view WHERE id_article = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($this->id_article));

        $nb_views = 0;
        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_OBJ);
            $nb_views = $res->nb_views;
        }

        return $nb_views;
    }

    public function getIdsTechnos(){
        $techno = new \classe\techno();
        $technos = $techno->load($this->id_article);
        $ids = array();
        foreach ($technos as $k => $v) {
            array_push($ids, $v->get("id_techno"));
        }

        return $ids;
    }

    public function getBefore(){
        global $pdo;

        $sql = "SELECT id_article, titre FROM cbrplx_io_article 
                WHERE date_publication < ? AND online = ?
                ORDER BY ABS( date_publication - ? ) LIMIT 0,1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($this->date_publication, "1", $this->date_publication));
        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            $retour = new \classe\article();
            foreach ($res as $k => $v) {
                $retour->$k = $v;
            }
            return $retour;
        }else{
            return false;
        }
    }

    public function getAfter(){
        global $pdo;

        $sql = "SELECT id_article, titre FROM cbrplx_io_article 
                WHERE date_publication > ? AND online = ?
                ORDER BY ABS( date_publication - ? ) LIMIT 0,1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($this->date_publication, "1", $this->date_publication));
        if($stmt->rowCount() > 0){
            $res = $stmt->fetch(\PDO::FETCH_ASSOC);
            $retour = new \classe\article();
            foreach ($res as $k => $v) {
                $retour->$k = $v;
            }
            return $retour;
        }else{
            return false;
        }
    }

    public static function recherche($keywords){
        global $pdo;

        $keywords = explode(' ', $keywords);

        $sql = "SELECT a.id_article, a.titre FROM cbrplx_io_article a";
        $params = array();
        foreach ($keywords as $k => $v) {
            if($k == 0){
                $sql .= " WHERE (a.titre LIKE ? OR a.text LIKE ?)";
            }else{
                $sql .= " AND (a.titre LIKE ? OR a.text LIKE ?)";
            }
            array_push($params, '%'.$v.'%');
            array_push($params, '%'.$v.'%');
        }
        $sql .= " ORDER BY a.id_article DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if($stmt->rowCount() > 0){
            $res = $stmt->fetchAll(\PDO::FETCH_OBJ);
            var_dump($res);
            // $retour = new \classe\article();
            // foreach ($res as $k => $v) {
            //     $retour->$k = $v;
            // }
            // return $retour;
        }
    }
}