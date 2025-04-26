/** @format */

const express = require("express")
const cors = require("cors")

const PORT = process.env.PORT || 3001

const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));
  

app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}`)
})

app.get("/api", (req, res) => {
    res.json({ message: "hello from backend" })
})
// {
//     "store": "Супермаркет ВК",
//     "date": "2023-04-25",
//     "time": "13:01",
//     "items": [
//       {
//         "name": "Хлеб",
//         "price": 40,
//         "quantity": 2
//       },
//       {
//         "name": "Компот из сухофруктов",
//         "price": 22,
//         "quantity": 2
//       },
//       {
//         "name": "KPacHoe море",
//         "price": 250,
//         "quantity": 1
//       }
//     ],
//     "total": 2114
// }
