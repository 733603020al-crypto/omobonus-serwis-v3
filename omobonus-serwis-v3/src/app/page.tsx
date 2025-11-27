import { Header } from '@/components/header'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Services } from '@/components/sections/services'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
    </>
  )
}