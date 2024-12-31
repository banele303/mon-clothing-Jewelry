'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UploadProof() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically upload the file to your server
    console.log('Uploading file:', file)
    alert('Proof of payment uploaded successfully!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Upload Proof of Payment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Payment Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="proof">Payment Receipt (PDF)</Label>
              <Input id="proof" type="file" accept=".pdf" onChange={handleFileChange} required />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="submit" className="w-full">
                Upload Proof of Payment
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

