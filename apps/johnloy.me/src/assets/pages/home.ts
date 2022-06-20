import { onPageView } from 'mksite/client'
import { mousePosition } from 'mksite/client/state/mouse'

const sayHi = () => {
  console.log('viewing home')
}

onPageView(() => {
  sayHi()
  const unsubscribe = mousePosition.subscribe(({ x, y }: any) => {
    console.log(x, y)
  })

  return () => {
    unsubscribe()
  }
})
