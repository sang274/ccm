import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Leaf, ShoppingCart, Award, TrendingUp, Users, Shield, Zap, Moon, Sun, CheckCircle, Globe, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    users: 0,
    vehicles: 0,
    credits: 0,
    partners: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    
    const targets = {
      users: 15000,
      vehicles: 8500,
      credits: 2500000,
      partners: 450
    };
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        users: Math.floor(targets.users * progress),
        vehicles: Math.floor(targets.vehicles * progress),
        credits: Math.floor(targets.credits * progress),
        partners: Math.floor(targets.partners * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Carbon Credit Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <Link
                to="/login"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block animate-fadeInScale">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-full animate-pulse-slow">
              <Leaf className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white animate-fadeInUp">
            Carbon Credit Marketplace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện. 
            Biến hành trình xanh của bạn thành giá trị kinh tế.
          </p>
          <div className="flex justify-center gap-4 animate-fadeInUp animation-delay-400">
            <Link
              to="/register"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg font-semibold transform"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg font-semibold border border-emerald-200 dark:border-gray-600 transform"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeInUp animation-delay-100">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {counters.users.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Người dùng đã đăng ký
              </div>
            </div>
            <div className="animate-fadeInUp animation-delay-200">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {counters.vehicles.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Xe điện đã đăng ký
              </div>
            </div>
            <div className="animate-fadeInUp animation-delay-300">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {(counters.credits / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Tín chỉ carbon đã giao dịch
              </div>
            </div>
            <div className="animate-fadeInUp animation-delay-400">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {counters.partners.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Doanh nghiệp đối tác
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fadeInUp">
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-100">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Chủ sở hữu xe điện
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Đăng ký xe điện, nhập hành trình và nhận tín chỉ carbon từ việc giảm phát thải CO2.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-200">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Người mua
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mua tín chỉ carbon đã được xác minh để bù đắp lượng khí thải của doanh nghiệp.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-300">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Xác minh CVA
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Cơ quan xác minh độc lập đảm bảo tính chính xác của tín chỉ carbon.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-400">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Giao dịch minh bạch
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hệ thống giao dịch an toàn, minh bạch với công nghệ blockchain.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-500">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <Award className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Chứng nhận quốc tế
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tín chỉ carbon được chứng nhận theo tiêu chuẩn quốc tế.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform animate-fadeInUp animation-delay-600">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg w-fit mb-4 transition-transform duration-300 hover:scale-110">
              <Users className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Cộng đồng xanh
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tham gia cộng đồng người dùng xe điện và đóng góp vào môi trường.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4 animate-fadeInUp">
            Tại sao lại chọn chúng tôi?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
            Chúng tôi cung cấp nền tảng giao dịch tín chỉ carbon đáng tin cậy và hiệu quả nhất tại Việt Nam
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 animate-fadeInUp animation-delay-200">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Xác minh chính xác 100%
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Mọi tín chỉ carbon đều được xác minh bởi cơ quan CVA độc lập với quy trình nghiêm ngặt, đảm bảo tính chính xác và minh bạch tuyệt đối.
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fadeInUp animation-delay-300">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Bảo mật tối đa
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hệ thống bảo mật đa lớp với công nghệ blockchain, mã hóa end-to-end và xác thực hai yếu tố để bảo vệ tài sản của bạn.
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fadeInUp animation-delay-400">
              <div className="flex-shrink-0">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tiêu chuẩn quốc tế
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tuân thủ các tiêu chuẩn carbon credit quốc tế như VCS, Gold Standard, được công nhận bởi các tổ chức môi trường toàn cầu.
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fadeInUp animation-delay-500">
              <div className="flex-shrink-0">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Giá trị tối ưu
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hệ thống định giá thông minh dựa trên thị trường, giúp người bán nhận được giá trị tốt nhất và người mua tiết kiệm chi phí.
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fadeInUp animation-delay-600">
              <div className="flex-shrink-0">
                <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Hỗ trợ 24/7
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi qua điện thoại, email và chat trực tuyến.
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fadeInUp animation-delay-700">
              <div className="flex-shrink-0">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tăng trưởng bền vững
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nền tảng phát triển nhanh với hơn 15,000 người dùng và 2.5 triệu tín chỉ đã giao dịch, tạo cơ hội kinh doanh lớn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-12 text-center animate-fadeInScale hover:scale-105 transition-transform duration-500">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fadeInUp">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-100">
            Tham gia ngay hôm nay để biến hành trình xanh của bạn thành giá trị thực.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 text-lg font-semibold transform animate-fadeInUp animation-delay-200"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-emerald-400" />
                <span className="text-xl font-bold">CCM</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng giao dịch tín chỉ carbon hàng đầu cho chủ sở hữu xe điện tại Việt Nam.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liên kết</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Đăng nhập</Link></li>
                <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Đăng ký</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Carbon Credit Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
