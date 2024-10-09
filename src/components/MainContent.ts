const string = `The spiral galaxy is classified as a Seyfert galaxy, one of the two largest groups of active galaxies, along with galaxies that host quasars

. Seyfert galaxies aren’t as luminous and distant as quasars, making them a more convenient way to study similar phenomena in lower energy light, like infrared.

This galaxy pair is similar to the Cartwheel Galaxy
千年运河畔，文化风景新。2023年12月，北京艺术中心、北京城市图书馆、北京大运河博物馆正式对公众开放，北京再添文化新地标。览运河文化古今同辉、见“未来之城”生机勃发，“文化粮仓”“森林书苑”“运河之舟”进一步满足市民多样化文化需求，成为北京这座千年古都又一张靓丽的文化名片。

, one of the first interacting galaxies that Webb observed. Arp 107 may have turned out very similar in appearance to the Cartwheel, but since the smaller elliptical galaxy likely had an off-center collision instead of a direct hit, the spiral galaxy got away with only its spiral arms being disturbed. 

The collision isn’t as bad as it sounds. Although there was star formation occurring before, collisions between galaxies can compress gas, improving the conditions needed for more stars to form. On the other hand, as Webb reveals, collisions also disperse a lot of gas, potentially depriving new stars of the material they need to form.

Webb has captured these galaxies in the process of
开卷阅读皆有益，书香文韵润京城。2023年，阔别十年的“我与地坛”北京书市重启，首次推出“旧书新知”活动。第二十九届北京国际图书博览会暨第二十一届北京国际图书节、第十三届书香中国·北京阅读季盛典等一系列线下书市书展相继推出，掀起全民阅读热潮，浓郁了北京的书香氛围，彰显了首都的文化力量。

merging, which will take hundreds of millions of years. As the two galaxies rebuild after the chaos of their collision, Arp 107 may lose its smile, but it will inevitably turn into something just as interesting for future astronomers to study.

Arp 107 is located 465 million light-years from Earth in the constellation Leo Minor.`

const contents = [
  {
    title: 'About Me',
    content: `
    &emsp; Hello! I'm Wayne, a developer passionate about learning, building, and solving problems.
    <br>
    &emsp; My curiosity for science began in my early childhood, and the desire to continuously explore new technologies only increased.
    <br>
    &emsp; I thrive in collaborative environments and enjoy tackling complex challenges with a creative mindset.
    <br>
    <br>
    &emsp; Currently, I am seeking new opportunities to further my growth and make impact to society.
    <br>
    - Email: <a style="color:white" href="mailto: waynesan41@gmail.com">waynesan41@gmail.com</a>
    <br>
    - Portfolio: <a style="color:white" href="https://github.com/waynesan41/wayne-portfolio">https://github.com/waynesan41/wayne-portfolio</a>
    <br>
    
    `,
    dialog: 'Click on the Piller to Change Movement.',
    dialogContent: 'HomeTips.jpg',
  },
  {
    title: 'Web App',
    content: `This is a Full Stack Web App and Chrome Extension.<br>
      The Goal for building this app is for me to learn. NodeJS, React and MongoDB.
    `,
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

const mainContent = async () => {
  const mainAppend = document.getElementById('main-content') as HTMLElement

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
                <img src="img/close.svg" alt="close" height="35" width="35" />
              </span>`
    dialog.innerHTML = `<h1 class="dialog-title">${element.dialog}</h1>
    <div style="color: white; text-align: center">
    <img src="img/pageTip/${element.dialogContent}" alt="${element.title}" 
    style="max-height: 80%; max-width: 80%"  />
    </div>`
    dialogContent.appendChild(closeBtn)
    dialogContent.appendChild(dialog)

    dialogContent.onclick = function (e: any) {
      // Dialog close when click on outside of the Dialog Box
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
    // dialogContent.addEventListener('keydown', (e) => {
    //   dialogContent.close()
    // })
    closeBtn.onclick = () => {
      dialogContent.close()
    }

    // Dialog Button
    showBtn.className = 'general-btn popup-btn'
    showBtn.innerHTML = `
    <span>
        <img src="img/question.svg" alt="Question" height="25" width="25" />
    </span>
    `

    // Dialog
    if (element.dialogContent.includes('Home')) {
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
    pageContent.innerHTML = element.content
    // divSection.appendChild(showBtn)
    divSection.appendChild(pageTitle)
    divSection.appendChild(pageContent)
    divSection.appendChild(expandBtn)
    section.appendChild(divSection)

    mainAppend?.appendChild(section)

    showBtn.onclick = () => {
      console.log('Open Dialog!!')
      dialogContent?.showModal()
    }
    expandBtn.onclick = () => {
      console.log('expand')
      pageContent.classList.toggle('expand')
      section.classList.toggle('section-expand')
      const text = expandBtn.innerHTML
      if (text.includes('Close')) {
        expandBtn.innerHTML = '<span> Expand </span>'
      } else {
        expandBtn.innerHTML = '<span> Close </span>'
      }
    }
    // End of
  })
}

export default mainContent
