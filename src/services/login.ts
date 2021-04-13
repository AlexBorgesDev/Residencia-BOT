import chalk from 'chalk'
import { Page } from 'puppeteer'

export default async function (page: Page, email: string, password: string) {
  console.clear()
  console.log(chalk.bold.blue('Autenticando, aguarde...'))

  await page.goto('https://sre.avaresidencia.com.br/')
  await page.waitForSelector('#username', { visible: true })

  await page.type('#username', email, { delay: 50 })
  await page.type('#password', password, { delay: 50 })

  await page.click('#jsmx-btn-login', { delay: 50 })

  await page.waitForNavigation()

  return await page.evaluate(() => location.href)
}
