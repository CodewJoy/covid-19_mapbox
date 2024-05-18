import React, { useState } from "react";
// import useSWR from 'swr';
import "./App.scss";
// Need mapbox css for tooltips later in the tutorial
import "mapbox-gl/dist/mapbox-gl.css";
import Control from "./components/Control";
import Map from "./components/Map";
import Legend from "./components/Legend";
import { parseLegendList, colorArr, radiusArr } from "./utils";
import oriData from "./data/covidData.json";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function App() {
  const [layer, setLayer] = useState("cases");

  const data = oriData.map((point, index) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.Long_, point.Lat],
    },
    properties: {
      id: index,
      country: point.Country_Region,
      province: point.Country_Region,
      cases: Number(point.Confirmed),
      deaths: Number(point.Deaths),
      recovered: Number(point.Recovered),
    },
  }));
  // const fetcher = (url) =>
  //   fetch(url)
  //     .then((r) => r.json())
  //     .then((data) =>
  //       data.map((point, index) => ({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: [
  //             point.coordinates.longitude,
  //             point.coordinates.latitude
  //           ]
  //         },
  //         properties: {
  //           id: index,
  //           country: point.country,
  //           province: point.province,
  //           cases: point.stats.confirmed,
  //           deaths: point.stats.deaths
  //         }
  //       }))
  //     );

  // const { data } = useSWR("https://disease.sh/v3/covid-19/jhucsse", fetcher);

  const maxAmount = data && {
    cases: Math.max(...data.map((item) => item.properties.cases)),
    deaths: Math.max(...data.map((item) => item.properties.deaths)),
    recovered: Math.max(...data.map((item) => item.properties.recovered)),
  };
  const legendList = maxAmount && {
    cases: parseLegendList(maxAmount["cases"], colorArr["cases"]),
    deaths: parseLegendList(maxAmount["deaths"], colorArr["deaths"]),
    recovered: parseLegendList(maxAmount["recovered"], colorArr["recovered"]),
  };

  const handleChange = (event) => {
    setLayer(event.target.value);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }} className="header">
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography>
              Csse Covid 19 Daily Reports 01-01-2021{" "}
              <a href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/01-01-2021.csv">
                Data Source
              </a>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        <Control layer={layer} handleChange={handleChange} />
        <Map
          data={data}
          maxAmount={maxAmount}
          colorArr={colorArr}
          radiusArr={radiusArr}
          layer={layer}
        />
        <Legend title={layer} legendList={legendList && legendList[layer]} />
      </main>
    </div>
  );
}

export default App;
