'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PaymentInstructionsProps {
  onClose: () => void
}

export default function PaymentInstructions({ onClose }: PaymentInstructionsProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Please follow these steps to complete your payment:</p>
          <ol className="list-decimal list-inside mb-4">
            <li>Copy our account details: 1234-5678-9012-3456</li>
            <li>Go to your bank&apos;s website or app</li>
            <li>Make a transfer to our account for the total amount</li>
            <li>Save the transaction receipt or take a screenshot</li>
            <li>Return to our website and upload the proof of payment</li>
          </ol>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full">Close</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

