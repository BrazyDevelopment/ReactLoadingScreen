// src/App.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import LoadingScreen from './components/LoadingScreen';

function App() {
  return (
    <React.StrictMode>
      <LoadingScreen />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
export default App;
