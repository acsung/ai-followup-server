const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require("openai");
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/classify-lead', async (req, res) => {
  const { name, email, phone, community, timeline, message } = req.body;

  const prompt = `Classify this buyer based on urgency:
Name: ${name}
Community: ${community}
Timeline: ${timeline}
Message: ${message}
Return JSON with buyer_type, suggested_campaign, sms_message, email_subject, email_body_preview.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = completion.choices[0].message.content;
    const jsonData = JSON.parse(responseText);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI processing failed.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

