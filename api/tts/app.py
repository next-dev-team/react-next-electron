import os
import tempfile
import argparse
from pysubparser import parser
from pydub import AudioSegment
import edge_tts
import asyncio

def time_to_ms(time):
    return ((time.hour * 60 + time.minute) * 60 + time.second) * 1000 + time.microsecond / 1000

async def generate_audio(path = 'data/test1.srt', voice='km-KH-PisethNeural'):
    print(f"Generating audio file for {path} with Edge TTS")

    subtitles = parser.parse(path)

    audio_sum = AudioSegment.empty()

    with tempfile.TemporaryDirectory() as tmpdirname:
        print('created temporary directory', tmpdirname)

        temp_file_path = os.path.join(tmpdirname, "temp.mp3")
        prev_subtitle = None
        prev_audio_duration_ms = 0

        for subtitle in subtitles:
            # Create communication with the Edge TTS service
            communicate = edge_tts.Communicate(subtitle.text, voice)

            # Save the audio to a temporary file
            await communicate.save(temp_file_path)

            # Load the audio segment
            audio_segment = AudioSegment.from_mp3(temp_file_path)

            print(subtitle.start, subtitle.text)

            # Calculate silence duration
            if prev_subtitle is None:
                silence_duration_ms = time_to_ms(subtitle.start)
            else:
                silence_duration_ms = time_to_ms(subtitle.start) - time_to_ms(prev_subtitle.start) - prev_audio_duration_ms

            # Add silence and audio segment to the final audio
            audio_sum += AudioSegment.silent(duration=silence_duration_ms) + audio_segment

            prev_subtitle = subtitle
            prev_audio_duration_ms = len(audio_segment)

        # Export the final audio file
        output_path = os.path.splitext(path)[0] + '.wav'
        with open(output_path, 'wb') as out_f:
            audio_sum.export(out_f, format='wav')

        print(f"Audio file saved to {output_path}")

def main():

    # Run the async function
    asyncio.run(generate_audio())

if __name__ == "__main__":
    main()




# srt_edge_tts(
#     "data/test.srt",
#     "data/test.mp3",
#     "km-KH-PisethNeural",
# )


