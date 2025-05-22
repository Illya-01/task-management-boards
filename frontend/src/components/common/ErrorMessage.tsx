import styled from 'styled-components'

interface ErrorMessageProps {
  message: string | null
}

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
`

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null

  return <ErrorContainer>{message}</ErrorContainer>
}

export default ErrorMessage
