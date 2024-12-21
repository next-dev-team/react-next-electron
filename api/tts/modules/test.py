import os
import srt
from pydub import AudioSegment
import datetime

def merge_audio_with_srt_advanced(audio_path: str, srt_path: str, output_path: str, pad_silence_ms=100):
    """
    Advanced audio merging that preserves all original audio, including silent parts
    """
    # Read the SRT file
    with open(srt_path, 'r', encoding='utf-8') as f:
        subtitles = list(srt.parse(f.read()))

    # Load the original audio
    full_audio = AudioSegment.from_file(audio_path)

    # Prepare a new merged audio segment
    merged_audio = AudioSegment.empty()

    # Track the last end time to capture silent parts
    last_end_time = 0

    # Create a log to track merged segments
    merge_log = []

    # Sort subtitles by start time to ensure correct order
    subtitles.sort(key=lambda x: x.start)

    for subtitle in subtitles:
        try:
            # Split speaker and text
            speaker_info = subtitle.content.split('|')
            if len(speaker_info) < 2:
                continue

            speaker = speaker_info[0].strip()
            text = speaker_info[1].strip()

            # Convert time to milliseconds
            start_ms = int(subtitle.start.total_seconds() * 1000)
            end_ms = int(subtitle.end.total_seconds() * 1000)

            # Add silent part if there's a gap
            if start_ms > last_end_time:
                # Extract and add silent part
                silent_segment = full_audio[last_end_time:start_ms]
                merged_audio += silent_segment

                merge_log.append({
                    'type': 'silence',
                    'start_ms': last_end_time,
                    'end_ms': start_ms,
                    'duration_ms': start_ms - last_end_time
                })

            # Extract and add the current segment
            segment_audio = full_audio[start_ms:end_ms]
            merged_audio += segment_audio

            # Log the merge details
            merge_log.append({
                'type': 'speech',
                'speaker': speaker,
                'text': text,
                'start_ms': start_ms,
                'end_ms': end_ms,
                'duration_ms': end_ms - start_ms
            })

            # Update last end time
            last_end_time = end_ms

        except Exception as e:
            print(f"Error processing subtitle: {subtitle}")
            print(f"Error details: {str(e)}")

    # Add any remaining audio after the last subtitle
    if last_end_time < len(full_audio):
        final_segment = full_audio[last_end_time:]
        merged_audio += final_segment

        merge_log.append({
            'type': 'final_silence',
            'start_ms': last_end_time,
            'end_ms': len(full_audio),
            'duration_ms': len(full_audio) - last_end_time
        })

    # Verify audio length
    original_duration = len(full_audio)
    merged_duration = len(merged_audio)

    print(f"Original Audio Duration: {original_duration} ms")
    print(f"Merged Audio Duration: {merged_duration} ms")

    # Export the merged audio
    merged_audio.export(output_path, format='wav')

    # Optionally, create a log file
    log_path = os.path.splitext(output_path)[0] + '_merge_log.json'
    import json
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(merge_log, f, ensure_ascii=False, indent=2)

    print(f"Merged audio exported to {output_path}")
    print(f"Merge log exported to {log_path}")

    return merge_log

def validate_audio_timing(original_audio, merged_audio):
    """
    Validate that no audio is lost during merging
    """
    original_duration = len(original_audio)
    merged_duration = len(merged_audio)

    # Allow small discrepancies due to audio format conversion
    tolerance_ms = 50

    if abs(original_duration - merged_duration) > tolerance_ms:
        print("WARNING: Potential audio loss detected!")
        print(f"Original Duration: {original_duration} ms")
        print(f"Merged Duration: {merged_duration} ms")
        print(f"Difference: {abs(original_duration - merged_duration)} ms")
        return False
    return True

def process_audio_with_full_preservation(input_audio, input_srt):
    """
    Comprehensive audio processing with full preservation
    """
    # Output paths
    output_audio = 'data/fully_merged_audio.wav'
    output_log = 'data/audio_merge_log.json'

    # Load original audio
    full_audio = AudioSegment.from_file(input_audio)

    # Merge audio with advanced method
    merge_log = merge_audio_with_srt_advanced(
        input_audio,
        input_srt,
        output_audio
    )

    # Load merged audio
    merged_audio = AudioSegment.from_file(output_audio)

    # Validate timing
    timing_valid = validate_audio_timing(full_audio, merged_audio)

    return {
        'merge_log': merge_log,
        'timing_valid': timing_valid,
        'original_duration': len(full_audio),
        'merged_duration': len(merged_audio)
    }

def main():
    # Input paths
    input_audio = 'data/output4.mp3'  # Replace with your input audio file
    input_srt = 'data/test1.srt'  # Replace with your input SRT file

    # Process audio
    result = process_audio_with_full_preservation(input_audio, input_srt)

    # Print result details
    print("\nProcessing Results:")
    print(f"Original Duration: {result['original_duration']} ms")
    print(f"Merged Duration: {result['merged_duration']} ms")
    print(f"Timing Validated: {result['timing_valid']}")

if __name__ == "__main__":
    main()
