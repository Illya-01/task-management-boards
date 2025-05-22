import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9f9f9;
    color: #333;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
  }

  #root {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Make the drag overlay appear above everything */
  .dnd-overlay {
    z-index: 9999 !important;
  }
`

export default GlobalStyles
