import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'womenrf';

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is required.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  console.log('Connected to MongoDB.\n');

  const db = client.db(dbName);
  const contentColl = db.collection('content');

  const teamDoc = await contentColl.findOne({ _id: 'team' });
  if (!teamDoc || !teamDoc.data) {
    console.error('No team data found in MongoDB.');
    process.exit(1);
  }

  const { categories, members } = teamDoc.data;
  console.log(`Found ${members.length} members:`);
  members.forEach((m, i) => console.log(`  [${i}] ${m.name} (${m.role}) — image: ${m.imageUrl || '(none)'}`));

  const sarah = members.find(
    (m) => m.name.toLowerCase().includes('sarah') && m.name.toLowerCase().includes('rutherford')
  );

  if (!sarah) {
    console.error('\nSarah Rutherford not found in team members.');
    process.exit(1);
  }

  console.log(`\nUpdating "${sarah.name}" (id: ${sarah.id})...`);

  sarah.imageUrl = '/images/Sarah_Rutherford.jpeg';

  sarah.translations = {
    fa: {
      name: 'سارا رادرفورد',
      role: 'عضو هیئت مدیره',
      bio: 'سارا رادرفورد یک متخصص ارتباطات است که به پیشبرد حقوق زنان و دختران در سطح جهان اختصاص دارد. به عنوان مدیر امور خارجی در مؤسسه جورج‌تاون برای زنان، صلح و امنیت (GIWPS)، او استراتژی ارتباطات یکی از برجسته‌ترین مراکز تحقیقاتی و سیاست‌گذاری این حوزه را رهبری می‌کند و با ملانی وروییر، مدیر اجرایی GIWPS و سفیر سابق آمریکا در امور جهانی زنان، همکاری نزدیک دارد. سارا برنده جایزه تعالی رئیس دانشگاه جورج‌تاون است و دارای مدرک کارشناسی ارشد در روابط عمومی و ارتباطات شرکتی از دانشگاه جورج‌تاون و کارشناسی در علوم سیاسی از دانشگاه براون است، جایی که با درجه مگنا کام لاود فارغ‌التحصیل شد.',
    },
    ps: {
      name: 'سارا رادرفورد',
      role: 'د اداره مجلس غړی',
      bio: 'سارا رادرفورد د اړیکو متخصصه ده چې د نړۍ په کچه د ښځو او نجونو د حقونو پرمختګ ته ژمنه لري. د جورج‌ټاون د ښځو، سولې او امنیت مؤسسې (GIWPS) کې د بهرنیو چارو رئیسه په توګه، هغه د دې برخې یو له مخکښو تحقیقاتي او پالیسي جوړونکو مرکزونو د اړیکو ستراتیژي رهبري کوي او د GIWPS اجرایي رئیسه او د ښځو نړیوالو مسایلو لپاره پخوانۍ امریکایي سفیره ملانی وروییر سره نږدې کار کوي. سارا د جورج‌ټاون پوهنتون د رئیس د عالي کچې جایزه ترلاسه کړې ده او د جورج‌ټاون پوهنتون څخه د عامه اړیکو او شرکتي اړیکو کې ماسټر سند او د براون پوهنتون څخه د سیاسي علومو کې لسانس سند لري، چېرې چې مګنا کم لاود فارغ‌التحصیله شوې.',
    },
  };

  await contentColl.updateOne(
    { _id: 'team' },
    { $set: { data: { categories, members }, updatedAt: new Date() } }
  );

  console.log('Updated successfully!');
  console.log(`  Image: ${sarah.imageUrl}`);
  console.log(`  Farsi name: ${sarah.translations.fa.name}`);
  console.log(`  Pashto name: ${sarah.translations.ps.name}`);
} catch (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
} finally {
  await client.close();
}
