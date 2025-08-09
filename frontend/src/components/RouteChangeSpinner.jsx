import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

/**
 * Shows a spinner whenever the route changes.
 * Always shows for `minDuration` ms to keep transitions smooth.
 */
const RouteChangeSpinner = ({ delay = 0, minDuration = 1000 }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [location.key, minDuration]);

  return visible ? <PageLoader /> : null;
};

export default RouteChangeSpinner;
