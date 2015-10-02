<?php

	// PHP google_sitemap Generator

	require "inc/php/config.php";

	// these day may be retrieved from DB
	$articles = new \classe\article();
	$articles = $articles->load();

	$cats = array();
	foreach ($articles as $k => $v) {

		if($v->get('online') == "1"){
			array_push($cats, array(
				"loc" => "http://cbrplx.io/articles/".preg_replace("@&@", "et", $v->getUrl()),
				"changefreq" => "monthly",
				"priority" => "0.8"
			));
		}
	}

	$cats[] = array(
						"loc" => "http://cbrplx.io/",
						"changefreq" => "monthly",
						"priority" => "1"
					);

	$cats[] = array(
						"loc" => "http://cbrplx.io/about/",
						"changefreq" => "monthly",
						"priority" => "1"
					);

	$site_map_container = new \classe\googleSitemap();

	for ( $i=0; $i < count( $cats ); $i++ )
	{
		$value = $cats[ $i ];

		$site_map_item = new \classe\googleSitemapItem( $value[ 'loc' ], "", $value[ 'changefreq' ], $value["priority"] );

		$site_map_container->add_item( $site_map_item );
	}

	header( "Content-type: application/xml; charset=\"".$site_map_container->charset . "\"", true );
	header( 'Pragma: no-cache' );

	$xml = $site_map_container->build();

	var_dump(file_put_contents("sitemap.xml", $xml));

?>