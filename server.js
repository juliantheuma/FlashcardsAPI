import express from "express";

import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})


const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message: "Hello"
    })
})

app.get("/api", async (req,res) => {
    try{
        const frontCard = req.query.frontCard;
        const savedAnswer = req.query.savedAnswer;
        const userAnswer = req.query.userAnswer;


        let prompt = `I have this question: ${frontCard}. My notes say: [${savedAnswer}]. If I answered with [${userAnswer}], grade my answer (A-F) and provide feedback in the format {"grade": "____", "feedback": "____"}`

        console.log(frontCard)
        console.log(savedAnswer)
        console.log(userAnswer)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          })
          console.log(response.data.choices[0].text)
          let parsed = (JSON.parse(response.data.choices[0].text))

          res.status(200).send(parsed)
    }
    catch (error){
        console.log(error)
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"))