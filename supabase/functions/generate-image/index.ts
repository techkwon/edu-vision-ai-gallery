import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1 }
      })
    });

    const result = await response.json();
    
    if (result.predictions?.[0]?.bytesBase64Encoded) {
      const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    throw new Error('No image data received');
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});