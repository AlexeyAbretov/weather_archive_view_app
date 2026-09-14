import { AppProviders } from './providers';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { AppFiltersProvider } from './context/AppFiltersContext';

export function App() {
  return (
    <AppProviders>
      <AppFiltersProvider>
        <AppLayout>
          <HomePage />
        </AppLayout>
      </AppFiltersProvider>
    </AppProviders>
  );
}
