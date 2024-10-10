const path = './src/components/'

export async function mainContent(floor: number) {
  let aboutHtml, webAppHtml, mobileAppHtml, experienceHtml, educationHtml
  await fetch(path + 'about.html')
    .then((response) => response.text())
    .then((html) => {
      // Use the fetched HTML content
      aboutHtml = html
    })

  await fetch(path + 'webApp.html')
    .then((response) => response.text())
    .then((html) => {
      // Use the fetched HTML content
      webAppHtml = html
    })

  const contents = [
    {
      title: 'About Me',
      content: aboutHtml,
      dialog: 'Click on the Piller to Change Movement.',
      dialogContent: 'HomeTips.jpg',
    },
    {
      title: 'Web App',
      content: webAppHtml,
      dialog: 'Double-click on following 3D Objects.',
      dialogContent: 'WebAppTips.png',
    },
    {
      title: 'Mobile App',
      content: `A Mobile App deploy on Play Store, developed using Flutter.<br><br>
      The App use SQLlite in back ground to store user data locally.
    `,
      dialog: 'Click on ground surface to move the Android.',
      dialogContent: 'MobileAppTips.jpg',
    },
    {
      title: 'Work Experience',
      content: `I do not have realy Experience.<br>
      I did create a chrome extension to may my job easier at the company I currently work.
      <br>
      I wanted to gain more expreience working with teams and other coders.
      <br>
    `,
      dialog: 'Double-click on the Company to see Discriptions.',
      dialogContent: 'WorkTips.jpg',
    },
    {
      title: 'Education',
      content: `Stoped education for BS in Computer Science during Covid due to family and finical rasons.<br>
      College Tution is very expensive.<br>
      Most of the programming skills I learn over the years are free or very low price on Udemy.<br>
    `,
      dialog: 'Double-click on the following 3D Objects.',
      dialogContent: 'EducationTips.jpg',
    },
  ]

  const mainAppend = document.getElementById('main-content') as HTMLElement
  let bluePrint: any
  await fetch(path + 'bluePrint.html')
    .then((response) => response.text())
    .then((html) => {
      // Use the fetched HTML content
      bluePrint = html
    })

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Loop to Append All Pages Content

  contents.forEach((element, index) => {
    const section = document.createElement('section')
    section.innerHTML = bluePrint
    // if (element.dialogContent.includes('Home')) {
    if (index == floor) {
      section.className = 'content visible'
    } else {
      section.className = 'content'
    }

    const dialogEle = section.getElementsByTagName('dialog')[0]
    const contentEle = section.getElementsByTagName('p')[0]
    // const titleEle = section.querySelectorAll(`[data="title"]`)[0]
    const titleEle = section.querySelector(`[data="title"]`)
    const dialogTitleEle = section.getElementsByClassName('dialog-title')[0]
    const dialogImgEle = section.querySelector(
      `[data="image"]`
    ) as HTMLImageElement
    const closeBtn = section.getElementsByClassName(
      'close-btn'
    )[0] as HTMLButtonElement
    const showBtn = section.getElementsByClassName(
      'popup-btn'
    )[0] as HTMLButtonElement
    const expandBtn = section.getElementsByClassName(
      'read'
    )[0] as HTMLButtonElement

    titleEle!.innerHTML = element.title
    contentEle.innerHTML = element.content!
    dialogTitleEle.innerHTML = element.dialog
    dialogImgEle.src = 'img/pageTip/' + element.dialogContent

    showBtn.onclick = () => {
      console.log(dialogEle)
      dialogEle?.showModal()
    }
    // Closing Dialog
    closeBtn.onclick = () => {
      dialogEle.close()
    }
    dialogEle.onclick = function (e: any) {
      // Dialog close when click on outside of the Dialog Box
      let rect = e.target.getBoundingClientRect()
      if (
        rect.left > e.clientX ||
        rect.right < e.clientX ||
        rect.top > e.clientY ||
        rect.bottom < e.clientY
      ) {
        dialogEle.close()
      }
    }

    // Expand Content
    expandBtn.onclick = () => {
      console.log('clicked')
      console.log('expand')
      contentEle.classList.toggle('expand')
      section.classList.toggle('section-expand')
      const text = expandBtn.innerHTML
      if (text.includes('Close')) {
        expandBtn.innerHTML = '<span> Expand </span>'
      } else {
        expandBtn.innerHTML = '<span> Close </span>'
      }
    }
    mainAppend?.appendChild(section)
  })
}
