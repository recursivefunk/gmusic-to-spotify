
const PlayMusic = require('playmusic')
let _client

module.exports = function (creds) {
  _client = new PlayMusic()

  const api = Object.create({
    init() {
      return new Promise((resolve, reject) => {
        _client.init(creds, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    },

    getPlayLists() {
      return new Promise((resolve, reject) => {
        _client.getPlayLists((err, data) => {
          if (err) return reject(err)
          resolve(data.data.items)
        })
      })
    },

    getPlayListTracks(playlistId) {
      return new Promise((resolve, reject) => {
        _client.getPlayListEntries((err, data) => {
          if (err) return reject(err)
          const tracks = data.data.items
            .filter(track => track.playlistId === playlistId)
            //.filter(track => track.track)
            //.map(track => track.track)
          resolve(tracks)
        })
      })
    },

    findPlayList(name) {
      return new Promise((resolve, reject) => {
        this.getPlayLists()
          .then(playlists => {
            const list = playlists
              .find(l => l.name.toLowerCase() === name.toLowerCase())
            resolve(list)
          })
          .catch(err => reject(err))
      })
    }
  })


  return api
}
