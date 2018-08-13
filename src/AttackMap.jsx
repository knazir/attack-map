import "whatwg-fetch"
import React, { Component } from "react"
import { ComposableMap, ZoomableGroup, Geographies, Geography, Markers, Marker } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

let attackScale = scaleLinear()
  .domain([0, 255])
  .range([1,255]);

const wrapperStyle = {
  width: "100%",
};

const geographyStyle = {
  default: {
    fill: "#ECEFF1",
    stroke: "#607D8B",
    strokeWidth: 0.75,
    outline: "none",
  },
  hover: {
    fill: "#ECEFF1",
    stroke: "#607D8B",
    strokeWidth: 0.75,
    outline: "none",
  },
  pressed: {
    fill: "#ECEFF1",
    stroke: "#607D8B",
    strokeWidth: 0.75,
    outline: "none",
  },
};

class AttackMap extends Component {
  constructor() {
    super();
    this.state = { attacks: [] };
    this.fetchAttacks = this.fetchAttacks.bind(this)
  }

  componentDidMount() {
    this.fetchAttacks()
  }

  async fetchAttacks() {
    const data = await (await fetch(`${process.env.REACT_APP_API_URL}/attacks/list`)).json();
    const attackCounts = {};
    data.attacks.forEach(attack => {
      const attacker = attack.attacker;
      const location = [attacker.location.longitude, attacker.location.latitude];
      location in attackCounts ? attackCounts[location]++ : attackCounts[location] = 1;
    });

    attackScale = scaleLinear()
      .domain([1, 255])
      .range([1, 255]);

    const attacks = data.attacks.map(attack => {
      const { ip, attacker } = attack;
      const location = [attacker.location.longitude, attacker.location.latitude];
      return {
        name: ip,
        coordinates: location,
        weight: 10
      };
    });

    this.setState({ attacks });
  }

  getMarkers() {
    return this.state.attacks.map((attack, i) => (
      <Marker key={i} marker={attack}>
        <circle
          cx={0}
          cy={0}
          r={attackScale(attack.weight)}
          fill="rgba(255,87,34,0.8)"
          stroke="#607D8B"
          strokeWidth="2"
        />
      </Marker>
    ))
  }

  render() {
    return (
      <div style={wrapperStyle}>
        <ComposableMap
          projectionConfig={{ scale: 205 }}
          style={{ width: "100vw", height: "100vh" }}>
          <ZoomableGroup center={[0, 20]}>
            <Geographies geography={process.env.REACT_APP_GEOGRAPHY_JSON_URL}>
              {
                (geographies, projection) => geographies.map(
                  (geography, i) =>
                    geography.id !== "ATA" &&
                    <Geography key={i} geography={geography} projection={projection} style={geographyStyle}/>
                )
              }
            </Geographies>
            <Markers>
              {this.getMarkers()}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default AttackMap
