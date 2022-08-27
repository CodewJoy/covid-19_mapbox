import React, { useState } from 'react';
import useSWR from 'swr';
import './App.scss';
// Need mapbox css for tooltips later in the tutorial
import 'mapbox-gl/dist/mapbox-gl.css';
import Control from './components/Control';
import Map from './components/Map';
import Legend from './components/Legend';
import { parseLegendList, colorArr, radiusArr } from './utils';

function App() {
  const [layer, setLayer] = useState("cases");
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

  const maxAmount = data && {
    cases: Math.max(...data.map((item) => item.properties.cases)),
    deaths: Math.max(...data.map((item) => item.properties.deaths)),
  };
  const legendList = maxAmount && {
    cases: parseLegendList(maxAmount["cases"], colorArr["cases"]),
    deaths: parseLegendList(maxAmount["deaths"], colorArr["deaths"]),
  };

  const handleChange = (event) => {
    setLayer(event.target.value);
  };

  return (
    <div className="App">
      <Control
        layer={layer}
        handleChange={handleChange}
      />
      <Map
        data={data}
        maxAmount={maxAmount}
        colorArr={colorArr}
        radiusArr={radiusArr}
        layer={layer}
      />
      <Legend
        title={layer}
        legendList={legendList && legendList[layer]}
      />
    </div>
  );
}

export default App;
