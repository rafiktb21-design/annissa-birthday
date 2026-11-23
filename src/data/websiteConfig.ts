export interface MemoryItem {
  id: number
  image: string
  title: string
  date: string
  caption: string
  location?: string
  rotation?: number
}

export interface GuestbookWish {
  id: string
  name: string
  message: string
  emoji: string
  timestamp: string
}

export const websiteConfig = {
  // Identities
  websiteTitle: "A Birthday Journey for Annissa",
  recipientFullName: "Annissa Nur Fadilah",
  recipientShortName: "Annissa",
  senderFullName: "Rafi Ramadhani",
  senderShortName: "Rafi",
  birthDate: "11 December 2005",
  celebrationDateString: "11 December 2026",
  targetIsoDate: "2026-12-11T00:00:00+07:00", // Asia/Jakarta
  age: 21,

  // Section 1: Invitation Cover
  cover: {
    badge: "A LITTLE CELEBRATION",
    forText: "FOR",
    name: "ANNISSA",
    fullName: "Annissa Nur Fadilah",
    date: "11 DECEMBER 2026",
    subtitle: "A special little world made just for you.",
    openButtonText: "BUKA UNDANGAN",
    openButtonSubtext: "Open Your Invitation",
    envelopeHint: "Ketuk untuk membuka amplop undangan",
  },

  // Section 2: Welcome Section
  welcome: {
    tagline: "A SPECIAL MILESTONE",
    title: "Happy 21st Birthday",
    nameHighlight: "Annissa!",
    quote: "Hari ini adalah perayaan untuk seseorang yang membuat hari-hari biasa terasa jauh lebih indah.",
    englishQuote: "Today is all about celebrating someone who makes ordinary days feel a little more beautiful.",
    dateBadge: "11 . 12 . 2026",
    portraitImage: "/assets/photos/memory-01.jpg",
  },

  // Section 3: Our Memories (Scrapbook Gallery)
  memoriesHeading: "Our Little Memories",
  memoriesSubtitle: "Setiap langkah bersamamu adalah lembaran kenangan yang ingin kusimpan selamanya.",
  memoriesEnglishSubtitle: "Every moment with you is a memory I want to keep forever in my heart.",
  memories: [
    {
      id: 1,
      image: "/assets/photos/memory-01.jpg",
      title: "Under the Starlit Sky",
      date: "11 Des 2024",
      caption: "Melihat senyummu di bawah temaram bintang, menyadari betapa berharganya kehadiranmu dalam hidupku.",
      location: "Under the Milky Way",
      rotation: -2,
    },
    {
      id: 2,
      image: "/assets/photos/memory-02.jpg",
      title: "Spring Blossom Walk",
      date: "14 Apr 2025",
      caption: "Caramu tertawa selalu punya keajaiban untuk membuat hari yang biasa mekar seindah bunga musim semi.",
      location: "Blossom Garden",
      rotation: 2.5,
    },
    {
      id: 3,
      image: "/assets/photos/memory-03.jpg",
      title: "Twilight by the Ocean",
      date: "20 Jul 2025",
      caption: "Menatap senja emas bersamamu—waktu seakan melambat dan dunia terasa begitu damai.",
      location: "Golden Coast",
      rotation: -1.5,
    },
    {
      id: 4,
      image: "/assets/photos/memory-04.jpg",
      title: "Warm Cafe Conversations",
      date: "08 Okt 2025",
      caption: "Secangkir kopi hangat dan obrolan kecil yang tak pernah habis, penuh tawa sederhana yang menenangkan.",
      location: "Cozy Corner",
      rotation: 2,
    },
    {
      id: 5,
      image: "/assets/photos/memory-05.jpg",
      title: "Festival of Floating Lanterns",
      date: "18 Nov 2025",
      caption: "Menerbangkan lampion ke langit malam, membawa satu doa tulus yang selalu kutitipkan untukmu.",
      location: "Tranquil Lake",
      rotation: -2.5,
    },
    {
      id: 6,
      image: "/assets/photos/memory-06.jpg",
      title: "A Promise for Tomorrow",
      date: "11 Des 2026",
      caption: "Merayakan langkah barumu dan setiap tahun indah di depan sana. Aku berjanji akan selalu ada di sampingmu.",
      location: "Infinite Horizon",
      rotation: 1.5,
    },
  ] as MemoryItem[],

  // Section 4: A Letter for You
  loveLetter: {
    heading: "A Letter for You",
    subtitle: "Folded with love, written just for you.",
    greeting: "Dear Annissa,",
    paragraphs: [
      "Happy 21st Birthday, my favorite person.",
      "Di hari istimewamu ini, aku cuma ingin kamu tahu betapa bersyukurnya aku bisa memilikimu dalam hidupku.",
      "Kamu punya cara tersendiri membuat hal-hal sederhana jadi begitu bermakna. Setiap kenangan kecil bersamamu jauh lebih berharga daripada apa pun yang bisa kuungkapkan dengan kata-kata.",
      "Semoga hari-harimu selalu dipenuhi kebahagiaan, kejutan-kejutan manis, dan alasan tanpa akhir untuk tersenyum.",
      "Terima kasih telah menjadi bagian paling indah dalam ceritaku."
    ],
    closing: "With all my love,",
    signature: "Rafi Ramadhani"
  },

  // Section 5: Birthday Countdown
  countdown: {
    heading: "Counting Down",
    subtitle: "Menghitung setiap detik menuju momen bahagiamu",
    englishSubtitle: "Every second brings us closer to your special day.",
    celebratedMessage: "Hari ini adalah hari spesialmu!",
    celebratedEnglish: "Today is your special day! Happy 21st Birthday!",
  },

  // Section 6: Birthday Celebration
  celebration: {
    heading: "The Birthday Celebration",
    subtitle: "Make a wish and blow the candles together ✨",
    cakeMessage: "Happy 21st Birthday Annissa",
    wishButtonText: "TIUP LILIN & MAKE A WISH 🎂",
    wishedTitle: "Semoga Semua Mimpimu Terwujud! ✨",
    wishedMessage: "May all your sweetest dreams and secret prayers come true, Annissa! You deserve all the love this world can give.",
  },

  // Section 7: Birthday Moments Storytelling
  moments: {
    heading: "Birthday Moments",
    subtitle: "Kepingan momen indah yang terukir dalam perjalanan kita",
    quotes: [
      {
        quote: "Seseorang yang membuat dunia ini terasa jauh lebih hangat hanya dengan ada di dalamnya.",
        author: "Rafi Ramadhani"
      },
      {
        quote: "May your twenties be as bright, joyful, and radiant as your beautiful smile.",
        author: "With endless love"
      }
    ]
  },

  // Section 8: Virtual Surprise Gift
  surpriseGift: {
    heading: "A Little Surprise",
    subtitle: "Sebuah kejutan kecil yang dibungkus dengan ketulusan",
    boxHint: "Ketuk kado ini untuk membukanya 🎁",
    message: "Your presence is already a beautiful gift. I hope this little surprise makes you smile.",
    indonesianMessage: "Kehadiranmu sudah merupakan hadiah terindah bagiku. Semoga kejutan kecil ini membuat senyum manismu merekah hari ini.",
    fromNote: "Dari seseorang yang selalu mendoakan yang terbaik untukmu — Rafi."
  },

  // Section 9: Guestbook / Birthday Wishes
  guestbook: {
    heading: "Birthday Wishes",
    subtitle: "Kirimkan doa dan ucapan hangat untuk Annissa",
    initialWishes: [
      {
        id: "1",
        name: "Rafi Ramadhani",
        message: "Selamat ulang tahun yang ke-21, Annissa! Semoga selalu sehat, bahagia, dan semua yang kamu cita-citakan tercapai dengan indah. Aku akan selalu bangga dan mendukungmu. 💖✨",
        emoji: "💖",
        timestamp: "11 Des 2026 • 00:01"
      },
      {
        id: "2",
        name: "Sahabat Tersayang",
        message: "Happy Birthday Caa! Welcome to 21 club! Makin bersinar, makin sukses kuliah dan karirnya, tetap jadi Annissa yang hangat dan ceria yaa! 🌸🎂",
        emoji: "🎂",
        timestamp: "11 Des 2026 • 07:15"
      },
      {
        id: "3",
        name: "Keluarga Hangat",
        message: "Barakallah fii umrik Annissa sayang. Semoga berkah usianya, selalu dalam lindungan-Nya, dan terus menjadi kebanggaan keluarga tercinta. 🌟🤍",
        emoji: "✨",
        timestamp: "11 Des 2026 • 08:30"
      }
    ] as GuestbookWish[]
  },

  // Section 10: Final Closing Message
  closingSection: {
    heading: "To More Beautiful Moments",
    message: "Semoga babak baru ini membawakanmu kebahagiaan tanpa akhir, kesempatan-kesempatan indah, kenangan hangat, dan segala hal yang selalu kamu impikan.",
    englishQuote: "May this new chapter bring you endless happiness, beautiful opportunities, warm memories, and everything your heart has been wishing for.",
    closing: "With love,",
    signature: "Rafi",
    replayButtonText: "BUKA KEMBALI UNDANGAN",
  },

  // Backwards compatibility aliases for older scenes
  finalMessage: "I LOVE YOU",
  recipientName: "Annissa Nur Fadilah",
  introTitle: "To Someone Special",
  introSubtitle: "A little journey made with love, just for you.",
  birthdayDate: "11 December",
  birthdayMessage: "Happy 21st Birthday, Annissa!",
  birthdaySubtitle: "Today is all about celebrating someone who makes ordinary days feel a little more beautiful.",
  wishedMessage: "May all your sweetest wishes come true, Annissa! 🎂✨",
  finalSubtitle: "And that's not the end of our story...",
  signatureText: "Made with love by Rafi.",
  replayButtonText: "✦ REPLAY OUR JOURNEY ✦",
  sakuraMessages: [
    "Every beautiful story starts somewhere...",
    "And this little journey starts with you."
  ],
}
