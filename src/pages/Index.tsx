import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Image, Images, ArrowRight, Zap, Palette, Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI 이미지 생성",
      description: "텍스트만으로 놀라운 이미지를 만들어보세요",
      action: () => navigate('/generate')
    },
    {
      icon: <Images className="h-8 w-8" />,
      title: "갤러리 탐험",
      description: "다양한 AI 아트 작품들을 감상하세요",
      action: () => navigate('/gallery')
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "다양한 스타일",
      description: "수채화부터 사이버펑크까지 원하는 스타일로",
      action: () => navigate('/generate')
    }
  ];

  const stats = [
    { number: "1000+", label: "생성된 이미지" },
    { number: "50+", label: "다양한 스타일" },
    { number: "24/7", label: "언제든 이용가능" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              AI Vision Gallery
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/gallery')}>
              갤러리
            </Button>
            <Button className="btn-hero" onClick={() => navigate('/generate')}>
              이미지 생성
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                <span className="text-gradient">AI로 그리는</span>
                <br />
                <span className="text-foreground">무한한 상상</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                텍스트 한 줄로 놀라운 이미지를 만들어보세요. 
                최첨단 AI 기술이 당신의 상상을 현실로 만들어드립니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-hero text-lg px-8 py-6"
                onClick={() => navigate('/generate')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                지금 시작하기
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/gallery')}
              >
                <Images className="h-5 w-5 mr-2" />
                갤러리 구경하기
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-large animate-float">
              <img 
                src={heroImage} 
                alt="AI Vision Gallery Hero"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-bounce" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full opacity-30 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            <span className="text-gradient">AI와 함께하는</span> 창작 여행
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            간단한 텍스트부터 복잡한 프롬프트까지, 당신의 아이디어를 멋진 이미지로 변환하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-glass card-animated cursor-pointer group"
              onClick={feature.action}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="pt-4">
                  <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    시작하기
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            어떻게 <span className="text-gradient">작동하나요?</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "텍스트 입력",
                description: "원하는 이미지를 설명하는 텍스트를 입력하세요",
                icon: <Zap className="h-6 w-6" />
              },
              {
                step: "02", 
                title: "스타일 선택",
                description: "수채화, 일러스트, 사이버펑크 등 원하는 스타일을 선택하세요",
                icon: <Palette className="h-6 w-6" />
              },
              {
                step: "03",
                title: "AI 생성",
                description: "AI가 몇 초 만에 놀라운 이미지를 생성해드립니다",
                icon: <Image className="h-6 w-6" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-white shadow-glow">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="card-glass bg-gradient-card">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-white">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-display font-bold">
              당신의 창의적인 여행을 <span className="text-gradient">시작하세요</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              무료로 시작하여 무한한 가능성을 탐험해보세요. 
              수백만 가지 스타일과 아이디어가 당신을 기다립니다.
            </p>
            <Button 
              size="lg" 
              className="btn-hero text-lg px-10 py-6"
              onClick={() => navigate('/generate')}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              첫 이미지 만들기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/20">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 AI Vision Gallery. Made with ❤️ and AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
