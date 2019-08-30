import React, { PureComponent, Fragment } from 'react'
import { PanelProps, PanelPlugin } from '@grafana/ui'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'

export class MyPanel extends PureComponent<PanelProps> {
  id: {}
  div: HTMLElement | null
  map: L.Map | null
  markerIcon: L.Icon<L.IconOptions>

  constructor(props: PanelProps) {
    super(props)
    this.id = {}
    this.map = null
    this.div = null

    this.markerIcon = L.icon({
      iconUrl: 'https://i.imgur.com/7wmPyyz.png',
      iconAnchor: [16, 51], // point of the icon which will correspond to marker's location
      iconSize: [32, 51], // size of the icon
    })
  }

  componentDidMount() {
    if (!this.div) return false

    const map = L.map(this.div).setView([51.505, -0.09], 13)
    L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
        maxZoom: 18,
        attribution:
          'map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetmap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">mapbox</a>',
        id: 'mapbox.streets',
      }
    ).addTo(map)

    const OptionsGeoJSON: L.GeoJSONOptions = {
      pointToLayer: (fea, latlng) => L.marker(latlng, { icon: this.markerIcon }),
    }

    this.props.data.series.forEach(serie => serie.rows.forEach(row => L.geoJSON(row, OptionsGeoJSON).addTo(map)))

    this.map = map
    return undefined
  }

  render() {
    return (
      <Fragment>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"></link>
        <div ref={d => (this.div = d)}></div>
      </Fragment>
    )
  }
}

export const plugin = new PanelPlugin(MyPanel)
