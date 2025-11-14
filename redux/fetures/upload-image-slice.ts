import { ServicePlanDataSchema, ServicePlanInput } from "@/types/service-plan";
import { apiSlice } from "../apiSlice";

export const uploadImageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/upload-image",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});


export const {
    useUploadImageMutation
} = uploadImageSlice