import React, { Component } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import { View, Dimensions, StyleSheet} from 'react-native';
var TimerMixin = require('react-timer-mixin');

import Aubergine from '../mapStyles/aubergine.json';

let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component<{}> {

  constructor() {
    super();
    this.watchID = null;
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }

  componentDidMount() {
    this.setInterval( () => {
      let d = new Date();
      let result = d.getHours() + d.getMinutes() / MINUTES_IN_HOUR;
      this.setState({
        timeLineTop: result
      })
    }, 300);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
    (error) => console.log(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ styles.container }
          customMapStyle={ Aubergine }
          showsUserLocation={ true }
          region={ this.state.region }
          onRegionChange={ region => this.setState({ region }) }
          onRegionChangeComplete={ region => this.setState({ region }) }
        >
          <MapView.Marker coordinate={ this.state.region }/>
        </MapView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
    width: '100%',
  }
});
