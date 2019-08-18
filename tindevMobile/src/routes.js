import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/login';
import Main from './pages/main';

export default function createAppContainer(){
  createSwitchNavigator({
    Login,
    Main
  })
}