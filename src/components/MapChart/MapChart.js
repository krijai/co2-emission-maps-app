import React, { useEffect, useState, memo, Fragment } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import Tooltip from '@material-ui/core/Tooltip';
import './MapChart.css';
import co2Data from '../../owid-co2-data.json';

import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
  .domain([0.01, 1000])
  .range(["#78FF00", "#FF1300"]);

const MapChart = (props) => {
  return (
    <ComposableMap
    data-tip=""
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 120
      }}
      viewBox={"0 120 800 600"}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
      {true && (
        <Geographies geography={geoUrl}>
          {
          ({ geographies }) => 
            geographies.map((geo) => {
              let d;
              let hasCo2;
              if(co2Data[0][geo.properties.NAME]) {
                d = co2Data[0][geo.properties.NAME].data.find((s) =>  s.year == props.year);
                hasCo2 = d ? d.co2 : false;
              }
              return (
                  <Fragment>
                    <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hasCo2 ? colorScale(d.co2) : "#F5F4F6"}
                    onMouseEnter={() => {
                        const { NAME, POP_EST } = geo.properties;
                        props.setToolTipContent(geo.properties);
                        console.log("onMouseEnter Hittttt",NAME,POP_EST, true);
                    }}
                    onMouseLeave={() => {
                        props.setToolTipContent("");
                      }}
                      style={{
                        hover: {
                          fill: "#F53",
                          outline: "none"
                        },
                        pressed: {
                          fill: "#E42",
                          outline: "none"
                        }
                      }}
                    >
                    </Geography>
                    {/* <Marker key={geo.rsmKey} coordinates={coordinates} fill="#777">
                    <text textAnchor="middle" fill="#F53" className="small">

                    {geo.properties.NAME}
                    </text>
                </Marker> */}
                </Fragment>
              );
            })
          }
        </Geographies>
        
      )}
    </ComposableMap>
  );
};

export default memo(MapChart);
