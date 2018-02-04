<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>XML Video Sitemap</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<style type="text/css">
			body {
				font-family: Helvetica, Arial, sans-serif;
				font-size: 13px;
				color: #545353;
			}
			a img {
				border: none;
			}
			table {
				border: none;
				border-collapse: collapse;
			}
			#sitemap tr.odd {
				background-color: #eee;
			}
			#sitemap tbody tr:hover {
				background-color: #ccc;
			}
			#sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
				color: #000;
			}
			#content {
				margin: 0 auto;
				width: 1000px;
			}
			p.expl {
				margin: 10px 3px;
				line-height: 1.3em;
			}
			p.expl a {
				color: #da3114;
				font-weight: bold;
			}
			a {
				color: #000;
				text-decoration: none;
			}
			a:visited {
				color: #777;
			}
			a:hover {
				text-decoration: underline;
			}
			td {
				font-size:11px;
				padding: 5px 15px 5px 0;
				vertical-align: top;
			}
			td img {
				padding: 0 5px;
			}
			th {
				text-align:left;
				padding-right:30px;
				font-size:11px;
			}
			thead th {
				border-bottom: 1px solid #000;
				cursor: pointer;
			}
		</style>
	</head>
	<body>
		<div id="content">
			<h1>XML Video Sitemap</h1>
			<p class="expl">
				this is an XML Video Sitemap, meant for consumption by Search Engines.
			</p>
			<p class="expl">
				You can find more information about XML Video sitemaps <a href="http://www.google.com/support/webmasters/bin/answer.py?hl=en&amp;answer=80472">here</a>.
			</p>
			<p class="expl">
				This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
			</p>			
			<div id="content">
				<table id="sitemap">
				<thead>
					<tr>
						<th width="10%">Video</th>
						<th width="25%">Post / Page</th>
						<th width="30%">Description</th>
						<th width="20%">Tags</th>
						<th width="15%">Pub Date</th>
					</tr>
				</thead>
				<tbody>
					<xsl:for-each select="sitemap:urlset/sitemap:url">
						<tr>
							<xsl:if test="position() mod 2 = 1">
								<xsl:attribute name="class">odd</xsl:attribute>
							</xsl:if>

							<td>
								<xsl:variable name="thumbURL">
									<xsl:value-of select="video:video/video:thumbnail_loc"/>
								</xsl:variable>
								
								<xsl:variable name="flvURL">
									<xsl:value-of select="video:video/video:player_loc"/>
								</xsl:variable>
								
								<a href="{$flvURL}"><img src="{$thumbURL}" width="80" height="60" /></a>
							</td>
							
							<td>
								<xsl:variable name="itemURL">
									<xsl:value-of select="sitemap:loc"/>
								</xsl:variable>
								<a href="{$itemURL}">
									<strong><xsl:value-of select="video:video/video:title"/></strong>
								</a>
							</td>

							<td>
								<xsl:variable name="desc">
									<xsl:value-of select="video:video/video:description"/>
								</xsl:variable>      
								<xsl:choose>
									<xsl:when test="string-length($desc) &lt; 200">
										<xsl:value-of select="$desc"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat(substring($desc,1,200),' ...')"/>
									</xsl:otherwise>
								</xsl:choose>
							</td>

							<td>
								<xsl:for-each select="video:video/video:tag">
									<xsl:value-of select="."/>, 
								</xsl:for-each>
							</td>
							
							<td>
								<xsl:value-of select="concat(substring(video:video/video:publication_date,0,11),concat(' ', substring(video:video/video:publication_date,12,5)))"/>
							</td>
						</tr>
					</xsl:for-each>
					</tbody>
				</table>
			</div>
		
		</div>
	</body>
</html>
</xsl:template>

</xsl:stylesheet>