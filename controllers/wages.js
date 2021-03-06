const Job = require('../models/job');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
  createWage,
  getWages
};

async function createWage(req, res) {
  console.log('in wage controller')
  const user = await User.findOne({ _id: req.user._id });
  const job = await Job.findById(req.params.id)
  try {
    job.wages.push(req.body)
    await job.save();
    const token = createJWT(user);
    res.json({ token })
  } catch (err) {
    // Probably a duplicate email
    console.log(err)
    res.status(400).json(err);
  }
}

async function getWages(req, res) {
  const date = new Date();  // 2009-11-10
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.toLocaleString('default', { year: 'numeric' });
  let curr = new Date
  let week = []
  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i
    let day = new Date(curr.setDate(first))
    week.push(day)
  }
  let monday = week[0]
  let sunday = week[6]
  sunday.setHours(00, 00, 00, 00)
  monday.setHours(00, 00, 00, 00)
  const job = await Job.findById(req.params.id)
  const user = await User.findOne({ _id: req.user._id });
  let wages = []
  let totalTips = 0
  let totalWages = 0
  let totalHours = 0
  let totalIncome = 0
  let averageIncome = 0
  let mondayTotal = 0
  let tuesdayTotal = 0
  let wednesdayTotal = 0
  let thursdayTotal = 0
  let fridayTotal = 0
  let saturdayTotal = 0
  let sundayTotal = 0
  let mondayHours = 0
  let tuesdayHours = 0
  let wednesdayHours = 0
  let thursdayHours = 0
  let fridayHours = 0
  let saturdayHours = 0
  let sundayHours = 0
  let mondayAvg = 0
  let tuesdayAvg = 0
  let wednesdayAvg = 0
  let thursdayAvg = 0
  let fridayAvg = 0
  let saturdayAvg = 0
  let sundayAvg = 0
  if (req.params.viewBy === 'w') {
    for (let i = 0; i < job.wages.length; i++) {
      if (job.wages[i].date <= sunday && job.wages[i].date >= monday) {
        wages.push(job.wages[i])
        totalTips += job.wages[i].tips
        totalWages += job.wages[i].wage
        totalHours += job.wages[i].hours
        totalIncome = totalTips + totalWages
        if (job.wages[i].date.getDay() === 1) {
          mondayTotal += job.wages[i].tips + job.wages[i].wage
          mondayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 2) {
          tuesdayTotal += job.wages[i].tips + job.wages[i].wage
          tuesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 3) {
          wednesdayTotal += job.wages[i].tips + job.wages[i].wage
          wednesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 4) {
          thursdayTotal += job.wages[i].tips + job.wages[i].wage
          thursdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 5) {
          fridayTotal += job.wages[i].tips + job.wages[i].wage
          fridayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 6) {
          saturdayTotal += job.wages[i].tips + job.wages[i].wage
          saturdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 7) {
          sundayTotal += job.wages[i].tips + job.wages[i].wage
          sundayHours += job.wages[i].hours
        }
      }
    }
    averageIncome = totalIncome / totalHours
    mondayAvg = mondayTotal / mondayHours
    tuesdayAvg = tuesdayTotal / tuesdayHours
    wednesdayAvg = wednesdayTotal / wednesdayHours
    thursdayAvg = thursdayTotal / thursdayHours
    fridayAvg = fridayTotal / fridayHours
    saturdayAvg = saturdayTotal / saturdayHours
    sundayAvg = sundayTotal / sundayHours
  } else if (req.params.viewBy === 'm') {
    for (let i = 0; i < job.wages.length; i++) {
      if (job.wages[i].date.toLocaleString('default', { month: 'long' }) === date.toLocaleString('default', { month: 'long' })) {
        wages.push(job.wages[i])
        totalTips += job.wages[i].tips
        totalWages += job.wages[i].wage
        totalHours += job.wages[i].hours
        totalIncome = totalTips + totalWages
        if (job.wages[i].date.getDay() === 1) {
          mondayTotal += job.wages[i].tips + job.wages[i].wage
          mondayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 2) {
          tuesdayTotal += job.wages[i].tips + job.wages[i].wage
          tuesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 3) {
          wednesdayTotal += job.wages[i].tips + job.wages[i].wage
          wednesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 4) {
          thursdayTotal += job.wages[i].tips + job.wages[i].wage
          thursdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 5) {
          fridayTotal += job.wages[i].tips + job.wages[i].wage
          fridayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 6) {
          saturdayTotal += job.wages[i].tips + job.wages[i].wage
          saturdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 7) {
          sundayTotal += job.wages[i].tips + job.wages[i].wage
          sundayHours += job.wages[i].hours
        }
      }
    }
    averageIncome = totalIncome / totalHours
    mondayAvg = mondayTotal / mondayHours
    tuesdayAvg = tuesdayTotal / tuesdayHours
    wednesdayAvg = wednesdayTotal / wednesdayHours
    thursdayAvg = thursdayTotal / thursdayHours
    fridayAvg = fridayTotal / fridayHours
    saturdayAvg = saturdayTotal / saturdayHours
    sundayAvg = sundayTotal / sundayHours
  } else if (req.params.viewBy === 'y') {
    for (let i = 0; i < job.wages.length; i++) {
      if (job.wages[i].date.toLocaleString('default', { year: 'numeric' }) === date.toLocaleString('default', { year: 'numeric' })) {
        wages.push(job.wages[i])
        totalTips += job.wages[i].tips
        totalWages += job.wages[i].wage
        totalHours += job.wages[i].hours
        totalIncome = totalTips + totalWages
        if (job.wages[i].date.getDay() === 1) {
          mondayTotal += job.wages[i].tips + job.wages[i].wage
          mondayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 2) {
          tuesdayTotal += job.wages[i].tips + job.wages[i].wage
          tuesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 3) {
          wednesdayTotal += job.wages[i].tips + job.wages[i].wage
          wednesdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 4) {
          thursdayTotal += job.wages[i].tips + job.wages[i].wage
          thursdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 5) {
          fridayTotal += job.wages[i].tips + job.wages[i].wage
          fridayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 6) {
          saturdayTotal += job.wages[i].tips + job.wages[i].wage
          saturdayHours += job.wages[i].hours
        } else if (job.wages[i].date.getDay() === 7) {
          sundayTotal += job.wages[i].tips + job.wages[i].wage
          sundayHours += job.wages[i].hours
        }
      }
    }
    averageIncome = totalIncome / totalHours
    mondayAvg = mondayTotal / mondayHours
    tuesdayAvg = tuesdayTotal / tuesdayHours
    wednesdayAvg = wednesdayTotal / wednesdayHours
    thursdayAvg = thursdayTotal / thursdayHours
    fridayAvg = fridayTotal / fridayHours
    saturdayAvg = saturdayTotal / saturdayHours
    sundayAvg = sundayTotal / sundayHours
  }
  try {
    const jobs = await Job.find({ user: req.user })
    res.status(200).json({
      totalTips, totalWages, totalHours, totalIncome, averageIncome,
      mondayAvg, tuesdayAvg, wednesdayAvg, thursdayAvg, fridayAvg, saturdayAvg, sundayAvg, wages
    })
  } catch (err) {
    res.json(err)
  }
}

function createJWT(user) {
  return jwt.sign(
    { user }, // data payload
    SECRET,
    { expiresIn: '24h' }
  );
}