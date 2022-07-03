import React from 'react';
import useSWR from 'swr';

function PieChart() {
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
  
    return (
      <div className="PieChart">
      
      </div>
    );
  }
  
  export default PieChart;
  