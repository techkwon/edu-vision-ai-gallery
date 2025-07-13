-- 교육 철학 이미지용 Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('education-images', 'education-images', true);

-- 모든 사용자가 이미지를 업로드할 수 있도록 정책 설정
CREATE POLICY "모든 사용자가 교육 이미지를 업로드할 수 있음" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'education-images');

-- 모든 사용자가 이미지를 볼 수 있도록 정책 설정
CREATE POLICY "모든 사용자가 교육 이미지를 볼 수 있음" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'education-images');

-- 모든 사용자가 이미지를 다운로드할 수 있도록 정책 설정
CREATE POLICY "모든 사용자가 교육 이미지를 다운로드할 수 있음" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'education-images');

-- generated_images 테이블에 storage_path 컬럼 추가
ALTER TABLE public.generated_images 
ADD COLUMN storage_path text;