import { onPageView } from 'mksite/client'

const sayHi = () => {
  console.log('viewing toolkit')
}

onPageView(() => {
  sayHi()
}, import.meta.url)
