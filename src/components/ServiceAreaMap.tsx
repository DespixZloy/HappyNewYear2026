import { MapPin, Navigation, Sparkles } from 'lucide-react';

export function ServiceAreaMap() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="glass-effect-dark rounded-3xl p-8 border-2 border-purple-500/50 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4 shadow-lg animate-pulse">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Зона обслуживания
          </h3>
          <p className="text-xl text-gray-300">
            Мы работаем в городе <span className="text-gradient-primary font-bold text-2xl">Подольск</span>
          </p>
        </div>

        <div className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-500/30">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A8e8c3c5f5b5e8e8e8e8e8e8e8e8e8e8e&amp;source=constructor&ll=37.554531%2C55.423647&z=12"
            width="100%"
            height="100%"
            frameBorder="0"
            className="grayscale-[20%] brightness-95"
            title="Карта зоны обслуживания Подольск"
          />

          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.9 }} />
                  <stop offset="50%" style={{ stopColor: '#d946ef', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.9 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <ellipse
                cx="400"
                cy="300"
                rx="180"
                ry="140"
                fill="rgba(168, 85, 247, 0.2)"
                stroke="url(#borderGradient)"
                strokeWidth="5"
                strokeDasharray="15,8"
                filter="url(#glow)"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="23" dur="2s" repeatCount="indefinite" />
              </ellipse>

              <circle
                cx="400"
                cy="300"
                r="10"
                fill="#d946ef"
                filter="url(#glow)"
              >
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur-2xl opacity-70 animate-pulse" />
                <div className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-2xl border-2 border-white/40 flex items-center gap-3">
                  <Navigation className="w-6 h-6 animate-bounce" />
                  Подольск
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-black/80 backdrop-blur-md px-5 py-2 rounded-full text-white text-sm font-semibold border-2 border-purple-500/60 shadow-lg">
                ✨ Зона доставки выделена
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-2xl border border-purple-500/30 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🏘️</div>
            <div className="font-bold text-white mb-2">Все районы города</div>
            <div className="text-sm text-gray-300">Выезжаем в любую точку Подольска</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-2xl border border-purple-500/30 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🚗</div>
            <div className="font-bold text-white mb-2">Быстрая доставка</div>
            <div className="text-sm text-gray-300">Приедем точно в назначенное время</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 rounded-2xl border border-purple-500/30 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">📞</div>
            <div className="font-bold text-white mb-2">Бесплатная консультация</div>
            <div className="text-sm text-gray-300">Ответим на все вопросы о выезде</div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-violet-600/20 border-2 border-purple-500/50 rounded-2xl">
          <h4 className="font-bold text-white text-xl mb-3 flex items-center gap-2">
            <MapPin size={24} className="text-purple-400" />
            Важная информация
          </h4>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>Проверьте, что ваш адрес находится в пределах города Подольск</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>При заполнении формы система автоматически проверит адрес</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">✓</span>
              <span>Если ваш адрес вне зоны обслуживания, свяжитесь с нами для уточнения возможности выезда</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
