import React, { useMemo } from "react";
import useSWR from "swr";
import styled from 'styled-components';
import "./App.scss";
// Need mapbox css for tooltips later in the tutorial
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/Map";
import Legend from "./components/Legend";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { parseLegendList } from "./utils";

const colorArr = {
  cases: [
    "#ffffb2",
    "#fed976",
    "#feb24c",
    "#fd8d3c",
    "#fc4e2a",
    "#e31a1c",
    "#b10026"
  ],
  deaths: [
    "#f1eef6",
    "#d4b9da",
    "#c994c7",
    "#df65b0",
    "#e7298a",
    "#ce1256",
    "#91003f"
  ],
}
const radiusArr = [1, 10, 20, 30, 40, 50];

const BoxWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
  z-index: 1;
  background-color: white;
  border-radius: 4px;
`;

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

  const maxAmount = data && {
    cases: Math.max(...data.map((item) => item.properties.cases)),
    deaths: Math.max(...data.map((item) => item.properties.deaths)),
  };
  console.log('maxAmount', maxAmount)
  const [layer, setLayer] = React.useState("cases");
  const legendList = maxAmount && {
    cases: parseLegendList(maxAmount["cases"], colorArr["cases"]),
    deaths: parseLegendList(maxAmount["deaths"], colorArr["deaths"]),
  };

  console.log('legendList', legendList)
  const handleChange = (event) => {
    setLayer(event.target.value);
  };

  return (
    <div className="App">
      <BoxWrapper>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Layer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={layer}
              label="Layer"
              onChange={handleChange}
            >
              <MenuItem value={"cases"}>Cases</MenuItem>
              <MenuItem value={"deaths"}>Deaths</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </BoxWrapper>
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
