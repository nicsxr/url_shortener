import axios from 'axios'
import Create from './create';
import UrlInfo from './urlInfo';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import UserInfo from './userInfo';
import NavbarComponent from './components/navbar'

axios.defaults.baseURL = 'https://shortlinkge.herokuapp.com/api/';
// axios.defaults.baseURL = 'http://localhost:8000/api/';


function App() {
  return (
    <Router>
      <NavbarComponent/>
      <div className="AppRoot">
        <Switch>
          <Route path="/" exact component={Create} />
          <Route path="/alias/:alias?" exact component={UrlInfo} />
          <Route path="/user/:alias?" exact component={UserInfo} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
