from zipfile import ZipFile, ZIP_LZMA, ZIP_BZIP2

assets = ''

with open('index.html', 'r') as index:
	lines = index.readlines()
	# get name of imported files
	assets_lines = [x for x in lines if 'type="text/javascript"' in x and 'src="' in x]
	assets_fnames = [x.split('"')[3] for x in assets_lines]
	
	for assets_fname in assets_fnames:
		# skip index.js as it will be injected on body
		if assets_fname == 'index.js':
			continue
		with open(assets_fname, 'r') as assetf:
			lines = assetf.readlines()
			# 
			for l in lines:
				lstriped = f"{l.lstrip()}"
				if not lstriped.startswith('//'):
					assets += lstriped

with open('index.html', 'r') as index:
	index_html = index.read()
	index_html = index_html.replace('/* inject assets.js */', assets)
	with open('index.js', 'r') as indexjs:
		index_html = index_html.replace('/* inject index.js */', indexjs.read())

	out = '\n'.join([x.lstrip() for x in index_html.split('\n') if not x.lstrip().startswith('//') and len(x.lstrip()) and not ('type="text/javascript"' in x and 'src="' in x)])
	
	with open('index.min.html', 'w+', encoding="utf-8") as f:
		read_data = f.write(out)

	with ZipFile('game.zip', 'w', compression=ZIP_BZIP2) as myzip:
		myzip.writestr('/index.html', out)


# print(assets)

