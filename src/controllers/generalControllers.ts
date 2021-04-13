import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import input from 'inquirer'
import puppeteer from 'puppeteer'

// Services
import login from '../services/login'
import watch from '../services/watch'
import modules, { MyAula } from '../services/modules'

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export default async function (e?: string, p?: string) {
  let email = e
  let password = p

  if (!email || !password) {
    const inputs = await input.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Informe seu email:',
        validate: value => {
          if (!value) return 'Informe seu email'
          if (!emailRegex.test(value)) return 'Informe um email valido.'
          else return true
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Informe sua senha:',
        validate: value => (value ? true : 'Informe sua senha')
      }
    ])

    email = inputs.email
    password = inputs.password
  }
  console.clear()

  if (!email || !password)
    return console.log(chalk.bold.red('Email ou senha não informados.'))

  const args = [
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ]

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: path.resolve('/usr/bin/google-chrome-stable'),
    defaultViewport: { width: 1200, height: 800 },
    args
  })
  const page = await browser.newPage()

  let href: string

  try {
    href = await login(page, email, password)
  } catch (err) {
    console.clear()
    await browser.close()
    return console.log(chalk.bold.red('Erro ao tentar fazer login.'))
  }

  if (href !== 'https://sre.avaresidencia.com.br/student/dashboard') {
    console.clear()
    await browser.close()
    return console.log(chalk.bold.red('Erro ao fazer login.'))
  }

  let aulas: MyAula[]

  if (href !== 'https://sre.avaresidencia.com.br/student/dashboard')
    await page.goto('https://sre.avaresidencia.com.br/student/dashboard')

  try {
    aulas = await modules(page)
  } catch (err) {
    console.error(err)
    return console.log(chalk.bold.red('Erro ao tentar pegar o link das aulas.'))
  }

  const watched: { episode: number; module: string }[] = []
  const watchErros: { episode: number; module: string; error: any }[] = []

  const backURL = await page.evaluate(() => location.href)

  for (const mod of aulas) {
    for (const aula of mod.aulas) {
      try {
        console.clear()
        console.log(
          chalk.blue(
            `Assistindo a aula ${aula.episode} do modulo ${mod.moduleName}.`
          )
        )
        await watch(page, aula.url, backURL)

        watched.push({ episode: aula.episode, module: mod.moduleName })
      } catch (err) {
        watchErros.push({
          episode: aula.episode,
          module: mod.moduleName,
          error: err
        })
        return
      }
    }
  }

  console.clear()
  console.log(chalk.bold.green('As aulas já foram assistidas.'))
  console.log('')

  for (const item of watched) {
    console.log(chalk.blue(`Aula ${item.episode} - ${item.module}`))
  }

  if (watchErros.length > 0) {
    const logPath = path.resolve(
      __dirname,
      '..',
      '..',
      'logs',
      `${Date.now()}-log.json`
    )

    fs.writeFileSync(logPath, JSON.stringify(watchErros), {
      encoding: 'utf-8'
    })

    console.log('')
    console.log(chalk.bold.red(`Veja o log de erros em:`))
    console.log(chalk.red(logPath))
  }

  await browser.close()
}
