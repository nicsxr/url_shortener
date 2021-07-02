import axios from 'axios'
import Create from './create';
import UrlInfo from './urlInfo';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
axios.defaults.baseURL = 'http://localhost:8000/';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Create} />
          <Route path="/info/:alias?" exact component={UrlInfo} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
