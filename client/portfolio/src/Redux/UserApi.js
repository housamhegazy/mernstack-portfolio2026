// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// @ts-ignore
const allowedBaseUrls = import.meta.env.VITE_API_URL;
// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: allowedBaseUrls,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUserByName: builder.query({
      query: () => `/api/user/profile`,
      providesTags: ["User"],
    }),

    // ✅ Sign in existing user
    signin: builder.mutation({
      query: (body) => ({
        url: "/api/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    //signout
    signOut: builder.mutation({
      query: () => ({
        url: "/api/user/signout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/api/user/updateprofile",
        method: "PUT",
        body: formData, // الـ formData هيتبعت هنا
      }),
      invalidatesTags: ["User"],
    }),

    updateSkills: builder.mutation({
      query: (skillsArray) => ({
        url: "/api/user/update-skills",
        method: "PUT",
        body: { skills: skillsArray }, // بنبعتها كـ JSON عادي
      }),
      invalidatesTags: ["User"], // عشان يحدث البيانات في البروفايل فوراً
    }),

    updateSocialLinks: builder.mutation({
      query: (socialLinks) => ({
        url: "/api/user/update-sociallinks",
        method: "PUT",
        body: { newsocialLinks: socialLinks }, // بنبعتها كـ JSON عادي
      }),
      invalidatesTags: ["User"], // عشان يحدث البيانات في البروفايل فوراً
    }),
    addproject: builder.mutation({
      query: (data) => ({
        url: "/api/user/add-project",
        method: "POST",
        body: data, // ابعت الـ FormData مباشرة هنا
      }),
      invalidatesTags: ["User"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/api/user/delete-project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"], // عشان يخلي البيانات تتحدث تلقائياً في الشاشة
    }),
    editProject: builder.mutation({
  query: ({ projectId, data }) => ({
    url: `/api/user/edit-project/${projectId}`,
    method: "PUT",
    body: data, // الـ FormData اللي فيها الصورة والبيانات
  }),
  invalidatesTags: ["User"],
}),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserByNameQuery,
  useSignOutMutation,
  useSigninMutation,
  useUpdateProfileMutation,
  useUpdateSkillsMutation,
  useUpdateSocialLinksMutation,
  useAddprojectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation
} = userApi;
