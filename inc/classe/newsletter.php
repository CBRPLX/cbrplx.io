<?php
namespace classe;

class newsletter{

	private $id_newsletter;
	private $nom;
	private $email;
	private $date_inscription;

	public function __construct () {
		
    }

    public function get($attr){
    	return $this->$attr;
    }

    public function set($attr, $value){
    	$this->$attr = $value;
    }

    public function add($nom, $email){
        global $pdo;

        $sql = "SELECT * FROM cbrplx_io_newsletter WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($email));

        if($stmt->rowCount() == 0){
            $sql = "INSERT INTO cbrplx_io_newsletter (nom, email, date_inscription) 
                    VALUES (?,?,?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($nom, $email, time()));
            if($stmt->rowCount() > 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}