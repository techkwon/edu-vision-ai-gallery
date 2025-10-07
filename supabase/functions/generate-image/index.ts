import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    // Supabase 클라이언트 초기화
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const { prompt, style } = requestBody;

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
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
      return new Response(
        JSON.stringify({ error: 'OpenAI API 키가 설정되지 않았습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OpenAI API 요청 시작, 프롬프트:', prompt);

    // OpenAI 이미지 생성 API 호출
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
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
    console.log('OpenAI API 성공 응답받음');

    if (!data.data || data.data.length === 0) {
      console.error('응답에 이미지 데이터가 없음:', data);
      return new Response(
        JSON.stringify({ error: '이미지 생성에 실패했습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const imageUrl = data.data[0].url;
    console.log('생성된 이미지 URL:', imageUrl);

    // OpenAI에서 이미지 다운로드
    console.log('OpenAI에서 이미지 다운로드 시작');
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('OpenAI 이미지 다운로드 실패');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Uint8Array(imageBuffer);
    console.log('이미지 다운로드 완료, 크기:', imageBlob.length, 'bytes');

    // Supabase Storage에 업로드
    const fileName = `education-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const filePath = `images/${fileName}`;
    
    console.log('Supabase Storage 업로드 시작:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('education-images')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Storage 업로드 오류:', uploadError);
      return new Response(
        JSON.stringify({ error: `Storage 업로드 실패: ${uploadError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Storage 업로드 성공:', uploadData);

    // 공개 URL 생성
    const { data: publicUrlData } = supabase.storage
      .from('education-images')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log('공개 URL 생성:', publicUrl);

    // 100개 제한 체크 및 오래된 파일 정리
    console.log('이미지 개수 체크 시작...');
    
    const { count, error: countError } = await supabase
      .from('generated_images')
      .select('*', { count: 'exact', head: true })
      .like('image_url', '%/storage/v1/object/public/education-images/%');

    if (!countError && count !== null && count >= 100) {
      console.log(`현재 스토리지 이미지 개수: ${count}개, 정리 시작...`);
      
      // 가장 오래된 이미지들 조회 (100개를 초과하는 만큼)
      const deleteCount = count - 99; // 새 이미지 포함해서 100개가 되도록
      const { data: oldImages, error: queryError } = await supabase
        .from('generated_images')
        .select('id, image_url')
        .like('image_url', '%/storage/v1/object/public/education-images/%')
        .order('created_at', { ascending: true })
        .limit(deleteCount);

      if (!queryError && oldImages && oldImages.length > 0) {
        console.log(`${oldImages.length}개의 오래된 이미지 삭제 시작`);
        
        // 스토리지 파일 경로 추출 및 삭제
        const filePaths = oldImages
          .map(img => {
            const url = img.image_url;
            if (url.includes('/education-images/')) {
              const parts = url.split('/education-images/');
              return parts[1];
            }
            return null;
          })
          .filter(path => path !== null);

        if (filePaths.length > 0) {
          console.log('삭제할 파일 경로:', filePaths);
          const { error: deleteStorageError } = await supabase.storage
            .from('education-images')
            .remove(filePaths);

          if (deleteStorageError) {
            console.error('스토리지 파일 삭제 오류:', deleteStorageError);
          } else {
            console.log(`${filePaths.length}개 스토리지 파일 삭제 완료`);
          }
        }

        // DB 레코드 삭제
        const imageIds = oldImages.map(img => img.id);
        const { error: deleteDbError } = await supabase
          .from('generated_images')
          .delete()
          .in('id', imageIds);

        if (deleteDbError) {
          console.error('DB 레코드 삭제 오류:', deleteDbError);
        } else {
          console.log(`${imageIds.length}개 DB 레코드 삭제 완료`);
        }
      }
    } else {
      console.log(`현재 스토리지 이미지 개수: ${count || 0}개, 정리 불필요`);
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: publicUrl,
        storagePath: filePath
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

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