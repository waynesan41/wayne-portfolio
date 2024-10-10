/* function temp() {
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
        pageContent.innerHTML = element.content!
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
} */
