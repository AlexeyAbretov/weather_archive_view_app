import { useContext } from 'react';

import { LocationContext, type LocationContextValue } from '@providers';

export const useSelectedLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      'useSelectedLocation должен использоваться в LocationProvider',
    );
  }

  return context;
};
