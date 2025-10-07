import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    console.log('스토리지 정리 시작...');

    // 1. DB에 있는 image_url에서 스토리지 파일명 추출
    const { data: validImages, error: dbError } = await supabase
      .from('generated_images')
      .select('image_url');

    if (dbError) {
      throw new Error(`DB 조회 실패: ${dbError.message}`);
    }

    // 스토리지 URL에서 파일명만 추출
    const validPaths = new Set(
      validImages
        ?.map(img => {
          const url = img.image_url;
          // Supabase Storage URL 형식: https://...supabase.co/storage/v1/object/public/education-images/파일명
          if (url && url.includes('/storage/v1/object/public/education-images/')) {
            const parts = url.split('/education-images/');
            return parts[1];
          }
          return null;
        })
        .filter(path => path) || []
    );

    console.log(`유효한 이미지 경로: ${validPaths.size}개`);

    // 2. education-images 버킷의 모든 파일 목록 가져오기
    const { data: files, error: listError } = await supabase
      .storage
      .from('education-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      throw new Error(`스토리지 목록 조회 실패: ${listError.message}`);
    }

    console.log(`스토리지 파일 총: ${files?.length || 0}개`);

    // 3. DB에 없는 파일들 찾기
    const filesToDelete = files?.filter(file => 
      !validPaths.has(file.name) && file.name !== '.emptyFolderPlaceholder'
    ) || [];

    console.log(`삭제할 파일: ${filesToDelete.length}개`);

    if (filesToDelete.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: '정리할 파일이 없습니다.',
          validFiles: validPaths.size,
          totalFiles: files?.length || 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // 4. 파일 삭제 (배치 처리)
    const pathsToDelete = filesToDelete.map(f => f.name);
    const { data: deleteData, error: deleteError } = await supabase
      .storage
      .from('education-images')
      .remove(pathsToDelete);

    if (deleteError) {
      throw new Error(`파일 삭제 실패: ${deleteError.message}`);
    }

    console.log(`삭제 완료: ${pathsToDelete.length}개 파일`);

    return new Response(
      JSON.stringify({ 
        message: '스토리지 정리 완료',
        validFiles: validPaths.size,
        deletedFiles: pathsToDelete.length,
        deletedPaths: pathsToDelete
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('스토리지 정리 오류:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
