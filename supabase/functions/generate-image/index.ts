import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`받은 요청: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight 요청 처리');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 요청 본문 파싱
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('요청 본문:', requestBody);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return new Response(
        JSON.stringify({ error: '잘못된 JSON 형식입니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { prompt } = requestBody;

    if (!prompt) {
      console.log('프롬프트가 없음');
      return new Response(
        JSON.stringify({ error: '프롬프트가 필요합니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // OpenAI API 키 확인
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('OpenAI API Key 존재 여부:', !!openAIApiKey);
    console.log('OpenAI API Key 길이:', openAIApiKey ? openAIApiKey.length : 0);
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
      return new Response(
        JSON.stringify({ error: 'OpenAI API 키가 설정되지 않았습니다. Supabase 설정에서 OPENAI_API_KEY를 확인해주세요.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OpenAI API 요청 시작, 프롬프트:', prompt);

    // OpenAI 이미지 생성 API 호출 (더 간단한 모델 사용)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',  // 더 안정적인 모델 사용
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',  // high -> standard로 변경
        response_format: 'url'
      }),
    });

    console.log('OpenAI API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API 오류 응답:', errorText);
      
      let errorMessage = '이미지 생성에 실패했습니다.';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        console.error('오류 응답 JSON 파싱 실패:', e);
      }
      
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API 오류 (${response.status}): ${errorMessage}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('OpenAI API 성공 응답:', data);

    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url;
      console.log('생성된 이미지 URL:', imageUrl);
      
      return new Response(
        JSON.stringify({ imageUrl }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('응답에 이미지 데이터가 없음:', data);
      return new Response(
        JSON.stringify({ error: '이미지 생성에 실패했습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('이미지 생성 함수 오류:', error);
    return new Response(
      JSON.stringify({ 
        error: `서버 오류: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});