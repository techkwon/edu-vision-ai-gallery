import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Grid3X3, Focus, Heart, Download, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "이미지 로드 실패",
        description: "갤러리 이미지를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      console.log('갤러리 다운로드 시작:', imageUrl);
      
      // Supabase Storage URL에서 직접 다운로드
      const response = await fetch(imageUrl);
      
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
      a.download = `교육철학-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9가-힣]/g, '_')}-${Date.now()}.${extension}`;
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
      console.error('갤러리 다운로드 오류:', error);
      toast({
        title: "다운로드 실패",
        description: error instanceof Error ? error.message : "이미지 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero mobile-scroll flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-muted-foreground">갤러리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero mobile-scroll p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              AI 갤러리
            </h1>
            <span className="text-sm text-muted-foreground">
              {images.length}개의 작품
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              그리드
            </Button>
            <Button
              variant={viewMode === 'focus' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('focus')}
              className="gap-2"
            >
              <Focus className="h-4 w-4" />
              포커스
            </Button>
          </div>
        </div>

        {images.length === 0 ? (
          <Card className="card-glass text-center py-16 mobile-responsive">
            <CardContent>
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Grid3X3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">아직 생성된 이미지가 없어요</h3>
                  <p>첫 번째 AI 아트를 만들어보세요!</p>
                </div>
                <Button onClick={() => navigate('/generate')} className="btn-hero">
                  이미지 생성하러 가기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <Dialog key={image.id}>
                 <DialogTrigger asChild>
                   <Card className="card-glass card-animated overflow-hidden group touch-target">
                    <div className="relative">
                      <img 
                        src={image.image_url} 
                        alt={image.prompt}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-medium truncate">{image.prompt}</p>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <img 
                        src={image.image_url} 
                        alt={image.prompt}
                        className="w-full rounded-lg shadow-medium"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">이미지 정보</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">프롬프트</label>
                            <p className="text-sm bg-muted/50 p-3 rounded-lg italic">"{image.prompt}"</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">스타일</label>
                            <p className="text-sm capitalize">{image.style}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(image.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleDownload(image.image_url, image.prompt)}
                          className="flex-1 gap-2"
                        >
                          <Download className="h-4 w-4" />
                          다운로드
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          /* Focus View */
          <div className="max-w-4xl mx-auto">
            <Card className="card-glass card-animated overflow-hidden mobile-responsive">
              <div className="relative">
                <img 
                  src={images[currentIndex]?.image_url} 
                  alt={images[currentIndex]?.prompt}
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0"
                      variant="secondary"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0"
                      variant="secondary"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">프롬프트</h3>
                    <p className="text-muted-foreground italic">"{images[currentIndex]?.prompt}"</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{images[currentIndex]?.style}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(images[currentIndex]?.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDownload(images[currentIndex]?.image_url, images[currentIndex]?.prompt)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        다운로드
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex justify-center mt-6 gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentIndex ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;