import React, { useState } from "react";
import "./App.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./components/Map";
import Polygon from "./components/Polygon";

const render = (status: Status) => {
  switch (status) {
    case Status.FAILURE:
      return <div>Failed to load map</div>;
    case Status.LOADING:
      return <div>loading...</div>;
    default:
      return <div>...</div>;
  }
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  const [path, setPath] = useState<google.maps.LatLng[]>([]);
  const [isSettingPath, setIsSettingPath] = useState<boolean>(false);
  const [editPath, setEditPath] = useState<boolean>(false);

  if (!GOOGLE_MAPS_API_KEY) {
    return <div>missing google maps api key</div>;
  }

  console.log("path", path);
  return (
    <div style={{ display: "flex", flexDirection: "row" }} className="App">
      <div>
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
          <Map
            onClick={(ev) => {
              if (ev.latLng && isSettingPath) {
                setPath([...path, ev.latLng]);
              }
            }}
          >
            <Polygon
              paths={path}
              editable={editPath}
              onChange={(path) => setPath(path)}
            />
          </Map>
        </Wrapper>
      </div>
      <div style={{ border: "1px solid gray", minWidth: 200 }}>
        <div>
          <input
            checked={isSettingPath}
            onChange={(ev) => setIsSettingPath(ev.target.checked)}
            type="checkbox"
            name="select-boundary"
            id="select-boundary"
          />
          <label htmlFor="select-boundary">Select boundary</label>
        </div>
        <div>
          <input
            checked={editPath}
            onChange={(ev) => setEditPath(ev.target.checked)}
            type="checkbox"
            name="edit-boundary"
            id="edit-boundary"
          />
          <label htmlFor="edit-boundary">Edit boundary</label>
        </div>
        <button onClick={() => setPath([])}>Clear path</button>
      </div>
    </div>
  );
}

export default App;
