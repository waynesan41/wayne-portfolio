import { Clock } from 'three'

const string = `Hello Wic the sd.o Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zooo Wic the sd. The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zoo The Panda has become the symbol of WWF. The well-known panda logo of WWF originated from a panda named Chi Chi that was transferred from the Beijing Zoo to the London Zoo in the`

const contents = [
  {
    title: 'Home',
    content: string,
    dialog: 'Click on the Stone to change movement.',
    dialogContent: 'dance.webp',
  },
  {
    title: 'Web App',
    content: string,
    dialog: 'Hover over Bookmark to Change Color.',
    dialogContent: 'dance.webp',
  },
  {
    title: 'Mobile App',
    content: string,
    dialog: 'Click on Ground to move Smart Phone',
    dialogContent: 'dance.webp',
  },
  {
    title: 'Work Experience',
    content: string,
    dialog: 'Click on Egg to put Dollar Sign',
    dialogContent: 'dance.webp',
  },
  {
    title: 'Education',
    content: string,
    dialog: 'Click on the wheel to sping something something',
    dialogContent: 'dance.webp',
  },
]

const mainContent = async () => {
  console.log('sss')
  const mainAppend = document.getElementById('main-content') as HTMLElement

  console.log(mainAppend)

  contents.forEach((element) => {
    const section = document.createElement('section')
    const divSection = document.createElement('div') // Title, Content, Expane Button

    const pageTitle = document.createElement('h1')
    const pageContent = document.createElement('p')
    const dialogContent = document.createElement('dialog')
    const expandBtn = document.createElement('button')
    const showBtn = document.createElement('button')
    const title = document.createElement('span')
    const dialog = document.createElement('span')
    const closeBtn = document.createElement('button')

    closeBtn.className = 'close-btn general-btn'
    closeBtn.innerHTML = `<span>
                <img src="/img/close.svg" alt="close" height="35" width="35" />
              </span>`
    dialog.innerHTML = `<h1 class="dialog-title">${element.dialog}</h1>
    <div style="color: white">
    <img src="/img/pageTip/${element.dialogContent}" alt="Home ThreeJS Features." width="100%" />
    </div>`
    dialogContent.appendChild(closeBtn)
    dialogContent.appendChild(dialog)

    dialogContent.onclick = function (e: any) {
      // Dialog
      let rect = e.target.getBoundingClientRect()
      if (
        rect.left > e.clientX ||
        rect.right < e.clientX ||
        rect.top > e.clientY ||
        rect.bottom < e.clientY
      ) {
        dialogContent.close()
      }
    }
    closeBtn.onclick = () => {
      dialogContent.close()
    }

    // Dialog Button
    showBtn.className = 'general-btn popup-btn'
    showBtn.innerHTML = `
    <span>
        <img src="/img/question.svg" alt="Question" height="25" width="25" />
    </span>
    `

    // Dialog

    if (element.title == 'Home') {
      section.className = 'content visible'
    } else {
      section.className = 'content'
    }
    pageTitle.className = 'page-title'
    pageContent.className = 'pwords'
    expandBtn.className = 'read'
    expandBtn.innerHTML = `<span> Expand </span>`
    title.innerText = element.title
    pageTitle.appendChild(showBtn)
    pageTitle.appendChild(title)

    pageTitle.appendChild(dialogContent)
    // pageTitle.innerHTML += element.title
    pageContent.innerText = element.content
    // divSection.appendChild(showBtn)
    divSection.appendChild(pageTitle)
    divSection.appendChild(pageContent)
    divSection.appendChild(expandBtn)
    section.appendChild(divSection)

    mainAppend?.appendChild(section)

    showBtn.onclick = () => {
      console.log('Click Home  dialog')
      dialogContent?.showModal()
    }
    expandBtn.onclick = () => {
      console.log('expand')
      pageContent.classList.toggle('expand')
    }
    // End of
  })
}

export default mainContent
