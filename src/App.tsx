import { useEffect, useRef, useState } from 'react';
import {
  Rocket,
  Shield,
  Zap,
  MessageCircle,
  CheckCircle2,
  Star,
  ChevronDown,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Send,
  Play,
  X,
  Menu,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import Chatbot from './components/Chatbot';

// Theme Toggle Component
function ThemeToggle({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="theme-toggle-thumb">
        {isLight ? (
          <Sun className="w-3.5 h-3.5 text-white" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-void" />
        )}
      </div>
    </button>
  );
}

// Particle Background Component
function ParticleBackground({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = window.innerWidth < 768 ? 40 : 80;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get particle color based on theme
      const particleColor = isLight ? '8, 145, 178' : '47, 216, 255';
      const lineColor = isLight ? '37, 99, 235' : '61, 123, 255';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        gradient.addColorStop(0, `rgba(${particleColor}, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(${particleColor}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${(1 - dist / 150) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
    />
  );
}

// Animated Counter Hook
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const startTimeAnim = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) requestAnimationFrame(startTimeAnim);
    };

    requestAnimationFrame(startTimeAnim);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Scroll Animation Hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Header Component
function Header({ isLight, onToggleTheme }: { isLight: boolean; onToggleTheme: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#services', label: 'Dịch vụ' },
    { href: '#process', label: 'Quy trình' },
    { href: '#pricing', label: 'Bảng giá' },
    { href: '#feedback', label: 'Feedback' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Liên hệ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav
          className={`glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'shadow-[0_8px_32px_var(--card-shadow),inset_0_0_0_1px_rgba(var(--particle-color),0.1)]' : ''
          }`}
        >
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-3 h-3 rounded-full bg-neon animate-pulse-glow shadow-[0_0_15px_var(--neon)]" />
            <span className="font-display font-bold text-xl tracking-wide">
              <span className="text-gradient">BLUE</span>
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative text-sm text-dynamic-mid font-medium hover:text-dynamic-hi transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon group-hover:w-full transition-all duration-300 shadow-[0_0_8px_var(--neon)]" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ThemeToggle isLight={isLight} onToggle={onToggleTheme} />

            <a
              href="#contact"
              className="hidden sm:inline-flex btn-primary px-6 py-2.5 rounded-full text-sm items-center gap-2 group"
            >
              <span>Liên hệ ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass text-dynamic-hi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 glass-strong rounded-2xl p-6 animate-scale-in">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-dynamic-mid hover:text-dynamic-neon transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <span>Liên hệ ngay</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'BLUE';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 hero-blob-1 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 hero-blob-2 rounded-full blur-[100px] animate-float-delay" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-dynamic-mid">
          <Sparkles className="w-4 h-4 text-dynamic-neon animate-pulse" />
          <span>Giải pháp hỗ trợ mạng xã hội chuyên nghiệp</span>
        </div>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none mb-6">
          <span className="text-gradient glow-text">{displayedText}</span>
          <span className="inline-block w-1.5 h-[0.85em] bg-neon ml-2 animate-pulse shadow-[0_0_20px_var(--neon)]" />
        </h1>

        <p className="font-mono text-sm sm:text-base text-dynamic-mid tracking-widest uppercase mb-4">
          Lê Chí Vỹ Blue
        </p>

        <p className="text-lg sm:text-xl text-dynamic-mid max-w-2xl mx-auto mb-8 leading-relaxed">
          Hỗ trợ phát triển và quản lý các nền tảng mạng xã hội như{' '}
          <span className="text-dynamic-neon font-medium">Facebook</span>,{' '}
          <span className="text-dynamic-neon font-medium">TikTok</span>,{' '}
          <span className="text-dynamic-neon font-medium">Zalo</span> và{' '}
          <span className="text-dynamic-neon font-medium">Telegram</span> — nhanh chóng, bảo mật,
          đồng hành cùng bạn trên mọi nền tảng.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#services"
            className="btn-primary px-8 py-4 rounded-xl text-base inline-flex items-center gap-3 group"
          >
            <Rocket className="w-5 h-5" />
            <span>Khám phá dịch vụ</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#pricing"
            className="btn-ghost px-8 py-4 rounded-xl text-base inline-flex items-center gap-3"
          >
            <Play className="w-5 h-5" />
            <span>Xem bảng giá</span>
          </a>
        </div>

        {/* Contact chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: '📘', label: 'Facebook', href: 'https://www.facebook.com/Lechivyblue.agency' },
            { icon: '🎵', label: 'TikTok', href: 'https://www.tiktok.com/@lechivy.ceo2007' },
            { icon: '💬', label: 'Zalo', href: 'https://zalo.me/lechivytrickervn' },
            { icon: '✈️', label: 'Telegram', href: 'https://t.me/Lechivyvippro' },
          ].map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-4 py-2 rounded-full text-sm text-dynamic-mid hover:text-dynamic-hi hover:border-neon/50 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>{contact.icon}</span>
              <span>{contact.label}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dynamic-low text-xs font-mono tracking-wider uppercase"
      >
        <span>Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce-subtle text-dynamic-neon" />
      </a>
    </section>
  );
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  const strengths = [
    { num: '01', icon: Zap, label: 'Tốc độ nhanh', desc: 'Phản hồi trong vòng 5 phút' },
    { num: '02', icon: Shield, label: 'Bảo mật tuyệt đối', desc: 'Thông tin luôn được bảo vệ' },
    { num: '03', icon: MessageCircle, label: 'Tư vấn tận tâm', desc: 'Đồng hành từng bước' },
    { num: '04', icon: TrendingUp, label: 'Hiệu quả thực tế', desc: 'Kết quả đo lường được' },
  ];

  return (
    <section id="about" className="relative py-32 px-6">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div>
          <span className="eyebrow mb-6">Giới thiệu</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-tight mb-6 text-dynamic-hi">
            BLUE là thương hiệu cá nhân chuyên{' '}
            <span className="text-dynamic-neon">hỗ trợ & tư vấn</span> phát triển mạng xã hội.
          </h2>
          <p className="text-dynamic-mid text-lg leading-relaxed mb-8">
            Với kinh nghiệm thực chiến trên nhiều nền tảng, BLUE đồng hành cùng khách hàng từ
            những bước đầu tiên đến khi đạt được mục tiêu tăng trưởng bền vững, minh bạch và
            an toàn. Mỗi dự án là một cam kết về chất lượng và sự hài lòng tuyệt đối.
          </p>
          <div className="flex items-center gap-4 text-dynamic-low">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full glass border-2 border-void flex items-center justify-center text-xs bg-gradient-to-br from-neon-2/20 to-neon/20"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-dynamic-mid">
              <span className="text-dynamic-neon font-semibold">1000+</span> khách hàng tin tưởng
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {strengths.map((item, index) => (
            <div
              key={item.num}
              className={`glass rounded-2xl p-6 card-hover transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="font-mono text-xs text-dynamic-neon bg-neon/10 px-2 py-1 rounded">
                  {item.num}
                </div>
                <div>
                  <item.icon className="w-5 h-5 text-dynamic-neon mb-3" />
                  <h3 className="font-semibold mb-1 text-dynamic-hi">{item.label}</h3>
                  <p className="text-dynamic-low text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();

  const services = [
    {
      icon: '🎵',
      title: 'TikTok',
      desc: 'Hỗ trợ phát triển kênh, tăng tương tác, tối ưu nội dung và xây dựng thương hiệu cá nhân trên nền tảng video ngắn hàng đầu.',
      features: ['Tăng follower', 'Tối ưu profile', 'Chiến lược content', 'Phân tích dữ liệu'],
      color: '#ff0050',
    },
    {
      icon: '📘',
      title: 'Facebook',
      desc: 'Quản lý fanpage, tối ưu tài khoản cá nhân, chạy quảng cáo hiệu quả và xây dựng cộng đồng khách hàng trung thành.',
      features: ['Quản lý Fanpage', 'Tối ưu tài khoản', 'Chạy quảng cáo', 'Care khách hàng'],
      color: '#1877f2',
    },
    {
      icon: '💬',
      title: 'Zalo',
      desc: 'Tư vấn vận hành Official Account, chăm sóc khách hàng chuyên nghiệp và xây dựng hệ thống bán hàng hiệu quả.',
      features: ['Vận hành OA', 'Broadcast tin nhắn', 'CSKH tự động', 'Tích hợp bán hàng'],
      color: '#0068ff',
    },
    {
      icon: '✈️',
      title: 'Telegram',
      desc: 'Xây dựng và quản lý cộng đồng, thiết lập kênh thông tin, phân phối nội dung và giao tiếp nhóm hiệu quả.',
      features: ['Quản lý Group', 'Thiết lập Channel', 'Bot tự động', 'Bảo mật cao'],
      color: '#0088cc',
    },
  ];

  return (
    <section id="services" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="eyebrow mb-6">Dịch vụ</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6 text-dynamic-hi">
            Nền tảng chúng tôi <span className="text-dynamic-neon">hỗ trợ</span>
          </h2>
          <p className="text-dynamic-mid text-lg">
            Từ chiến lược đến thực thi, chúng tôi đồng hành cùng bạn trên mọi nền tảng mạng xã hội
            phổ biến nhất hiện nay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`glass rounded-3xl p-8 card-hover group relative overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${service.color}20, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="text-4xl mb-6 p-4 rounded-2xl glass inline-block group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: `0 0 30px ${service.color}30`,
                  }}
                >
                  {service.icon}
                </div>

                <h3 className="font-display text-xl font-semibold mb-3 text-dynamic-hi">{service.title}</h3>
                <p className="text-dynamic-mid text-sm leading-relaxed mb-6">{service.desc}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-dynamic-mid">
                      <CheckCircle2 className="w-4 h-4 text-dynamic-neon flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-dynamic-neon hover:text-dynamic-hi transition-colors group/link"
                >
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  const { ref, isVisible } = useScrollAnimation();

  const steps = [
    {
      num: '01',
      title: 'Liên hệ & Tư vấn',
      desc: 'Kết nối với BLUE qua Zalo/Telegram/Facebook để chia sẻ nhu cầu và nhận tư vấn miễn phí.',
      icon: MessageCircle,
    },
    {
      num: '02',
      title: 'Phân tích & Đề xuất',
      desc: 'Đánh giá hiện trạng, đề xuất giải pháp phù hợp và báo giá minh bạch.',
      icon: TrendingUp,
    },
    {
      num: '03',
      title: 'Thực thi & Giám sát',
      desc: 'Triển khai chiến lược, theo dõi tiến độ và tối ưu liên tục.',
      icon: Rocket,
    },
    {
      num: '04',
      title: 'Báo cáo & Hậu mãi',
      desc: 'Báo cáo kết quả chi tiết, hỗ trợ duy trì và phát triển bền vững.',
      icon: Award,
    },
  ];

  return (
    <section id="process" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-panel/30 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="eyebrow mb-6">Quy trình</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6 text-dynamic-hi">
            Cách thức <span className="text-dynamic-neon">hoạt động</span>
          </h2>
          <p className="text-dynamic-mid text-lg">
            Quy trình 4 bước đơn giản, minh bạch từ tư vấn đến hoàn thành dự án.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon/30 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.num}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="glass rounded-2xl p-6 text-center card-hover relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon/20 to-neon-2/10 border border-neon/30 flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-7 h-7 text-dynamic-neon" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neon text-void text-xs font-bold flex items-center justify-center font-mono">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-dynamic-hi">{step.title}</h3>
                  <p className="text-dynamic-mid text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const { ref, isVisible } = useScrollAnimation();

  const packages = [
    {
      name: 'Starter',
      price: 'Liên hệ',
      desc: 'Phù hợp cho cá nhân mới bắt đầu',
      features: [
        'Tư vấn chiến lược cơ bản',
        'Hỗ trợ 1 nền tảng',
        'Báo cáo hàng tháng',
        'Hỗ trợ qua chat',
        'Thời gian phản hồi: 24h',
      ],
      popular: false,
      cta: 'Bắt đầu',
    },
    {
      name: 'Professional',
      price: 'Liên hệ',
      desc: 'Phù hợp cho doanh nghiệp nhỏ',
      features: [
        'Chiến lược phát triển toàn diện',
        'Hỗ trợ đa nền tảng (3+)',
        'Báo cáo hàng tuần',
        'Hỗ trợ ưu tiên 24/7',
        'Manager chuyên trách',
        'Training & Workshop',
      ],
      popular: true,
      cta: 'Nâng cấp',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Giải pháp tùy chỉnh cho doanh nghiệp',
      features: [
        'Chiến lược riêng biệt',
        'Tất cả nền tảng',
        'Báo cáo real-time',
        'Team hỗ trợ riêng',
        'SLA cam kết',
        'API & Integration',
      ],
      popular: false,
      cta: 'Liên hệ',
    },
  ];

  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="eyebrow mb-6">Bảng giá</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6 text-dynamic-hi">
            Gói dịch vụ <span className="text-dynamic-neon">phù hợp</span> với bạn
          </h2>
          <p className="text-dynamic-mid text-lg">
            Bảng giá minh bạch, linh hoạt theo nhu cầu thực tế của từng khách hàng.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`glass rounded-3xl p-8 relative card-hover transition-all duration-700 ${
                pkg.popular ? 'border-neon/50 shadow-[0_0_30px_var(--card-glow)]' : ''
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon text-void text-xs font-bold uppercase tracking-wider">
                  Phổ biến nhất
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display text-xl font-semibold mb-2 text-dynamic-hi">{pkg.name}</h3>
                <p className="text-dynamic-mid text-sm mb-4">{pkg.desc}</p>
                <div className="text-4xl font-display font-bold text-gradient">{pkg.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-dynamic-neon flex-shrink-0 mt-0.5" />
                    <span className="text-dynamic-mid">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-3 rounded-xl text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                <span>{pkg.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-dynamic-low text-sm mt-8">
          * Giá cụ thể sẽ được tư vấn sau khi đánh giá nhu cầu.{' '}
          <a href="#contact" className="text-dynamic-neon hover:underline">
            Liên hệ ngay
          </a>{' '}
          để nhận báo giá.
        </p>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const stats = [
    { value: 1000, suffix: '+', label: 'Khách hàng' },
    { value: 5000, suffix: '+', label: 'Yêu cầu xử lý' },
    { value: 99, suffix: '%', label: 'Hài lòng' },
    { value: 4, suffix: '+', label: 'Năm kinh nghiệm' },
  ];

  return (
    <section className="relative py-20 px-6">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto glass rounded-3xl p-8 lg:p-12 relative overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[120px]" />

        <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const { count, ref: counterRef } = useCounter(stat.value, 2000);
            return (
              <div
                key={stat.label}
                ref={counterRef}
                className="text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl lg:text-6xl stat-number mb-2">
                  {isVisible ? count : 0}
                  {stat.suffix}
                </div>
                <div className="text-dynamic-mid text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Minh Tuấn',
      role: 'Chủ shop online',
      avatar: 'MT',
      content: 'BLUE đã giúp tôi tăng 300% doanh số chỉ sau 2 tháng. Dịch vụ chuyên nghiệp, hỗ trợ nhanh, rất đáng tiền!',
      rating: 5,
    },
    {
      name: 'Thanh Hà',
      role: 'KOL/Freelancer',
      avatar: 'TH',
      content: 'Từ khi được BLUE hỗ trợ, kênh TikTok của tôi đã đạt 100K followers trong 3 tháng. Cảm ơn đội ngũ rất nhiều!',
      rating: 5,
    },
    {
      name: 'Văn Đức',
      role: 'CEO Startup',
      avatar: 'VD',
      content: 'Chiến lược của BLUE rất bài bản, rõ ràng. Họ thực sự hiểu về mạng xã hội và cách vận hành hiệu quả.',
      rating: 5,
    },
    {
      name: 'Phương Linh',
      role: 'Chủ thương hiệu',
      avatar: 'PL',
      content: 'Dịch vụ tận tâm, báo cáo chi tiết, luôn sẵn sàng hỗ trợ. Recommend cho ai đang cần xây dựng thương hiệu.',
      rating: 5,
    },
    {
      name: 'Hoàng Nam',
      role: 'Nhà đầu tư',
      avatar: 'HN',
      content: 'BLUE không chỉ hỗ trợ kỹ thuật mà còn tư vấn chiến lược dài hạn. Đối tác tin cậy để phát triển kinh doanh.',
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="feedback" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="eyebrow mb-6">Feedback</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6 text-dynamic-hi">
            Khách hàng nói gì về <span className="text-dynamic-neon">BLUE</span>
          </h2>
          <p className="text-dynamic-mid text-lg">
            Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi.
          </p>
        </div>

        {/* Featured testimonial */}
        <div
          className={`glass rounded-3xl p-8 lg:p-12 text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="mb-6 flex justify-center">
            {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-8 text-dynamic-hi">
            "{testimonials[activeIndex].content}"
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon to-neon-2 flex items-center justify-center text-void font-bold text-lg">
              {testimonials[activeIndex].avatar}
            </div>
            <div className="text-left">
              <div className="font-semibold text-dynamic-hi">{testimonials[activeIndex].name}</div>
              <div className="text-dynamic-mid text-sm">{testimonials[activeIndex].role}</div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-neon w-8'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Small cards grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {testimonials.slice(0, 3).map((t, index) => (
            <div
              key={t.name}
              className={`glass rounded-2xl p-6 card-hover transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100 + 500}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon/50 to-neon-2/50 flex items-center justify-center text-void font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm text-dynamic-hi">{t.name}</div>
                  <div className="text-dynamic-low text-xs">{t.role}</div>
                </div>
              </div>
              <p className="text-dynamic-mid text-sm line-clamp-2">{t.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'BLUE hỗ trợ những nền tảng nào?',
      answer: 'Chúng tôi hỗ trợ toàn diện các nền tảng phổ biến: Facebook, TikTok, Zalo, Telegram, Instagram, YouTube và nhiều nền tảng khác. Mỗi nền tảng đều có chiến lược và công cụ tối ưu riêng.',
    },
    {
      question: 'Thời gian phản hồi là bao lâu?',
      answer: 'Thời gian phản hồi trung bình từ 5-30 phút trong giờ làm việc. Với gói Professional và Enterprise, chúng tôi hỗ trợ 24/7 với thời gian phản hồi ưu tiên trong vòng 5 phút.',
    },
    {
      question: 'Chi phí dịch vụ như thế nào?',
      answer: 'Chi phí phụ thuộc vào phạm vi và yêu cầu cụ thể của từng dự án. Chúng tôi cung cấp báo giá minh bạch, chi tiết sau khi tư vấn và đánh giá nhu cầu. Cam kết không phát sinh chi phí ẩn.',
    },
    {
      question: 'Thông tin của tôi có được bảo mật không?',
      answer: 'Tuyệt đối. Chúng tôi cam kết bảo mật toàn bộ thông tin khách hàng theo thỏa thuận NDA. Mọi dữ liệu được mã hóa và xử lý theo tiêu chuẩn bảo mật cao nhất.',
    },
    {
      question: 'Tôi có thể thay đổi gói dịch vụ không?',
      answer: 'Có, bạn có thể nâng cấp hoặc điều chỉnh gói dịch vụ bất cứ lúc nào. Chúng tôi linh hoạt trong việc điều chỉnh theo nhu cầu thực tế và hoàn cảnh của từng khách hàng.',
    },
    {
      question: 'Có hỗ trợ sau khi hoàn thành dự án không?',
      answer: 'Có. Tùy theo gói dịch vụ, chúng tôi cung cấp hỗ trợ hậu mãi từ 1-3 tháng, bao gồm tư vấn duy trì, training và hỗ trợ kỹ thuật để bạn tự quản lý hiệu quả.',
    },
  ];

  return (
    <section id="faq" className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="eyebrow mb-6">FAQ</span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-6 text-dynamic-hi">
            Câu hỏi <span className="text-dynamic-neon">thường gặp</span>
          </h2>
          <p className="text-dynamic-mid text-lg">
            Tìm hiểu câu trả lời cho các câu hỏi phổ biến về dịch vụ của BLUE.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass rounded-2xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className="font-medium pr-4 text-dynamic-hi group-hover:text-dynamic-neon transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-dynamic-neon' : 'text-dynamic-low'
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-dynamic-mid leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();

  const contacts = [
    {
      icon: '📘',
      label: 'FACEBOOK',
      value: 'facebook.com/Lechivyblue.agency',
      href: 'https://www.facebook.com/Lechivyblue.agency',
      color: '#1877f2',
    },
    {
      icon: '🎵',
      label: 'TIKTOK',
      value: '@lechivy.ceo2007',
      href: 'https://www.tiktok.com/@lechivy.ceo2007',
      color: '#ff0050',
    },
    {
      icon: '💬',
      label: 'ZALO',
      value: 'zalo.me/lechivytrickervn',
      href: 'https://zalo.me/lechivytrickervn',
      color: '#0068ff',
    },
    {
      icon: '✈️',
      label: 'TELEGRAM',
      value: 't.me/Lechivyvippro',
      href: 'https://t.me/Lechivyvippro',
      color: '#0088cc',
    },
  ];

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={ref}
          className={`glass rounded-3xl p-8 lg:p-12 relative overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-neon/10 rounded-full blur-[100px]" />

          <div className="relative z-10 text-center mb-10">
            <span className="eyebrow mb-6">Liên hệ</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4 text-dynamic-hi">
              Sẵn sàng đồng hành cùng <span className="text-dynamic-neon">bạn</span>
            </h2>
            <p className="text-dynamic-mid max-w-lg mx-auto">
              Kết nối với BLUE qua bất kỳ kênh nào bên dưới. Phản hồi nhanh trong vòng 5 phút.
            </p>
          </div>

          <div className="relative z-10 grid sm:grid-cols-2 gap-4 mb-8">
            {contacts.map((contact, index) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass rounded-2xl p-5 flex items-center gap-4 group card-hover transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="text-3xl p-3 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`,
                  }}
                >
                  {contact.icon}
                </div>
                <div className="text-left">
                  <div className="text-dynamic-low text-xs font-mono tracking-wider">{contact.label}</div>
                  <div className="font-medium text-dynamic-hi group-hover:text-dynamic-neon transition-colors">{contact.value}</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-dynamic-low opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Email CTA */}
          <a
            href="mailto:Lechivy207.inst@gmail.com"
            className="relative z-10 glass rounded-2xl p-5 flex items-center justify-center gap-4 mb-8 group card-hover transition-all duration-500 w-full"
          >
            <div className="text-3xl p-3 rounded-xl bg-gradient-to-br from-neon/20 to-neon-2/10">
              📧
            </div>
            <div className="text-center">
              <div className="text-dynamic-low text-xs font-mono tracking-wider">EMAIL</div>
              <div className="font-medium text-dynamic-hi group-hover:text-dynamic-neon transition-colors">Lechivy207.inst@gmail.com</div>
            </div>
          </a>

          {/* Quick CTA */}
          <div className="relative z-10 text-center">
            <p className="text-dynamic-mid text-sm mb-4">
              Phản hồi nhanh nhất qua Zalo hoặc Telegram
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://zalo.me/lechivytrickervn"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Chat Zalo
              </a>
              <a
                href="https://t.me/Lechivyvippro"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Chat Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative z-10 py-8 px-6 footer-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neon shadow-[0_0_10px_var(--neon)]" />
          <span className="font-display font-bold text-dynamic-hi">BLUE</span>
        </div>

        <div className="flex items-center gap-6 text-dynamic-low text-sm">
          <span>© 2026 Lê Chí Vỹ Blue</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Giải pháp hỗ trợ mạng xã hội</span>
        </div>

        <div className="flex items-center gap-4">
          {['📘', '🎵', '💬', '✈️'].map((icon, index) => (
            <a
              key={index}
              href={['https://www.facebook.com/Lechivyblue.agency', 'https://www.tiktok.com/@lechivy.ceo2007', 'https://zalo.me/lechivytrickervn', 'https://t.me/Lechivyvippro'][index]}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-neon/50 hover:text-dynamic-neon transition-all duration-300"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
    } else if (savedTheme === 'dark') {
      setIsLightMode(false);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsLightMode(!prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to body
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    // Save preference
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <div className={`relative min-h-screen ${isLightMode ? 'light-mode' : ''}`}>
      <ParticleBackground isLight={isLightMode} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="grain absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Header isLight={isLightMode} onToggleTheme={toggleTheme} />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <PricingSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
