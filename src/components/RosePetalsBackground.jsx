import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PETAL_SHAPES = [
  // Wide petal
  "M15 2C15 2 27 12 27 19C27 24 23 28 17 28C14 28 12 26 12 26C12 26 10 28 7 28C3 28 1 24 1 19C1 12 15 2 15 2Z",
  // Narrow petal
  "M15 2C15 2 24 10 24 17C24 22 20 26 15 26C10 26 6 22 6 17C6 10 15 2 15 2Z",
  // Curved petal
  "M15 4C15 4 25 14 22 22C19 30 11 28 11 28C11 28 8 26 5 20C2 14 15 4 15 4Z"
];

const PETAL_COLORS = [
  "#FF4D6D", // deep rose
  "#FF758F", // vibrant pink
  "#FF8FA3", // light pink
  "#FFB3C1", // soft pink
  "#F7CAD0", // warm pastel blush
  "#E07A5F", // rose gold / peach
];

const RosePetalsBackground = () => {
  const location = useLocation();
  const [petals, setPetals] = useState([]);

  const hiddenRoutes = ['/camera-capture', '/photo-editing', '/strip-compositor', '/strip-selection'];

  useEffect(() => {
    // Generate a fixed number of petals with randomized properties
    const newPetals = Array.from({ length: 18 }).map((_, index) => {
      const size = Math.random() * 15 + 15; // 15px to 30px
      const left = Math.random() * 100; // 0% to 100%
      const fallDuration = Math.random() * 10 + 8; // 8s to 18s
      const swayDuration = Math.random() * 3 + 3; // 3s to 6s
      const delay = Math.random() * -15; // Negative delay to start immediately in different positions
      const shapePath = PETAL_SHAPES[Math.floor(Math.random() * PETAL_SHAPES.length)];
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const opacity = Math.random() * 0.3 + 0.4; // 0.4 to 0.7

      return {
        id: index,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: opacity,
          animation: `rose-fall ${fallDuration}s linear infinite, rose-sway ${swayDuration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        },
        shapePath,
        color
      };
    });

    setPetals(newPetals);
  }, []);

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="petal-container">
      {petals.map((petal) => (
        <svg
          key={petal.id}
          className="rose-petal"
          style={petal.style}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={petal.shapePath} fill={petal.color} />
        </svg>
      ))}
    </div>
  );
};

export default RosePetalsBackground;
