import React, { useEffect, useState } from "react";

interface PolygonProps extends google.maps.PolylineOptions {
  onChange?: (path: google.maps.LatLng[]) => void;
}

const Polyline: React.FC<PolygonProps> = (options) => {
  const [polyline, setPolyline] = React.useState<google.maps.Polyline>();
  const [listeners, setListeners] = useState<google.maps.MapsEventListener[]>(
    []
  );

  useEffect(() => {
    if (!polyline) {
      setPolyline(new google.maps.Polyline(options));
    }

    // remove marker from map on unmount
    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [polyline]);

  useEffect(() => {
    if (polyline) {
      polyline.setOptions(options);
    }
  }, [polyline, options]);

  useEffect(() => {
    if (options.onChange) {
      listeners.forEach((l) => l.remove());
      const l1 = polyline?.addListener("insert_at", () =>
        options.onChange!(polyline.getPath().getArray())
      );

      const l2 = polyline?.addListener("remove_at", () =>
        options.onChange!(polyline.getPath().getArray())
      );

      const l3 = polyline?.addListener("set_at", () =>
        options.onChange!(polyline.getPath().getArray())
      );
      setListeners([l1!, l2!, l3!]);
    }

    return () => listeners.forEach((l) => l.remove());
  }, [options.onChange]);

  return null;
};

export default Polyline;
