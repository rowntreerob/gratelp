// server.js
// Express app serving a Google Maps page at GET /getchloop
// - Loads ./greatloopplaces-001.geojson once on startup (static)
// - Returns HTML/JS that plots markers with InfoWindows
// - InfoWindow shows properties.place and an <a> (href=properties.url, label=properties.title)

const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();

// ---- Load GeoJSON once at startup (static data) ----
const GEO_PATH = path.resolve(__dirname, "greatloopplaces-001.geojson");
let features = [];
try {
  const raw = fs.readFileSync(GEO_PATH, "utf8");
  const fc = JSON.parse(raw);
  if (fc && fc.type === "FeatureCollection" && Array.isArray(fc.features)) {
    features = fc.features;
    console.log(`[init] Loaded ${features.length} features from ${GEO_PATH}`);
  } else {
    console.warn("[init] GeoJSON missing FeatureCollection.features array.");
  }
} catch (e) {
  console.error(`[init] Failed to load ${GEO_PATH}:`, e.message);
}

// ---- Route: GET /getchloop ----
// Optional query params: ?lat=...&long=...
app.get("/getchloop", (req, res) => {
  const qLat = Number(req.query.lat);
  const qLng = Number(req.query.long);
  const hasQueryCenter = Number.isFinite(qLat) && Number.isFinite(qLng);

  // Inline the FeatureCollection to avoid fetch/CORS
  const inlineData = JSON.stringify({ type: "FeatureCollection", features });

  // Use env key if present
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
  const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : "";

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Great Loop — Map</title>
  <style>
    html, body, #map { height: 100%; margin: 0; }
    .info { min-width: 240px; font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .info .place { font-weight: 600; margin-bottom: 4px; }
    .gm-style .gm-style-iw-c { border-radius: 12px; }
  </style>
</head>
<body>
  <div id="map"></div>

  <script id="places" type="application/json">${inlineData}</script>

  <script>
    // Define a non-async global function that *invokes* an async initializer.
    // This avoids any edge cases where Google expects a plain function.
    window.initMap = function() {
      (async function init() {
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");

        const START_CENTER = ${hasQueryCenter ? `{"lat":${qLat},"lng":${qLng}}` : "null"};

        const mapOptions = {
          mapTypeId: "roadmap",
          streetViewControl: false,
          mapTypeControl: false
        };
        if (START_CENTER) {
          mapOptions.center = START_CENTER;
          mapOptions.zoom = 6;
        }

        const map = new Map(document.getElementById("map"), mapOptions);
        const info = new InfoWindow();
        const bounds = new google.maps.LatLngBounds();

        const fc = JSON.parse(document.getElementById("places").textContent);
        const feats = (fc && Array.isArray(fc.features)) ? fc.features : [];

        let placed = 0;
        feats.forEach((ft) => {
          const p = ft.properties || {};
          const g = ft.geometry || {};
          const c = Array.isArray(g.coordinates) ? g.coordinates : null;
          if (!c || c.length !== 2) return;

          const lat = Number(c[1]);
          const lng = Number(c[0]);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

          const place = (p.place || "").toString();
          const url   = (p.url   || "#").toString();
          const title = (p.title || place || url).toString();

          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: place || title
          });

          // Build InfoWindow content safely using DOM (no string HTML injection)
          function openInfo() {
            const container = document.createElement("div");
            container.className = "info";

            const placeDiv = document.createElement("div");
            placeDiv.className = "place";
            placeDiv.textContent = place;
            container.appendChild(placeDiv);

            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = title;
            container.appendChild(a);

            info.setContent(container);
            info.open({ anchor: marker, map });
          }

          marker.addListener("click", openInfo);

          bounds.extend({ lat, lng });
          placed++;
        });

        if (!START_CENTER && placed > 0) {
          map.fitBounds(bounds);
          google.maps.event.addListenerOnce(map, "bounds_changed", () => {
            if (map.getZoom() > 12) map.setZoom(10);
          });
        } else if (!START_CENTER && placed === 0) {
          map.setCenter({ lat: 39, lng: -95 });
          map.setZoom(4);
        }
      })().catch((err) => {
        console.error("init error:", err);
      });
    };
  </script>

  <script src="https://maps.googleapis.com/maps/api/js?v=weekly&callback=initMap${keyParam}" async defer></script>
</body>
</html>`);
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})
