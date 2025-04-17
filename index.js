const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const formData = req.body;
    console.log('✅ Received form data:', formData);

    // Forward the form data to Zapier webhook
    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/5510257/2xhjiqd/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    console.log('✅ Forwarded to Zapier with status:', zapierResponse.status);

    res.status(200).send('Data received and forwarded to Zapier successfully.');
  } catch (error) {
    console.error('❌ Error forwarding data:', error);
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
