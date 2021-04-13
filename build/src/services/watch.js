"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = __importDefault(require("delay"));
async function default_1(page, url) {
    const videoURL = await page.evaluate(async (url) => {
        let task = url;
        task += task.indexOf('?') !== -1 ? '&allow=true' : '?allow=true';
        const response = await fetch(task, { method: 'GET' });
        const data = await response.json();
        return data.url;
    }, url);
    await page.goto(videoURL);
    await page.waitForSelector('#jsmx-container-tasks');
    await delay_1.default(1000);
    const attended = await page.evaluate(async () => {
        return document
            .querySelectorAll('#jsmx-badgeCoursedSide')[1]
            .classList.contains('uk-hidden');
    });
    if (!attended) {
        await page.goBack();
        return;
    }
    await page.mouse.click(112, 564, { delay: 100 });
    await delay_1.default(10000);
    await page.waitForSelector('iframe');
    await page.mouse.click(720, 376, { delay: 50 });
    await page.evaluate(async () => {
        var _a;
        const video = (_a = document
            .getElementsByTagName('iframe')[0]
            .contentDocument) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('video')[0];
        if (!video)
            return;
        video.muted = true;
        let videoFinish = false;
        video.addEventListener('pause', () => {
            if (!videoFinish)
                video.play();
        });
        return await new Promise(resolve => {
            const attendedElement = document.querySelectorAll('#jsmx-badgeCoursedSide')[1];
            const observer = new MutationObserver((mutation, observe) => {
                const attended = document
                    .querySelectorAll('#jsmx-badgeCoursedSide')[1]
                    .classList.contains('uk-hidden');
                if (!attended) {
                    observe.disconnect();
                    setTimeout(() => {
                        resolve('');
                    }, 10000);
                }
            });
            observer.observe(attendedElement, { attributeFilter: ['class'] });
            video === null || video === void 0 ? void 0 : video.addEventListener('ended', () => {
                videoFinish = true;
                setTimeout(() => {
                    resolve('');
                }, 10000);
            });
        });
    });
    await page.goBack();
    await page.goBack();
    return;
}
exports.default = default_1;
