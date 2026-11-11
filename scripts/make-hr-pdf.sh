#!/bin/sh
# Делает PDF информационного листа для HR из страницы /hr (запускать при работающем `npm run dev` на :3000).
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for l in en de ru; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=4000 \
    --print-to-pdf="public/pdf/hr-$l.pdf" "http://localhost:3000/$l/hr" 2>/dev/null
done
ls -la public/pdf
