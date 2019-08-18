import React from 'react';
import { YellowBox } from 'react-native';

// Ignnorando avisos que não atrapalham no funcionamento do app
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
])

import Routes from './pages/routes';

export default function App () {
  return (
    <Routes />
  );
};