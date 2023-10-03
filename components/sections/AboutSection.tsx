import React from 'react'
import AboutCard from '../cards/AboutCard'
import { aboutData } from '@/lib/constants'

const AboutSection = () => {
  return (
    <section className='w-full flex items-center flex-col'>
      
      {aboutData.map((item,index) => (
        <AboutCard 
          key={index}
          title={item.title}
          content={item.content}
          imageUrl={item.image}
          backgroundStyle={index % 2 === 0 ? "" : "bg-[#f6f6f6]"}
          rowStyle={index % 2 === 0 ? "" : "flex-row-reverse"}
          />
      ))}
    </section>
  )
}

export default AboutSection
