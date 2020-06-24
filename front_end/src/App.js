import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMapData } from './actions/traffic.action';

// import component for this
import TrafficGoogle from './components/TrafficGoogle';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount () {
      // get all map data
      this.props.getMapData();
  }

  render() {
    return (
        <Router>
          <Route exact path="/" component={TrafficGoogle} />
        </Router>
    );
   }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getMapData
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
