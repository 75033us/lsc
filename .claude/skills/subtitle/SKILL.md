---
name: subtitle
description: Transcribe MP4 videos into bilingual SRT subtitles (original language + Traditional Chinese) with Whisper, then burn them into the video with ffmpeg
disable-model-invocation: true
---

# Generate Bilingual Subtitles (Original + Traditional Chinese)

Generate bilingual subtitles for MP4 video files — the spoken/original language on the first line, a Traditional Chinese translation on the second line — and burn them into the video.

## Setup (one-time)

**Recommended path — `whisper.cpp` with Metal acceleration on Apple Silicon (~5–10× faster than Python openai-whisper):**

```bash
brew install whisper-cpp
mkdir -p ~/whisper-models
curl -L -o ~/whisper-models/ggml-large-v3.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin
```

The `whisper-cli` binary uses Metal automatically on Apple Silicon — no flags required. A 55-min sermon takes ~5–10 min instead of ~2.5 hr.

**Fallback — OpenAI's Python `whisper`** (CPU-only on macOS, much slower; only use if `whisper.cpp` isn't installed):

```bash
pip install openai-whisper
```

## Your Job

1. **Identify the input** from the user's arguments — one or more MP4 file paths.

2. **Detect and transcribe** each MP4. Prefer `whisper.cpp` for Metal-accelerated speed on Apple Silicon. Auto-detect the language (do NOT force a language unless the user explicitly asks). Use the `large-v3` model for best accuracy.

   **Preferred — whisper.cpp:**
   ```bash
   # whisper.cpp needs 16 kHz mono PCM WAV
   ffmpeg -y -i "<file.mp4>" -ar 16000 -ac 1 -c:a pcm_s16le "<file>.wav"
   whisper-cli -m ~/whisper-models/ggml-large-v3.bin -osrt -of "<file_stem>" "<file>.wav"
   # produces <file_stem>.srt next to the input
   rm "<file>.wav"  # cleanup the intermediate WAV
   ```
   Metal is engaged automatically — confirm by checking the startup banner (`whisper_init_state: using Metal backend`).

   **Fallback — Python `openai-whisper`:**
   ```bash
   whisper "<file.mp4>" --model large --task transcribe --output_format srt --output_dir "<same directory as input>"
   ```
   Warn the user: this path is CPU-only on macOS and ~5–10× slower than the whisper.cpp path. For a 55-min source, expect 2+ hours wall-clock.

3. **Review the .srt** — read the generated subtitle file. Remove any whisper hallucinations (common on silence/music: ads, "字幕志愿者 ...", "Amen" repetitions, random characters). Check that the first entry's timing matches the actual start of speech.

4. **Build a bilingual .srt** — for each entry, keep the original transcription as line 1 and add a Traditional Chinese translation as line 2. The format for each entry is:
   ```
   N
   HH:MM:SS,mmm --> HH:MM:SS,mmm
   <original language line>
   <Traditional Chinese line>
   ```
   For Bible passages, use 和合本 (CUV) translation. For other content, produce natural Traditional Chinese (not Simplified).

5. **Show a preview** of the first ~10 bilingual entries as a table and ask the user to confirm or request corrections before burning.

6. **Burn subtitles into the video** using ffmpeg. Use `FontSize=16` (libass default size unit — this is a good readable size, not too large):
   ```bash
   ffmpeg -y -i "<file.mp4>" -vf "subtitles=<file.srt>:force_style='FontSize=16,FontName=PingFang TC,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1'" -c:a copy "<file>_subtitled.mp4"
   ```
   Note: Escape any special characters in the path for the subtitles filter. Prefer running ffmpeg from the directory containing the srt so the path is simple.

7. **Output** — the final file is `<original_name>_subtitled.mp4` in the same directory. Keep the `.srt` file — the user may want to edit it manually.

## Important Notes

- **Bilingual is the default.** Line 1 = original spoken language, line 2 = Traditional Chinese translation. Do not drop the original language.
- **Do not force `--language zh`.** Let Whisper auto-detect. Forcing the wrong language degrades accuracy and timing (and can make Whisper mis-transcribe English audio).
- **Use `--model large`** by default for accuracy. Warn the user that long videos (>30 min) will take a while.
- **Watch for whisper hallucinations** at the very start and end of the video (during silence or music). Common hallucinations: Chinese ad slogans, "字幕志愿者 ...", repeated "Amen", stray punctuation. Remove these before burning.
- **Check the first timestamp.** Whisper sometimes merges leading silence into the first entry or starts too late. Verify the first subtitle aligns with the actual start of speech.
- If ffmpeg is not installed, tell the user to run `brew install ffmpeg`.
