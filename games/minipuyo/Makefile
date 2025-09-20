compile:
	haxe build.hxml

retail:
	rm -rf build
	rm -rf retail
	mkdir -p retail/build
	haxe build.hxml
	rsync -avzm . ./retail -progress --exclude='**/phaser.js' --include='deps/**/*.css' --include='data/**' --include='*/' --include='index.html' --exclude='*'
	terser --compress --mangle -- build/main.js > retail/build/main.js

zip: retail
	rm -f retail.zip
	cd retail && zip -r ../retail.zip ./*
	stat retail.zip | grep Size

.PHONY: build retail
