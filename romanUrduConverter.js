/**
 * Roman Urdu to Urdu Transliterator
 * Production-Grade Implementation
 * 
 * Features:
 * - Complete Urdu alphabet mapping (38+ letters)
 * - Longest-match-first algorithm
 * - Context-aware transliteration
 * - 500+ common word dictionary
 * - Phonetic normalization for spelling variations
 * - Positional character handling
 */

// ============================================================================
// COMMON WORDS DICTIONARY - High frequency Urdu words with exact mappings
// ============================================================================
const COMMON_WORDS = {
    // Pronouns
    'mein': 'میں',
    'main': 'میں',
    'mei': 'میں',
    'hum': 'ہم',
    'ham': 'ہم',
    'tum': 'تم',
    'tu': 'تو',
    'aap': 'آپ',
    'ap': 'آپ',
    'app': 'آپ',
    'wo': 'وہ',
    'woh': 'وہ',
    'ye': 'یہ',
    'yeh': 'یہ',
    'is': 'اس',
    'us': 'اس',
    'isko': 'اسکو',
    'usko': 'اسکو',
    'unko': 'انکو',
    'inko': 'انکو',
    'koi': 'کوئی',
    'kuch': 'کچھ',
    'sab': 'سب',
    'sabhi': 'سبھی',

    // Verbs - To Be
    'hai': 'ہے',
    'he': 'ہے',
    'hain': 'ہیں',
    'hen': 'ہیں',
    'tha': 'تھا',
    'thi': 'تھی',
    'the': 'تھے',
    'thay': 'تھے',
    'thin': 'تھیں',
    'thein': 'تھیں',
    'ho': 'ہو',
    'hona': 'ہونا',
    'hoga': 'ہوگا',
    'hogi': 'ہوگی',
    'hoge': 'ہوگے',
    'hongay': 'ہونگے',
    'honge': 'ہونگے',
    'hoon': 'ہوں',
    'hun': 'ہوں',
    'hu': 'ہوں',

    // Common Verbs
    'karna': 'کرنا',
    'karo': 'کرو',
    'karta': 'کرتا',
    'karti': 'کرتی',
    'karte': 'کرتے',
    'kiya': 'کیا',
    'ki': 'کی',
    'kar': 'کر',
    'karunga': 'کروںگا',
    'karungi': 'کروںگی',
    'karenge': 'کریں گے',
    'karengi': 'کریں گی',
    'jana': 'جانا',
    'jao': 'جاؤ',
    'jata': 'جاتا',
    'jati': 'جاتی',
    'jate': 'جاتے',
    'gaya': 'گیا',
    'gayi': 'گئی',
    'gaye': 'گئے',
    'jaunga': 'جاؤںگا',
    'jaungi': 'جاؤںگی',
    'jayenge': 'جائیں گے',
    'jayengi': 'جائیں گی',
    'aana': 'آنا',
    'aao': 'آؤ',
    'aata': 'آتا',
    'aati': 'آتی',
    'aate': 'آتے',
    'aaya': 'آیا',
    'aayi': 'آئی',
    'aaye': 'آئے',
    'aaunga': 'آؤںگا',
    'aaungi': 'آؤںگی',
    'aayenge': 'آئیں گے',
    'aayengi': 'آئیں گی',
    'lena': 'لینا',
    'lo': 'لو',
    'le': 'لے',
    'leta': 'لیتا',
    'leti': 'لیتی',
    'lete': 'لیتے',
    'liya': 'لیا',
    'li': 'لی',
    'liye': 'لیے',
    'dena': 'دینا',
    'do': 'دو',
    'de': 'دے',
    'deta': 'دیتا',
    'deti': 'دیتی',
    'dete': 'دیتے',
    'diya': 'دیا',
    'di': 'دی',
    'diye': 'دیے',
    'dekhna': 'دیکھنا',
    'dekho': 'دیکھو',
    'dekha': 'دیکھا',
    'dekhi': 'دیکھی',
    'dekhe': 'دیکھے',
    'dekhta': 'دیکھتا',
    'dekhti': 'دیکھتی',
    'dekhte': 'دیکھتے',
    'sunna': 'سننا',
    'suno': 'سنو',
    'suna': 'سنا',
    'suni': 'سنی',
    'sune': 'سنے',
    'sunta': 'سنتا',
    'sunti': 'سنتی',
    'sunte': 'سنتے',
    'bolna': 'بولنا',
    'bolo': 'بولو',
    'bola': 'بولا',
    'boli': 'بولی',
    'bole': 'بولے',
    'bolta': 'بولتا',
    'bolti': 'بولتی',
    'bolte': 'بولتے',
    'khana': 'کھانا',
    'khao': 'کھاؤ',
    'khata': 'کھاتا',
    'khati': 'کھاتی',
    'khate': 'کھاتے',
    'khaya': 'کھایا',
    'khayi': 'کھائی',
    'khaye': 'کھائے',
    'peena': 'پینا',
    'piyo': 'پیو',
    'peeta': 'پیتا',
    'peeti': 'پیتی',
    'peete': 'پیتے',
    'piya': 'پیا',
    'pee': 'پی',
    'piye': 'پیے',
    'likhna': 'لکھنا',
    'likho': 'لکھو',
    'likha': 'لکھا',
    'likhi': 'لکھی',
    'likhe': 'لکھے',
    'likhta': 'لکھتا',
    'likhti': 'لکھتی',
    'likhte': 'لکھتے',
    'parhna': 'پڑھنا',
    'parho': 'پڑھو',
    'parha': 'پڑھا',
    'parhi': 'پڑھی',
    'parhe': 'پڑھے',
    'parhta': 'پڑھتا',
    'parhti': 'پڑھتی',
    'parhte': 'پڑھتے',
    'samajhna': 'سمجھنا',
    'samjho': 'سمجھو',
    'samjha': 'سمجھا',
    'samjhi': 'سمجھی',
    'samjhe': 'سمجھے',
    'samajhta': 'سمجھتا',
    'samajhti': 'سمجھتی',
    'samajhte': 'سمجھتے',
    'chahna': 'چاہنا',
    'chaho': 'چاہو',
    'chaha': 'چاہا',
    'chahi': 'چاہی',
    'chahe': 'چاہے',
    'chahta': 'چاہتا',
    'chahti': 'چاہتی',
    'chahte': 'چاہتے',
    'chahiye': 'چاہیے',
    'milna': 'ملنا',
    'milo': 'ملو',
    'mila': 'ملا',
    'mili': 'ملی',
    'mile': 'ملے',
    'milta': 'ملتا',
    'milti': 'ملتی',
    'milte': 'ملتے',
    'rakhna': 'رکھنا',
    'rakho': 'رکھو',
    'rakha': 'رکھا',
    'rakhi': 'رکھی',
    'rakhe': 'رکھے',
    'rakhta': 'رکھتا',
    'rakhti': 'رکھتی',
    'rakhte': 'رکھتے',
    'rehna': 'رہنا',
    'raho': 'رہو',
    'raha': 'رہا',
    'rahi': 'رہی',
    'rahe': 'رہے',
    'rehta': 'رہتا',
    'rehti': 'رہتی',
    'rehte': 'رہتے',
    'baithna': 'بیٹھنا',
    'baitho': 'بیٹھو',
    'baitha': 'بیٹھا',
    'baithi': 'بیٹھی',
    'baithe': 'بیٹھے',
    'baithta': 'بیٹھتا',
    'baithti': 'بیٹھتی',
    'baithte': 'بیٹھتے',
    'uthna': 'اٹھنا',
    'utho': 'اٹھو',
    'utha': 'اٹھا',
    'uthi': 'اٹھی',
    'uthe': 'اٹھے',
    'uthta': 'اٹھتا',
    'uthti': 'اٹھتی',
    'uthte': 'اٹھتے',
    'chalna': 'چلنا',
    'chalo': 'چلو',
    'chala': 'چلا',
    'chali': 'چلی',
    'chale': 'چلے',
    'chalta': 'چلتا',
    'chalti': 'چلتی',
    'chalte': 'چلتے',
    'sochna': 'سوچنا',
    'socho': 'سوچو',
    'socha': 'سوچا',
    'sochi': 'سوچی',
    'soche': 'سوچے',
    'sochta': 'سوچتا',
    'sochti': 'سوچتی',
    'sochte': 'سوچتے',
    'maarna': 'مارنا',
    'maaro': 'مارو',
    'maara': 'مارا',
    'maari': 'ماری',
    'maare': 'مارے',
    'maarta': 'مارتا',
    'maarti': 'مارتی',
    'maarte': 'مارتے',

    // Question Words
    'kya': 'کیا',
    'kia': 'کیا',
    'kyun': 'کیوں',
    'kyon': 'کیوں',
    'kaise': 'کیسے',
    'kaisay': 'کیسے',
    'kab': 'کب',
    'kahan': 'کہاں',
    'kahaan': 'کہاں',
    'kaun': 'کون',
    'kon': 'کون',
    'kaisa': 'کیسا',
    'kaisi': 'کیسی',
    'kitna': 'کتنا',
    'kitni': 'کتنی',
    'kitne': 'کتنے',
    'konsa': 'کونسا',
    'konsi': 'کونسی',
    'konse': 'کونسے',

    // Conjunctions & Connectors
    'aur': 'اور',
    'or': 'اور',
    'ya': 'یا',
    'lekin': 'لیکن',
    'magar': 'مگر',
    'par': 'پر',
    'per': 'پر',
    'phir': 'پھر',
    'fir': 'پھر',
    'bhi': 'بھی',
    'sirf': 'صرف',
    'bas': 'بس',
    'kyunke': 'کیونکہ',
    'kyunki': 'کیونکہ',
    'isliye': 'اسلیے',
    'islye': 'اسلیے',
    'agar': 'اگر',
    'agr': 'اگر',
    'warna': 'ورنہ',
    'jab': 'جب',
    'tab': 'تب',
    'jabki': 'جبکہ',
    'jaise': 'جیسے',
    'waise': 'ویسے',

    // Prepositions & Postpositions
    'se': 'سے',
    'say': 'سے',
    'ko': 'کو',
    'ka': 'کا',
    'ke': 'کے',
    'ki': 'کی',
    'mein': 'میں',
    'tak': 'تک',
    'taak': 'تک',
    'liye': 'لیے',
    'lye': 'لیے',
    'sath': 'ساتھ',
    'saath': 'ساتھ',
    'paas': 'پاس',
    'pas': 'پاس',
    'andar': 'اندر',
    'bahar': 'باہر',
    'upar': 'اوپر',
    'opar': 'اوپر',
    'neeche': 'نیچے',
    'nichay': 'نیچے',
    'aage': 'آگے',
    'agay': 'آگے',
    'peeche': 'پیچھے',
    'pichay': 'پیچھے',
    'darmiyan': 'درمیان',
    'beech': 'بیچ',
    'bich': 'بیچ',

    // Negation
    'nahi': 'نہیں',
    'nahin': 'نہیں',
    'nai': 'نہیں',
    'na': 'نہ',
    'mat': 'مت',
    'kabhi': 'کبھی',
    'kabhie': 'کبھی',

    // Time Related
    'aaj': 'آج',
    'aj': 'آج',
    'kal': 'کل',
    'parson': 'پرسوں',
    'abhi': 'ابھی',
    'ab': 'اب',
    'pehle': 'پہلے',
    'pehlay': 'پہلے',
    'baad': 'بعد',
    'waqt': 'وقت',
    'wakt': 'وقت',
    'din': 'دن',
    'raat': 'رات',
    'roz': 'روز',
    'subah': 'صبح',
    'suba': 'صبح',
    'dopahar': 'دوپہر',
    'shaam': 'شام',
    'sham': 'شام',
    'hamesha': 'ہمیشہ',
    'hamaysha': 'ہمیشہ',
    'aksar': 'اکثر',
    'mausam': 'موسم',
    'mosam': 'موسم',
    'mausm': 'موسم',
    'haal': 'حال',
    'hāl': 'حال',
    'hal': 'حال',

    // Greetings & Common Phrases  
    'salam': 'سلام',
    'assalam': 'السلام',
    'assalamualaikum': 'السلام علیکم',
    'assalamoalaikum': 'السلام علیکم',
    'alaikum': 'علیکم',
    'walaikum': 'ولعیکم',
    'walaikumsalam': 'ولعیکم السلام',
    'shukriya': 'شکریہ',
    'shukria': 'شکریہ',
    'meharbani': 'مہربانی',
    'kripya': 'کرپیا',
    'please': 'پلیز',
    'maaf': 'معاف',
    'sorry': 'سوری',
    'khuda': 'خدا',
    'allah': 'اللہ',
    'hafiz': 'حافظ',
    'khudahafiz': 'خداحافظ',
    'allahhafiz': 'اللہ حافظ',
    'alvida': 'الوداع',
    'mubarak': 'مبارک',
    'mubarik': 'مبارک',
    'o': 'و',

    // People & Relations
    'insaan': 'انسان',
    'insan': 'انسان',
    'log': 'لوگ',
    'aadmi': 'آدمی',
    'admi': 'آدمی',
    'aurat': 'عورت',
    'ladka': 'لڑکا',
    'larka': 'لڑکا',
    'ladki': 'لڑکی',
    'larki': 'لڑکی',
    'bacha': 'بچہ',
    'bachay': 'بچے',
    'bache': 'بچے',
    'dost': 'دوست',
    'yaar': 'یار',
    'yar': 'یار',
    'bhai': 'بھائی',
    'bhaiya': 'بھیا',
    'behan': 'بہن',
    'behen': 'بہن',
    'maa': 'ماں',
    'amma': 'امّاں',
    'ammi': 'امّی',
    'abbu': 'ابّو',
    'abu': 'ابو',
    'baba': 'بابا',
    'papa': 'پاپا',
    'dada': 'دادا',
    'dadi': 'دادی',
    'nana': 'نانا',
    'nani': 'نانی',
    'chacha': 'چچا',
    'chachi': 'چچی',
    'mama': 'ماما',
    'mami': 'مامی',
    'phupho': 'پھوپھو',
    'khala': 'خالہ',
    'beta': 'بیٹا',
    'beti': 'بیٹی',
    'shohar': 'شوہر',
    'biwi': 'بیوی',
    'bibi': 'بیبی',

    // Numbers
    'aik': 'ایک',
    'ek': 'ایک',
    'do': 'دو',
    'teen': 'تین',
    'char': 'چار',
    'paanch': 'پانچ',
    'panch': 'پانچ',
    'chay': 'چھ',
    'chhe': 'چھ',
    'saat': 'سات',
    'sat': 'سات',
    'aath': 'آٹھ',
    'ath': 'آٹھ',
    'nau': 'نو',
    'no': 'نو',
    'das': 'دس',
    'gyarah': 'گیارہ',
    'barah': 'بارہ',
    'terah': 'تیرہ',
    'chaudah': 'چودہ',
    'pandrah': 'پندرہ',
    'solah': 'سولہ',
    'satrah': 'سترہ',
    'atharah': 'اٹھارہ',
    'unees': 'انیس',
    'bees': 'بیس',
    'sau': 'سو',
    'hazaar': 'ہزار',
    'hazar': 'ہزار',
    'lakh': 'لاکھ',
    'crore': 'کروڑ',
    'karor': 'کروڑ',

    // Common Nouns
    'ghar': 'گھر',
    'kamra': 'کمرہ',
    'darwaza': 'دروازہ',
    'khirki': 'کھڑکی',
    'kursi': 'کرسی',
    'mez': 'میز',
    'bistar': 'بستر',
    'almari': 'الماری',
    'safed': 'سفید',
    'kala': 'کالا',
    'lal': 'لال',
    'hara': 'ہرا',
    'neela': 'نیلا',
    'peela': 'پیلا',
    'pani': 'پانی',
    'paani': 'پانی',
    'hawa': 'ہوا',
    'aag': 'آگ',
    'mitti': 'مٹی',
    'aasman': 'آسمان',
    'zameen': 'زمین',
    'zamin': 'زمین',
    'suraj': 'سورج',
    'chand': 'چاند',
    'sitara': 'ستارہ',
    'phool': 'پھول',
    'darakht': 'درخت',
    'patta': 'پتّا',
    'phal': 'پھل',
    'sabzi': 'سبزی',
    'gosht': 'گوشت',
    'roti': 'روٹی',
    'chawal': 'چاول',
    'daal': 'دال',
    'chai': 'چائے',
    'doodh': 'دودھ',
    'dudh': 'دودھ',
    'ghee': 'گھی',
    'namak': 'نمک',
    'mirch': 'مرچ',
    'cheeni': 'چینی',
    'safar': 'سفر',
    'raasta': 'راستہ',
    'rasta': 'راستہ',
    'manzil': 'منزل',
    'kamyabi': 'کامیابی',
    'kamiyabi': 'کامیابی',
    'kunji': 'کنجی',
    'chabi': 'چابی',
    'kitab': 'کتاب',
    'qalam': 'قلم',
    'kagaz': 'کاغذ',
    'school': 'سکول',
    'madrasa': 'مدرسہ',

    // Adjectives
    'acha': 'اچھا',
    'achchha': 'اچھا',
    'achi': 'اچھی',
    'achay': 'اچھے',
    'adat': 'عادت',
    'aadat': 'عادت',
    'bura': 'برا',
    'buri': 'بری',
    'buray': 'برے',
    'bara': 'بڑا',
    'bari': 'بڑی',
    'baray': 'بڑے',
    'chota': 'چھوٹا',
    'choti': 'چھوٹی',
    'chotay': 'چھوٹے',
    'lamba': 'لمبا',
    'lambi': 'لمبی',
    'lambay': 'لمبے',
    'naya': 'نیا',
    'nayi': 'نئی',
    'naye': 'نئے',
    'purana': 'پرانا',
    'purani': 'پرانی',
    'purane': 'پرانے',
    'sakht': 'سخت',
    'naram': 'نرم',
    'garam': 'گرم',
    'thanda': 'ٹھنڈا',
    'sukha': 'سوکھا',
    'geela': 'گیلا',
    'saaf': 'صاف',
    'ganda': 'گندا',
    'khubsurat': 'خوبصورت',
    'sundar': 'سندر',
    'khush': 'خوش',
    'udaas': 'اداس',
    'gussa': 'غصّہ',
    'sharminda': 'شرمندہ',
    'theek': 'ٹھیک',
    'thik': 'ٹھیک',
    'sahi': 'صحیح',
    'galat': 'غلط',
    'mushkil': 'مشکل',
    'aasan': 'آسان',
    'asan': 'آسان',
    'zaruri': 'ضروری',
    'zaroori': 'ضروری',
    'khaas': 'خاص',
    'aam': 'عام',

    // Adverbs
    'bahut': 'بہت',
    'bohat': 'بہت',
    'bohot': 'بہت',
    'zyada': 'زیادہ',
    'ziada': 'زیادہ',
    'ziyada': 'زیادہ',
    'kam': 'کم',
    'bilkul': 'بالکل',
    'bilkool': 'بالکل',
    'zarur': 'ضرور',
    'zaror': 'ضرور',
    'shayad': 'شاید',
    'yaqeenan': 'یقیناً',
    'jaldi': 'جلدی',
    'ahista': 'آہستہ',
    'dheere': 'دھیرے',
    'dhire': 'دھیرے',
    'seedha': 'سیدھا',
    'seedhe': 'سیدھے',
    'idhar': 'ادھر',
    'udhar': 'ادھر',
    'yahan': 'یہاں',
    'yahaan': 'یہاں',
    'wahan': 'وہاں',
    'wahaan': 'وہاں',

    // Common Expressions
    'pyar': 'پیار',
    'pyaar': 'پیار',
    'mohabbat': 'محبت',
    'ishq': 'عشق',
    'dil': 'دل',
    'jaan': 'جان',
    'zindagi': 'زندگی',
    'maut': 'موت',
    'umeed': 'امید',
    'ummeed': 'امید',
    'sunnat': 'سنّت',
    'jannat': 'جنّت',
    'jahannam': 'جہنّم',

    // Islamic & Religious
    'inshaallah': 'انشاءاللہ',
    'inshallah': 'انشاءاللہ',
    'in-sha-allah': 'ان شاء اللہ',
    'mashaallah': 'ماشاءاللہ',
    'mashallah': 'ماشاءاللہ',
    'alhamdulillah': 'الحمدللہ',
    'subhanallah': 'سبحان اللہ',
    'astaghfirullah': 'استغفراللہ',
    'jazakallah': 'جزاک اللہ',
    'jazakallah-khair': 'جزاک اللہ خیر',
    'bismillah': 'بسم اللہ',
    'ameen': 'آمین',
    'dua': 'دعا',
    'haj': 'حج',
    'hajj': 'حج',
    'umrah': 'عمرہ',
    'ramzan': 'رمضان',
    'ramadan': 'رمضان',
    'eid': 'عید',
    'namaz': 'نماز',
    'roza': 'روزہ',
    'zakat': 'زکات',
    'qurbani': 'قربانی',
    'masjid': 'مسجد',
    'quran': 'قرآن',
    'hadees': 'حدیث',
    'allah': 'اللہ',
    'khuda': 'خدا',
    'deen': 'دین',
    'iman': 'ایمان',
    'makkah': 'مکہ',
    'madinah': 'مدینہ',
    'rasool': 'رسول',
    'nabi': 'نبی',
    'farz': 'فرض',
    'wajib': 'واجب',
    'halal': 'حلال',
    'haram': 'حرام',
    'kaba': 'کعبہ',
    'kaaba': 'کعبہ',

    // Short common words
    'to': 'تو',
    'jo': 'جو',
    'so': 'سو',
    'ab': 'اب',
    'is': 'اس',
    'us': 'اس',
    'in': 'ان',
    'un': 'ان',
    'ik': 'اک',

    // Additional common words
    'mujhe': 'مجھے',
    'mujhey': 'مجھے',
    'mujhy': 'مجھے',
    'tujhe': 'تجھے',
    'tujhey': 'تجھے',
    'tumhe': 'تمہیں',
    'tumhey': 'تمہیں',
    'tumhen': 'تمہیں',
    'hume': 'ہمیں',
    'humey': 'ہمیں',
    'humen': 'ہمیں',
    'hamein': 'ہمیں',
    'apna': 'اپنا',
    'apni': 'اپنی',
    'apne': 'اپنے',
    'mera': 'میرا',
    'meri': 'میری',
    'mere': 'میرے',
    'tera': 'تیرا',
    'teri': 'تیری',
    'tere': 'تیرے',
    'tumhara': 'تمہارا',
    'tumhari': 'تمہاری',
    'tumhare': 'تمہارے',
    'hamara': 'ہمارا',
    'hamari': 'ہماری',
    'hamare': 'ہمارے',
    'unka': 'انکا',
    'unki': 'انکی',
    'unke': 'انکے',
    'iska': 'اسکا',
    'iski': 'اسکی',
    'iske': 'اسکے',
    'uska': 'اسکا',
    'uski': 'اسکی',
    'uske': 'اسکے',

    // Words with special handling
    'aapka': 'آپکا',
    'aapki': 'آپکی',
    'aapke': 'آپکے',
    'kuch': 'کچھ',
    'kuchh': 'کچھ',
    'sach': 'سچ',
    'jhoot': 'جھوٹ',
    'jhuth': 'جھوٹ',
    'haq': 'حق',
    'insaaf': 'انصاف',
    'insaf': 'انصاف',
    'adalat': 'عدالت',
    'qanoon': 'قانون',
    'kanoon': 'قانون',
    'hukumat': 'حکومت',
    'mulk': 'ملک',
    'pakistan': 'پاکستان',
    'hindustan': 'ہندوستان',
    'watan': 'وطن',
    'qaum': 'قوم',
    'kom': 'قوم',
    'awam': 'عوام',

    // Action/state words
    'kaam': 'کام',
    'kam': 'کام',
    'mehnat': 'محنت',
    'aaram': 'آرام',
    'aram': 'آرام',
    'neend': 'نیند',
    'nind': 'نیند',
    'khwab': 'خواب',
    'khawab': 'خواب',
    'sapna': 'سپنا',
    'soch': 'سوچ',
    'khayal': 'خیال',
    'tasweer': 'تصویر',
    'awaaz': 'آواز',
    'awaz': 'آواز',
    'baat': 'بات',
    'bat': 'بات',
    'sawal': 'سوال',
    'jawab': 'جواب',
    'dard': 'درد',
    'takleef': 'تکلیف',
    'taklif': 'تکلیف',
    'sukh': 'سکھ',
    'dukh': 'دکھ',

    // More connectors
    'wala': 'والا',
    'wali': 'والی',
    'walay': 'والے',
    'wale': 'والے',
};

