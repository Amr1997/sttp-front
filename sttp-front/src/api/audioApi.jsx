import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken; // Access token from the Redux store
    console.log('Access token from Redux:', getState()?.auth); // Debugging line
    console.log('Access token from Redux:', token); // Debugging line
    if (token) {
      headers.set('Authorization', `Bearer ${token}`); // Add Authorization header
    }
    return headers;
  },
});


export const audioApi = createApi({
  reducerPath: 'audioApi',
  baseQuery: baseQueryWithAuth, // Use the base query with authorization
  endpoints: (builder) => ({
    transcribeAudio: builder.mutation({
      query: (audioFile) => ({
        url: 'transcribe_audio/',
        method: 'POST',
        body: audioFile,
      }),
    }),
  }),
});

export const { useTranscribeAudioMutation } = audioApi;
