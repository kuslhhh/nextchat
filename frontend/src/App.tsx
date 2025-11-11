import axios from "axios"
import { useEffect, useState } from "react"

export default function App() {

   const [message, setMessage] = useState("")


   useEffect(() => {
      const messagess = async () => {
         const response = await axios.get("http://localhost:3000/pratik")
         console.log(response);
         //@ts-ignore
         setMessage(response.data)

      }

      messagess()
   }, [])
   return (
      <div>{message}</div>
   )
}
