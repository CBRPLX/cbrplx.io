<?php
namespace classe;
// require_once ("/inc/php/config.php");

class techno{

	private $id_techno_article;
	private $id_article;
	private $id_techno;
    private $nom_techno;
    private $nom_type_techno;

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
            $sql = "SELECT ta.id_techno_article, ta.id_article, ta.id_techno, tt.nom_type_techno, t.nom_techno
                    FROM cbrplx_io_techno_article ta, cbrplx_io_techno t, cbrplx_io_type_techno tt
                    WHERE ta.id_article = ?
                    AND ta.id_techno = t.id_techno
                    AND t.id_type_techno = tt.id_type_techno
                    ORDER BY t.id_type_techno ASC, t.nom_techno ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($id_article));

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $techno = array();
                foreach ($res as $k => $v) {
                    $a = new \classe\techno();
                    foreach ($v as $ka => $va) {
                        $a->$ka = $va;
                    }
                    array_push($techno, $a);
                }
                return $techno;
            }else{
                return false;
            }
        }else{
            $sql = "SELECT t.*, tt.nom_type_techno FROM cbrplx_io_techno t, cbrplx_io_type_techno tt 
                    WHERE t.id_type_techno = tt.id_type_techno ORDER BY t.id_type_techno ASC, t.nom_techno ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            if($stmt->rowCount() > 0){
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $techno = array();
                foreach ($res as $k => $v) {
                    $a = new \classe\techno();
                    foreach ($v as $ka => $va) {
                        $a->$ka = $va;
                    }
                    array_push($techno, $a);
                }
                return $techno;
            }else{
                return false;
            }
        }
    }

    public function delFromArticle($id_article){
        global $pdo;

        $sql = "DELETE from cbrplx_io_techno_article WHERE id_article = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($id_article));
    }

    public function add($ids_technos, $id_article){
        global $pdo;

        $this->delFromArticle($id_article);

        $sql = "INSERT INTO cbrplx_io_techno_article(id_article, id_techno) VALUES ";
        $i = 0;
        foreach ($ids_technos as $k => $v) {
            if($i > 0) $sql .= ",";
            $sql .= "('".$id_article."','".$v."') ";
            $i++;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        if($stmt->rowCount() > 0){
            return true;
        }else{
            return false;
        }
    }
}