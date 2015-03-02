<?php

namespace classe;

class googleSitemap
{
  var $header = "<\x3Fxml version=\"1.0\" encoding=\"UTF-8\"\x3F>\n\t<urlset xmlns=\"http://www.google.com/schemas/sitemap/0.84\">";
  var $charset = "UTF-8";
  var $footer = "\t</urlset>\n";
  var $items = array();

  /** Adds a new item to the channel contents.
   *@param google_sitemap item $new_item
   *@access public
   */
  function add_item($new_item){
    //Make sure $new_item is an 'google_sitemap item' object
    if(!is_a($new_item, "\classe\googleSitemapItem")){
      //Stop execution with an error message
      trigger_error("Can't add a non-google_sitemap_item object to the sitemap items array");
    }
    $this->items[] = $new_item;
  }

  /** Generates the sitemap XML data based on object properties.
   *@param string $file_name ( optional ) if file name is supplied the XML data is saved in it otherwise returned as a string.
   *@access public
   *@return [void|string]
   */
  function build( $file_name = null )
  {
    $map = $this->header . "\n";

    foreach($this->items as $item)
    {
		$item->loc = $item->loc;
      $map .= "\t\t<url>\n\t\t\t<loc>$item->loc</loc>\n";

	  // lastmod
      if ( !empty( $item->lastmod ) )
      	$map .= "\t\t\t<lastmod>$item->lastmod</lastmod>\n";

	  // changefreq
      if ( !empty( $item->changefreq ) )
      	$map .= "\t\t\t<changefreq>$item->changefreq</changefreq>\n";

	  // priority
      if ( !empty( $item->priority ) )
      	$map .= "\t\t\t<priority>$item->priority</priority>\n";

      $map .= "\t\t</url>\n\n";
    }

    $map .= $this->footer . "\n";

    if(!is_null($file_name)){
      $fh = fopen($file_name, 'w');
      fwrite($fh, $map);
      fclose($fh);
    }else{
      return $map;
    }
  }

}

?>