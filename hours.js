import fs from "fs";
import fetch from 'node-fetch';

const postHours = async (secondsSpent, issue, started, user) => {
    const response = await fetch(
        `https://portalcliente.pixeon.com/rest/api/2/issue/${issue}/worklog`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(
                    user,
                ).toString('base64')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timeSpentSeconds: secondsSpent,
                started: started,
            }),
        },
    )

    const responseJson = await response.text()
    console.log(responseJson)
}

// READ CSV INTO STRING
var data = fs.readFileSync("./hours-oct.csv").toLocaleString();
// STRING TO ARRAY
var rows = data.split("\n"); // SPLIT ROWS
rows.forEach((row) => {
    const user = 'victor.silveira:rasengan123'
    const [hours, issue, day] = row.split(",");
    const secs = hours * 60 * 60

    postHours(secs, issue, day, user)
})