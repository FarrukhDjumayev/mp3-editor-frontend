import { Telegraf, session, Context } from "telegraf";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import NodeID3 from "node-id3";

dotenv.config();

// 1. Session interfeysi
interface MySession {
  step: number;
  musicFileId: string | null;
  title: string;
  artist: string;
  imageFileId: string | null;
}

// 2. Contextni kengaytirish
interface MyContext extends Context {
  session: MySession;
}

const STEP = {
  NONE: 0,
  WAITING_FOR_MUSIC: 1,
  WAITING_FOR_TITLE: 2,
  WAITING_FOR_ARTIST: 3,
  WAITING_FOR_IMAGE: 4,
};

// 3. Bot yaratish
const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN as string);

// 4. Session default qiymatlari
bot.use(
  session({
    defaultSession: (): MySession => ({
      step: STEP.NONE,
      musicFileId: null,
      title: "",
      artist: "",
      imageFileId: null,
    }),
  })
);

// /start komandasi
bot.start((ctx) => {
  ctx.session.step = STEP.WAITING_FOR_MUSIC;
  ctx.reply(`Salom, ${ctx.from?.first_name}! 👋\nIltimos, menga MP3 formatdagi musiqa yuboring.`);
});

// Audio qabul qilish
bot.on("audio", async (ctx) => {
  if (ctx.session.step !== STEP.WAITING_FOR_MUSIC) return;

  const audio = ctx.message.audio;
  if (!audio.mime_type?.includes("audio/mpeg")) {
    return ctx.reply("❌ Faqat MP3 fayl yuboring!");
  }

  ctx.session.musicFileId = audio.file_id;
  ctx.session.step = STEP.WAITING_FOR_TITLE;

  await ctx.reply("✅ Ajoyib! Endi qo'shiq nomini (Title) yuboring.");
});

// Matn qabul qilish
bot.on("text", async (ctx) => {
  const text = ctx.message.text;

  if (ctx.session.step === STEP.WAITING_FOR_TITLE) {
    ctx.session.title = text;
    ctx.session.step = STEP.WAITING_FOR_ARTIST;
    return ctx.reply("Rahmat! Endi qo'shiq ijrochisi nomini (Artist) yuboring.");
  }

  if (ctx.session.step === STEP.WAITING_FOR_ARTIST) {
    ctx.session.artist = text;
    ctx.session.step = STEP.WAITING_FOR_IMAGE;
    return ctx.reply("Endi qo'shiq uchun cover rasm yuboring (JPG yoki PNG).");
  }
});

// Photo qabul qilish va tahrirlash
bot.on("photo", async (ctx) => {
  if (ctx.session.step !== STEP.WAITING_FOR_IMAGE) return;

  const photos = ctx.message.photo;

  // ❗️ Tekshirish qo'shildi
  if (!photos || photos.length === 0) {
    return ctx.reply("❌ Rasm topilmadi, qaytadan yuboring.");
  }

  // Eng katta o'lchamdagi rasmni olamiz
  const photo = photos[photos.length - 1];
  ctx.session.imageFileId = photo.file_id;

  await ctx.reply("Ma'lumotlar qabul qilindi. 🔄 Tahrirlanmoqda...");

  try {
    // MP3 faylni yuklab olish
    const musicLink = await ctx.telegram.getFileLink(ctx.session.musicFileId!);
    const musicBuffer = await fetch(musicLink.href).then((res) => res.arrayBuffer());
    const musicPath = path.join(process.cwd(), "temp_music.mp3");
    fs.writeFileSync(musicPath, Buffer.from(musicBuffer));

    // Cover rasmni yuklab olish
    const imageLink = await ctx.telegram.getFileLink(ctx.session.imageFileId!);
    const imageBuffer = await fetch(imageLink.href).then((res) => res.arrayBuffer());
    const imagePath = path.join(process.cwd(), "cover.jpg");
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

    // ID3 teglarini yangilash
    const tags = {
      title: ctx.session.title,
      artist: ctx.session.artist,
      APIC: imagePath, // Cover rasmi
    };

    NodeID3.update(tags, musicPath);

    // Tahrirlangan faylni yuborish
    await ctx.replyWithDocument(
      { source: musicPath },
      { caption: "🎵 Mana tahrirlangan musiqangiz!" }
    );

    // Vaqtinchalik fayllarni o‘chirish
    fs.unlinkSync(musicPath);
    fs.unlinkSync(imagePath);

    // Sessionni tozalash
    ctx.session = {
      step: STEP.NONE,
      musicFileId: null,
      title: "",
      artist: "",
      imageFileId: null,
    };
  } catch (error) {
    console.error("Xatolik:", error);
    ctx.reply("❌ Tahrirlash jarayonida xatolik yuz berdi.");
  }
});

// Botni ishga tushirish
export const startBot = () => {
  bot.launch();
  console.log("🤖 Telegram bot ishga tushdi!");
};
