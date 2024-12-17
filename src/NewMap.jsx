import {
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { MarkerWithInfoWindow } from "./MarkerWithInfoWindow";

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

function NewMap() {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [stations, setStations] = useState([]);
  const [center, setCenter] = useState({ lat: 47.6125257, lng: -122.0332217 });

  useEffect(() => {
    if (!placesLib || !map) return;

    const fetchNearbyPlaces = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": import.meta.env.VITE_REACT_APP_GOOGLE_FIELD_MAPS,
        },
        body: JSON.stringify({
          locationRestriction: {
            circle: {
              center: {
                latitude: center.lat,
                longitude: center.lng,
              },
              radius: 5000,
            },
          },
          includedPrimaryTypes: [
            "gas_station",
            "electric_vehicle_charging_station",
          ],
        }),
      };

      try {
        const response = await fetch(
          "https://places.googleapis.com/v1/places:searchNearby",
          requestOptions
        );
        const data = await response.json();
        setStations(data.places);
      } catch (error) {
        console.error("Error fetching nearby places:", error);
      }
    };

    fetchNearbyPlaces();
  }, [placesLib, map, center]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`,
          requestOptions
        );
        const data = await res.json();
        setCenter(data.location);
      } catch (error) {
        console.error("Error fetching geolocation:", error);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <Map
      style={{ width: "90vw", height: "90vh" }}
      defaultCenter={center}
      mapId={"e2ea39204ffcffc4"}
      defaultZoom={15}
      disableDefaultUI={true}
      gestureHandling={"greedy"}
      maxZoom={20}
      onZoomChanged={(zoom) => console.log("Zoom changed", zoom)}
    >
      <AdvancedMarker position={center}>
        <div className="user-marker">
          <img src="/user.svg" width={32} height={32} />
        </div>
      </AdvancedMarker>

      {stations &&
        stations.length > 0 &&
        stations.map((station) => {
          return (
            <div key={station.id}>
              <AdvancedMarker
                position={{
                  lat: station.location.latitude,
                  lng: station.location.longitude,
                }}
              />

              <MarkerWithInfoWindow
                station={station}
                position={station.location}
              />
            </div>
          );
        })}
    </Map>
  );
}

export default NewMap;
