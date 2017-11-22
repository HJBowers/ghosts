import React from 'react';
import { Text, View, StyleSheet, Switch, Slider, TouchableOpacity } from 'react-native';
// import TouchableOpacity from 'react-native-action-button';
import { Player, Recorder, MediaStates } from 'react-native-audio-toolkit'
import Icon from 'react-native-vector-icons/Ionicons';

let filename = 'test.mp4';

class AppContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      playPauseButton: 'Preparing...',
      recordButton: 'Preparing...',

      stopButtonDisabled: true,
      playButtonDisabled: true,
      recordButtonDisabled: true,

      progress: 0,

      error: null
    };
  }

  componentWillMount() {
    this.player = null;
    this.recorder = null;
    this.lastSeek = 0;

    this._reloadPlayer();
    this._reloadRecorder();

    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) {// && !this._dragging) {
        this.setState({progress: Math.max(0, this.player.currentTime) / this.player.duration});
      }
    }, 100);
  }

  componentWillUnmount() {
    //console.log('unmount');
    // TODO
    clearInterval(this._progressInterval);
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState(err) {
    this.setState({
      playPauseButton:      this.player    && this.player.isPlaying     ? 'Pause' : 'Play',
      recordButton:         this.recorder  && this.recorder.isRecording ? 'Stop' : 'Record',

      stopButtonDisabled:   !this.player   || !this.player.canStop,
      playButtonDisabled:   !this.player   || !this.player.canPlay || this.recorder.isRecording,
      recordButtonDisabled: !this.recorder || (this.player         && !this.player.isStopped),
    });
  }

  _playPause() {
    this.player.playPause((err, playing) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }

    this.lastSeek = Date.now();

    let position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._updateState();
    });
  }

  _reloadPlayer() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Player(filename, {
      autoDestroy: false
    }).prepare((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      }

      this._updateState();
    });

    this._updateState();

    this.player.on('ended', () => {
      this._updateState();
    });
    this.player.on('pause', () => {
      this._updateState();
    });
  }

  _reloadRecorder() {
    if (this.recorder) {
      this.recorder.destroy();
    }

    this.recorder = new Recorder(filename, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: 'max'
      //format: 'ac3', // autodetected
      //encoder: 'aac', // autodetected
    });

    this._updateState();
  }

  _toggleRecord() {
    if (this.player) {
      this.player.destroy();
    }

    this.recorder.toggleRecord((err, stopped) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      if (stopped) {
        this._reloadPlayer();
        this._reloadRecorder();
      }

      this._updateState();
    });
  }

  render() {
    return (
      <View>
        <Text ></Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity title={this.state.playPauseButton} disabled={this.state.playButtonDisabled} style={styles.button} onPress={() => this._playPause()} >
            <Text style={styles.title}>
              {this.state.playPauseButton}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity title="Stop" disabled={this.state.stopButtonDisabled} style={styles.button} onPress={() => this._stop()} >
            <Text style={styles.title}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.slider}>
          <Slider step={0.0001} disabled={this.state.playButtonDisabled} onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress}/>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity title={this.state.recordButton} disabled={this.state.recordButtonDisabled} style={styles.button} onPress={() => this._toggleRecord()} >
            <Text style={styles.title}>
              {this.state.recordButton}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.errorMessage}>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}

{/* <View>
  <Text style={styles.errorMessage}>{this.state.error}</Text>
</View> */}
var styles = StyleSheet.create({
  button: {
    padding: .1,
    backgroundColor: 'grey',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'black',
  },
  slider: {
    height: 30,
    margin: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 8,
    padding: 8,
    backgroundColor: 'blue',
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    margin: 10,
    color: 'red'
  }
  // settingsContainer: {
  //   flex: 1,
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // container: {
  //   borderRadius: 4,
  //   borderWidth: 0.5,
  //   borderColor: '#d6d7da',
  // },
});

export default AppContainer;
