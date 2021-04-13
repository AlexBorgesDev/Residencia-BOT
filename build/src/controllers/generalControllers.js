"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const login_1 = __importDefault(require("../services/login"));
const watch_1 = __importDefault(require("../services/watch"));
const modules_1 = __importDefault(require("../services/modules"));
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
async function default_1(e, p) {
    let email = e;
    let password = p;
    if (!email || !password) {
        const inputs = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Informe seu email:',
                validate: value => {
                    if (!value)
                        return 'Informe seu email';
                    if (!emailRegex.test(value))
                        return 'Informe um email valido.';
                    else
                        return true;
                }
            },
            {
                type: 'password',
                name: 'password',
                message: 'Informe sua senha:',
                validate: value => (value ? true : 'Informe sua senha')
            }
        ]);
        email = inputs.email;
        password = inputs.password;
    }
    console.clear();
    if (!email || !password)
        return console.log(chalk_1.default.bold.red('Email ou senha não informados.'));
    const args = [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
    ];
    const browser = await puppeteer_1.default.launch({
        headless: true,
        executablePath: path_1.default.resolve('/usr/bin/google-chrome-stable'),
        defaultViewport: { width: 1200, height: 800 },
        args
    });
    const page = await browser.newPage();
    let href;
    try {
        href = await login_1.default(page, email, password);
    }
    catch (err) {
        console.clear();
        await browser.close();
        return console.log(chalk_1.default.bold.red('Erro ao tentar fazer login.'));
    }
    if (href !== 'https://sre.avaresidencia.com.br/student/dashboard') {
        console.clear();
        await browser.close();
        return console.log(chalk_1.default.bold.red('Erro ao fazer login.'));
    }
    let aulas;
    if (href !== 'https://sre.avaresidencia.com.br/student/dashboard')
        await page.goto('https://sre.avaresidencia.com.br/student/dashboard');
    try {
        aulas = await modules_1.default(page);
    }
    catch (err) {
        console.error(err);
        return console.log(chalk_1.default.bold.red('Erro ao tentar pegar o link das aulas.'));
    }
    const watched = [];
    const watchErros = [];
    for (const mod of aulas) {
        for (const aula of mod.aulas) {
            try {
                console.clear();
                console.log(chalk_1.default.blue(`Assistindo a aula ${aula.episode} do modulo ${mod.moduleName}.`));
                await watch_1.default(page, aula.url);
                watched.push({ episode: aula.episode, module: mod.moduleName });
            }
            catch (err) {
                watchErros.push({
                    episode: aula.episode,
                    module: mod.moduleName,
                    error: err
                });
                return;
            }
        }
    }
    console.clear();
    console.log(chalk_1.default.bold.green('As aulas já foram assistidas.'));
    console.log('');
    for (const item of watched) {
        console.log(chalk_1.default.blue(`Aula ${item.episode} - ${item.module}`));
    }
    if (watchErros.length > 0) {
        const logPath = path_1.default.resolve(__dirname, '..', '..', 'logs', `${Date.now()}-log.json`);
        fs_1.default.writeFileSync(logPath, JSON.stringify(watchErros), {
            encoding: 'utf-8'
        });
        console.log('');
        console.log(chalk_1.default.bold.red(`Veja o log de erros em:`));
        console.log(chalk_1.default.red(logPath));
    }
    await browser.close();
}
exports.default = default_1;
