import fs from 'fs'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const postHours = async (secondsSpent, issue, started, user) => {
  await sleep(Math.random() * 2000)

  const response = await fetch(
    `${process.env.HOST_JIRA}/rest/api/2/issue/${issue}/worklog`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(user).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeSpentSeconds: secondsSpent,
        started: started,
      }),
    },
  )

  let responseJson
  try {
    responseJson = await response.json()
  } catch (error) {
    responseJson = await response.text()
  }
  console.log(responseJson)
}

const data = fs.readFileSync('./hours-oct.csv').toLocaleString()
const rows = data.split('\n')

rows.forEach((row) => {
  const user = process.env.USER_PASS
  const [hours, issue, day] = row.split(',')
  const secs = hours * 60 * 60

  postHours(secs, issue, day, user)
})
