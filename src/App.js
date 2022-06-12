import React from "react";
import useSWR from "swr";
import "./App.scss";
// Need mapbox css for tooltips later in the tutorial
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/Map";
import Legend from "./components/Legend";
import { parseLegendList } from "./utils";

const colorArr = [
  "#ffffb2",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#fc4e2a",
  "#e31a1c",
  "#b10026"
];
const radiusArr = [1, 10, 20, 30, 40, 50];

function App() {
  const fetcher = (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((data) =>
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
            id: index,
            country: point.country,
            province: point.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths
          }
        }))
      );

  const { data } = useSWR("https://disease.sh/v3/covid-19/jhucsse", fetcher);
  
  const maxAmount = data && Math.max(...data.map((item) => item.properties.cases));
  const legendList = parseLegendList(maxAmount, colorArr);

  return (
    <div className="App">
      <Map 
        data={data}
        maxAmount={maxAmount}
        colorArr={colorArr}
        radiusArr={radiusArr}
      />
      <Legend legendList={legendList} />
    </div>
  );
}

export default App;
