const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// මෙතනට ඔයාගේ බොටාගේ MONGO_URI එකම දාන්න
const MONGO_URI = "mongodb+srv://botmini:botmini@minibot.upglk0f.mongodb.net/?retryWrites=true&w=majority"; 

const client = new MongoClient(MONGO_URI);
let configsCol;

client.connect().then(() => {
    const db = client.db('DTEC_MINI'); // බොටාගේ ඩේටාබේස් නම
    configsCol = db.collection('configs');
    console.log("DB Connected");
});

app.post('/login', async (req, res) => {
    const { number, password } = req.body;
    const user = await configsCol.findOne({ number: number });
    if(user && user.web_password === password) {
        res.json({ success: true, config: user.config || {} });
    } else {
        res.json({ success: false });
    }
});

app.post('/save', async (req, res) => {
    const { number, settings } = req.body;
    // පරණ සෙටින්ග්ස් එක්ක අලුත් ඒවා එකතු කරනවා
    const user = await configsCol.findOne({ number: number });
    const newConfig = { ...user.config, ...settings };

    await configsCol.updateOne({ number: number }, { $set: { config: newConfig } });
    res.json({ success: true });
});

app.listen(3000, () => console.log("Dashboard Started"));
