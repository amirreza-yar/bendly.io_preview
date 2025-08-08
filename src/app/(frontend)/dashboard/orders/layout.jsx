export default function OrdersLayout({ children }) {
  //   useEffect(() => {
  //     if ('serviceWorker' in navigator) {
  //       navigator.serviceWorker
  //         .register('/sw.js')
  //         .then((reg) => {
  //           console.log('sw registered!')
  //           console.log(reg)
  //         })
  //         .catch((error) => {
  //           console.log('sw reg failed!')
  //           console.log(error)
  //         })
  //     }
  //   }, [])

  return (
    <>
      {children}

      {/* <BottomNav /> */}
    </>
  )
}
