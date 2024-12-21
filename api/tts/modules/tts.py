import asyncio
import logging
import random
import tempfile
from typing import Dict, Tuple, List

import edge_tts
import pysrt
from pydub import AudioSegment
from rvc_python.infer import RVCInference


class MultiSpeakerTTSConverter:
    def __init__(
        self,
        voice_models: Dict[str, str] = None,
        rate: str = "+0%",
        volume: str = "+0%",
        batch_size: int = 50,
    ):
        """
        Initialize the Multi-Speaker TTS converter with enhanced natural speech generation.

        :param voice_models: Dictionary mapping speaker tags to voice models
        :param rate: Default speech rate
        :param volume: Default speech volume
        :param batch_size: Number of subtitles to process in parallel
        """
        # Default voice models for Khmer language with multiple voices
        self.default_voice_models = {
            "SPEAKER_00": "km-KH-PisethNeural",
            "SPEAKER_01": "km-KH-SreymomNeural",
            "SPEAKER_02": "km-KH-PisethNeural",
            "SPEAKER_03": "km-KH-SreymoomNeural",
            "None": "km-KH-PisethNeural",
        }

        # Override default models if custom models are provided
        self.voice_models = voice_models or self.default_voice_models

        # Speech parameters with more natural variation
        self.rate = rate
        self.volume = volume
        self.batch_size = batch_size

        # Setup logging
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(
            level=logging.INFO,
            format="[%(asctime)s] %(levelname)s: %(message)s"
        )

        # Logging for duration tracking
        self.duration_log: List[Dict] = []

    def _handle_short_duration_text(
        self, text: str, duration: float
    ) -> Tuple[str, str, str]:
        """
        Intelligently handle text-to-speech generation for short durations.

        :param text: Input text
        :param duration: Available duration in seconds
        :return: Tuple of (adjusted rate, adjusted volume, processed text)
        """
        # Improved word count and duration estimation
        text_word_count = len(text.split())
        avg_word_read_time = 0.3  # Average time to speak a word
        estimated_natural_duration = max(text_word_count * avg_word_read_time, 0.5)

        # More nuanced rate adjustment
        if duration < estimated_natural_duration:
            compression_factor = duration / estimated_natural_duration

            # Extreme short duration handling
            if duration < 1:
                # Ultra-compression: select key words
                words = text.split()
                text = " ".join(words[: max(1, int(len(words) * 0.3))])
                rate = f"+{min(100, int((1/compression_factor) * 100))}%"
                volume = "+10%"
            else:
                # Moderate compression
                rate = f"+{min(50, int((estimated_natural_duration / duration - 1) * 100))}%"
                volume = "+15%"
        else:
            # Normal duration
            rate = self.rate
            volume = self.volume

        return rate, volume, text

    def parse_subtitle_text(self, text: str) -> Tuple[str, str]:
        """
        Parse subtitle text to extract speaker and actual text with improved handling.

        :param text: Raw subtitle text
        :return: Tuple of (speaker, cleaned text)
        """
        # Enhanced speaker tag parsing
        parts = text.split("|", 1)

        # Handle various speaker tag formats
        if len(parts) == 2:
            speaker = parts[0].strip().upper()
            text = parts[1].strip()
        else:
            # Use contextual speaker detection or default
            speaker = self._detect_speaker(text)
            text = parts[0].strip()

        # Remove any extra whitespaces and newlines
        text = " ".join(text.split())

        return speaker, text

    def _detect_speaker(self, text: str) -> str:
        """
        Detect speaker based on context or pattern matching.

        :param text: Subtitle text
        :return: Detected speaker tag
        """
        # Simple heuristics for speaker detection
        speaker_keywords = {
            "NARRATOR": ["narrator", "voice over", "description"],
            "SPEAKER_01": ["woman", "female"],
            "SPEAKER_00": ["man", "male"],
        }

        text_lower = text.lower()
        for tag, keywords in speaker_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                return tag

        return "None"

    def pysrttime_to_seconds(self, t) -> float:
        """Convert pysrt time to total seconds."""
        return (t.hours * 60 + t.minutes) * 60 + t.seconds + t.milliseconds / 1000

    async def generate_audio_segment(
        self, text: str, duration: float, speaker: str
    ) -> str:
        """
        Generate an audio segment with more natural speech characteristics.

        :param text: Text to convert to speech
        :param duration: Expected duration of the segment
        :param speaker: Speaker identifier
        :return: Path to generated audio file
        """
        # Handle short duration text intelligently
        rate, volume, processed_text = self._handle_short_duration_text(text, duration)

        retry_count = 0
        retry_limit = 3

        # Adaptive voice selection with fallback
        voice = self.voice_models.get(speaker, self.voice_models["None"])

        rvc = RVCInference(
            device="cuda:0",
            models_dir="D:\\pinokio\\api\\react-next-electron\\api\\tts\\data",
        )
        rvc.set_params(f0method="rmvpe")
        rvc_models = {
            "SPEAKER_00": "me",
            "SPEAKER_01": "rosev3",
            "SPEAKER_02": "rosev3",
            "None": "me",
        }
        rvc.load_model(rvc_models.get(speaker, rvc_models["None"]))

        while retry_count <= retry_limit:
            try:
                # Generate temporary filename
                temp_file = tempfile.mktemp(suffix=".mp3")

                # Generate speech with dynamic parameters
                communicate = edge_tts.Communicate(
                    processed_text, rate=rate, volume=volume, voice=voice
                )
                await communicate.save(temp_file)

                # Advanced audio length adjustment
                audio = AudioSegment.from_file(temp_file, format="mp3")

                # Enhanced duration mapping
                audio = self._precise_audio_length_adjustment(
                    audio, duration, processed_text
                )

                # Add natural breathing or pause effects
                audio = self._add_natural_pauses(audio, processed_text)

                # Convert to WAV and apply RVC
                wav_file = temp_file.replace(".mp3", ".wav")
                audio.export(wav_file, format="wav")
                result = rvc.infer_file(wav_file, wav_file)

                # Log duration details
                actual_duration = len(audio) / 1000
                self.duration_log.append({
                    'text': processed_text,
                    'expected_duration': duration,
                    'actual_duration': actual_duration,
                    'speaker': speaker,
                    'rate': rate,
                })

                return result

            except Exception as e:
                retry_count += 1
                self.logger.warning(
                    f"Audio generation retry {retry_count} for {speaker}: {e}"
                )
                await asyncio.sleep(retry_count + random.randint(1, 3))

        # Fallback: generate natural-sounding silence
        return self._generate_fallback_silence(duration)

    def _precise_audio_length_adjustment(
        self, audio: AudioSegment, target_duration: float, text: str
    ) -> AudioSegment:
        """
        Precisely adjust audio length with intelligent padding and trimming.

        :param audio: Input audio segment
        :param target_duration: Desired duration in seconds
        :param text: Original text for context-aware adjustment
        :return: Adjusted audio segment
        """
        target_length_ms = int(target_duration * 1000)
        current_length = len(audio)

        # Minimum threshold for adjustment
        if abs(current_length - target_length_ms) <= 100:
            return audio

        if current_length > target_length_ms:
            # Proportional trimming
            trim_ratio = target_length_ms / current_length
            audio = audio[:target_length_ms]

            # Dynamic fade out based on text complexity
            fade_duration = min(int(current_length * 0.1), 300)
            audio = audio.fade_out(fade_duration)
        else:
            # Intelligent padding
            padding_ms = target_length_ms - current_length

            # Context-aware silence insertion
            silence_factor = 0.9 if ',' in text else 1.0
            silence_duration = int(padding_ms * silence_factor)

            silence = AudioSegment.silent(duration=silence_duration)
            silence = silence.fade_in(50).fade_out(50)
            audio += silence

        return audio

    def _add_natural_pauses(self, audio: AudioSegment, text: str) -> AudioSegment:
        """
        Add natural pauses and breathing-like effects.

        :param audio: Input audio segment
        :param text: Original text
        :return: Audio with added natural effects
        """
        # Add soft breathing or pause effects
        punctuation_pause_map = {
            ".": 100,  # Period
            ",": 50,   # Comma
            "!": 150,  # Exclamation
            "?": 120,  # Question mark
        }

        for punct, pause_duration in punctuation_pause_map.items():
            if punct in text:
                # Add soft breathing or subtle pause
                breath_effect = AudioSegment.silent(duration=pause_duration)
                breath_effect = breath_effect.fade_in(20).fade_out(20)
                audio += breath_effect

        return audio

    def _generate_fallback_silence(self, duration: float) -> str:
        """
        Generate a more natural-sounding fallback silence.

        :param duration: Desired silence duration
        :return: Path to silence audio file
        """
        temp_file = tempfile.mktemp(suffix=".mp3")

        # Create slightly varying natural-sounding silence
        silence = AudioSegment.silent(duration=int(duration * 1000))
        silence = silence.fade_in(50).fade_out(50)

        silence.export(temp_file, format="mp3")
        return temp_file

    async def convert_srt_to_audio(self, srt_file: str, out_file: str):
        """
        Convert SRT file to audio with enhanced multi-speaker support.

        :param srt_file: Input SRT file path
        :param out_file: Output audio file path
        """
        # Reset duration log
        self.duration_log = []

        # Read SRT data
        srt_data = pysrt.open(srt_file)
        max_duration = self.pysrttime_to_seconds(srt_data[-1].end)

        # Use context-aware processing
        with tempfile.TemporaryDirectory() as temp_dir:
            audio_segments = []
            last_end_time = 0
            last_speaker = None

            # Process subtitles in intelligent batches
            for i in range(0, len(srt_data), self.batch_size):
                batch = srt_data[i : i + self.batch_size]
                batch_tasks = []

                for subtitle in batch:
                    start = self.pysrttime_to_seconds(subtitle.start)
                    end = self.pysrttime_to_seconds(subtitle.end)
                    duration = end - start

                    # Parse speaker and text with enhanced detection
                    speaker, text = self.parse_subtitle_text(subtitle.text)

                    # Prepare text and generate audio task
                    task = self.generate_audio_segment(text, duration, speaker)
                    batch_tasks.append((start, end, task, speaker, text))

                # Await batch processing
                for start, end, task, speaker, text in batch_tasks:
                    audio_path = await task
                    audio_segments.append((start, end, audio_path, speaker, text))

            # Combine audio with intelligent transitions
            final_audio = AudioSegment.empty()
            audio_segments.sort(key=lambda x: x[0])

            for i, (start, end, audio_path, speaker, text) in enumerate(audio_segments):
                # Add intelligent inter-speaker transitions
                if start > last_end_time:
                    transition_duration = (start - last_end_time) * 1000
                    if transition_duration > 0:
                        # Create a more natural, varied transition
                        fade_duration = min(200, int(transition_duration / 3))
                        silence = AudioSegment.silent(duration=int(transition_duration))
                        final_audio += silence.fade_in(fade_duration).fade_out(
                            fade_duration
                        )

                # Load and process audio segment
                segment = AudioSegment.from_file(audio_path, format="mp3")

                # Add subtle emphasis based on speaker changes
                if speaker != last_speaker and last_speaker is not None:
                    segment = segment.fade_in(100)

                final_audio += segment
                last_end_time = end
                last_speaker = speaker

            # Add final padding if needed
            if last_end_time < max_duration:
                final_silence_duration = (max_duration - last_end_time) * 1000
                final_audio += AudioSegment.silent(
                    duration=int(final_silence_duration)
                ).fade_in(50)

            # Export final audio
            final_audio.export(out_file, format="mp3")

            # Log duration analysis
            self._log_duration_analysis()

        self.logger.info(f"Converted {srt_file} to {out_file}")

    def _log_duration_analysis(self):
        """
        Log detailed analysis of audio generation durations.
        """
        if not self.duration_log:
            return

        self.logger.info("\n--- Audio Duration Analysis ---")
        total_expected = sum(entry['expected_duration'] for entry in self.duration_log)
        total_actual = sum(entry['actual_duration'] for entry in self.duration_log)

        self.logger.info(f"Total Expected Duration: {total_expected:.2f} seconds")
        self.logger.info(f"Total Actual Duration: {total_actual:.2f} seconds")
        self.logger.info(f"Duration Difference: {abs(total_expected - total_actual):.2f} seconds")

        # Detailed breakdown
        for entry in self.duration_log:
            self.logger.info(
                f"Text: '{entry['text'][:50]}...', "
                f"Speaker: {entry['speaker']}, "
                f"Expected: {entry['expected_duration']:.2f}s, "
                f"Actual: {entry['actual_duration']:.2f}s, "
                f"Rate: {entry['rate']}"
            )

    def convert(self, srt_file: str, out_file: str):
        """
        Synchronous wrapper for async conversion.

        :param srt_file: Input SRT file path
        :param out_file: Output audio file path
        """
        try:
            asyncio.run(self.convert_srt_to_audio(srt_file, out_file))
        except Exception as e:
            self.logger.error(f"Conversion failed: {e}")
            raise


# Example usage
def main():
    # Setup logging
    logging.basicConfig(level=logging.INFO)

    # Custom voice models for different speakers
    custom_voice_models = {
        "SPEAKER_00": "km-KH-PisethNeural",
        "SPEAKER_01": "km-KH-SreymomNeural",
        "SPEAKER_02": "km-KH-PisethNeural",
        "SPEAKER_03": "km-KH-SreymoomNeural",
        "None": "km-KH-PisethNeural",
    }

    # Initialize converter with enhanced parameters
    converter = MultiSpeakerTTSConverter(
        voice_models=custom_voice_models, rate="+0%", volume="+0%", batch_size=25
    )

    # Convert SRT to multi-speaker audio
    try:
        converter.convert("data/test1.srt", "data/output4.mp3")
        print("Conversion completed successfully!")
    except Exception as e:
        print(f"Conversion failed: {e}")


if __name__ == "__main__":
    main()
