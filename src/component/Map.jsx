import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import "leaflet/dist/leaflet.css";

const Map = ({ geojsonData }) => {
  const [drawnShapes, setDrawnShapes] = useState([]);

  const handleDrawCreated = (event) => {
    const { layerType, layer } = event;
    const shapeData = {};
    if (layerType === 'polygon') {
      shapeData.type = 'Polygon';
      shapeData.coordinates = layer.getLatLngs().map(latlng => [latlng.lng, latlng.lat]);
    } else if (layerType === 'circle') {
      shapeData.type = 'Circle';
      shapeData.center = [layer.getLatLng().lng, layer.getLatLng().lat];
      shapeData.radius = layer.getRadius();
    }
    setDrawnShapes([...drawnShapes, shapeData]);
  };

  const handleDownloadGeoJSON = () => {
    const geoJSONData = {
      type: 'FeatureCollection',
      features: drawnShapes.map(shape => ({
        type: 'Feature',
        geometry: {
          type: shape.type === 'Polygon' ? 'Polygon' : 'Point',
          coordinates: shape.type === 'Polygon' ? [shape.coordinates] : shape.center,
        },
        properties: shape.type === 'Polygon' ? {} : { radius: shape.radius },
      })),
    };
    const blob = new Blob([JSON.stringify(geoJSONData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawn_shapes.geojson';
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <div style={{ width: '100%', maxWidth: '1200px', height: '70vh', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geojsonData && <GeoJSON data={JSON.parse(geojsonData)} />}
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleDrawCreated}
              draw={{
                rectangle: false,
                marker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
      <button onClick={handleDownloadGeoJSON} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Download GeoJSON
      </button>
    </div>
  );
};

export default Map;
