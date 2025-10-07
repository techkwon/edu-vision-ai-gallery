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

    // education-images 버킷의 모든 파일 목록 가져오기
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

    // .emptyFolderPlaceholder를 제외한 모든 파일 삭제
    const filesToDelete = files?.filter(file => 
      file.name !== '.emptyFolderPlaceholder'
    ) || [];

    console.log(`삭제할 파일: ${filesToDelete.length}개`);

    if (filesToDelete.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: '정리할 파일이 없습니다.',
          totalFiles: files?.length || 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // 파일 삭제 (배치 처리)
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
