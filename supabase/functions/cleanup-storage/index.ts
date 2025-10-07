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

    // images 폴더의 모든 파일 가져오기 (페이지네이션)
    while (hasMore) {
      const { data: files, error: listError } = await supabase
        .storage
        .from('education-images')
        .list('images', {
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

    // education-으로 시작하는 파일만 필터링
    const educationFiles = allFiles.filter(file => 
      file.name.startsWith('education-')
    );

    console.log(`education- 파일: ${educationFiles.length}개`);

    // 최신순으로 정렬 (이미 created_at DESC로 정렬되어 있음)
    // 최신 100개를 제외한 나머지 삭제
    const filesToDelete = educationFiles.slice(100);

    console.log(`삭제할 파일 (100개 초과분): ${filesToDelete.length}개`);

    if (filesToDelete.length === 0) {
      console.log('파일 정리 완료. DB 정리 시작...');
    } else {
      // 파일 삭제 (배치로 100개씩, images/ 경로 포함)
      let deletedCount = 0;
      for (let i = 0; i < filesToDelete.length; i += 100) {
        const batch = filesToDelete.slice(i, i + 100);
        const pathsToDelete = batch.map(f => `images/${f.name}`);
        
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

      console.log(`파일 삭제 완료: ${deletedCount}개`);
    }

    // 2단계: DB 정리 - 스토리지에 없는 파일을 참조하는 레코드 삭제
    console.log('DB 정리 시작...');
    
    // 남은 파일명 목록 (최신 100개)
    const remainingFiles = educationFiles.slice(0, 100);
    const remainingFileNames = new Set(
      remainingFiles.map(f => `https://${Deno.env.get('SUPABASE_URL')?.split('//')[1]}/storage/v1/object/public/education-images/images/${f.name}`)
    );

    // DB에서 image_url이 스토리지 URL인데 파일이 없는 레코드 찾기
    const { data: dbRecords, error: dbError } = await supabase
      .from('generated_images')
      .select('id, image_url')
      .like('image_url', '%/storage/v1/object/public/education-images/%');

    if (dbError) {
      console.error('DB 조회 오류:', dbError.message);
    } else {
      const recordsToDelete = dbRecords?.filter(record => 
        !remainingFileNames.has(record.image_url)
      ) || [];

      console.log(`삭제할 DB 레코드: ${recordsToDelete.length}개`);

      if (recordsToDelete.length > 0) {
        const idsToDelete = recordsToDelete.map(r => r.id);
        const { error: deleteDbError } = await supabase
          .from('generated_images')
          .delete()
          .in('id', idsToDelete);

        if (deleteDbError) {
          console.error('DB 삭제 오류:', deleteDbError.message);
        } else {
          console.log(`DB 정리 완료: ${recordsToDelete.length}개 레코드 삭제`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: '스토리지 및 DB 정리 완료',
        deletedFiles: filesToDelete.length,
        remainingFiles: educationFiles.slice(0, 100).length,
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
