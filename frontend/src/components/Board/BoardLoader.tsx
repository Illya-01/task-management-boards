import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { fetchBoard } from '../../store/slices/boardSlice'
import { fetchCards } from '../../store/slices/cardSlice'
import { type AppDispatch } from '../../store'
import Button from '../common/Button'
import Input from '../common/Input'

const BoardLoaderContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
`

const BoardIdInput = styled(Input)`
  flex: 1;
`

const BoardLoader = () => {
  const [boardId, setBoardId] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const handleLoadBoard = async () => {
    if (boardId.trim()) {
      try {
        await dispatch(fetchBoard(boardId)).unwrap()
        await dispatch(fetchCards(boardId)).unwrap()
      } catch (err) {
        console.error('Failed to load board:', err)
      }
    }
  }

  return (
    <BoardLoaderContainer>
      <BoardIdInput
        placeholder="Enter a board ID here..."
        value={boardId}
        onChange={e => setBoardId(e.target.value)}
      />
      <Button onClick={handleLoadBoard}>Load</Button>
    </BoardLoaderContainer>
  )
}

export default BoardLoader