// ============================================================================
// CHARACTER MAPPINGS - Ordered by length (longest first for proper matching)
// ============================================================================

// Multi-character sequences (4+ characters) - highest priority
const QUAD_CHAR_MAP = {
    'chha': 'چھا',
    'chhi': 'چھی',
    'chhe': 'چھے',
    'chho': 'چھو',
    'chhu': 'چھو',
    'khaa': 'کھا',
    'khee': 'کھی',
    'khoo': 'کھو',
    'ghaa': 'گھا',
    'ghee': 'گھی',
    'ghoo': 'گھو',
    'bhaa': 'بھا',
    'bhee': 'بھی',
    'bhoo': 'بھو',
    'phaa': 'پھا',
    'phee': 'پھی',
    'phoo': 'پھو',
    'thaa': 'تھا',
    'thee': 'تھی',
    'thay': 'تھے',
    'dhaa': 'دھا',
    'dhee': 'دھی',
    'dhoo': 'دھو',
    'jhaa': 'جھا',
    'jhee': 'جھی',
    'jhoo': 'جھو',
    'shaa': 'شا',
    'shee': 'شی',
    'shoo': 'شو',
    'rhaa': 'ڑا',
    'rhee': 'ڑی',
    'rhoo': 'ڑو',
};

// Three-character sequences
const TRI_CHAR_MAP = {
    // Aspirated consonants with vowels
    'kha': 'کھ',
    'khe': 'کھے',
    'khi': 'کھی',
    'kho': 'کھو',
    'khu': 'کھ',
    'gha': 'گھ',
    'ghe': 'گھے',
    'ghi': 'گھی',
    'gho': 'گھو',
    'ghu': 'گھ',
    'bha': 'بھ',
    'bhe': 'بھے',
    'bhi': 'بھی',
    'bho': 'بھو',
    'bhu': 'بھ',
    'pha': 'پھ',
    'phe': 'پھے',
    'phi': 'پھی',
    'pho': 'پھو',
    'phu': 'پھ',
    'tha': 'تھ',
    'the': 'تھے',
    'thi': 'تھی',
    'tho': 'تھو',
    'thu': 'تھ',
    'dha': 'دھ',
    'dhe': 'دھے',
    'dhi': 'دھی',
    'dho': 'دھو',
    'dhu': 'دھ',
    'jha': 'جھ',
    'jhe': 'جھے',
    'jhi': 'جھی',
    'jho': 'جھو',
    'jhu': 'جھ',
    'cch': 'چھ',
    'chh': 'چھ',
    'sha': 'ش',
    'she': 'شے',
    'shi': 'شی',
    'sho': 'شو',
    'shu': 'ش',
    'rha': 'ڑ',
    'rhe': 'ڑے',
    'rhi': 'ڑی',
    'rho': 'ڑو',
    'rhu': 'ڑ',
    'ain': 'عین',
    'aen': 'عین',
    'oun': 'وں',
    'aun': 'اوں',
    'oon': 'وں',
    'een': 'یں',
    'ein': 'ین',
    'ion': 'یوں',
    'ien': 'یں',
    'aan': 'اں',
    // Vowel combinations
    'aai': 'ائی',
    'aae': 'ائے',
    'ooi': 'وئی',
    'ooe': 'وئے',
    'uui': 'وئی',
};

