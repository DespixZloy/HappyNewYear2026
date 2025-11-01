import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Calendar, Users, MapPin, Clock, DollarSign, Phone as PhoneIcon, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { formatPhoneNumber, getCleanedPhoneNumber } from '../utils/phoneFormatter';
import { getMockSuggestions, validatePodolskAddress, type AddressSuggestion } from '../utils/addressValidator';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EventFormat = 'kindergarten' | 'school' | 'home';
type TimeSlot = '9:00-12:00' | '13:00-17:00' | '18:00-23:00' | '23:00-3:00';

interface PriceModifiers {
  kindergarten: number;
  school: number;
  home: number;
}

const formatLabels: Record<EventFormat, string> = {
  kindergarten: 'Детский сад',
  school: 'Школа',
  home: 'На дом'
};

const timeSlotPrices: Record<TimeSlot, number> = {
  '9:00-12:00': 13000,
  '13:00-17:00': 15000,
  '18:00-23:00': 17000,
  '23:00-3:00': 30000
};

const formatPriceModifiers: PriceModifiers = {
  kindergarten: 1.3,
  school: 1.5,
  home: 1.0
};

const childrenPriceMultiplier = (count: number): number => {
  if (count <= 5) return 1.0;
  if (count <= 10) return 1.2;
  if (count <= 15) return 1.4;
  return 1.6;
};

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [eventFormat, setEventFormat] = useState<EventFormat | ''>('');
  const [eventDate, setEventDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot | ''>('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setAddressError('');
    setSelectedAddress(null);

    if (value.length >= 3) {
      const suggestions = await getMockSuggestions(value);
      setAddressSuggestions(suggestions);
      setShowAddressSuggestions(suggestions.length > 0);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setAddress(suggestion.value);
    setSelectedAddress(suggestion);
    setShowAddressSuggestions(false);
    setAddressError('');

    if (!validatePodolskAddress(suggestion)) {
      setAddressError('Указанный адрес вне зоны бронирования праздника');
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowAddressSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculatePrice = (): number => {
    if (!timeSlot || !eventFormat) return 0;
    const basePrice = timeSlotPrices[timeSlot as TimeSlot];
    const formatModifier = formatPriceModifiers[eventFormat as EventFormat];
    const childrenModifier = childrenPriceMultiplier(childrenCount);
    return Math.round(basePrice * formatModifier * childrenModifier);
  };

  const resetForm = () => {
    setStep(1);
    setChildrenCount(1);
    setEventFormat('');
    setEventDate('');
    setTimeSlot('');
    setClientName('');
    setPhone('');
    setAddress('');
    setSelectedAddress(null);
    setAddressError('');
    setShowSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!clientName || !phone || !eventDate || !timeSlot || !eventFormat || !selectedAddress) {
      if (!selectedAddress) {
        setAddressError('Пожалуйста, выберите адрес из списка');
      }
      return;
    }

    if (!validatePodolskAddress(selectedAddress)) {
      setAddressError('Указанный адрес вне зоны бронирования праздника');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculatePrice();
      const cleanedPhone = getCleanedPhoneNumber(phone);
      const bookingData = {
        client_name: clientName,
        phone: '+' + cleanedPhone,
        event_date: eventDate,
        time_slot: timeSlot,
        children_count: childrenCount,
        event_format: eventFormat,
        base_price: timeSlotPrices[timeSlot as TimeSlot],
        total_price: totalPrice,
        address: selectedAddress.value,
        address_verified: true,
      };

      const { error } = await supabase.from('bookings').insert([bookingData]);

      if (error) throw error;

      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(bookingData),
      });

      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-effect-dark rounded-3xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">Заявка отправлена!</h2>
          <p className="text-gray-200 text-lg">
            Мы свяжемся с вами в ближайшее время для подтверждения деталей
          </p>
        </div>
      </div>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-effect-dark rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Забронировать праздник</h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👶</div>
              <h3 className="text-2xl font-bold text-white mb-2">Сколько детей будет на празднике?</h3>
              <p className="text-gray-300">Это поможет нам подготовить лучшую программу</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setChildrenCount(Math.max(1, childrenCount - 1))}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-2xl font-bold hover:scale-110 transition-transform shadow-lg"
              >
                -
              </button>
              <div className="text-6xl font-bold text-white min-w-[100px] text-center">
                {childrenCount}
              </div>
              <button
                onClick={() => setChildrenCount(childrenCount + 1)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold hover:scale-110 transition-transform shadow-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2"
            >
              Далее <ChevronRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-2xl font-bold text-white mb-2">Формат мероприятия</h3>
              <p className="text-gray-300">Выберите где пройдет праздник</p>
            </div>

            <div className="grid gap-4">
              {(['kindergarten', 'school', 'home'] as EventFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setEventFormat(format)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    eventFormat === format
                      ? 'bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border-purple-500 scale-105'
                      : 'bg-white/5 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <MapPin className={`${eventFormat === format ? 'text-purple-400' : 'text-white'}`} size={32} />
                    <div className="text-left flex-1">
                      <div className={`text-xl font-bold ${eventFormat === format ? 'text-purple-400' : 'text-white'}`}>
                        {formatLabels[format]}
                      </div>
                      <div className="text-sm text-gray-300">
                        +{Math.round((formatPriceModifiers[format] - 1) * 100)}% к базовой цене
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => eventFormat && setStep(3)}
                disabled={!eventFormat}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-2">Выберите дату</h3>
              <p className="text-gray-300">Когда планируется праздник?</p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl">
              <Calendar className="text-purple-400 mx-auto mb-4" size={48} />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white text-center text-xl font-bold focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => eventDate && setStep(4)}
                disabled={!eventDate}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Время и контакты</h3>
              <p className="text-gray-300">Осталось совсем немного!</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <Clock size={20} /> Выберите время
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(timeSlotPrices) as TimeSlot[]).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        timeSlot === slot
                          ? 'bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border-purple-500 scale-105'
                          : 'bg-white/5 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className={`font-bold ${timeSlot === slot ? 'text-purple-400' : 'text-white'}`}>
                        {slot}
                      </div>
                      <div className="text-sm text-gray-300">
                        от {timeSlotPrices[slot].toLocaleString('ru-RU')} ₽
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {timeSlot && totalPrice > 0 && (
                <div className="bg-gradient-to-r from-green-400/20 to-green-500/20 border-2 border-green-500 p-6 rounded-2xl text-center animate-pulse-slow">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <DollarSign size={24} />
                    <span className="font-semibold">Итоговая стоимость</span>
                    <DollarSign size={24} />
                  </div>
                  <div className="text-5xl font-bold text-white">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    за 30 минут выступления
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <Users size={20} /> Ваше имя
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label className="text-white font-semibold flex items-center gap-2">
                  <PhoneIcon size={20} /> Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 999-99-99"
                  maxLength={18}
                  className="w-full p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white text-lg font-semibold placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-3 relative" ref={addressInputRef}>
                <label className="text-white font-semibold flex items-center gap-2">
                  <MapPin size={20} /> Адрес в Подольске
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Начните вводить адрес..."
                  className={`w-full p-4 rounded-xl bg-white/10 border-2 ${
                    addressError ? 'border-red-500' : 'border-white/20'
                  } text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors`}
                />

                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-900 border-2 border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddressSelect(suggestion)}
                        className="w-full text-left p-4 hover:bg-amber-400/20 transition-colors border-b border-white/10 last:border-b-0"
                      >
                        <div className="text-white font-semibold">{suggestion.value}</div>
                        <div className="text-sm text-gray-400">г Подольск, Московская область</div>
                      </button>
                    ))}
                  </div>
                )}

                {addressError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                    <AlertCircle size={16} />
                    <span>{addressError}</span>
                  </div>
                )}

                {selectedAddress && !addressError && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <MapPin size={16} />
                    <span>Адрес подтвержден ✓</span>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  💡 Выберите адрес из списка подсказок. Доставка только по городу Подольск.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={!clientName || !phone || !timeSlot || !selectedAddress || !!addressError || isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.95; }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-scale-in {
            animation: scale-in 0.4s ease-out;
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
