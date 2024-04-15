(function () {
  chrome.runtime.onConnect.addListener(function(connection) {
    connection.onMessage.addListener(async function(msg) {
      if (msg === 'ping') {
        connection.postMessage('start')
        return
      }

      if (msg.message === 'check target') {
        if (!msg.target) {
          await asyncTimeout()
          connection.postMessage('get target')
          return
        }
        connection.postMessage({ message: 'target checked', target: msg.target})
        return
      }

      if (msg.message === 'to translate') {
        const res = await fetch("http://dmd.dev.br/translate", {
          method: "POST",
          body: JSON.stringify({
            q: msg.text,
            source: "en",
            target: "pt",
            format: "text",
            api_key: ""
          }),
          headers: { "Content-Type": "application/json" }
        });
        const response = await res.json()

        console.log('response -> ', response)
        
        connection.postMessage({ message: 'translated', translated: response.translatedText, originalText: msg.text })
      }
    })
  })
})()

const asyncTimeout = () => new Promise((resolve) => setTimeout(() => resolve(), 5000))