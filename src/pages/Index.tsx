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
      title: "교육 철학 시각화",
      description: "나만의 교육 철학을 한 문장으로 표현하고 AI 이미지로 만들어보세요",
      action: () => navigate('/generate')
    },
    {
      icon: <Images className="h-8 w-8" />,
      title: "동료 교사 갤러리",
      description: "다른 선생님들의 교육 철학 이미지를 감상하고 영감을 받으세요",
      action: () => navigate('/gallery')
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "교육적 가치 공유",
      description: "따뜻한 교육 철학을 시각적으로 나누며 교육 공동체를 만들어가요",
      action: () => navigate('/generate')
    }
  ];

  const stats = [
    { number: "500+", label: "교육 철학 이미지" },
    { number: "100+", label: "참여 교사" },
    { number: "무한", label: "교육적 영감" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50 animate-blur-in">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gradient">
                AI 교육 철학 갤러리
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/gallery')}
                className="px-6 py-2.5 bg-white/60 backdrop-blur-lg border border-white/30 rounded-xl font-medium text-gray-700 hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
              >
                동료 갤러리
              </button>
              <button 
                onClick={() => navigate('/generate')}
                className="btn-hero"
              >
                철학 시각화
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-blur-in">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">AI, 내 교육 철학을</span>
                <br />
                <span className="text-foreground">그려줘!</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                자신의 교육 철학을 한 문장으로 표현하고, AI를 통해 세상에 하나뿐인 이미지로 만들어보세요. 
                <br className="hidden lg:block" />
                동료 교사들과 따뜻한 교육적 가치를 나누며 교육 공동체를 만들어가요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => navigate('/generate')}
                className="btn-hero text-lg px-10 py-4 flex items-center justify-center gap-3"
              >
                <Sparkles className="h-6 w-6" />
                나의 철학 그리기
                <ArrowRight className="h-6 w-6" />
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="px-10 py-4 bg-white/60 backdrop-blur-lg border border-white/30 rounded-xl font-semibold text-lg text-gray-700 hover:bg-white/80 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3"
              >
                <Images className="h-6 w-6" />
                동료 교사 갤러리
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-primary p-1">
              <div className="rounded-3xl overflow-hidden bg-white">
                <img 
                  src={heroImage} 
                  alt="AI 교육 철학 갤러리"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-bounce" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full opacity-30 animate-pulse" />
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
