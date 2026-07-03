import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Phone,
  Mail,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
}

// Knowledge base for responses
const knowledgeBase: Record<string, { keywords: string[]; response: string; options?: string[] }> = {
  greeting: {
    keywords: ['xin chào', 'hello', 'hi', 'chào', 'hey', 'helo'],
    response: 'Xin chào! 👋 Tôi là trợ lý ảo của BLUE. Tôi có thể giúp gì cho bạn hôm nay?',
    options: ['Dịch vụ hỗ trợ', 'Bảng giá', 'Liên hệ', 'Tư vấn miễn phí'],
  },
  services: {
    keywords: ['dịch vụ', 'service', 'hỗ trợ', 'tiktok', 'facebook', 'zalo', 'telegram', 'nền tảng'],
    response: 'BLUE hỗ trợ toàn diện các nền tảng mạng xã hội:\n\n🎵 **TikTok** - Phát triển kênh, tăng tương tác, tối ưu content\n📘 **Facebook** - Quản lý Fanpage, chạy ads, chăm sóc khách hàng\n💬 **Zalo** - Vận hành OA, broadcast, CSKH tự động\n✈️ **Telegram** - Quản lý Group/Channel, Bot tự động\n\nBạn quan tâm đến nền tảng nào?',
    options: ['TikTok', 'Facebook', 'Zalo', 'Telegram', 'Tư vấn chi tiết'],
  },
  pricing: {
    keywords: ['giá', 'bảng giá', 'chi phí', 'bao nhiêu', 'phí', 'cost', 'price', 'gói'],
    response: 'BLUE có 3 gói dịch vụ:\n\n🔹 **Starter** - Phù hợp cá nhân mới bắt đầu\n🔸 **Professional** - Phù hợp doanh nghiệp nhỏ (Phổ biến nhất)\n🔹 **Enterprise** - Giải pháp tùy chỉnh\n\nGiá cụ thể phụ thuộc vào nhu cầu. Bạn muốn nhận báo giá chi tiết?',
    options: ['Nhận báo giá', 'Tư vấn gói phù hợp', 'So sánh các gói'],
  },
  contact: {
    keywords: ['liên hệ', 'contact', 'điện thoại', 'email', 'zalo', 'telegram', 'facebook'],
    response: 'Bạn có thể liên hệ với BLUE qua:\n\n📘 Facebook: facebook.com/lechivy.CEO\n💬 Zalo: zalo.me/lechivytrickervn\n✈️ Telegram: t.me/Lechivyvippro\n📧 Email: Lechivy207.inst@gmail.com\n\nPhản hồi nhanh nhất qua Zalo hoặc Telegram!',
    options: ['Chat với Zalo', 'Chat với Telegram', 'Gửi Email'],
  },
  time: {
    keywords: ['thời gian', 'giờ', 'mấy giờ', 'mấy tiếng', 'phản hồi', 'bao lâu'],
    response: '⏰ **Thời gian hỗ trợ:**\n\n• Thứ 2 - Thứ 6: 8:00 - 22:00\n• Thứ 7 - CN: 9:00 - 21:00\n\n⚡ Phản hồi trung bình: 5-30 phút\n🚀 Với gói Professional/Enterprise: Hỗ trợ 24/7',
    options: ['Liên hệ ngay', 'Tìm hiểu thêm'],
  },
  tiktok: {
    keywords: ['tiktok'],
    response: '🎵 **Dịch vụ TikTok của BLUE:**\n\n✅ Tăng follower tự nhiên\n✅ Tối ưu profile & bio\n✅ Chiến lược content viral\n✅ Phân tích dữ liệu & xu hướng\n✅ Quản lý bình luận, tương tác\n\nBạn cần hỗ trợ gì trên TikTok?',
    options: ['Tăng follower', 'Tối ưu content', 'Nhận tư vấn'],
  },
  facebook: {
    keywords: ['facebook', 'fb', 'fanpage'],
    response: '📘 **Dịch vụ Facebook của BLUE:**\n\n✅ Quản lý Fanpage chuyên nghiệp\n✅ Tối ưu tài khoản cá nhân\n✅ Chạy quảng cáo hiệu quả\n✅ Chăm sóc khách hàng tự động\n✅ Xây dựng cộng đồng\n\nBạn cần hỗ trợ gì trên Facebook?',
    options: ['Quản lý Fanpage', 'Chạy quảng cáo', 'Nhận tư vấn'],
  },
  payment: {
    keywords: ['thanh toán', 'trả tiền', 'chuyển khoản', 'payment', 'pay'],
    response: '💳 **Phương thức thanh toán:**\n\n✅ Chuyển khoản ngân hàng\n✅ Momo, ZaloPay\n✅ Thanh toán theo giai đoạn\n\nHỗ trợ xuất hóa đơn VAT cho doanh nghiệp. Chi tiết sẽ được tư vấn sau khi chốt gói dịch vụ.',
    options: ['Xem bảng giá', 'Liên hệ tư vấn'],
  },
  security: {
    keywords: ['bảo mật', 'an toàn', 'secure', 'privacy', 'thông tin'],
    response: '🔒 **Cam kết bảo mật:**\n\n✅ Ký NDA (thỏa thuận bảo mật)\n✅ Mã hóa dữ liệu end-to-end\n✅ Không chia sẻ thông tin bên thứ 3\n✅ Xóa dữ liệu sau khi hoàn thành (theo yêu cầu)\n\nBạn hoàn toàn yên tâm khi sử dụng dịch vụ của BLUE!',
    options: ['Tìm hiểu thêm', 'Liên hệ'],
  },
  thanks: {
    keywords: ['cảm ơn', 'thank', 'thanks', 'cám ơn'],
    response: 'Không có gì! 🙏 Rất vui được hỗ trợ bạn. Nếu cần thêm thông tin, đừng ngần ngại hỏi nhé!\n\nChúc bạn một ngày tuyệt vời! ✨',
    options: ['Liên hệ ngay', 'Xem dịch vụ'],
  },
  help: {
    keywords: ['giúp', 'help', 'hỗ trợ', 'tư vấn', 'tìm hiểu'],
    response: 'Tôi có thể giúp bạn:\n\n📋 Thông tin dịch vụ & nền tảng hỗ trợ\n💰 Bảng giá & gói dịch vụ\n📞 Cách thức liên hệ\n⏰ Thời gian hỗ trợ\n🔒 Chính sách bảo mật\n\nBạn muốn biết gì?',
    options: ['Dịch vụ', 'Bảng giá', 'Liên hệ', 'Bảo mật'],
  },
  demo: {
    keywords: ['demo', 'thử', 'test', 'trải nghiệm'],
    response: '🎁 Bạn muốn trải nghiệm dịch vụ?\n\nBLUE hỗ trợ:\n✅ Tư vấn miễn phí 15 phút\n✅ Demo tính năng cơ bản\n✅ Báo giá chi tiết không ràng buộc\n\nLiên hệ ngay để được tư vấn!',
    options: ['Đăng ký tư vấn', 'Xem bảng giá'],
  },
};

