exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { systemPrompt, userPrompt, modelType } = JSON.parse(event.body);
    
    // Choose model based on type (default to Mistral for text)
    const model = modelType || 'mistralai/Mistral-7B-Instruct-v0.2';
    
    // Format the prompt for Instruct models
    const formattedPrompt = `<s>[INST] ${systemPrompt ? systemPrompt + '\n\n' : ''}${userPrompt} [/INST]`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          return_full_text: false,
        }
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        return { statusCode: response.status, body: JSON.stringify({ error: 'HuggingFace API Error', details: errorData }) };
    }

    const data = await response.json();
    
    // Extract the generated text safely depending on the model's output format
    let generatedText = '';
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        generatedText = data[0].generated_text;
    } else if (data.generated_text) {
        generatedText = data.generated_text;
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
