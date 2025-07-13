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
    <div className="min-h-screen bg-white mobile-scroll">
      {/* 모바일 반응형 네비게이션 */}
      <nav className="mobile-nav">
        <div className="mobile-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center touch-target">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-sm sm:text-lg font-semibold gradient-text">
                AI 교육 철학 갤러리
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/gallery')}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 touch-target transition-colors"
              >
                갤러리
              </button>
              <button 
                onClick={() => navigate('/generate')}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 touch-target transition-colors"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 - 모바일 최적화 */}
      <section className="section-mobile">
        <div className="mobile-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* 텍스트 콘텐츠 */}
            <div className="space-y-6 lg:space-y-8 fade-in">
              <div className="space-y-4">
                <h1 className="heading-xl">
                  <span className="gradient-text">AI, 내 교육 철학을</span>
                  <br />
                  <span className="text-gray-900">그려줘!</span>
                </h1>
                <p className="text-responsive">
                  자신의 교육 철학을 한 문장으로 표현하고, AI를 통해 세상에 하나뿐인 이미지로 만들어보세요.
                  <span className="hidden sm:inline"> 동료 교사들과 따뜻한 교육적 가치를 나누며 교육 공동체를 만들어가요.</span>
                </p>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/generate')}
                  className="btn-mobile"
                >
                  <Sparkles className="h-5 w-5" />
                  나의 철학 그리기
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigate('/gallery')}
                  className="btn-mobile-secondary"
                >
                  <Images className="h-5 w-5" />
                  동료 교사 갤러리
                </button>
              </div>

              {/* 통계 - 모바일 최적화 */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미지 */}
            <div className="relative mt-8 lg:mt-0">
              <img 
                src={heroImage} 
                alt="AI 교육 철학 갤러리"
                className="responsive-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 - 모바일 반응형 */}
      <section className="section-mobile bg-gray-50">
        <div className="mobile-container">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="heading-lg mb-4">
              <span className="gradient-text">AI와 함께하는</span> 창작 여행
            </h2>
            <p className="text-responsive max-w-2xl mx-auto">
              간단한 텍스트부터 복잡한 프롬프트까지, 당신의 아이디어를 멋진 이미지로 변환하세요
            </p>
          </div>

          <div className="responsive-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card cursor-pointer touch-target"
                onClick={feature.action}
              >
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  <button className="btn-mobile-secondary">
                    시작하기
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용법 섹션 */}
      <section className="section-mobile">
        <div className="mobile-container">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="heading-lg">
              어떻게 <span className="gradient-text">작동하나요?</span>
            </h2>
          </div>

          <div className="responsive-grid max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "교육 철학 입력",
                description: "나만의 교육 철학을 한 문장으로 표현해보세요",
                icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              },
              {
                step: "02", 
                title: "스타일 선택",
                description: "수채화, 일러스트 등 원하는 이미지 스타일을 골라주세요",
                icon: <Palette className="h-5 w-5 sm:h-6 sm:w-6" />
              },
              {
                step: "03",
                title: "AI 이미지 생성",
                description: "AI가 몇 초 만에 당신만의 교육 철학 이미지를 만들어드려요",
                icon: <Image className="h-5 w-5 sm:h-6 sm:w-6" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative mx-auto w-fit">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="section-mobile bg-gray-50">
        <div className="mobile-container">
          <div className="glass-card text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              당신의 창의적인 여행을 <span className="gradient-text">시작하세요</span>
            </h2>
            <p className="text-responsive">
              무료로 시작하여 무한한 가능성을 탐험해보세요. 
              수백만 가지 스타일과 아이디어가 당신을 기다립니다.
            </p>
            <button 
              onClick={() => navigate('/generate')}
              className="btn-mobile"
            >
              <Sparkles className="h-5 w-5" />
              첫 이미지 만들기
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 border-t border-gray-200">
        <div className="mobile-container">
          <div className="text-center text-gray-600">
            <p className="text-sm">Made by TechKwon</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
