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

    let allFiles: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    // 모든 파일 가져오기 (페이지네이션)
    while (hasMore) {
      const { data: files, error: listError } = await supabase
        .storage
        .from('education-images')
        .list('', {
          limit: limit,
          offset: offset,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        throw new Error(`스토리지 목록 조회 실패: ${listError.message}`);
      }

      if (files && files.length > 0) {
        allFiles = [...allFiles, ...files];
        offset += limit;
        hasMore = files.length === limit;
      } else {
        hasMore = false;
      }
    }

    console.log(`스토리지 파일 총: ${allFiles.length}개`);

    // .emptyFolderPlaceholder를 제외한 모든 파일 삭제
    const filesToDelete = allFiles.filter(file => 
      file.name !== '.emptyFolderPlaceholder'
    );

    console.log(`삭제할 파일: ${filesToDelete.length}개`);

    if (filesToDelete.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: '정리할 파일이 없습니다.',
          totalFiles: allFiles.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // 파일 삭제 (배치로 100개씩)
    let deletedCount = 0;
    for (let i = 0; i < filesToDelete.length; i += 100) {
      const batch = filesToDelete.slice(i, i + 100);
      const pathsToDelete = batch.map(f => f.name);
      
      const { error: deleteError } = await supabase
        .storage
        .from('education-images')
        .remove(pathsToDelete);

      if (deleteError) {
        console.error(`배치 ${i / 100 + 1} 삭제 실패:`, deleteError.message);
      } else {
        deletedCount += pathsToDelete.length;
        console.log(`배치 ${i / 100 + 1} 삭제 완료: ${pathsToDelete.length}개`);
      }
    }

    console.log(`전체 삭제 완료: ${deletedCount}개 파일`);

    return new Response(
      JSON.stringify({ 
        message: '스토리지 정리 완료',
        deletedFiles: deletedCount,
        totalFiles: allFiles.length
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
