import { onPageView } from 'mksite/client'

const sayHi = () => {
  console.log('viewing projects')
}

onPageView(() => {
  sayHi()
}, import.meta.url)
