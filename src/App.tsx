import { lazy } from 'react';
import RoutesComponent from './routes';
import './App.css';
import './_i18n';
const Toast = lazy(async () => await import('./components/atoms/Toast'));
function App() {
  return (
    <>
      <RoutesComponent />
      <Toast />
    </>
  );
}

export default App;
