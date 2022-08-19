import React, { ReactNode, useEffect } from "react";

interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  children: ReactNode;
}

const Map: React.FC<MapProps> = ({ onClick, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }
    }
  }, [map, onClick]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: new window.google.maps.LatLng(
            51.53469489899163,
            -0.5117766987789006
          ),
          zoom: 14,
        })
      );
    }
  }, [ref, map]);

  return (
    <>
      <div
        style={{ width: 1000, height: 800, border: "1px solid black" }}
        ref={ref}
      ></div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

export default Map;
