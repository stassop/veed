import React from 'react';
import { QueryClient, QueryClientProvider} from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools'

import '../styles/App.css';
import Repos from './Repos';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Most Starred Github Repos</h1>
      </header>
      <main>
        <QueryClientProvider client={queryClient}>
          <Repos />
        </QueryClientProvider>
      </main>
    </div>
  );
}

export default App;
