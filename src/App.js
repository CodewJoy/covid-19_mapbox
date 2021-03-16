import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import useSWR from "swr"; // React hook to fetch the data
import lookup from "country-code-lookup"; // npm module to get ISO Code for countries
import Classnames from 'classnames';
import "./App.scss";

// Mapbox css - needed to make tooltips work later in this article
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiY29kZXdqb3kiLCJhIjoiY2tlcnJodDdyMThhOTJxbjFseGJmcWw5cCJ9.1PLZ4HoeVICZjZB7kDLKzg";

function App() {
  const [map, setMap] = useState(null);
  const [isClicked, setIsClicked] = useState([true, false]);
  const mapboxElRef = useRef(null); // DOM element to render map

  const clone = (obj) => {
    if (obj === null || typeof (obj) !== 'object') { return obj; }
    const temp = new obj.constructor();
    if (obj instanceof Set) {
        for (const key of obj.keys()) { temp.add(key); }
    } else {
        for (const key in obj) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
  };

  const fetcher = url =>
    fetch(url)
      .then(r => r.json())
      .then(data =>
        // console.log(data)
        data.map((point, index) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              point.coordinates.longitude,
              point.coordinates.latitude
            ]
          },
          properties: {
            id: index, // unique identifier in this case the index
            country: point.country,
            province: point.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths,
            recovered: point.stats.recovered,
          }
        }))
      );

  // Fetching our data with swr package
  const { data } = useSWR("https://corona.lmao.ninja/v2/jhucsse", fetcher);
  // Initialize our map
  useEffect(() => {
    if (data) {
      // You can store the map instance with useRef too
      const map = new mapboxgl.Map({
        container: mapboxElRef.current,
        style: "mapbox://styles/notalemesa/ck8dqwdum09ju1ioj65e3ql3k",
        center: [16, 27], // initial geo location
        zoom: 2 // initial zoom
      });
      setMap(map);
      // Add navigation controls to the top right of the canvas
      map.addControl(new mapboxgl.NavigationControl());

      // Call this method when the map is loaded
      map.once("load", function () {
        // Add our SOURCE
        // with id "casesSource"
        map.addSource("casesSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data
          }
        });
        // Add our layer
        map.addLayer({
          id: "cases",
          source: "casesSource", // this should be the id of the source
          type: "circle",
          layout: {
            // make layer visible by default
            'visibility': 'visible'
          },
          // paint properties
          paint: {
            "circle-opacity": 0.75,
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["get", "cases"],
              1, 1,
              100000, 1.75,
            ],
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "cases"],
              1, 4,
              4000, 8,
              16000, 10,
              32000, 14,
              48000, 18,
              400000, 40
            ],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "cases"],
              1, '#ffffb2',
              5000, '#fed976',
              10000, '#feb24c',
              25000, '#fd8d3c',
              50000, '#fc4e2a',
              75000, '#e31a1c',
              100000, '#b10026'
            ],
          }
        });

        // with id "recoveredSource"
        map.addSource("recoveredSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data
          }
        });

        map.addLayer({
          id: "recovered",
          source: "recoveredSource", // this should be the id of the source
          type: "circle",
          layout: {
            // make layer visible by default
            'visibility': 'none'
          },
          // paint properties
          paint: {
            "circle-opacity": 0.75,
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["get", "recovered"],
              1, 1,
              100000, 1.75,
            ],
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "recovered"],
              1, 4,
              4000, 8,
              16000, 10,
              32000, 14,
              48000, 18,
              400000, 40
            ],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "recovered"],
              1, '#feebe2',
              5000, '#fcc5c0',
              10000, '#fa9fb5',
              25000, '#f768a1',
              50000, '#dd3497',
              75000, '#ae017e',
              100000, '#7a0177'
            ],
          }
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        let lastId;

        map.on("mousemove", "cases", e => {
          const id = e.features[0].properties.id;

          if (id !== lastId) {
            lastId = id;
            const {
              cases,
              deaths,
              country,
              province
            } = e.features[0].properties;

            // Change the pointer type on mouseenter
            map.getCanvas().style.cursor = "pointer";

            const coordinates = e.features[0].geometry.coordinates.slice();

            const countryISO =
              lookup.byCountry(country)?.iso2 ||
              lookup.byInternet(country)?.iso2;
            const provinceHTML =
              province !== "null" ? `<p>Province: <b>${province}</b></p>` : "";
            const mortalityRate = ((deaths / cases) * 100).toFixed(2);
            const countryFlagHTML = Boolean(countryISO)
              ? `<img src="https://www.countryflags.io/${countryISO}/flat/64.png"></img>`
              : "";

            const HTML = `<p>Country: <b>${country}</b></p>
                ${provinceHTML}
                <p>Cases: <b>${cases}</b></p>
                <p>Deaths: <b>${deaths}</b></p>
                <p>Mortality Rate: <b>${mortalityRate}%</b></p>
                ${countryFlagHTML}`;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup
              .setLngLat(coordinates)
              .setHTML(HTML)
              .addTo(map);
          }
        });

        map.on("mouseleave", "cases", function () {
          lastId = undefined;
          map.getCanvas().style.cursor = "";
          popup.remove();
        });

      });
    }
  }, [data]);

  // enumerate ids of the layers
  var toggleableLayerIds = ['cases', 'recovered'];

  return (
    <div className="App">
      <nav id="menu">
        {toggleableLayerIds.map((item, index) => (
          <div
            className={Classnames('select-layer',{'active': isClicked[index]})}
            key={item}
            onClick={(e) => {
              var clickedLayer = item;
              console.log('clickedLayer',clickedLayer)
              e.preventDefault();
              e.stopPropagation();

              var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
              let isClickedArr = clone(isClicked);
              // toggle layer visibility by changing the layout object's visibility property
              if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                isClickedArr[index] = false;
                setIsClicked(isClickedArr);
              } else {
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                isClickedArr[index] = true;
                setIsClicked(isClickedArr);
              }
            }}
          >
            {item}
          </div>
        ))}
      </nav>
      <div className="mapContainer">
        {/* Assigned Mapbox container */}
        <div className="mapBox" ref={mapboxElRef} />
      </div>
    </div>
  );
}

export default App;