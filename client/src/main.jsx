import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { MockClerkProvider } from './mockClerk.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <MockClerkProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </MockClerkProvider>
    </Provider>
  </BrowserRouter>
)

