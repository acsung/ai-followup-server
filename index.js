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
    console.log("🔍 RAW AI Response:\n", responseText); // 👈 This line logs it

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const jsonData = JSON.parse(jsonString);

    res.json(jsonData);
  } catch (error) {
    console.error("❌ Error parsing AI response:", error.message);
    res.status(500).json({ error: 'Failed to parse AI response' });
  }
});

const PORT = process.env.PORT || 5000;
const express = require('express');
const fetch = require('node-fetch'); // If not already imported
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Your existing routes are here...

// 🚀 NEW: Relay Form Data to Zapier
app.post("/webhook-relay", async (req, res) => {
  try {
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/5510257/2xhjiqd/";

    const response = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Zapier responded with status ${response.status}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error forwarding to Zapier:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

