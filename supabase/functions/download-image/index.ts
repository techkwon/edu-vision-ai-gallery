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
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: '이미지 URL이 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('이미지 프록시 요청:', imageUrl);

    // OpenAI 이미지 URL에서 이미지 가져오기
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error('이미지 fetch 실패:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: '이미지를 가져올 수 없습니다.' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageBlob = await response.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    
    console.log('이미지 크기:', imageBuffer.byteLength, 'bytes');

    // Base64로 인코딩
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    // Content-Type 확인
    const contentType = response.headers.get('content-type') || 'image/png';
    
    return new Response(
      JSON.stringify({ 
        imageData: `data:${contentType};base64,${base64Image}`,
        contentType: contentType
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('이미지 프록시 오류:', error);
    return new Response(
      JSON.stringify({ error: `프록시 오류: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});