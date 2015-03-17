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
                $pageController = new \controller\emailController();
                $contenu = $pageController->genererInscriptionNews($_POST["nom"]);
                
                $destinataire = ucfirst(strtolower($_POST["nom"]))." <".$_POST["email"].">";
                $pageController->envoyerEmail($destinataire, "Inscription à la newsletter cbrplx.io", $contenu);

                $contenu = $pageController->genererNouvelleInscription($_POST["nom"], $_POST["email"]);
                $pageController->envoyerEmail('cbrplx.io <robin.pierrot@gmail.com>', "Nouvelle inscription à la newsletter cbrplx.io", $contenu);

                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
}