const defaultResponses = [
  'Tôi hiểu câu hỏi của bạn. Để được tư vấn chi tiết và chính xác nhất, bạn vui lòng liên hệ trực tiếp với BLUE qua Zalo hoặc Telegram nhé! 📱',
  'Câu hỏi thú vị đấy! Đội ngũ BLUE sẽ tư vấn chi tiết cho bạn. Bạn có thể để lại thông tin liên hệ hoặc chat trực tiếp qua Zalo/Telegram.',
  'Hmm, tôi cần thêm thông tin để trả lời chính xác. Bạn có thể liên hệ trực tiếp với BLUE để được hỗ trợ nhanh nhất!',
];

function findResponse(input: string): { response: string; options?: string[] } {
  const normalizedInput = input.toLowerCase().trim();

  // Check each category in knowledge base
  for (const category of Object.values(knowledgeBase)) {
    for (const keyword of category.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        return { response: category.response, options: category.options };
      }
    }
  }

  // Return random default response
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return { response: defaultResponses[randomIndex], options: ['Liên hệ Zalo', 'Liên hệ Telegram', 'Gửi Email'] };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Quick action buttons
const quickActions = [
  { label: 'Dịch vụ', icon: '📋' },
  { label: 'Bảng giá', icon: '💰' },
  { label: 'Liên hệ', icon: '📞' },
  { label: 'Tư vấn', icon: '💡' },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      type: 'bot',
      content: 'Xin chào! 👋 Tôi là **BLUE Assistant** - Trợ lý ảo của Lê Chí Vỹ Blue.\n\nTôi có thể giúp bạn tìm hiểu về dịch vụ, bảng giá và hỗ trợ mạng xã hội. Bạn cần gì?',
      timestamp: new Date(),
      options: ['Dịch vụ', 'Bảng giá', 'Liên hệ', 'Tư vấn miễn phí'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const { response, options } = findResponse(messageText);
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        options,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleOptionClick = (option: string) => {
    // Map options to actual queries
    const optionQueries: Record<string, string> = {
      'Dịch vụ': 'dịch vụ hỗ trợ',
      'Bảng giá': 'bảng giá',
      'Liên hệ': 'liên hệ',
      'Tư vấn miễn phí': 'tư vấn',
      'Tư vấn': 'tư vấn',
      'TikTok': 'tiktok',
      'Facebook': 'facebook',
      'Zalo': 'zalo',
      'Telegram': 'telegram',
      'Nhận báo giá': 'bảng giá',
      'Chat với Zalo': 'lien he zalo',
      'Chat với Telegram': 'lien he telegram',
      'Gửi Email': 'lien he email',
      'Liên hệ ngay': 'liên hệ',
      'Tăng follower': 'tiktok tăng follower',
      'Tối ưu content': 'tiktok tối ưu content',
      'Quản lý Fanpage': 'facebook quản lý fanpage',
      'Chạy quảng cáo': 'facebook chạy quảng cáo',
      'Đăng ký tư vấn': 'tư vấn miễn phí',
    };

    const query = optionQueries[option] || option;
    handleSend(query);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action.toLowerCase());
  };

  // Handle contact links
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'user') {
      const msg = lastMessage.content.toLowerCase();
      if (msg.includes('zalo') && !msg.includes('lien he')) {
        window.open('https://zalo.me/lechivytrickervn', '_blank');
      } else if (msg.includes('telegram') && !msg.includes('lien he')) {
        window.open('https://t.me/Lechivyvippro', '_blank');
      } else if (msg.includes('email') && !msg.includes('lien he')) {
        window.location.href = 'mailto:Lechivy207.inst@gmail.com';
      }
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full btn-primary flex items-center justify-center shadow-[0_0_30px_var(--card-glow)] animate-bounce-subtle group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
          1
        </span>
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg glass text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat với BLUE
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-72'
          : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)]'
      }`}
    >
      {/* Header */}
      <div className="glass-strong rounded-t-2xl p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-neon-2 flex items-center justify-center">
            <Bot className="w-5 h-5 text-void" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-dynamic-hi">BLUE Assistant</h3>
            <p className="text-xs text-dynamic-low flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dynamic-mid hover:text-dynamic-hi"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dynamic-mid hover:text-dynamic-hi"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="glass bg-dynamic-panel h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-neon to-neon-2 text-void rounded-2xl rounded-br-md'
                      : 'glass rounded-2xl rounded-bl-md'
                  } px-4 py-3`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.type === 'bot' && <Bot className="w-4 h-4 text-dynamic-neon flex-shrink-0 mt-0.5" />}
                    <p className="text-sm whitespace-pre-line text-dynamic-hi">
                      {message.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.split('**').map((part, j) =>
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    {message.type === 'user' && <User className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  </div>

                  {/* Option buttons */}
                  {message.type === 'bot' && message.options && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="px-3 py-1.5 text-xs rounded-full glass hover:border-neon/50 hover:text-dynamic-neon transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Bot className="w-4 h-4 text-dynamic-neon" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-dynamic-neon animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-dynamic-neon animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-dynamic-neon animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="glass bg-dynamic-panel px-4 py-2 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs glass hover:border-neon/50 hover:text-dynamic-neon transition-all whitespace-nowrap"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="glass-strong rounded-b-2xl p-4 flex items-center gap-3 border-t border-white/10">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-dynamic-hi placeholder-dynamic-low focus:outline-none focus:ring-2 focus:ring-neon/50 transition-all"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Contact info */}
          <div className="glass bg-dynamic-panel px-4 py-2 rounded-b-2xl flex items-center justify-center gap-4 text-xs text-dynamic-low border-t border-white/5">
            <a
              href="https://zalo.me/lechivytrickervn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-dynamic-neon transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Zalo</span>
            </a>
            <span>•</span>
            <a
              href="https://t.me/Lechivyvippro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-dynamic-neon transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Telegram</span>
            </a>
            <span>•</span>
            <a
              href="mailto:Lechivy207.inst@gmail.com"
              className="flex items-center gap-1 hover:text-dynamic-neon transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
