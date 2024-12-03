from datetime import datetime
import os
import tempfile
from pysubparser import parser
from pydub import AudioSegment
import edge_tts
from rvc_python.infer import RVCInference


def time_to_ms(time):
    return (
        (time.hour * 60 + time.minute) * 60 + time.second
    ) * 1000 + time.microsecond / 1000


async def srt_edge_tts(path, voice, voice_models=None, rvc_models=None):
    print(f"Generating audio file for {path} with Edge TTS")

    subtitles = parser.parse(path)

    audio_sum = AudioSegment.empty()

    with tempfile.TemporaryDirectory() as tmpdirname:
        print("created temporary directory", tmpdirname)

        temp_file_path = os.path.join(tmpdirname, "temp.mp3")
        prev_subtitle = None
        prev_audio_duration_ms = 0

        rvc = RVCInference(
          device="cuda:0",
          models_dir="D:\\pinokio\\api\\react-next-electron\\api\\tts\\data",
          f0method = "rmvpe",
          f0up_key=0,
          index_rate=0.5,
          filter_radius=3,
          resample_sr=48000,
          rms_mix_rate=1,
          protect=0.33
        )

        current_model = None

        for subtitle in subtitles:
            if "|" in subtitle.text:
                speaker, text = subtitle.text.split("|", 1)
            else:
                speaker = None
                text = subtitle.text

            model = rvc_models.get(speaker)

            if model != current_model:
                rvc.load_model(model)
                current_model = model

            # Create communication with the Edge TTS service
            communicate = edge_tts.Communicate(text, voice_models.get(speaker, voice))

            # Save the audio to a temporary file
            await communicate.save(temp_file_path)

            # Load the audio segment
            audio_segment = AudioSegment.from_mp3(temp_file_path)

            # Convert the audio segment to voice using RVC
            result = rvc.infer_file(
                temp_file_path, os.path.join(tmpdirname, "temp.wav")
            )

            # Load the audio segment after conversion
            audio_segment = AudioSegment.from_wav(result)

            print(subtitle.start, text)

            # Calculate silence duration
            if prev_subtitle is None:
                silence_duration_ms = time_to_ms(subtitle.start)
            else:
                silence_duration_ms = (
                    time_to_ms(subtitle.start)
                    - time_to_ms(prev_subtitle.start)
                    - prev_audio_duration_ms
                )

            # Add silence and audio segment to the final audio
            audio_sum += (
                AudioSegment.silent(duration=silence_duration_ms) + audio_segment
            )

            prev_subtitle = subtitle
            prev_audio_duration_ms = len(audio_segment)

        # Export the final audio file
        now = datetime.now()
        output_path = os.path.join(
            os.path.dirname(path),
            f"{now.strftime('%Y-%m-%d-%H-%M-%S')}-{os.path.basename(path)}.wav",
        )
        with open(output_path, "wb") as out_f:
            audio_sum.export(out_f, format="wav")

        print(f"Audio file saved to {output_path}")

