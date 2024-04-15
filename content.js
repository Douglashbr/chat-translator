(function() {
  var target
  const connection = chrome.runtime.connect({ name: 'chat-messages' })
  // const isWatchPage = document.querySelector('[data-a-page-loaded-name=ChannelWatchPage]')

  // if (!isWatchPage) {
  //   return
  // }

  connection.postMessage('ping')
  connection.onMessage.addListener(function(msg) {
    if (msg === 'start') {
      const target = getTarget()
      connection.postMessage({ message: 'check target', target })
      return
    }

    if (msg === 'get target') {
      target = getTarget()
      console.log('tentou')
      connection.postMessage({ message: 'check target', target })
      return
    }

    if (msg.message === 'target checked') {
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(async mutation => {
          const texts = mutation.addedNodes.item(0)?.querySelectorAll('.text-fragment') 
          ||  mutation.nextSibling?.querySelectorAll('.text-fragment')
          if (texts?.lenght === 0) {
            return
          }

          texts.forEach((text) => {
            text.setAttribute('data-original-text', text.innerText)
            connection.postMessage({ message: 'to translate', text: text.innerText })
          })
          return

        })
      })

      const config = {
        attributes: true,
        childList: true,
        characterData: true
      }
    
      observer.observe(target, config)
      return
    }

    if (msg.message === "translated") {
      document.querySelector(`[data-original-text="${msg.originalText}"]`).innerText = msg.translated
      return
    }
  })
})()

function getTarget() {
  const target = document.querySelector('.chat-scrollable-area__message-container')

  if (!target) {
    return undefined
  }

  return target
}