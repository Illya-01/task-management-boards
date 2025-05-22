import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { createNewBoard } from '../../store/slices/boardSlice'
import { type AppDispatch } from '../../store'
import Button from '../common/Button'
import Input from '../common/Input'

const FormContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
`

const BoardForm = () => {
  const [name, setName] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const handleCreateBoard = async () => {
    if (name.trim()) {
      try {
        await dispatch(createNewBoard(name)).unwrap()
        setName('')
      } catch (err) {
        console.error('Failed to create board:', err)
      }
    }
  }

  return (
    <FormContainer>
      <Input
        placeholder="Enter board name..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button onClick={handleCreateBoard}>Create Board</Button>
    </FormContainer>
  )
}

export default BoardForm
