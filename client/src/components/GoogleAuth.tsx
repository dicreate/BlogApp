import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { app } from '../firebase'
import { useNavigate } from 'react-router-dom'
import useAuth from '../zustand/useAuth'

const GoogleAuth = () => {
   const auth = getAuth(app)
   const navigate = useNavigate()
   const { setCurrentUser, setLoading, setErrorMessage } = useAuth()

   const handleGoogleClick = async () => {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      try {
         const resultsFromGoogle = await signInWithPopup(auth, provider)
         const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cross-Origin-Opener-Policy": "same-origin-allow-popups" },
            body: JSON.stringify({
               name: resultsFromGoogle.user.displayName,
               email: resultsFromGoogle.user.email,
               googlePhotoUrl: resultsFromGoogle.user.photoURL
            })
         })
         const data = await res.json()

         if (res.ok) {
            navigate('/')
            setLoading(false)
            setCurrentUser(data)
            setErrorMessage(null)
         }
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
         <AiFillGoogleCircle className='w-6 h-6 mr-2' />
         Continue with Google
      </Button>
   )
}

export default GoogleAuth