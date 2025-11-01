import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    src: '/image/1.jpg',
    title: 'Дед Мороз и Снегурочка',
  },
  {
    src: '/image/2.jpg',
    title: 'Волшебный праздник для детей',
  },
  {
    src: '/image/3.jpg',
    title: 'Новогоднее представление',
  },
  {
    src: '/image/4.jpg',
    title: 'Радость детей',
  },
  {
    src: 'https://images.pexels.com/photos/1303085/pexels-photo-1303085.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Праздник в детском саду',
  },
  {
    src: 'https://images.pexels.com/photos/1303084/pexels-photo-1303084.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Новогодние подарки',
  },
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full relative"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl md:text-4xl font-bold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-effect-dark flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-effect-dark flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 w-8 shadow-lg'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
