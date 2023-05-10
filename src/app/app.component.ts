import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { error } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'maps-poc';
  public map!: Map

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(resp => {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: 'map',
        view: new View({
          center: fromLonLat([resp.coords.longitude, resp.coords.latitude]),
          zoom: 12, maxZoom: 18,
        }),
      })
    });
  }

  getCoord(event: any) {
    let pixel = this.map.getEventPixel(event);
    let coordinate = this.map.getCoordinateFromPixel(pixel);

    const url = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${coordinate[0]},${coordinate[1]}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '6eeeddbb5fmsh36086b5eff9a8e0p174c0ajsn6dfdd5f56b02',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
      }
    };

    fetch(url, options).then(response => {
      const result = response.text();
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }
}