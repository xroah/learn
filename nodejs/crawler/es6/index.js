const puppeteer = require("puppeteer");

async function start(browser, link) {
    let page = await browser.newPage();
    await page.goto(link.url);
    await timeout(2000);
    await page.evaluate(() => {
        let els = document.querySelectorAll("#sidebar, #flip, #留言");
        document.getElementById("content").style.paddingBottom = "0px";
        Array.from(els).forEach(el => el.style.display = "none");
    });
    await page.pdf({
        path: `./pdf/${link.text}.pdf`,
        printBackground: true,
        margin: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 10
        },
        width: 800
    });
    await page.close();
}

function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function init() {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto("http://es6.ruanyifeng.com/");
    await timeout(2000);
    let links = await page.evaluate(() => {
        let links = document.querySelectorAll("#sidebar ol a");
        links = Array.from(links).map(link => {
            return {
                text: link.innerHTML.trim(),
                url: link.href
            }
        })
        return Promise.resolve(links);
    });
    async function save() {
        if(links.length) {
            let link = links.shift();
            await start(browser, link);
            process.stdout.write(`正在下载: ${link.text}\n`);
            save();
        } else {
            browser.close();
        }
    }
    save();
}

init();