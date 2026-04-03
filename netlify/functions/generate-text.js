export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { systemPrompt, userPrompt, modelType } = JSON.parse(event.body);
    
    // Choose model based on type (default to Llama 3 for best quality on new router)
    const model = modelType || 'meta-llama/Llama-3.1-8B-Instruct:fastest';

    const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
            { role: "system", content: systemPrompt || "You are a helpful assistant." },
            { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        return { statusCode: response.status, body: JSON.stringify({ error: 'HuggingFace API Error', details: errorData }) };
    }

    const data = await response.json();
    
    // Extract the generated text safely depending on the model's output format
    let generatedText = '';
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        generatedText = data.choices[0].message.content;
    } else {
        generatedText = JSON.stringify(data);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: generatedText })
    };

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
    };
  }
};
