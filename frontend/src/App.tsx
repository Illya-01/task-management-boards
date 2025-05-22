import { Provider } from 'react-redux'
import { store } from './store'
import BoardPage from './pages/BoardPage'
import GlobalStyles from './styles/globalStyles'

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <BoardPage />
    </Provider>
  )
}

export default App
