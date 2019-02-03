const fs = require('fs')

function writeHTML() {
	const fileNames = fs.readdirSync('dist/compiled')
	const cssFile = fileNames.find(file => file.includes('.css'))
	const jsFile = fileNames.find(file => file.includes('.js'))
	const indexHTML = fs.readFileSync('client/index.html', 'utf8')
	const indexHTML_withReplacements = indexHTML
		.replace('CSSHERE', cssFile)
		.replace('JSHERE', jsFile)
	fs.writeFileSync('dist/index.html', indexHTML_withReplacements)
}

writeHTML()
