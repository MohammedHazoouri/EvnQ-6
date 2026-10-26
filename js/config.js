/* ==========================================================================
   config.js — كل تفاصيل الزفاف في مكان واحد  |  All wedding details in one place
   عدّلوا القيم هون فقط، ما في داعي تلمسوا باقي الملفات.
   اتركوا أي قيمة فاضية ('') وبيظهر مكانها نص بديل بدل ما نخترع معلومات.
   ========================================================================== */
window.WEDDING_CONFIG = {

  /* ---------- اللغة ---------- */
  language: 'ar',                    // 'ar' (افتراضي، RTL) أو 'en'
  availableLanguages: ['ar', 'en'],  // اتركوا لغة وحدة فقط لإخفاء زر تبديل اللغة

  /* ---------- الأسماء ---------- */
  brideName: { ar: 'لمى', en: 'Lama' },
  groomName: { ar: 'يزن', en: 'Yazan' },
  brideShort: { ar: 'قلب ينبض بالحب والفرح', en: 'A heart full of love and joy' },   // وصف قصير اختياري تحت الصورة
  groomShort: { ar: 'سند وأمان وضحكة ما بتغيب', en: 'Strength, warmth and a smile that never fades' },
  bridePhoto: 'assets/bride.jpg',                    // مثال: 'assets/bride.jpg'
  groomPhoto: 'assets/groom.jpg',

  /* ---------- الموعد ----------
     صيغة ISO مع فرق التوقيت، مثال لسوريا (UTC+3):  '2027-06-12T18:00:00+03:00'
     إذا تركتوه فاضي ما رح يشتغل العد التنازلي ولا زر "احفظوا الموعد". */
  date: '2027-06-18T19:00:00+03:00',
  timezone: 'Asia/Damascus',         // المنطقة الزمنية لعرض التاريخ والوقت
  durationHours: 5,                  // مدة الحفل لملف التقويم

  /* ---------- التفاصيل (اتركوها فاضية إذا لسا ما تحددت) ---------- */
  ceremonyTime:  { ar: '7:00 مساءً', en: '7:00 PM' }, // مثال: '6:00 مساءً'
  receptionTime: { ar: '8:30 مساءً', en: '8:30 PM' },
  venueName:     { ar: 'قاعة الياسمين', en: 'Jasmine Garden Hall' },
  venueAddress:  { ar: 'شارع الجلاء، حي الشعلان', en: 'Al-Jalaa Street, Shaalan District' },
  venueCity:     { ar: 'دمشق، سوريا', en: 'Damascus, Syria' },
  notes:         { ar: 'نرجو الحضور قبل الموعد بنصف ساعة', en: 'Kindly arrive 30 minutes before the ceremony' },
  venueDescription: { ar: '', en: '' }, // اتركوها فاضية لاستخدام النص الافتراضي
  venueImage: 'assets/venue.jpg',                    // مثال: 'assets/venue.jpg'

  /* ---------- الخريطة ----------
     إما إحداثيات حقيقية أو نص عنوان للبحث. إذا الاثنين فاضيين الزر بيتعطّل. */
  map: { lat: '', lng: '', query: 'دمشق، سوريا' },

  /* ---------- الألوان / الإطلالة ---------- */
  dressCode: {
    title:     { ar: 'أنيق', en: 'Elegant' },   // فاضي = القسم بيختفي
    colors:    { ar: 'الباستيل والعاجي والأخضر الزيتوني', en: 'Pastels, ivory and olive green' },
    formality: { ar: 'رسمي أنيق', en: 'Semi-formal' },
    setting:   { ar: 'حديقة مفتوحة في المساء', en: 'Open-air garden, evening' },
    footwear:  { ar: 'أحذية مريحة تناسب الحديقة', en: 'Comfortable garden-friendly shoes' }
  },

  /* ---------- قصة الثنائي (كلها قابلة للتعديل) ---------- */
  timeline: [
    { date: { ar: 'ربيع 2021', en: 'Spring 2021' },
      title: { ar: 'اللقاء الأول', en: 'The First Meeting' },
      text:  { ar: 'لحظة بدأت منها حكاية جميلة.', en: 'A moment that started a beautiful story.' },
      photo: '' },
    { date: { ar: 'خريف 2022', en: 'Autumn 2022' },
      title: { ar: 'الفصل الأول', en: 'The First Chapter' },
      text:  { ar: 'لما صار الطريقان طريقاً واحداً.', en: 'When two separate journeys began to move in the same direction.' },
      photo: '' },
    { date: { ar: 'صيف 2026', en: 'Summer 2026' },
      title: { ar: 'السؤال الكبير', en: 'The Big Question' },
      text:  { ar: 'لحظة صار فيها الوعد بداية للأبد.', en: 'The moment a new promise became the beginning of forever.' },
      photo: '' },
    { date: { ar: '18 حزيران 2027', en: '18 June 2027' },
      title: { ar: 'يوم الزفاف', en: 'The Wedding Day' },
      text:  { ar: 'احتفال بحب محاط بالأهل والأحبة وذكريات ما بتنتسى.', en: 'The celebration of a love surrounded by family, friends, and unforgettable memories.' },
      photo: '' }
  ],

  /* ---------- المعرض ----------
     ضعوا الصور في مجلد assets وأضيفوها هون. إذا فاضي بتظهر أماكن بديلة. */
  gallery: [
    { src: 'assets/gallery-1.jpg', alt: { ar: 'ممر الحديقة وقوس الورد', en: 'Garden aisle and floral arch' } },
    { src: 'assets/gallery-2.jpg', alt: { ar: 'باقة ورد ناعمة', en: 'A soft bouquet of roses' } },
    { src: 'assets/gallery-3.jpg', alt: { ar: 'طاولة الشموع والورد', en: 'Candlelit table with flowers' } },
    { src: 'assets/gallery-4.jpg', alt: { ar: 'خاتما الزواج بين الورد', en: 'Wedding rings among roses' } },
    { src: 'assets/gallery-5.jpg', alt: { ar: 'أغصان الزيتون والورد', en: 'Olive branches and roses' } },
    { src: 'assets/gallery-6.jpg', alt: { ar: 'فوانيس الحديقة مساءً', en: 'Garden lanterns at dusk' } },
    { src: 'assets/gallery-7.jpg', alt: { ar: 'أجواء الحفل في الحديقة', en: 'The garden celebration' } }
  ],
  heroImage: 'assets/hero.jpg',                     // خلفية الصفحة الرئيسية (اختياري)
  closingImage: 'assets/closing.jpg',                  // خلفية القسم الأخير (اختياري)

  /* ---------- الموسيقى (ملف مسموح لكم باستخدامه قانونياً) ---------- */
  musicSrc: '',                      // مثال: 'assets/music.mp3' — فاضي = الزر بيختفي

  /* ---------- تأكيد الحضور (RSVP) ----------
     بدون endpoint الفورم بيشتغل كنسخة تجريبية وما بيحفظ شي (وبيقول هيك بصراحة).
     مثال Formspree:  'https://formspree.io/f/xxxxxxx'  */
  rsvp: {
    enabled: true,
    endpoint: '',
    allowGuestCount: true,
    maxGuests: 6,
    askDietary: true,
    askContact: false
  },

  /* ---------- دعوات شخصية (اختياري، معطّلة افتراضياً) ----------
     الرابط: ?g=TOKEN  والسيرفر لازم يرجّع JSON: { "name": "اسم الضيف" }
     endpoint مثال: 'https://example.com/api/guest?token=' */
  personalization: { enabled: false, endpoint: '' },

  /* ---------- علامة اللوغو العائمة ---------- */
  badge: {
    logo: 'assets/logo.png',
    url: 'https://www.instagram.com/invites/contact/?utm_content=10y5v4es&srtk=2od0mn8c877b',
    label: { ar: 'تواصل مع EvnQ عبر انستغرام', en: 'Contact EvnQ on Instagram' }
  }
};
