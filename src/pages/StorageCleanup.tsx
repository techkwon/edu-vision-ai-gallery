import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StorageCleanup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('cleanup-storage');

      if (error) throw error;

      setResult(data);
      toast({
        title: "정리 완료",
        description: `${data.deletedFiles}개의 파일을 삭제했습니다.`,
      });
    } catch (error) {
      console.error('정리 오류:', error);
      toast({
        title: "정리 실패",
        description: error instanceof Error ? error.message : "스토리지 정리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero mobile-scroll p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              스토리지 정리
            </CardTitle>
            <CardDescription>
              사용되지 않는 이미지 파일을 삭제하여 스토리지 공간을 확보합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                이 작업은 데이터베이스에 등록되지 않은 스토리지의 이미지 파일들을 삭제합니다.
                삭제된 파일은 복구할 수 없습니다.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleCleanup}
              disabled={isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner h-4 w-4" />
                  정리 중...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  스토리지 정리 시작
                </>
              )}
            </Button>

            {result && (
              <Alert className={result.deletedFiles > 0 ? "border-green-500" : ""}>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">{result.message}</p>
                    <ul className="text-sm space-y-1">
                      <li>• 유효한 파일: {result.validFiles}개</li>
                      <li>• 삭제된 파일: {result.deletedFiles}개</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageCleanup;
