import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const useResponsivity = (mediaQuery?: number) => {
  const mediaQueryChangeHandler = (match: boolean) => {
    console.log(match);
    setHasMatchMediaQuery(match);
  };

  const currentStatusMediaQuery = useMediaQuery(
    { maxWidth: mediaQuery || 768 },
    undefined,
    mediaQueryChangeHandler
  );
  const [hasMatchMediaQuery, setHasMatchMediaQuery] = useState(
    currentStatusMediaQuery
  );

  return hasMatchMediaQuery;
};