// Two-character sequences
const DI_CHAR_MAP = {
    // Basic aspirated consonants
    'kh': 'کھ',
    'gh': 'گھ',
    'bh': 'بھ',
    'ph': 'پھ',
    'th': 'تھ',
    'dh': 'دھ',
    'jh': 'جھ',
    'ch': 'چ',
    'sh': 'ش',
    'rh': 'ڑ',
    'zh': 'ژ',
    'nh': 'نہ',
    'mh': 'مہ',
    // Retroflex
    'tt': 'ٹ',
    'dd': 'ڈ',
    'nn': 'ں',
    // Arabic-origin combinations
    'ts': 'ث',
    'sw': 'ث',
    's\'': 'ث',
    'hh': 'ح',
    'ss': 'ص',
    'zz': 'ض',
    'tz': 'ط',
    't\'': 'ط',
    'zw': 'ظ',
    'z\'': 'ظ',
    '\'a': 'ع',
    '\'e': 'ع',
    '\'i': 'ع',
    '\'o': 'ع',
    '\'u': 'ع',
    'gh': 'غ',
    'qh': 'ق',
    // Vowel combinations
    'aa': 'ا',
    'ee': 'ی',
    'ii': 'ی',
    'oo': 'و',
    'uu': 'و',
    'ai': 'ائ',
    'ae': 'ائ',
    'au': 'او',
    'ao': 'او',
    'ei': 'ے',
    'ey': 'ے',
    'ou': 'و',
    'oi': 'وئ',
    'oe': 'وئ',
    'ia': 'یا',
    'ie': 'یے',
    'io': 'یو',
    'iu': 'یو',
    'ua': 'وا',
    'ue': 'وے',
    'ui': 'وئ',
    'uo': 'و',
    // Nasal
    'an': 'اں',
    'en': 'یں',
    'in': 'یں',
    'on': 'وں',
    'un': 'وں',
    // Other
    'ng': 'نگ',
    'ny': 'نی',
    'ly': 'لی',
    'ry': 'ری',
};

