import Lottie from "lottie-react";
import phoneOwnAnimation from '../../public/phone.json'
const Home = () => {
   return (
      <div className="flex justify-center">
         <div className="w-1/4 h-1/4">
            <Lottie animationData={phoneOwnAnimation} loop={true} />
         </div>
      </div>
   )
}

export default Home