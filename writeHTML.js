const fs = require('fs')

function writeHTML() {
	const fileNames = fs.readdirSync('dist/compiled')
	const cssFile = fileNames.find(file => file.includes('.css'))
	const indexHTML = fs.readFileSync('client/index.html', 'utf8')
	const indexHTML_withCSS = indexHTML.replace('CSSHERE', cssFile)
	fs.writeFileSync('dist/index.html', indexHTML_withCSS)
}

writeHTML()
