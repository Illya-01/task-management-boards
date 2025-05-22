import axios, { AxiosError } from 'axios'

const API_URL = 'http://localhost:5000/api'
let boardId: string
let cardId: string

const runTests = async () => {
  try {
    console.log('Starting API tests...')

    // Test board creation
    const createBoardResponse = await axios.post(`${API_URL}/boards`, {
      name: 'Test Board',
    })
    boardId = createBoardResponse.data._id
    console.log('✅ Board created with ID:', boardId)

    // Test get board
    const getBoardResponse = await axios.get(`${API_URL}/boards/${boardId}`)
    console.log('✅ Retrieved board:', getBoardResponse.data.name)

    // Test create card
    const createCardResponse = await axios.post(`${API_URL}/cards`, {
      title: 'Test Card',
      description: 'This is a test card',
      boardId,
      column: 'todo',
    })
    cardId = createCardResponse.data._id
    console.log('✅ Card created with ID:', cardId)

    // Test get cards
    const getCardsResponse = await axios.get(`${API_URL}/cards/board/${boardId}`)
    console.log('✅ Retrieved', getCardsResponse.data.length, 'cards')

    // Test update card
    await axios.put(`${API_URL}/cards/${cardId}`, {
      title: 'Updated Card',
      description: 'This card has been updated',
      column: 'inProgress',
    })
    console.log('✅ Card updated')

    // Test delete card
    await axios.delete(`${API_URL}/cards/${cardId}`)
    console.log('✅ Card deleted')

    // Test delete board
    await axios.delete(`${API_URL}/boards/${boardId}`)
    console.log('✅ Board deleted')

    console.log('All tests passed!')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      console.error('❌ Error:', axiosError.response?.data || axiosError.message)
    } else {
      console.error('❌ Error:', error)
    }
  }
}

runTests()
