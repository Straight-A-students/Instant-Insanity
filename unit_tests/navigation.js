const puppeteer = require('puppeteer');
const fs = require('fs');
const Printer = require('./util.js').Printer;
var ArgumentParser = require('argparse').ArgumentParser;


var parser = new ArgumentParser({ addHelp: true, headless: false });

parser.addArgument('--width', { defaultValue: 1200, type: 'int' });
parser.addArgument('--height', { defaultValue: 900, type: 'int' });
parser.addArgument('--withhead', { dest: 'headless', action: 'storeFalse' });
var args = parser.parseArgs();
console.log(args);

const width = args.width;
const height = args.height;
const headless = args.headless
const outdir = __dirname + '/output/navigation/';
const printer = new Printer(outdir)
const htmlfiel = outdir + 'result.html';

if (!fs.existsSync(outdir)) {
	fs.mkdirSync(outdir, { recursive: true });
}

if (fs.existsSync(htmlfiel)) {
	fs.unlink(htmlfiel, function(err) {
		if (err) throw err;
	});
}

(async () => {

	const browser = await puppeteer.launch({
		headless: headless,
		defaultViewport: {
			width: width,
			height: height,
		}
	});
	console.log(await browser.version());

	const page = await browser.newPage();

	await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle2' });
	await page.waitFor(100)
	await printer.writeText('browser.version: ' + await browser.version() + ' width:' + width + ' height:' + height)
	await printer.writeImg(page, 'Load home')

	await page.click('#start')
	await page.waitFor(100)
	await printer.writeImg(page, 'Go to game')

	await page.click('#pause')
	await page.waitFor(100)
	await printer.writeImg(page, 'Click Pause')

	await page.click('#exit')
	await page.waitFor(100)
	await printer.writeImg(page, 'Click Exit. Go back to Home')

	await page.click('#gotoSetting')
	await page.waitFor(100)
	await printer.writeImg(page, 'Go to Setting')

	await page.click('#gohome')
	await page.waitFor(100)
	await printer.writeImg(page, 'Go back to Home')

	await page.click('#gotoAchievement')
	await page.waitFor(100)
	await printer.writeImg(page, 'Go to Achievement')

	await page.click('#gohome')
	await page.waitFor(100)
	await printer.writeImg(page, 'Go back to Home')

	await browser.close();
})();
