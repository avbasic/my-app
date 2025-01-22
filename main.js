import './style.css';
import { Map, View } from 'ol';

import OSM from 'ol/source/OSM';
import {StadiaMaps, Vector as VectorSource} from 'ol/source.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Icon, Style} from 'ol/style.js';
import {fromLonLat} from 'ol/proj.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Fill, Stroke, Text} from 'ol/style.js';
import {Overlay} from 'ol';

const iconCoordinates = [
  [37.6176, 55.7558], // Moscow
  [2.3522, 48.8566],  // Paris
  [-74.0060, 40.7128], // New York
  [139.6917, 35.6895] // Tokyo
];

// Labels for the features
const labels = [
  { text: "Moscow", link: "https://en.wikipedia.org/wiki/Moscow" },
  { text: "Paris", link: "https://en.wikipedia.org/wiki/Paris" },
  { text: "New York", link: "https://en.wikipedia.org/wiki/New_York_City" },
  { text: "Tokyo", link: "https://en.wikipedia.org/wiki/Tokyo" }
];

// Create a vector source and add features
const vectorSource = new VectorSource();

iconCoordinates.forEach((coord,index) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(coord)),
    name: labels[index], // Add a property for the label text
    link: labels[index].link  // Add a property for the link
  });

  // Style the icon
  feature.setStyle(new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/latest/examples/data/icon.png', // URL to your icon
      scale: 0.5 // Adjust the size of the icon
    }),
    text: new Text({
      text: labels[index][0], // Label for the icon
      offsetY: -25, // Position the label below the icon
      textAlign: 'center', // Center the text
      fill: new Fill({ color: '#000000' }), // Text color
      stroke: new Stroke({ color: '#FFFFFF', width: 2 }) // Text outline color and width
    })
  }));

  vectorSource.addFeature(feature);
});

     // Create a vector layer with the source
     const vectorLayer = new VectorLayer({
      source: vectorSource
  });


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

  // Zoom to the extent of the features
  const extent = vectorSource.getExtent();
  map.getView().fit(extent, {
      padding: [50, 50, 50, 50], // Optional padding around the extent
      duration: 2000 // Animation duration in milliseconds
  });


  // Create HTML overlays for labels
iconCoordinates.forEach((coord, index) => {
  const label = labels[index];

  // Create a div element for the label
  const labelElement = document.createElement('div');
 // labelElement.className = 'ol-label';
  labelElement.innerHTML = `<a href="${label.link}" target="_blank">${label.text}</a>`;
   
  // Create an overlay for the label
  const overlay = new Overlay({
    position: fromLonLat(coord),
    positioning: 'bottom-center',
    element: labelElement,
    offset: [0, -20] // Offset the label above the icon
  });

  // Add the overlay to the map
  map.addOverlay(overlay);
});