import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

function App() {
  const [spec, setSpec] = useState()
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const pipe = urlParams.get('pipe')
    const signaling = urlParams.get('signaling')
    const ydoc = new Y.Doc()
    const webrtcProvider = new WebrtcProvider(pipe, ydoc, {
      signaling: [signaling]
    })
    const dataMap = ydoc.getMap('data')
    dataMap.observe((event, transaction) => {
      if (transaction.origin === 'web-change') return
      if (!event.keysChanged.has('content')) return
      setSpec(dataMap.get('content'))
    })
    webrtcProvider.on('status', ({ status }) => {
      console.log('status', status)
      // setConnected(status === 'connected')
    })
    
    webrtcProvider.on('synced', () => {
      console.log('synced')
      // setConnected(true)
    })
  }, [])
  return (
    <div>
      {!spec && 'loading'}
      {spec && <SwaggerUI spec={spec} />}
    </div>
  )
}

export default App
