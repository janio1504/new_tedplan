import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Importar Leaflet CSS
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

// Componente de mapa importado dinamicamente
const MapComponent = dynamic(
  async () => {
    const { MapContainer, TileLayer, Marker, useMapEvents } = await import("react-leaflet");
    const L = await import("leaflet");
    
    // Fix para ícone padrão do Leaflet
    delete (L.default.Icon.Default.prototype as any)._getIconUrl;
    L.default.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
      const [position, setPosition] = useState<[number, number] | null>(null);

      useMapEvents({
        click(e: any) {
          const lat = parseFloat(e.latlng.lat.toFixed(7));
          const lng = parseFloat(e.latlng.lng.toFixed(7));
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
        },
      });

      return position === null ? null : <Marker position={position} />;
    }

    return function MapComponentInternal({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
      const center: [number, number] = initialLat && initialLng 
        ? [initialLat, initialLng] 
        : [-14.235, -51.9253]; // Centro do Brasil

      return (
        <MapContainer
          center={center}
          zoom={initialLat && initialLng ? 15 : 6}
          style={{ height: "500px", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  return <MapComponent onLocationSelect={onLocationSelect} initialLat={initialLat} initialLng={initialLng} />;
}
