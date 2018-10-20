
require('dotenv').config()

const Gplay = require('./lib/gplay')
const env = require('good-env')
let gplay
let creds

env.ensure('GOOGLE_EMAIL', 'GOOGLE_PASSWORD')

creds = {
  email: env.get('GOOGLE_EMAIL'),
  password: env.get('GOOGLE_PASSWORD')
}

gplay = Gplay(creds)

// @TODO: Make configurable later
const targetPlayList = 'vibe'

;(async function () {
  try {
    await gplay.init(creds)
    const list = await gplay.findPlayList(targetPlayList)
    let tracks

    if (!list) {
      throw Error(`Couldn't find a playlist names "${targetPlayList}"`)
    }

    console.log(`Found playlist: "${list.name}"`)

    tracks = await gplay.getPlayListTracks(list.id)
    console.log(`Founrd ${tracks.length} tracks in playlist "${list.name}"`)
    console.log(tracks)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}())
