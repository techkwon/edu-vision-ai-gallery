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
    <div className="safe-bg min-h-screen">
      {/* 모바일 네비게이션 */}
      <nav className="mobile-nav">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-semibold gradient-text hidden sm:block">
                AI 교육 철학 갤러리
              </span>
              <span className="text-sm font-semibold gradient-text sm:hidden">
                교육 철학
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/gallery')}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                갤러리
              </button>
              <button 
                onClick={() => navigate('/generate')}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">AI, 내 교육 철학을</span>
                <br />
                <span style={{color: '#1f2937'}}>그려줘!</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                자신의 교육 철학을 한 문장으로 표현하고, AI를 통해 세상에 하나뿐인 이미지로 만들어보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/generate')}
                className="btn-primary"
              >
                <Sparkles className="h-5 w-5" />
                나의 철학 그리기
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="btn-secondary"
              >
                <Images className="h-5 w-5" />
                동료 교사 갤러리
              </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="image-container">
              <img 
                src={heroImage} 
                alt="AI 교육 철학 갤러리"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="gradient-text">AI와 함께하는</span> 창작 여행
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            간단한 텍스트부터 복잡한 프롬프트까지, 당신의 아이디어를 멋진 이미지로 변환하세요
          </p>
        </div>

        <div className="mobile-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2"
              onClick={feature.action}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold" style={{color: '#1f2937'}}>{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="pt-4">
                  <button className="btn-secondary">
                    시작하기
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="glass-card text-center space-y-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">
            당신의 창의적인 여행을 <span className="gradient-text">시작하세요</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            무료로 시작하여 무한한 가능성을 탐험해보세요. 
            수백만 가지 스타일과 아이디어가 당신을 기다립니다.
          </p>
          <button 
            onClick={() => navigate('/generate')}
            className="btn-primary"
          >
            <Sparkles className="h-5 w-5" />
            첫 이미지 만들기
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="safe-area-bottom container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 AI 교육 철학 갤러리. Made with ❤️ and AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
