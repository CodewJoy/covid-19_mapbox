import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { isNil } from "lodash-es";
import { parseMapboxArr } from "./../utils";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXdqb3kiLCJhIjoiY2xlenE0dnE2MDFueTNycDJrMnc5Y2twcCJ9.p7bcH7fkoTbnOYDRUyGVsw";

const layers = ["cases", "deaths", "recovered"];

function Map(props) {
  const { data, maxAmount, colorArr, radiusArr, layer } = props;
  const mapboxElRef = useRef(null); // DOM element to render map
  const [map, setMap] = useState(null);

  // Initialize our map
  useEffect(() => {
    const createMap = () => {
      const map = new mapboxgl.Map({
        container: mapboxElRef.current,
        style: "mapbox://styles/notalemesa/ck8dqwdum09ju1ioj65e3ql3k",
        center: [16, 27], // initial geo location
        zoom: 2, // initial zoom
      });
  
      // Add navigation controls to the top right of the canvas
      map.addControl(new mapboxgl.NavigationControl());
  
      // Add navigation to center the map on your geo location
      map.addControl(
        new mapboxgl.GeolocateControl({
          fitBoundsOptions: { maxZoom: 6 },
        })
      );
      setMap(map);
    };
    createMap();
  }, []);

  const isSourceExist = (map, sourceId) => !isNil(map.getSource(sourceId));
  const isLayerExist = (map, layerId) => !isNil(map.getLayer(layerId));

  const createSource = (map, sourceId, geoData) => {
    if (map && !isSourceExist(map, sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: geoData,
        },
      });
    }
  };

  const createLayer = (map, layerId, sourceId) => {
    const circleColorArr = parseMapboxArr(
      maxAmount[layerId],
      colorArr[layerId],
      layerId
    );
    const circleRadiusArr = parseMapboxArr(
      maxAmount[layerId],
      radiusArr,
      layerId
    );
    if (map && !isLayerExist(map, layerId)) {
      map.addLayer({
        id: layerId,
        source: sourceId, // this should be the id of source
        type: "circle",
        paint: {
          "circle-opacity": 0.75,
          "circle-stroke-width": 1,
          "circle-radius": circleRadiusArr,
          "circle-color": circleColorArr,
        },
      });
    }
  };

  const setLayerVisible = (map, id, visible) => {
    if (!map || !isLayerExist(map, id)) return;
    const visibility = visible ? "visible" : "none";
    if (map.getLayoutProperty(id, "visibility") !== visibility)
      map.setLayoutProperty(id, "visibility", visibility);
  };

  const generateLayerTooltip = (map, id) => {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let lastId;

    map.on("mousemove", id, (e) => {
      const id = e.features[0].properties.id;

      if (id !== lastId) {
        lastId = id;
        const { cases, deaths, country, province } = e.features[0].properties;

        // Change the pointer type on mouseenter
        map.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();

        const provinceHTML =
          province !== "null" ? `<p>Province: <b>${province}</b></p>` : "";
        const mortalityRate = ((deaths / cases) * 100).toFixed(2);

        const HTML = `<p>Country: <b>${country}</b></p>
                ${provinceHTML}
                <p>Cases: <b>${cases}</b></p>
                <p>Deaths: <b>${deaths}</b></p>
                <p>Mortality Rate: <b>${mortalityRate}%</b></p>
                `;

        // // Ensure that if the map is zoomed out such that multiple
        // // copies of the feature are visible, the popup appears
        // // over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        popup.setLngLat(coordinates).setHTML(HTML).addTo(map);
      }
    });

    map.on("mouseleave", "cases", function () {
      lastId = undefined;
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  };

  useEffect(() => {
    if (data && map) {
      map.once("load", () => {
        // Add our SOURCE
        createSource(map, "points", data);
        // Add our layer
        layers.forEach((el) => createLayer(map, el, "points"));
        // Set first layer visible, others invisible
        layers.forEach((el, index) => setLayerVisible(map, el, index === 0));
        layers.forEach((el) => generateLayerTooltip(map, el));
      });
    }
  }, [data, map]);

  useEffect(() => {
    if (map) {
      layers.forEach((el) => {
        if (layer === el) {
          setLayerVisible(map, el, true);
        } else {
          setLayerVisible(map, el, false);
        }
      });
    }
  }, [layer, map]);

  return <div className="mapContainer" ref={mapboxElRef} />;
}

export default Map;
