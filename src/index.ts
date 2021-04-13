#!/usr/bin/env node

import commander from 'commander'

import { version } from '../package.json'

// Controllers
import generalControllers from './controllers/generalControllers'

console.clear()

commander.version(version)

commander
  .arguments('[email] [password]')
  .description('Assiste aulas automaticamente', {
    email: 'email para login',
    password: 'senha para login'
  })
  .action(generalControllers)

commander.parse(process.argv)
