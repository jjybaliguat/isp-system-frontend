"use client"

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useGetWebsiteModalQuery } from "@/redux/fetures/settings-api-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WebsiteModal = () => {
  const [open, setOpen] = useState(false);
  const {data, isLoading} = useGetWebsiteModalQuery();

  useEffect(() => {
    if (data?.isActive) {
      setOpen(true);
    }
  }, [data]);

  if (!open || !data) return null;

  const isHTML = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str);

  const formatDescription = (desc: string) => {
    if (!desc) return "";

    if (isHTML(desc)) {
        return desc; // already HTML
    }

    // convert line breaks to <br>
    return desc.replace(/\n/g, "<br>");
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Information
          </DialogTitle>
        </DialogHeader>

        {/* Image */}
        {data?.imageUrl && (
          <img
            src={data.imageUrl}
            alt="Modal"
            className="w-full h-80 object-contain rounded-xl mb-4"
          />
        )}

        {/* Description */}
        <div
          className="text-sm text-gray-700 space-y-2 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatDescription(data.description || "")),
          }}
        />

      </DialogContent>
    </Dialog>
  );
};

export default WebsiteModal;