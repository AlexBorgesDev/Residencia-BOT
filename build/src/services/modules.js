"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const delay_1 = __importDefault(require("delay"));
async function default_1(page) {
    console.clear();
    console.log(chalk_1.default.bold.blue('Obtendo os links das aulas, aguarde...'));
    await page.waitForSelector('h3[title][data-uk-tooltip]', {
        visible: true,
        timeout: 15000
    });
    await page.click('h3[title][data-uk-tooltip]');
    await delay_1.default(1500);
    await page.waitForSelector('div > ul > li > div[aria-hidden] div.uk-flex.uk-flex-middle[style] a');
    const aulas = await page.evaluate(() => {
        function checkPendente(element) {
            var _a, _b, _c, _d;
            return (((_d = (_c = (_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.querySelectorAll('div')[1].querySelector('span')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase()) === 'pendente');
        }
        const aulas = [
            ...document.querySelectorAll('div > ul > li > div[aria-hidden] div.uk-flex.uk-flex-middle[style] a')
        ];
        const myAulas = [];
        const modules = [...document.querySelectorAll('h4')].map(element => { var _a; return ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const aulasModuleOne = aulas.filter((e, index) => index <= 8);
        const aulasModuleTwo = aulas.filter((e, index) => index > 10 && index <= 19);
        const aulasModuleThree = aulas.filter((e, index) => index > 21 && index <= 30);
        const aulasModuleFor = aulas.filter((e, index) => index > 32 && index <= 41);
        const newAulasModuleOne = [];
        const newAulasModuleTwo = [];
        const newAulasModuleThree = [];
        const newAulasModuleFor = [];
        for (const index in aulasModuleOne) {
            if (checkPendente(aulasModuleOne[index])) {
                newAulasModuleOne.push({
                    url: aulasModuleOne[index].getAttribute('href') || '',
                    index: Number(index),
                    episode: Number(index) + 1
                });
            }
        }
        myAulas.push({ aulas: newAulasModuleOne, moduleName: modules[0] });
        for (const index in aulasModuleTwo) {
            if (checkPendente(aulasModuleTwo[index])) {
                newAulasModuleTwo.push({
                    url: aulasModuleTwo[index].getAttribute('href') || '',
                    index: Number(index),
                    episode: Number(index) + 1
                });
            }
        }
        myAulas.push({ aulas: newAulasModuleTwo, moduleName: modules[1] });
        for (const index in aulasModuleThree) {
            if (checkPendente(aulasModuleThree[index])) {
                newAulasModuleThree.push({
                    url: aulasModuleThree[index].getAttribute('href') || '',
                    index: Number(index),
                    episode: Number(index) + 1
                });
            }
        }
        myAulas.push({ aulas: newAulasModuleThree, moduleName: modules[2] });
        for (const index in aulasModuleFor) {
            if (checkPendente(aulasModuleFor[index])) {
                newAulasModuleFor.push({
                    url: aulasModuleFor[index].getAttribute('href') || '',
                    index: Number(index),
                    episode: Number(index) + 1
                });
            }
        }
        myAulas.push({ aulas: newAulasModuleFor, moduleName: modules[3] });
        return myAulas;
    });
    console.clear();
    return aulas;
}
exports.default = default_1;
