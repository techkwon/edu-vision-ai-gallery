-- 1. 최신 100개를 제외한 오래된 이미지 삭제
DELETE FROM generated_images
WHERE id NOT IN (
  SELECT id FROM generated_images
  ORDER BY created_at DESC
  LIMIT 100
);

-- 2. 자동으로 100개만 유지하는 함수 생성
CREATE OR REPLACE FUNCTION maintain_image_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- 현재 이미지 개수가 100개를 초과하면 가장 오래된 것 삭제
  DELETE FROM generated_images
  WHERE id IN (
    SELECT id FROM generated_images
    ORDER BY created_at ASC
    LIMIT (
      SELECT COUNT(*) - 100 
      FROM generated_images
      WHERE (SELECT COUNT(*) FROM generated_images) > 100
    )
  );
  
  RETURN NEW;
END;
$function$;

-- 3. 새 이미지 삽입 시 자동으로 제한을 유지하는 트리거 생성
DROP TRIGGER IF EXISTS trigger_maintain_image_limit ON generated_images;
CREATE TRIGGER trigger_maintain_image_limit
AFTER INSERT ON generated_images
FOR EACH STATEMENT
EXECUTE FUNCTION maintain_image_limit();