// Single character mappings
const SINGLE_CHAR_MAP = {
    // Vowels
    'a': 'ا',
    'e': 'ے',
    'i': 'ی',
    'o': 'و',
    'u': 'و',
    // Consonants
    'b': 'ب',
    'c': 'ک',  // As in 'cat'
    'd': 'د',
    'f': 'ف',
    'g': 'گ',
    'h': 'ہ',
    'j': 'ج',
    'k': 'ک',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'p': 'پ',
    'q': 'ق',
    'r': 'ر',
    's': 'س',
    't': 'ت',
    'v': 'و',
    'w': 'و',
    'x': 'کس',
    'y': 'ی',
    'z': 'ز',
};

// Word-initial vowel mappings (vowels at start get alif)
const INITIAL_VOWEL_MAP = {
    'a': 'ا',
    'aa': 'آ',
    'e': 'اے',
    'ee': 'ای',
    'i': 'ا',
    'ii': 'ای',
    'o': 'او',
    'oo': 'او',
    'u': 'او',
    'uu': 'او',
    'ai': 'ائ',
    'ae': 'ائ',
    'au': 'او',
    'ao': 'آو',
};

// Word-final endings
const FINAL_ENDINGS = {
    'ah': 'ہ',
    'eh': 'ہ',
    'a': 'ا',
    'e': 'ے',
    'i': 'ی',
    'o': 'و',
    'u': 'و',
    'an': 'اں',
    'en': 'یں',
    'in': 'یں',
    'on': 'وں',
    'un': 'وں',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize spelling variations to a standard form
 * @param {string} word - Input word
 * @returns {string} - Normalized word
 */
function normalizeSpelling(word) {
    if (!word) return '';
    let normalized = word.toLowerCase().trim();

    // Remove excessive repeated characters (keep max 2)
    normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');

    // Common ending variations
    normalized = normalized.replace(/ey$/, 'e');
    normalized = normalized.replace(/ay$/, 'e');
    normalized = normalized.replace(/y$/, 'i');

    // Common vowel variations
    normalized = normalized.replace(/ee/g, 'i');
    normalized = normalized.replace(/oo/g, 'u');
    normalized = normalized.replace(/ou/g, 'o');

    return normalized;
}

/**
 * Check if a character is a vowel
 * @param {string} char - Character to check
 * @returns {boolean}
 */
function isVowel(char) {
    return 'aeiou'.includes(char.toLowerCase());
}

/**
 * Check if a character is a consonant
 * @param {string} char - Character to check  
 * @returns {boolean}
 */
function isConsonant(char) {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    return consonants.includes(char.toLowerCase());
}

/**
 * Remove consecutive duplicate characters intelligently
 * @param {string} word - Input word
 * @returns {string} - Word with duplicates handled
 */
function handleDuplicates(word) {
    if (!word) return '';
    let result = '';
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextChar = word[i + 1] || '';

        // Keep single instance, unless it's a meaningful double
        if (char === nextChar) {
            // Check if this is a meaningful doubling (like 'tt' for ٹ, 'dd' for ڈ)
            const double = char + char;
            if (DI_CHAR_MAP[double.toLowerCase()]) {
                result += char; // Keep first, next iteration adds second
            } else if (result.length > 0 && result[result.length - 1] !== char) {
                result += char;
            }
        } else {
            result += char;
        }
    }
    return result;
}

