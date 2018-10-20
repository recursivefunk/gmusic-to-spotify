
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
  let list
  let trackIds

  try {
    await gplay.init(creds)
    list = await gplay.findPlayList(targetPlayList)

    if (!list) {
      throw Error(`Couldn't find a playlist names "${targetPlayList}"`)
    }

    console.log(`Found playlist: "${list.name}"`)

    const allTracks = await gplay.getAllTracks(list.id)
    console.log(allTracks.length)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}())
