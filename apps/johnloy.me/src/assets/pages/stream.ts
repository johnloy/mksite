import { onPageView } from 'mksite/client'

const sayHi = () => {
  console.log('viewing stream')
}

onPageView(() => {
  sayHi()
}, import.meta.url)
