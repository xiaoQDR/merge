import './style.css'
import { GameApp } from './app/GameApp'

const root = document.querySelector<HTMLElement>('#app')

if (!root) {
  throw new Error('Missing #app root element')
}

const app = new GameApp(root)
void app.start()
