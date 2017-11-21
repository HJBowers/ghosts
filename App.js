import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Aubergine from './mapStyles/aubergine.json';
import {
    Player,
    Recorder,
    MediaStates
} from 'react-native-audio-toolkit';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

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
      disabled: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
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

  _onPress() {
    // Disable button while recording and playing back
    this.setState({disabled: true});

    // Start recording
    let rec = new Recorder("filename.mp4").record();

    // Stop recording after approximately 3 seconds
    setTimeout(() => {
      rec.stop((err) => {
        // NOTE: In a real situation, handle possible errors here

        // Play the file after recording has stopped
        new Player("filename.mp4")
        .play()
        .on('ended', () => {
          // Enable button again after playback finishes
          this.setState({disabled: false});
        });
      });
    }, 3000);
  }

  render() {
    return (
      <View>
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ styles.container }
          customMapStyle={ Aubergine }
          initialRegion={{
            latitude: 37.801508,
            longitude: -122.274012,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ styles.container }
          customMapStyle={ Aubergine }
          showsUserLocation={ true }
          region={ this.state.region }
          onRegionChange={ region => this.setState({ region }) }
          onRegionChangeComplete={ region => this.setState({ region }) }
        >
          <MapView.Marker
            coordinate={ this.state.region }
          />
        </MapView>
        <TouchableHighlight disabled={this.state.disabled} onPress={() => this._onPress()}>
          <Text>
            Press me!
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '40%',
    width: '100%',
  }
});
