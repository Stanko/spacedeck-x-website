!#/bin/sh

# 720p
ffmpeg -i trailer.mp4 -vf scale=-2:720  -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart public/trailer/spacedeck-trailer-720.mp4 -y

# 1080p
ffmpeg -i trailer.mp4 -vf scale=-2:1080 -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 160k -movflags +faststart public/trailer/spacedeck-trailer-1080.mp4 -y

# 4K (re-encoded so it streams well and stays smaller)
ffmpeg -i trailer.mp4 -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 192k -movflags +faststart public/trailer/spacedeck-trailer-2160.mp4 -y

# Poster image (frame at 5.35 seconds)
ffmpeg -ss 5.35 -i trailer.mp4 -frames:v 1 -vf scale=-2:1080 public/trailer/poster.jpg -y
