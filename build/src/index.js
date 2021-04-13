#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const package_json_1 = require("../package.json");
const generalControllers_1 = __importDefault(require("./controllers/generalControllers"));
console.clear();
commander_1.default.version(package_json_1.version);
commander_1.default
    .arguments('[email] [password]')
    .description('Assiste aulas automaticamente', {
    email: 'email para login',
    password: 'senha para login'
})
    .action(generalControllers_1.default);
commander_1.default.parse(process.argv);
