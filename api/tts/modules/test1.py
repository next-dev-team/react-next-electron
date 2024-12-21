import edge_tts
import asyncio
from pydub import AudioSegment

class EdgeTTSSync:
    def __init__(self, text, language='zh-CN', voice=None, rate=None):
        self.text = text
        self.language = language
        self.voice = voice or self.get_default_voice()
        self.rate = rate or self.calculate_optimal_rate()

    def get_default_voice(self):
        # Mapping of languages to recommended voices
        voice_map = {
            'zh-CN': 'zh-CN-XiaoxiaoNeural',
            'zh-TW': 'zh-TW-HsiaoChenNeural',
            'ja-JP': 'ja-JP-NanamiNeural',
            'ko-KR': 'ko-KR-SunHiNeural'
        }
        return voice_map.get(self.language, 'zh-CN-XiaoxiaoNeural')

    def calculate_optimal_rate(self):
        # Dynamic rate calculation based on text characteristics
        text_length = len(self.text)

        if text_length < 50:
            return "+0%"  # Short text, normal speed
        elif text_length < 100:
            return "+10%"  # Slightly faster
        elif text_length < 200:
            return "+20%"  # Moderate speed increase
        else:
            return "+30%"  # Significant speed boost

    async def generate_tts(self, output_file=None):
        try:
            # Enhanced TTS generation
            communicate = edge_tts.Communicate(
                self.text,
                rate=self.rate,
                voice=self.voice
            )

            # If no output file specified, use temporary file
            output = output_file or f"data/tts_output_{hash(self.text)}.mp3"

            await communicate.save(output)
            return output

        except Exception as e:
            print(f"TTS Generation Error: {e}")
            return None

    def analyze_audio_duration(self, audio_file):
        # Analyze actual audio duration
        audio = AudioSegment.from_mp3(audio_file)
        return len(audio) / 1000  # Duration in seconds

    @staticmethod
    async def generate_multilingual_tts(
        texts,
        languages=['en-US', 'zh-CN'],
        voices=None
    ):
        # Batch TTS generation for multiple languages
        tts_tasks = []
        for text, lang in zip(texts, languages):
            voice = voices.get(lang) if voices else None
            tts_sync = EdgeTTSSync(text, language=lang, voice=voice)
            tts_task = tts_sync.generate_tts()
            tts_tasks.append(tts_task)

        return await asyncio.gather(*tts_tasks)

# Usage Examples
async def main():
    # Single Language TTS
    tts_generator = EdgeTTSSync(
        "Yang Yang ខ្ញុំបានសុំឱ្យមេដោះរបស់ខ្ញុំរៀបចំអាហារសម្រន់សម្រាប់អ្នក។",
        language='zh-CN',
        rate="+20%"
    )
    audio_file = await tts_generator.generate_tts()

    # Analyze Duration
    duration = tts_generator.analyze_audio_duration(audio_file)
    print(f"Audio Duration: {duration} seconds")

    # Multilingual TTS
    texts = [
        "Yang Yang I asked you to prepare a snack for you.",
        "你好，这是一个测试句子"
    ]
    languages = ['en-US', 'zh-CN']
    voices = {
        'en-US': 'en-US-AriaNeural',
        'zh-CN': 'zh-CN-XiaoxiaoNeural'
    }

    audio_files = await EdgeTTSSync.generate_multilingual_tts(
        texts, languages, voices
    )
    print("Generated Audio Files:", audio_files)

# Run the async function
asyncio.run(main())
