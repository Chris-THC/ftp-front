'use client'
import React from 'react'
import { Button } from "@/components/ui/button"

const Page = () => {
  return (
    <div>
      <Button onClick={()=>{alert("Clik")}}>Click me</Button>
    </div>
  )
}

export default Page