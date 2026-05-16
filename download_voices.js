const https = require('https');
const fs = require('fs');
const path = require('path');

const TRANSLATIONS = {
  id: {
    Sun: "Matahari",
    Mercury: "Merkurius",
    Venus: "Venus",
    Earth: "Bumi",
    Mars: "Mars",
    Jupiter: "Yupiter",
    Saturn: "Saturnus",
    Uranus: "Uranus",
    Neptune: "Neptunus",
    Moon: "Bulan",
    ISS: "Satelit",
    Asteroid: "Asteroid",
    Astronaut: "Astronot",
  },
  en: {
    Sun: "Sun",
    Mercury: "Mercury",
    Venus: "Venus",
    Earth: "Earth",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Uranus: "Uranus",
    Neptune: "Neptune",
    Moon: "Moon",
    ISS: "Satellite",
    Asteroid: "Asteroid",
    Astronaut: "Astronaut",
  },
};

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const voicesDir = path.join(__dirname, 'public', 'voices');
  for (const lang of ['id', 'en']) {
    for (const [key, text] of Object.entries(TRANSLATIONS[lang])) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
      const dest = path.join(voicesDir, lang, `${key.toLowerCase()}.mp3`);
      console.log(`Downloading ${lang} voice for ${key}...`);
      await download(url, dest);
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log('All voices regenerated!');
}

run().catch(console.error);
