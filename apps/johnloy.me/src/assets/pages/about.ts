import { onPageView } from 'mksite/client'

const sayHi = () => {
  console.log('viewing about')
}

onPageView(() => {
  sayHi()
}, import.meta.url)
