import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUploadImageMutation } from "@/redux/fetures/upload-image-slice";
import { useGetWebsiteModalQuery, useSaveWebsiteModalMutation } from "@/redux/fetures/settings-api-slice";

const WebsiteModalSettings = () => {
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadImage] = useUploadImageMutation();
  const [saveWebsiteModal] = useSaveWebsiteModalMutation();
  const { data } = useGetWebsiteModalQuery();

  useEffect(() => {
    if (data) {
      setIsActive(data.isActive);
      setDescription(data.description || "");
      setImageUrl(data.imageUrl);
    }
  }, [data]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const res = await uploadImage(file).unwrap();
      setImageUrl(res.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveWebsiteModal({
        isActive,
        description,
        imageUrl,
      });

      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Modal Settings</CardTitle>
        <CardDescription>
          Configure homepage modal visibility, content, and image.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enable Modal</span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        {/* Description */}
        {isActive && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Enter modal description (you can use basic HTML like <b>, <br>, <ul>)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[300px] px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Image Upload */}
        {isActive && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />

          {uploading && (
            <p className="text-xs text-gray-500">Uploading...</p>
          )}

          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-40 object-cover rounded-xl border"
              />
            </div>
          )}
        </div>)}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>

      </CardContent>
    </Card>
  );
};

export default WebsiteModalSettings;