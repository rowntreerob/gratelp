# gratelp - mapped index of places visited and blogged about 


[Input geoJSON](https://github.com/rowntreerob/gratelp/blob/main/greatloopplaces-001.geojson?short_path=e046a32#L20) syntax

![View the map](https://github.com/rowntreerob/gratelp/blob/main/grlp_map_ui.png)

Map server & public hosting for the tail-end of a longer processing sequence and distillation of travel blog collections to a simple map containing a set of markers providing entire journey summary.  These markers, on-click, link directly to a blog post in whose body the place was originally mentioned. 



## Features

- Outputs a standalone [map of placemarkers](https://gratelp-production.up.railway.app/getchloop) hi-lighted in blog(s)
- Hover , click markers in the above to open the original blog
- Simple map index (TOC) of extensive journeys covered in blogs
- using your platform's [embed a site](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget), post a complete map of placemarkers  
- Upstream AI steps convert blog corpus to geojson syntax for input to any map api

## Usage
- Install input geojson file in project root
- config GEO_PATH in server.js
- add new [route](https://github.com/rowntreerob/gratelp/blob/ebc1c9541e4718ae760c204a17762b94f4c3ac30/server.js#L32) in server.js to handle the map request
- new Post entry in blog using embed a site gets the map on your blog


## Tech - upstream  AI steps to infer the places visited
  
Preceeding steps , external process generates Input geoJSON for this project. AI layer is under construction and out-of-scope.   

- scrape with [playwright](https://github.com/microsoft/playwright-python) & list of all blog links
- visit content, [contstruct metadata](https://github.com/rowntreerob/gratelp/blob/main/grlp_data_schema_bloglist.png) for the AI phase
- [AI prompt](https://chatgpt.com/share/68b9ae4f-c42c-8003-8b34-24c6f30261de) , multiple stages w NLP on complete blog text ( img labels & all)
- AI distills geographic locations from natural language text.
- AI Generates map coordinates for set of gumdrops matching places visited.
- AI manages data hierarchy (titles, links, map coordinates)   
- AI outputs geoJSON for std mapping layer interface ( input geoJSON at top is generic map layer input)
- choose a map layer to host / represent data from the AI


