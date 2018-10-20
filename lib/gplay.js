
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

    /**
     * Promise wrapper for playmusic.getPlayLists()
     *
     */
    getPlayLists() {
      return new Promise((resolve, reject) => {
        _client.getPlayLists((err, data) => {
          if (err) return reject(err)
          resolve(data.data.items)
        })
      })
    },

    /**
     * Fetch the tracks in the playlist with the specified ID
     *
     * @param playlistId The ID of the playlist object
     *
     */
    getPlayListTracks(playlistId) {
      return new Promise((resolve, reject) => {
        _client.getPlayListEntries((err, data) => {
          if (err) return reject(err)
          const tracks = data.data.items
            .filter(track => track.playlistId === playlistId)
          resolve(tracks)
        })
      })
    },

    /**
     * Fetch all the trackIds in the specified playlist. Since the API doesn't
     * always provide actual track information, I need to fetch the IDs only
     * and _then_ go back and fetch the actual track metadata using a different
     * API call
     *
     */
    getPlayListTrackIds(playlistId) {
      return new Promise((resolve, reject) => {
        _client.getPlayListEntries((err, data) => {
          if (err) return reject(err)
          const tracks = data.data.items
            .filter(item => item.playlistId === playlistId)
            // A future optimization could be to cache the tracks metadata for
            // the items that _do_ come back and only fetch metadata for items
            // with missing metadata. This will result in a non-optimized array
            // in that some items will be strings and some will be objects #fml
            .map(item => item.id)
          resolve(tracks)
        })
      })
    },

    getAllTracks(playlistId) {
      return new Promise(async (resolve, reject) => {
        const trackIds = await this.getPlayListTrackIds(playlistId)
        console.log(`got ${trackIds.length} trackIds`)
        _client.getAllTracks((err, data) => {
          if (err) return reject(err)
          // @TODO: Need to implement pagination using { data: nextPageToken }
          const tracks = trackIds.map(trackId => {
            const track = data.data.items.find(track => track.id === trackId)
          })
          .filter(track => track)

          resolve(tracks)
        })
      })
    },

    /**
     * Finds the playlist with the name specified which belongs to the current
     * user. The search ignores case.
     * @param name The name of the playlist
     *
     */
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
