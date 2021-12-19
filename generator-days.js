import moment from 'moment'
import fs from 'fs'

function calculateBusinessDays(d1, d2) {
  const businessDay = []
  const days = d2.diff(d1, 'days') + 1
  let newDay = d1.toDate(),
    workingDays = 0,
    sundays = 0,
    saturdays = 0

  for (let i = 0; i < days; i++) {
    const date = moment(newDay)
    const day = newDay.getDay()
    newDay = d1.add(1, 'days').toDate()
    const isWeekend = day % 6 === 0
    if (!isWeekend) {
      businessDay.push(`8,AURORA-00000,${date.format("YYYY-MM-DD")}T18:00:00.000+0000`)
      workingDays++
    } else {
      if (day === 6) saturdays++
      if (day === 0) sundays++
    }
  }

  console.table({
    'Total Days:': days,
    workingDays: workingDays,
    saturdays: saturdays,
    sundays: sundays,
  })

  return businessDay
}

const options = {}
process.argv.forEach((val) => {
  const [attr, date] = val.split('=')
  if (attr && date) {
    options[attr.replace('--', '')] = date
  }
})

const { start, end } = options

const write = calculateBusinessDays(moment(start), moment(end)).join('\n')

fs.writeFileSync('hours-oct.csv', write, 'utf8')
