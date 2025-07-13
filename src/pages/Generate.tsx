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
    { value: "watercolor", label: "따뜻한 수채화 스타일", prompt: "in a vibrant watercolor style" },
    { value: "illustration", label: "동화 일러스트", prompt: "as a cozy storybook illustration" },
    { value: "minimalist", label: "미니멀 라인 아트", prompt: "as minimalist line art, clean background" },
    { value: "fantasy", label: "판타지 아트", prompt: "as glowing fantasy art" },
    { value: "anime", label: "애니메이션 스타일", prompt: "as a detailed anime scene" },
    { value: "cyberpunk", label: "사이버펑크", prompt: "in cyberpunk style with neon colors" },
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
      const fullPrompt = `${prompt}, ${selectedStyle?.prompt}`;

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('이미지 생성에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        // Save to database
        const { data: imageData, error } = await supabase
          .from('generated_images')
          .insert({
            prompt: prompt,
            style: style,
            image_url: data.imageUrl
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
      console.error('Generation error:', error);
      toast({
        title: "생성 실패",
        description: "이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-vision-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "이미지 다운로드 중 오류가 발생했습니다.",
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
    <div className="min-h-screen bg-gradient-hero p-4">
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
            AI 이미지 생성
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                텍스트로 이미지 만들기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">프롬프트</label>
                <Textarea
                  placeholder="예: 아름다운 산 풍경, 노을이 지는 호수, 귀여운 고양이..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
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
                className="btn-hero w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    이미지 생성하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="card-glass">
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