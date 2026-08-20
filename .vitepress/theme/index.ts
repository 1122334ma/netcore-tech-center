import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { setupSearchHighlight } from './search-highlight'

export default {
  extends: DefaultTheme,
  setup() {
    setupSearchHighlight()
  },
}
