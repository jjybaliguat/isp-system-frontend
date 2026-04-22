"use client"
import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
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
      
      <DialogContent className="w-screen h-screen max-w-none p-0 border-none bg-black">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        {previewImage && (
          <div className="relative w-full h-full">
            
            {/* IMAGE */}
            <Image
              src={previewImage}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-md hover:bg-black/70 transition"
            >
              ✕
            </button>

          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer