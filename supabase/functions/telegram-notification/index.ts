import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingData {
  client_name: string;
  phone: string;
  event_date: string;
  time_slot: string;
  children_count: number;
  event_format: string;
  total_price: number;
  address: string;
  base_price: number;
}

// Функция sendTelegramNotification (без изменений)
async function sendTelegramNotification(booking: BookingData): Promise<boolean> {
  const BOT_TOKEN = "8418020791:AAFu3CuIlNtucAud67OGs4vEyDJHbyyVp-0";
  const CHAT_ID = "1305678741";

  const formatMap: { [key: string]: string } = {
    kindergarten: "Детский сад",
    school: "Школа",
    home: "На дом"
  };

  const message = `🎄 НОВАЯ ЗАЯВКА НА ПРАЗДНИК! 🎅\n\n` +
    `👤 Клиент: ${booking.client_name}\n` +
    `📞 Телефон: <a href="tel:${booking.phone}">${booking.phone}</a>\n` +
    `📅 Дата: ${new Date(booking.event_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}\n` +
    `⏰ Время: ${booking.time_slot}\n` +
    `👶 Детей: ${booking.children_count}\n` +
    `📍 Формат: ${formatMap[booking.event_format] || booking.event_format}\n` +
    `🏠 Адрес: ${booking.address}\n` +
    `💰 Базовая цена: ${booking.base_price.toLocaleString('ru-RU')} ₽\n` +
    `💎 Итоговая цена: <b>${booking.total_price.toLocaleString('ru-RU')} ₽</b>\n\n` +
    `✅ Заказ сохранен в базе данных Supabase\n` +
    `🔔 Свяжитесь с клиентом для подтверждения`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Telegram API error:", error);
    return false;
  }
}

// Основная функция
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const booking: BookingData = await req.json();

    if (!booking.client_name || !booking.phone || !booking.event_date || !booking.time_slot) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "YOUR_SUPABASE_URL";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "YOUR_SUPABASE_ANON_KEY";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert с фиксом: status = 'pending' (из твоего ARRAY)
    const insertData = {
      ...booking,
      status: "pending",  // Теперь пройдёт check constraint
      telegram_sent: false,
      address_verified: true
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ success: false, error: "Failed to save to Supabase: " + error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const insertedBooking = data[0];

    // Отправка уведомления
    const telegramSuccess = await sendTelegramNotification(booking);

    if (telegramSuccess) {
      try {
        await supabase
          .from("bookings")
          .update({ telegram_sent: true })
          .eq('id', insertedBooking.id);
      } catch (updateError) {
        console.error("Failed to update telegram_sent:", updateError);
      }
    } else {
      return new Response(JSON.stringify({ success: false, error: "Failed to send Telegram notification" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Booking saved and notification sent", data: insertedBooking }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
