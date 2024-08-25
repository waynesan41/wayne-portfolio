export async function navToggle() {
  // Menu Toggle for Small Screen
  //----------------------------------------------------------------------------
  // document.getElementById()
  const navBtn = document.getElementById('drop-down-btn')
  const menu = document.getElementById('menu-list')
  const navMenu = document.getElementById('main-nav')

  // console.log(navBtn?.style)
  // console.log(navBtn?.style.display)
  // console.log(menu)

  navBtn?.classList.toggle('change')
  // menu?.classList.toggle('show')
  // Index Change for Menu
  // navMenu?.classList.toggle('nav-over-lay')
  navBtn?.addEventListener('click', () => {
    navBtn.classList.toggle('change')
    navMenu?.classList.toggle('nav-over-lay')

    if (menu?.classList.contains('displayMenu')) {
      // Display First than Show
      menu?.classList.toggle('displayMenu')
      setTimeout(() => {
        menu?.classList.toggle('show')
      }, 100)
      // menu?.classList.toggle('show')
    } else {
      // Show Than Display None
      menu?.classList.toggle('show')
      setTimeout(() => {
        menu?.classList.toggle('displayMenu')
      }, 400)
    }
  })

  //----------------------------------------------------------------------------
  // Set up Expend Content
  /* const expandBtn = document.getElementsByClassName('read')
  const content = document.getElementsByClassName('pwords')
  for (let i = 0; i < expandBtn.length; i++) {
    expandBtn[i]?.addEventListener('click', () => {
      content[i].classList.toggle('expand')
      // const contentNode = e.target.parentNode.parentNode.childNodes[3]
      // contentNode.classList.toggle('expand')
      // console.log(contentNode)
    })
  } */
  //----------------------------------------------------------------------------
  // Sound | Music Mute

  const audio = document.getElementById('music-audio') as HTMLAudioElement
  const playBtn = document.getElementById('sound-btn') as HTMLButtonElement
  const mute = playBtn.getElementsByTagName('path')[0] as any

  mute.classList.toggle('mute')
  audio?.pause()
  playBtn.addEventListener('click', () => {
    mute.classList.toggle('mute')
    if (mute.classList.contains('mute')) {
      audio.play()
    } else {
      audio.pause()
    }
  })
  // Button Sound Effect
  //----------------------------------------------------------------------------
  // Credit Dialog

  const dialog = document.getElementById('creditPopup') as HTMLDialogElement
  const showButton = document.querySelector('dialog + button')
  const closeButton = document.querySelector('#creditPopup button')
  // "Show the dialog" button opens the dialog modally
  showButton?.addEventListener('click', () => {
    dialog?.showModal()
  })

  // "Close" button closes the dialog
  closeButton?.addEventListener('click', () => {
    dialog?.close()
  })
  dialog?.addEventListener('click', function (e: any) {
    // Dialog
    let rect = e.target.getBoundingClientRect()
    if (
      rect.left > e.clientX ||
      rect.right < e.clientX ||
      rect.top > e.clientY ||
      rect.bottom < e.clientY
    ) {
      dialog.close()
    }
  })

  // Keyboard Short Cut
  //----------------------------------------------------------------------------
  const upBtn = document.getElementById('up-btn')
  const downBtn = document.getElementById('down-btn')
  window.addEventListener('keydown', function (e: KeyboardEvent) {
    console.log(e)
    if (e.code == 'ArrowUp') {
      upBtn?.click()
    }
    if (e.code == 'ArrowDown') {
      downBtn?.click()
    }
  })
}
