import { useState, useEffect } from 'react';
import { Phone, Sparkles, Star, Gift, Clock, Users, Award, MessageCircle, Camera } from 'lucide-react';
import { Snowfall } from './components/Snowfall';
import { BookingModal } from './components/BookingModal';
import { Gallery } from './components/Gallery';
import { ServiceAreaMap } from './components/ServiceAreaMap';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(globalThis.scrollY);
    globalThis.addEventListener('scroll', handleScroll);
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Волшебная программа',
      description: 'Интерактивные игры, конкурсы и сюрпризы для детей любого возраста',
    },
    {
      icon: <Gift className="" />,
      title: 'Подарки детям',
      description: 'Каждый ребенок получит памятный новогодний сувенир',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Профессиональные артисты',
      description: 'Опыт работы более 5 лет, сотни довольных семей',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Гибкий график',
      description: 'Работаем с раннего утра до поздней ночи, включая праздники',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Индивидуальный подход',
      description: 'Учитываем возраст детей и ваши пожелания к программе',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Гарантия качества',
      description: 'Договор, страховка и гарантия возврата средств',
    },
  ];

  const testimonials = [
    {
      name: 'Елена М.',
      text: 'Невероятный праздник! Дети в восторге, особенно понравились интерактивные игры. Дед Мороз и Снегурочка - настоящие профессионалы!',
      rating: 5,
    },
    {
      name: 'Дмитрий П.',
      text: 'Заказывали на корпоратив в офис. Взрослые смеялись не меньше детей! Спасибо за отличное настроение!',
      rating: 5,
    },
    {
      name: 'Анна К.',
      text: 'Организовали праздник в детском саду. Все прошло идеально, дети были в восторге целую неделю после выступления!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-purple-950 to-blue-900 text-white relative overflow-hidden">
      <Snowfall />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />;
        <div className="absolute top-1 right-10 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />;
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />;
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-fuchsia-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />;
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />;
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />;
      </div>

      <div className="relative z-10">
        <header className="fixed top-0 w-full z-40 transition-all duration-300" style={{
          background: scrollY > 50 ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
        }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="max-w-20 max-h-20"><img src='/image/santa.png'></img></div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Волшебный Новый Год</h1>
                <p className="text-xs md:text-sm text-gray-300">с Дедом Морозом и Снегурочкой</p>
              </div>
            </div>
            <a
              href="tel:+79999999999"
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full btn-gradient-success hover:scale-105 transition-transform shadow-xl font-semibold"
            >
              <Phone size={20} />
              <span className="hidden md:inline">+7 (800) 500-00-00</span>
            </a>
          </div>
        </header>

        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <div
              className="inline-block mb-8 animate-float"
              style={{
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              {/* <div className="text-8xl md:text-9xl mb-4 drop-shadow-2xl w-100 h-100"><img src='/image/santa.png'></img>🎅❄️</div> */}
              <div className="flex justify-center w-40 h-40"><img src='./image/santa.png'></img><img src='./image/snegurochka.png'></img></div>
              {/* <div className="w-40 h-40"><img src='/image/snegurochka.png'></img></div> */}
            </div>

            <h2 className="text-4xl md:text-7xl font-bold mb-6 text-shadow-glow leading-tight">
              Подарите детям
              <br />
              <span className="text-gradient-primary">
                незабываемый праздник
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Профессиональные Дед Мороз и Снегурочка создадут волшебную атмосферу
              на вашем празднике
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group px-8 py-5 rounded-2xl btn-gradient-primary text-white font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3"
              >
                <Sparkles className="group-hover:rotate-12 transition-transform" />
                Забронировать праздник
                <Sparkles className="group-hover:-rotate-12 transition-transform" />
              </button>

              <a
                href="tel:+79999999999"
                className="px-8 py-5 rounded-2xl glass-effect-dark border-2 border-white/30 hover:border-white/60 font-bold text-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <MessageCircle />
                Позвонить нам
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                { num: '500+', label: 'Счастливых семей' },
                { num: '5+', label: 'Лет опыта' },
                { num: '100%', label: 'Качество' },
                { num: '24/7', label: 'Поддержка' },
              ].map((stat, i) => (
                <div key={i} className="glass-effect p-6 rounded-2xl hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                    {stat.num}
                  </div>
                  <div className="text-sm md:text-base text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
              Почему выбирают нас
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="glass-effect-dark p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:border-amber-400 border-2 border-transparent"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-6">
              Наши тарифы
            </h2>
            <p className="text-xl text-gray-300 text-center mb-16">
              Цена зависит от времени, количества детей и места проведения
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { time: '9:00 - 12:00', price: 'от 13 000', gradient: 'from-blue-500 to-cyan-500' },
                { time: '13:00 - 17:00', price: 'от 15 000', gradient: 'from-purple-500 to-pink-500' },
                { time: '18:00 - 23:00', price: 'от 17 000', gradient: 'from-orange-500 to-red-500' },
                { time: '23:00 - 3:00', price: 'от 30 000', gradient: 'from-amber-500 to-yellow-500' },
              ].map((tariff, i) => (
                <div
                  key={i}
                  className="glass-effect-dark p-8 rounded-3xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all hover:scale-105"
                >
                  <Clock className="w-12 h-12 text-amber-400 mb-4" />
                  <div className="text-2xl font-bold mb-2">{tariff.time}</div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${tariff.gradient} text-transparent bg-clip-text mb-4`}>
                    {tariff.price} ₽
                  </div>
                  <div className="text-sm text-gray-400">за 40 минут</div>
                </div>
              ))}
            </div>

            <div className="mt-12 glass-effect-dark p-8 rounded-3xl border-2 border-purple-500/50 shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-center">Дополнительные условия</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-2">👶</div>
                  <div className="font-semibold text-amber-400">Количество детей</div>
                  <div className="text-sm text-gray-300 mt-2">
                    До 5 детей<br/>
                    6-10 детей<br/>
                    11-15 детей<br/>
                    16+ детей
                  </div>
                </div>
                <div>
                  <div className="text-4xl mb-2">📍</div>
                  <div className="font-semibold text-amber-400">Место проведения</div>
                  <div className="text-sm text-gray-300 mt-2">
                    На дом<br/>
                    Детский сад<br/>
                    Школа
                  </div>
                </div>
                <div>
                  <div className="text-4xl mb-2">🎁</div>
                  <div className="font-semibold text-amber-400">В стоимость входит</div>
                  <div className="text-sm text-gray-300 mt-2">
                    Интерактивная программа<br/>
                    Игры и конкурсы<br/>
                    Подарки для детей
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Camera className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Фотогалерея наших праздников
              </h2>
              <p className="text-xl text-gray-300">
                Счастливые моменты, которые мы создаем вместе
              </p>
            </div>
            <Gallery />
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
              Отзывы наших клиентов
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="glass-effect-dark p-8 rounded-3xl hover:scale-105 transition-transform"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-200 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="font-bold text-purple-400">{testimonial.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-black/30">
          <ServiceAreaMap />
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-7xl mb-8 animate-bounce">🎄</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Готовы подарить волшебство?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Забронируйте праздник прямо сейчас и получите скидку 10% на раннее бронирование!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-12 py-6 rounded-2xl btn-gradient-primary text-white font-bold text-2xl shadow-2xl hover:scale-110 transition-all duration-300"
            >
              Забронировать праздник
            </button>
          </div>
        </section>

        <footer className="py-12 px-4 bg-black/50 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Волшебный Новый Год</h3>
                <p className="text-gray-400">
                  Создаем незабываемые праздники для ваших детей
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Контакты</h4>
                <div className="space-y-2 text-gray-400">
                  <a href="tel:+79999999999" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone size={18} />
                    +7 (999) 999-99-99
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">График работы</h4>
                <p className="text-gray-400">
                  Ежедневно с 9:00 до 3:00<br/>
                  Без выходных и праздников
                </p>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm border-t border-white/10 pt-8">
              © 2025 Волшебный Новый Год. Все права защищены.
            </div>
          </div>
        </footer>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
