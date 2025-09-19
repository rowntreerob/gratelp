# gratelp - mapped index of places visited and blogged about 


[Input geoJSON](https://github.com/rowntreerob/gratelp/blob/main/greatloopplaces-001.geojson?short_path=e046a32#L20) syntax

![View the map](https://github.com/rowntreerob/gratelp/blob/main/grlp_map_ui.png)

Map server & public hosting for the tail-end of a longer processing sequence and distillation of travel blog collections to a simple, deeplinked map containing a set of markers that when cliked link to a blog post in whose body, the place was mentioned. 



## Features

- Outputs a [map of placemarkers](https://gratelp-production.up.railway.app/getchloop) hi-lighted in blog(s)
- Hover , click to open the original blog
- Simple map index of extensive journeys covered in blogs
- using [embed a site](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget), post map like this to your blog 
- Upstream AI steps convert blog corpus to geojson syntax for any map api

## Usage
- Install input geojson file in project root
- config GEO_PATH in server.js
- add new [route](https://github.com/rowntreerob/gratelp/blob/ebc1c9541e4718ae760c204a17762b94f4c3ac30/server.js#L32) in server.js to handle the map request
- new Post entry in blog using embed a site gets the map on your blog


## Tech



