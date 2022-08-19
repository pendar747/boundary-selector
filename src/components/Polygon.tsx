import React, { useEffect, useState } from "react";

interface PolygonProps extends google.maps.PolygonOptions {
  onChange?: (path: google.maps.LatLng[]) => void;
}

const Polygon: React.FC<PolygonProps> = (options) => {
  const [polygon, setPolygon] = useState<google.maps.Polygon>();
  const [listeners, setListeners] = useState<google.maps.MapsEventListener[]>(
    []
  );

  React.useEffect(() => {
    if (!polygon) {
      setPolygon(new google.maps.Polygon(options));
    }

    // remove marker from map on unmount
    return () => {
      if (polygon) {
        polygon.setMap(null);
      }
    };
  }, [polygon]);

  React.useEffect(() => {
    if (polygon) {
      polygon.setOptions(options);
    }
  }, [polygon, options]);

  useEffect(() => {
    if (options.onChange && polygon && polygon.getPath()) {
      listeners.forEach((l) => l.remove());
      console.log("setting listeners");
      const l1 = google.maps.event.addListener(
        polygon.getPath(),
        "insert_at",
        () => {
          console.log("insert at");
          options.onChange!(polygon.getPath().getArray());
        }
      );

      const l2 = google.maps.event.addListener(
        polygon.getPath(),
        "remove_at",
        () => options.onChange!(polygon.getPath().getArray())
      );

      const l3 = google.maps.event.addListener(
        polygon.getPath(),
        "set_at",
        () => options.onChange!(polygon.getPath().getArray())
      );
      setListeners([l1, l2, l3]);
    }

    return () => listeners.forEach((l) => l.remove());
  }, [options.onChange, polygon]);

  return null;
};

export default Polygon;
