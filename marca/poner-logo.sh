#!/bin/bash
# Pega el logo de Aurum sobre el video a partir de un segundo dado (aparece con un fundido de 0,4 s).
# Uso:  bash marca/poner-logo.sh reels/<slug>/exports/<slug>.mp4 <segundo_inicio> [ancho_px=420] [centro_y_px=860]
# El último plano del reel debe dejar libre un recuadro claro centrado en x = 540, y = centro_y.
# Escribe <video>-logo.mp4 al lado del original.
set -e
in="$1"; t="$2"; w="${3:-420}"; cy="${4:-860}"
[ -f "$in" ] && [ -n "$t" ] || { echo "Uso: bash marca/poner-logo.sh <video.mp4> <segundo_inicio> [ancho] [centro_y]"; exit 1; }
logo="$(cd "$(dirname "$0")" && pwd)/logo_aurum_transparente.png"
out="${in%.mp4}-logo.mp4"
ffmpeg -v error -y -i "$in" -loop 1 -i "$logo" -filter_complex \
  "[1:v]scale=${w}:-1,format=rgba,fade=t=in:st=${t}:d=0.4:alpha=1[l];[0:v][l]overlay=x=(W-w)/2:y=${cy}-h/2:shortest=1:enable='gte(t,${t})'" \
  -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p -c:a copy "$out"
echo "Listo: $out"
