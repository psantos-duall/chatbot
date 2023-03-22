import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import twilio from 'twilio';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
    accountSID: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN
});


const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

//console.log()


app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World'
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            prompt: `${prompt}`,
            temperature: 0.2,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        });
    }
    catch (error){
        console.log(error);
        res.status(500).send({error})
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))