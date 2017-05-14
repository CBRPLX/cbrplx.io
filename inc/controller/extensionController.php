<?php
namespace controller;

class extensionController {

	public function __construct () {
		
    }

    public function genererExtension($nomExtension, $version) {
        $increment = \classe\extension::incrementDownload($nomExtension, $version);

        if ($increment) {
            header('Location:/dist/extensions/' . $nomExtension . '-' . $version . '.crx');
        }
    }

    public function genererExtensionDownloadPage($nomExtension) {
    	global $twig;

        $contenu = '';

        switch ($nomExtension) {
        	case 'hdStreamLiberator':
        		header('Location:/extension/videoUnlocker');
        		break;

        	case 'videoUnlocker':
        		$template = $twig->loadTemplate($nomExtension . '.html.twig');
        		break;
        	
        	default:
        		header('Location:/404/');
        		break;
        }

        $extensionInfo = new \classe\extension();
        $extensionInfo->getInfoLatestVersion($nomExtension);

        $imageInfos = getimagesize('https://cbrplx.io/dist/images/' . $nomExtension . '/banner.jpg');
        $htmlImageInfos = array(
            'mime' => $imageInfos['mime'],
            'width' => $imageInfos[0],
            'height' => $imageInfos[1],
        );

        $contenu = $template->render(array(
            'extensionInfo' => $extensionInfo,
            'extensionName' => $nomExtension,
            'htmlImageInfos' => $htmlImageInfos,
        ));

        return $contenu;
    }
}