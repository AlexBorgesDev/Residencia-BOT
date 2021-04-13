import delay from 'delay'
import { Page } from 'puppeteer'

export default async function (page: Page, url: string, backURL: string) {
  const videoURL = await page.evaluate(async url => {
    let task = url
    task += task.indexOf('?') !== -1 ? '&allow=true' : '?allow=true'

    const response = await fetch(task, { method: 'GET' })
    const data = await response.json()

    return data.url
  }, url)

  await page.goto(videoURL)

  await page.waitForSelector('#jsmx-container-tasks')
  await delay(1000)

  // const attended = await page.evaluate(async () => {
  //   return document
  //     .querySelectorAll('#jsmx-badgeCoursedSide')[1]
  //     .classList.contains('uk-hidden')
  // })

  // if (!attended) {
  //   await page.goBack()
  //   return
  // }

  const items = await page.evaluate(() => {
    const items = [...document.querySelectorAll('div.jsmx-task')]
      .filter(
        (element, index, array) =>
          element.querySelector('span.sl-icon-control-play') !== null &&
          index < array.length / 2
      )
      .map(element => ({
        url: element.getAttribute('data-jsmx-target'),
        element,
        watched: element
          .querySelector('#jsmx-badgeCoursedSide')
          ?.classList.contains('uk-hidden')
      }))

    return items
  })

  for (const item of items) {
    if (!item.watched) continue

    if (!item.url) continue

    await page.goto(item.url)

    await delay(7500)
    await page.waitForSelector('iframe')

    await page.mouse.click(720, 376, { delay: 50 })

    await page.evaluate(async () => {
      const video = document
        .getElementsByTagName('iframe')[0]
        .contentDocument?.getElementsByTagName('video')[0]

      if (!video) return

      video.muted = true

      let videoFinish = false

      video.addEventListener('pause', () => {
        if (!videoFinish) video.play()
      })

      return await new Promise(resolve => {
        const attendedElement = document.querySelectorAll(
          '#jsmx-badgeCoursedSide'
        )[1]

        const observer = new MutationObserver((mutation, observe) => {
          const attended = document
            .querySelectorAll('#jsmx-badgeCoursedSide')[1]
            .classList.contains('uk-hidden')

          if (!attended) {
            observe.disconnect()

            setTimeout(() => {
              resolve('')
            }, 10000)
          }
        })

        observer.observe(attendedElement, { attributeFilter: ['class'] })

        video?.addEventListener('ended', () => {
          videoFinish = true

          setTimeout(() => {
            resolve('')
          }, 10000)
        })

        video?.addEventListener('error', () => {
          setTimeout(() => {
            resolve('')
          }, 10000)
        })
      })
    })
  }

  await page.goto(backURL)

  return
}
