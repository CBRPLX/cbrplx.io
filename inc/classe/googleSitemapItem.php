<?php
namespace classe;

class googleSitemapItem
{
  /** Assigns constructor parameters to their corresponding object properties.
   *@access public
   *@param string $loc location
   *@param string $lastmod date (optional) format in YYYY-MM-DD or in "ISO 8601" format
   *@param string $changefreq (optional)( always,hourly,daily,weekly,monthly,yearly,never )
   *@param string $priority (optional) current link's priority ( 0.0-1.0 )
   */
  function __construct( $loc, $lastmod = '', $changefreq = '', $priority = '' )
  {
    $this->loc = $loc;
    $this->lastmod = $lastmod;
    $this->changefreq = $changefreq;
    $this->priority = $priority;
  }
}