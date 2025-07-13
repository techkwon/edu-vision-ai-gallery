import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ArrowLeft, Download, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const styles = [
    { value: "watercolor", label: "따뜻한 수채화 스타일", prompt: "in a warm watercolor style with soft educational elements" },
    { value: "illustration", label: "교육적 일러스트", prompt: "as an inspiring educational illustration with books, learning symbols, and warm lighting" },
    { value: "minimalist", label: "미니멀 교육 아트", prompt: "as minimalist educational art with clean lines, books, and learning symbols" },
    { value: "academic", label: "클래식 아카데믹", prompt: "in classical academic style with scholarly elements and warm library atmosphere" },
    { value: "modern", label: "현대 교육 스타일", prompt: "in modern educational style with contemporary classroom elements and inspiring atmosphere" },
    { value: "nature", label: "자연 친화 교육", prompt: "blending education with nature, showing growth and learning in natural settings" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "프롬프트를 입력해주세요",
        description: "이미지를 생성할 텍스트를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!style) {
      toast({
        title: "스타일을 선택해주세요",
        description: "원하는 이미지 스타일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const selectedStyle = styles.find(s => s.value === style);
      const fullPrompt = `Educational philosophy concept: "${prompt}". This represents a teacher's core educational belief and teaching approach. Visual representation ${selectedStyle?.prompt}. Include symbolic elements of education, learning, growth, and inspiration.`;

      const response = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: fullPrompt,
          style: style
        }
      });

      console.log('Supabase 함수 응답:', response);

      if (response.error) {
        console.error('Supabase 함수 오류:', response.error);
        throw new Error(response.error.message || '이미지 생성에 실패했습니다');
      }

      const data = response.data;
      console.log('응답 데이터:', data);
      
      if (data && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        // Save to database with storage path
        const { data: imageData, error } = await supabase
          .from('generated_images')
          .insert({
            prompt: prompt,
            style: style,
            image_url: data.imageUrl,
            storage_path: data.storagePath
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
        } else {
          setImageId(imageData.id);
        }

        toast({
          title: "이미지가 생성되었습니다!",
          description: "멋진 AI 아트가 완성되었어요.",
        });
      }
    } catch (error) {
      console.error('이미지 생성 오류 상세:', error);
      let errorMessage = '이미지 생성 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "생성 실패",
        description: errorMessage + " 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      console.log('Supabase Storage에서 다운로드 시작:', generatedImage);
      
      // Supabase Storage URL에서 직접 다운로드
      const response = await fetch(generatedImage);
      
      if (!response.ok) {
        throw new Error(`다운로드 실패: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob 생성 완료:', blob.size, 'bytes');
      
      // 파일 타입 확인
      const contentType = response.headers.get('content-type') || blob.type || 'image/png';
      let extension = 'png';
      if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        extension = 'jpg';
      } else if (contentType.includes('webp')) {
        extension = 'webp';
      }
      
      // 다운로드 실행
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `교육철학-이미지-${Date.now()}.${extension}`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      // 클린업
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      toast({
        title: "다운로드 완료",
        description: "이미지가 성공적으로 다운로드되었습니다.",
      });
      
    } catch (error) {
      console.error('다운로드 오류:', error);
      toast({
        title: "다운로드 실패",
        description: error instanceof Error ? error.message : "이미지 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && generatedImage) {
      try {
        await navigator.share({
          title: 'AI Vision Gallery',
          text: prompt,
          url: window.location.href,
        });
      } catch (error) {
        // Copy to clipboard fallback
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "링크가 복사되었습니다",
          description: "클립보드에 링크가 복사되었어요.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero mobile-scroll p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Button>
          <h1 className="text-3xl font-display font-bold text-gradient">
          AI 교육 철학 시각화
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="card-glass card-animated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                나의 교육 철학 표현하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Philosophy Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">교육 철학 (한 문장으로 표현)</label>
                <Textarea
                  placeholder="예: 나는 따뜻한 질문을 통해 학생들의 숨겨진 가능성을 이끌어내는 교사다."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  💡 팁: 가장 중요하게 생각하는 교육적 가치나 신념을 담아 문장을 만들어보세요
                </p>
              </div>

              {/* Style Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">스타일</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="이미지 스타일을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || !style}
                className="btn-hero w-full touch-target"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    교육 철학 이미지 생성하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="card-glass card-animated">
            <CardHeader>
              <CardTitle>생성 결과</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-80 space-y-4">
                  <div className="spinner" />
                  <div className="text-center">
                    <p className="font-medium">AI가 이미지를 생성하고 있어요</p>
                    <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  <div className="relative group overflow-hidden rounded-lg">
                    <img 
                      src={generatedImage} 
                      alt="생성된 이미지"
                      className="w-full h-auto rounded-lg shadow-medium transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      다운로드
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                      <Share className="h-4 w-4" />
                      공유
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">사용된 프롬프트:</p>
                    <p className="text-sm text-muted-foreground italic">"{prompt}"</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-muted-foreground">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>프롬프트를 입력하고 이미지를 생성해보세요</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generate;