"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
async function default_1(page, email, password) {
    console.clear();
    console.log(chalk_1.default.bold.blue('Autenticando, aguarde...'));
    await page.goto('https://sre.avaresidencia.com.br/');
    await page.waitForSelector('#username', { visible: true });
    await page.type('#username', email, { delay: 50 });
    await page.type('#password', password, { delay: 50 });
    await page.click('#jsmx-btn-login', { delay: 50 });
    await page.waitForNavigation();
    return await page.evaluate(() => location.href);
}
exports.default = default_1;
