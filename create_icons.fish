set -l ANDROID 144 192 48 72 96
set -l APPLE 114 144 57 72
set -l MSTILE 144 70 310 50
set -l INPUT src/assets/img/logo_plain_colored.svg

for i in $ANDROID
    set -l SIZE (echo $i)x(echo $i)
    echo "Generating $SIZE"
    inkscape -w $i -h $i $INPUT -o src/assets/img/android/chrome-(echo $SIZE).png
end

for i in $APPLE
    set -l SIZE (echo $i)x(echo $i)
    inkscape -w $i -h $i $INPUT -o src/assets/img/apple/apple-touch-icon-(echo $SIZE).png
end

for i in $MSTILE
    set -l SIZE (echo $i)x(echo $i)
    inkscape -w $i -h $i $INPUT -o src/assets/img/mstile/mstile-(echo $SIZE).png
end

inkscape -w 32 -h 32 $INPUT -o src/assets/img/favicon.png

## Convert to ICO
convert src/assets/img/favicon.png -define icon:auto-resize=16,32,48,64,128,256 src/assets/img/favicon.ico