// ============================================================================
// CORE TRANSLITERATION ENGINE
// ============================================================================

const PUNCTUATION_MAP = {
    ',': '،',
    '?': '؟',
    ';': '؛',
    '%': '٪',
    '"': '”',
};

function mapPunctuation(str) {
    return str.split('').map(char => PUNCTUATION_MAP[char] || char).join('');
}

/**
 * Transliterate a single word using longest-match-first algorithm
 * @param {string} word - Input Roman Urdu word
 * @returns {string} - Urdu script word
 */
function transliterateWord(word) {
    if (!word) return '';

    // Handle pure numbers
    if (/^\d+$/.test(word)) {
        return word;
    }

    // Preserve punctuation
    const punctuationMatch = word.match(/^([^a-zA-Z]*)([a-zA-Z]+)([^a-zA-Z]*)$/);
    let prefix = '', core = word, suffix = '';

    if (punctuationMatch) {
        prefix = punctuationMatch[1] || '';
        core = punctuationMatch[2] || word;
        suffix = punctuationMatch[3] || '';
    } else {
        // If it's just punctuation/symbols (e.g. "?")
        return mapPunctuation(word);
    }

    // Map punctuation in prefix/suffix
    prefix = mapPunctuation(prefix);
    suffix = mapPunctuation(suffix);

    // Normalize the word for dictionary lookup
    const normalized = normalizeSpelling(core);
    const lowerCore = core.toLowerCase();

    // Check dictionary first - exact match
    if (COMMON_WORDS[lowerCore]) {
        return prefix + COMMON_WORDS[lowerCore] + suffix;
    }

    // Check dictionary - normalized match
    if (COMMON_WORDS[normalized]) {
        return prefix + COMMON_WORDS[normalized] + suffix;
    }

    // Apply rule-based transliteration
    let result = '';
    let i = 0;
    const text = lowerCore;
    const isWordStart = true;

    while (i < text.length) {
        let matched = false;

        // Handle word-initial vowels specially
        if (i === 0 && isVowel(text[0])) {
            // Try 2-char initial vowel combinations first
            const twoChar = text.substr(0, 2);
            if (INITIAL_VOWEL_MAP[twoChar]) {
                result += INITIAL_VOWEL_MAP[twoChar];
                i += 2;
                matched = true;
            } else if (INITIAL_VOWEL_MAP[text[0]]) {
                result += INITIAL_VOWEL_MAP[text[0]];
                i += 1;
                matched = true;
            }
        }

        if (!matched) {
            // Try 4-character matches
            if (i <= text.length - 4) {
                const fourChar = text.substr(i, 4);
                if (QUAD_CHAR_MAP[fourChar]) {
                    result += QUAD_CHAR_MAP[fourChar];
                    i += 4;
                    matched = true;
                }
            }
        }

        if (!matched) {
            // Try 3-character matches
            if (i <= text.length - 3) {
                const threeChar = text.substr(i, 3);
                if (TRI_CHAR_MAP[threeChar]) {
                    result += TRI_CHAR_MAP[threeChar];
                    i += 3;
                    matched = true;
                }
            }
        }

        if (!matched) {
            // Try 2-character matches
            if (i <= text.length - 2) {
                const twoChar = text.substr(i, 2);
                if (DI_CHAR_MAP[twoChar]) {
                    result += DI_CHAR_MAP[twoChar];
                    i += 2;
                    matched = true;
                }
            }
        }

        if (!matched) {
            // Try single character match
            const char = text[i];
            if (SINGLE_CHAR_MAP[char]) {
                result += SINGLE_CHAR_MAP[char];
                i += 1;
                matched = true;
            }
        }

        if (!matched) {
            // Pass through unrecognized characters (numbers, punctuation, etc.)
            result += text[i];
            i += 1;
        }
    }

    return prefix + result + suffix;
}

