-- 기존 취약한 업데이트 정책 제거
DROP POLICY IF EXISTS "Anyone can update generation requests" ON generation_requests;

-- 시스템만 업데이트 가능하도록 제한 (일반 사용자는 업데이트 불가)
CREATE POLICY "Only system can update generation requests"
ON generation_requests
FOR UPDATE
USING (false);

-- generated_images 테이블에도 보안 강화
CREATE POLICY "No one can update generated images"
ON generated_images
FOR UPDATE
USING (false);

CREATE POLICY "No one can delete generated images"
ON generated_images
FOR DELETE
USING (false);

CREATE POLICY "No one can delete generation requests"
ON generation_requests
FOR DELETE
USING (false);

-- 함수 보안 강화 (search_path 설정)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_generation_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;