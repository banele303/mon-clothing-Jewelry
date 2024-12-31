'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PaymentInstructions from '@/components/ui/PaymentInstractions'
import Link from 'next/link'

export default function Checkout() {
    const [showInstructions, setShowInstructions] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Checkout</h1>
            <Card>
                <CardHeader>

                </CardHeader>
                <CardContent>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button onClick={() => setShowInstructions(true)} className="w-full">
                            Proceed to Payment
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
            {showInstructions && <PaymentInstructions onClose={() => setShowInstructions(false)} />}
            <div className="mt-8">
                <Link href="/upload-proof" passHref>
                    <Button variant="outline">Upload Proof of Payment</Button>
                </Link>
            </div>
        </div>
    )
}