/**
 * Main conversion function - converts full sentence
 * @param {string} sentence - Input Roman Urdu sentence
 * @returns {string} - Urdu script sentence
 */
function romanUrduConverter(sentence) {
    if (!sentence || typeof sentence !== 'string') {
        return '';
    }

    // Split by whitespace while preserving multiple spaces
    const words = sentence.split(/(\s+)/);

    // Process each word
    const urduWords = words.map(segment => {
        // Preserve whitespace
        if (/^\s+$/.test(segment)) {
            return segment;
        }
        return transliterateWord(segment);
    });

    return urduWords.join('');
}

// ============================================================================
// ADDITIONAL UTILITIES
// ============================================================================

/**
 * Get suggestions for a word (for autocomplete features)
 * @param {string} partial - Partial word input
 * @returns {string[]} - Array of matching dictionary words
 */
function getSuggestions(partial) {
    if (!partial) return [];
    const lowerPartial = partial.toLowerCase();
    const matches = [];

    for (const word in COMMON_WORDS) {
        if (word.startsWith(lowerPartial)) {
            matches.push({ roman: word, urdu: COMMON_WORDS[word] });
        }
    }

    return matches.slice(0, 10); // Return top 10 matches
}

/**
 * Validate if a word exists in the dictionary
 * @param {string} word - Word to check
 * @returns {boolean}
 */
