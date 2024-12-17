import { APIProvider } from "@vis.gl/react-google-maps";
import "./App.css";
import NewMap from "./NewMap";

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const App = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <NewMap />
    </APIProvider>
  );
};

export default App;
