"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAddTicketCommentMutation, useDeleteTicketCommentMutation, useGetTicketCommentsQuery } from "@/redux/fetures/tickets-api-slice"
import { toast } from "sonner"
import { formatLocalDateTime } from "@/utils/formatDateTime"
import { useAppSelector } from "@/redux/store/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IconPhotoScan, IconX } from "@tabler/icons-react"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"

interface TicketCommentsSectionProps {
  ticketId: string
}

export function TicketCommentsSection({ ticketId }: TicketCommentsSectionProps) {
  const [message, setMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: comments, isLoading } = useGetTicketCommentsQuery(ticketId)
  const [addComment] = useAddTicketCommentMutation()
  const [deleteComment] = useDeleteTicketCommentMutation()
  const user = useAppSelector((store) => store.auth)

  const handleAddComment = async () => {
    if (!message.trim() && !selectedImage) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("message", message)
      formData.append("ticketId", ticketId)
      if (selectedImage) formData.append("image", selectedImage)

      const res = await addComment(formData).unwrap()

      console.log(res)
      setMessage("")
      setSelectedImage(null)
      toast("Success", { description: "Comment added" })
    } catch {
      toast("Error", { description: "Failed to add comment" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteComment(id)
      toast("Success", { description: "Comment deleted Successfully" })
    } catch (error) {
      console.log(error)
      toast("Error", { description: "Failed to delete comment" })
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
  }

  const removeSelectedImage = () => setSelectedImage(null)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments</h3>

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>{comment.user?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{comment.user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{formatLocalDateTime(comment.createdAt)}</p>
                  </div>
                  {user?.id === comment.userId && (
                    <DeleteConfirmAction
                       title="Delete Confirmation" 
                       message="This action cannot be undone. The comment will be permanently removed."
                       triggerButton={<Button variant="ghost" size="sm" className="text-red-500">Delete</Button>}
                       onConfirm={()=>handleDeleteComment(comment.id)}
                     />
                  )}
                </div>

                {/* Render markdown message */}
                <div className="prose prose-sm dark:prose-invert mt-1 max-w-none [&_img]:w-70 [&_img]:h-60 [&_img]:object-cover">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      img: ({ node, ...props }: any) => (
                        <a href={props.src} target="_blank" rel="noopener noreferrer">
                          <img {...props} className="cursor-pointer hover:opacity-80 transition-opacity" />
                        </a>
                      ),
                    }}
                  >
                    {comment.message}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet</p>
        )}
      </div>

      {/* Add Comment */}
      <div className="space-y-4">
        <Textarea
          placeholder="Add a comment (Markdown supported)..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
          rows={3}
        />

        {/* Selected image preview */}
        {selectedImage && (
          <div className="relative w-32 h-32">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt={selectedImage.name}
              className="w-full h-full object-contain border rounded"
            />
              <IconX onClick={removeSelectedImage} className="absolute top-0 right-0 h-6 w-6 text-red-500" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer text-sm text-primary hover:underline flex items-center gap-1"
          >
            <IconPhotoScan /> <span>Upload Image</span>
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        <Button
          onClick={handleAddComment}
          disabled={isSubmitting || (!message.trim() && !selectedImage)}
          className="w-full"
        >
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </div>
    </div>
  )
}
