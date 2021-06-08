import './App.css';
import MapChart from './components/MapChart/MapChart';
import co2Data from './owid-co2-data.json';
import Tooltip from '@material-ui/core/Tooltip';
import React, { Component, Fragment } from 'react';
import ReactTooltip from "react-tooltip";
import Slider from './components/Slider/Slider';
import marks from './components/Slider/SliderRange.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state= {
      currentData: [],
      filteredData: [],
      scale: 0,
      currentYear:1940
    }
  }

  currentYearHandler = (newValue) => {
    let year;
      const previousMarkIndex = Math.floor(newValue / 25);
      const previousMark = marks[previousMarkIndex];
      const remainder = newValue % 25;
      if (remainder === 0) {
        return previousMark.scaledValue;
      }
      const nextMark = marks[previousMarkIndex + 1];
      const increment = 1;
      year = remainder * increment + previousMark.scaledValue;
  
    this.setState({
      scale: newValue,
      currentYear: year
    })
  };



  setCurrentData = (item) => {
    let filteredData;
    if(item !== "" && co2Data[0][item.NAME] !== undefined) {
      filteredData = this.searchDataByYear("1990", co2Data[0][item.NAME].data)
    }
    this.setState({
      currentData: item,
      filteredData: filteredData
    })
  }

  searchDataByYear = (nameKey, myArray) => {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].year == nameKey) {
            return myArray[i];
        }
    }
  }

  render() {
    return (
      <div className="co2-main-content">
        <h1>Co2 Emissions Map - {this.state.currentYear}</h1>
        <div className="slider-year">
        <Slider currentYearHandler={this.currentYearHandler} scale={this.state.scale} currentYear={this.state.currentYear}/>
        </div>
        <MapChart setToolTipContent={this.setCurrentData} co2Data={co2Data} year={this.state.currentYear} searchDataByYear={this.searchDataByYear}/>
        <ReactTooltip>
          {
            this.state.filteredData ? 
            <Fragment>
              <h4>{this.state.currentData.NAME}</h4>
              <p><strong>Co2:</strong>{this.state.filteredData.co2}</p>
              <p><strong>Cement co2:</strong>{this.state.filteredData.cement_co2}</p>
              <p><strong>co2 Growth Abs:</strong>{this.state.filteredData.co2_growth_abs}</p>
              <p><strong>Consumption co2:</strong>{this.state.filteredData.consumption_co2}</p>
              <p><strong>Methane:</strong>{this.state.filteredData.methane}</p>
            </Fragment> : ''
          }
        </ReactTooltip>
      </div>
    );
  }
}

export default App;
