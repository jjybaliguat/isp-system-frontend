"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import Image from 'next/image'

const ImageViewer = ({
    setPreviewImage,
    previewImage
}: {
    setPreviewImage: (image: string | null) => void
    previewImage: string | null
}) => {
  return (
    <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-2 overflow-hidden">
            
            <DialogHeader>
            <DialogTitle className="text-sm text-muted-foreground">
                Payment Proof Preview
            </DialogTitle>
            </DialogHeader>

            {previewImage && (
            <div className="w-full max-h-[80vh] flex items-center justify-center">
                <Image
                src={previewImage}
                alt="Payment Proof"
                width={1000}
                height={800}
                className="object-contain rounded-lg"
                unoptimized
                />
            </div>
            )}

        </DialogContent>
    </Dialog>
  )
}

export default ImageViewer