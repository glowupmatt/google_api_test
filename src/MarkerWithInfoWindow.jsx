import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export const MarkerWithInfoWindow = ({ position, station }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const handleMarkerClick = useCallback(() => {
    setInfoWindowShown((isShown) => !isShown);
  }, []);

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (station.photos && station.photos.length > 0) {
        const photoName = station.photos[0].name;
        const response = await fetch(
          `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${
            import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
          }`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setPhotoUrl(imageObjectURL);
      }
    };

    fetchPhotoUrl();
  }, [station]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{
          lat: position.latitude,
          lng: position.longitude,
        }}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && station && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          style={{ width: "200px", height: "200px" }}
        >
          <div>
            <h2>{station.displayName.text}</h2>
            <p>
              Address:
              {station.shortFormattedAddress}
            </p>
            <a
              href={station.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
            >
              {station.googleMapsUri}
            </a>
            {photoUrl && (
              <div className="image-container">
                <img className="image" src={photoUrl} alt="place" />
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

MarkerWithInfoWindow.propTypes = {
  position: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  station: PropTypes.shape({
    displayName: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    shortFormattedAddress: PropTypes.string.isRequired,
    googleMapsUri: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        heightPx: PropTypes.number.isRequired,
        widthPx: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
};
