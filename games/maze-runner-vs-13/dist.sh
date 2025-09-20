rm -frd release.js
rm -frd main.js
npx google-closure-compiler --js=game.js --js_output_file=release.js --compilation_level=ADVANCED --language_out=ECMASCRIPT_2019 --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper
npx roadroller "release.js" -o "main.js"
rm -frd release.js