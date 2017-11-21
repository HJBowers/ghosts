import React, { Component } from 'react';
import { Platform, Text, View, TouchableHighlight } from 'react-native';
import { Player, Recorder, MediaStates } from 'react-native-audio-toolkit';
// import { Scene, Router } from 'react-native-router-flux'

import Map from './src/Map'
// import RecorderComp from './src/recorder/Recorder'
// import PlayerComp from './src/player/Player'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = {
      disabled: false,
    }
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
        <Map/>
        <TouchableHighlight disabled={this.state.disabled} onPress={() => this._onPress()}>
          <Text>
            Press me!
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}
