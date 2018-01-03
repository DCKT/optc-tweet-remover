require('dotenv').config()

const Twitter = require('twitter')
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
const MATCHING_WORD = 'Escargophone attrapé'
const userName = process.argv[2]

if (userName) {
  checkProfile(userName)
} else {
  console.log('\n/!\\ ERROR /!\\')
  console.log('You must provide an user name.\n')
}

function checkProfile (name) {
  client
    .get('users/search', { q: encodeURIComponent(name), count: 1 })
    .then((users, response) => {
      if (users.length) {
        const user = users[0]
        if (user.status.text.includes(MATCHING_WORD)) {
          client.post(`statuses/destroy/${user.status.id_str}`, err => {
            if (err) {
              console.log('An error occurred during tweet deletion')
              console.log(err)
            } else {
              console.log('Tweet deleted !')
            }
          })
        } else {
          console.log('last tweet is not spam')
        }
      }
    })
    .catch(err => {
      console.log('An error occurred during user fetching')
      console.log(err)
    })
}
