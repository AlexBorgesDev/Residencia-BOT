import chalk from 'chalk'
import delay from 'delay'

import { Page } from 'puppeteer'

export interface Aula {
  url: string
  index: number
  episode: number
}

export interface MyAula {
  aulas: Aula[]
  moduleName: string
}

export default async function (page: Page) {
  console.clear()
  console.log(chalk.bold.blue('Obtendo os links das aulas, aguarde...'))

  await page.waitForSelector('h3[title][data-uk-tooltip]', {
    visible: true,
    timeout: 15000
  })
  await page.click('h3[title][data-uk-tooltip]')

  await delay(1500)
  await page.waitForSelector(
    'div > ul > li > div[aria-hidden] div.uk-flex.uk-flex-middle[style] a'
  )

  const aulas = await page.evaluate(() => {
    function checkPendente(element: Element) {
      return (
        element.parentElement?.parentElement
          ?.querySelectorAll('div')[1]
          .querySelector('span')
          ?.textContent?.trim()
          .toLowerCase() === 'pendente'
      )
    }

    const aulas = [
      ...document.querySelectorAll(
        'div > ul > li > div[aria-hidden] div.uk-flex.uk-flex-middle[style] a'
      )
    ]

    const myAulas: MyAula[] = []

    const modules = [...document.querySelectorAll('h4')].map(
      element => element.textContent?.trim() || ''
    )
    const aulasModuleOne = aulas.filter((e, index) => index <= 8)
    const aulasModuleTwo = aulas.filter((e, index) => index > 10 && index <= 19)
    const aulasModuleThree = aulas.filter(
      (e, index) => index > 21 && index <= 30
    )
    const aulasModuleFor = aulas.filter((e, index) => index > 32 && index <= 41)

    const newAulasModuleOne: Aula[] = []
    const newAulasModuleTwo: Aula[] = []
    const newAulasModuleThree: Aula[] = []
    const newAulasModuleFor: Aula[] = []

    for (const index in aulasModuleOne) {
      if (checkPendente(aulasModuleOne[index])) {
        newAulasModuleOne.push({
          url: aulasModuleOne[index].getAttribute('href') || '',
          index: Number(index),
          episode: Number(index) + 1
        })
      }
    }
    myAulas.push({ aulas: newAulasModuleOne, moduleName: modules[0] })

    for (const index in aulasModuleTwo) {
      if (checkPendente(aulasModuleTwo[index])) {
        newAulasModuleTwo.push({
          url: aulasModuleTwo[index].getAttribute('href') || '',
          index: Number(index),
          episode: Number(index) + 1
        })
      }
    }
    myAulas.push({ aulas: newAulasModuleTwo, moduleName: modules[1] })

    for (const index in aulasModuleThree) {
      if (checkPendente(aulasModuleThree[index])) {
        newAulasModuleThree.push({
          url: aulasModuleThree[index].getAttribute('href') || '',
          index: Number(index),
          episode: Number(index) + 1
        })
      }
    }
    myAulas.push({ aulas: newAulasModuleThree, moduleName: modules[2] })

    for (const index in aulasModuleFor) {
      if (checkPendente(aulasModuleFor[index])) {
        newAulasModuleFor.push({
          url: aulasModuleFor[index].getAttribute('href') || '',
          index: Number(index),
          episode: Number(index) + 1
        })
      }
    }
    myAulas.push({ aulas: newAulasModuleFor, moduleName: modules[3] })

    return myAulas
  })

  console.clear()
  return aulas
}
