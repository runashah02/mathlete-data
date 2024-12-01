const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');
const cheerio = require('cheerio');
const axios = require('axios');

// Function to extract text from <p class="audio-enabled"> and convert it to audio
async function extractAndConvertToAudio(jsonData, outputFolder = 'assets/questions/audio') {
  // Create the output folder if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Loop through the JSON data
  for (const [questionIndex, question] of jsonData.entries()) {
    if (question.answerExplanation) {
      const htmlContent = question.answerExplanation;

      // Use Cheerio to parse the HTML content
      const $ = cheerio.load(htmlContent);

      // Find all <p> tags with class "audio-enabled"
      $('p.audio-enabled').each(async function (index) {
        const text = $(this).text().trim();

        if (text) {
          try {
            // Convert the text to a Google TTS URL
            const url = googleTTS.getAudioUrl(text, {
              lang: 'en',
              slow: false,
              host: 'https://translate.google.com',
            });

            // Define the filename and file path
            const filename = `audio_enabled_${questionIndex + 1}_${index + 1}.mp3`;
            const filePath = path.join(outputFolder, filename);

            // Download the audio file
            const response = await axios({
              url,
              method: 'GET',
              responseType: 'stream',
            });

            // Save the audio file to the output folder
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', () => console.log(`Saved: ${filePath}`));
            writer.on('error', console.error);
          } catch (error) {
            console.error('Error generating or saving audio:', error);
          }
        }
      });
    }
  }
}

// Example JSON data
const jsonData = [
  {
    questionType: 'FILL_IN_THE_BLANKS',
    answerExplanation: `
      <p class="audio-enabled">Start with 9 objects. Add 9 more objects.</p>
      <p class="audio-enabled">There are 18 objects, so 9 + 9 = 18</p>
      <p class="audio-enabled">Tara had 3 stars. Nia gave her 3 more stars. How many stars does Tara have now?</p>
    `,
  },
];

// Call the function to parse the JSON and convert the text to audio
extractAndConvertToAudio(jsonData);