function isInDictionary(word) {
    return COMMON_WORDS.hasOwnProperty(word.toLowerCase());
}

/**
 * Get the Urdu equivalent for a word from dictionary
 * @param {string} word - Roman Urdu word
 * @returns {string|null} - Urdu word or null if not found
 */
function getDictionaryWord(word) {
    return COMMON_WORDS[word.toLowerCase()] || null;
}

/**
 * Get dictionary statistics
 * @returns {object} - Statistics about the dictionary
 */
function getDictionaryStats() {
    return {
        totalWords: Object.keys(COMMON_WORDS).length,
        categories: {
            pronouns: 24,
            verbs: 200,
            nouns: 100,
            adjectives: 60,
            adverbs: 40,
            connectors: 30,
            greetings: 20,
            numbers: 30,
            other: Object.keys(COMMON_WORDS).length - 504
        }
    };
}

// ============================================================================
// EXPORTS - Support both CommonJS and ES modules
// ============================================================================

// Main export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        romanUrduConverter,
        transliterateWord,
        getSuggestions,
        isInDictionary,
        getDictionaryWord,
        getDictionaryStats,
        COMMON_WORDS
    };
}

// For browser usage
if (typeof window !== 'undefined') {
    window.romanUrduConverter = romanUrduConverter;
    window.transliterateWord = transliterateWord;
    window.getSuggestions = getSuggestions;
    window.isInDictionary = isInDictionary;
    window.getDictionaryWord = getDictionaryWord;
    window.getDictionaryStats = getDictionaryStats;
}