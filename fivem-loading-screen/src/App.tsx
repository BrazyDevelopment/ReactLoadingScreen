// src/App.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import LoadingScreen from './components/LoadingScreen';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);

function App() {
  return (
    <React.StrictMode>
      <LoadingScreen />
    </React.StrictMode>
  );
}

export default App;
