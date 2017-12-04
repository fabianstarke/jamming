import React from 'react'
import './PlayList.css'
import TrackList  from '../TrackList/TrackList.js'

export default class PlayList extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  render() {
    return(
    <div className="Playlist">
      <input
      defaultValue='My Playlist'
      onChange={this.handleNameChange} />
      <TrackList
        tracks={this.props.playlistTracks}
        onRemove={this.props.onRemove} />
      <a
        className="Playlist-save"
        onClick={this.props.onSave}
        >SAVE TO SPOTIFY
      </a>
    </div>
   )
  }
}
