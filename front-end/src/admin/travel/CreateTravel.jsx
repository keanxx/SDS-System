import React from 'react'
import TravelInput from '../AdminComponents/TravelInput'
import Upload from '../../Components/Upload'

const adminDashboard = () => {
  return (
    <div className="w-full  min-h-screen max-h-full flex-col flex justify-center items-center px-10 bg-gradient-to-r from-[#fffaf5] via-[#e7fdfd] to-[#aeeaf5]">
    <section className=" bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg justify-center  space-x-5 flex  p-10 min-w-[900px] max-w-[1200px] w-full">
        <TravelInput/>
        <Upload/>
    </section>
   
    </div>
  )
}

export default adminDashboard