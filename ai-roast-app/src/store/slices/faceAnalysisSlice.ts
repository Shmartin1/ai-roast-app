import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadImage = createAsyncThunk(
  'faceAnalysis/uploadImage',
  async (imageUri: string, thunkAPI) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    try {
      const response = await axios.post('http://192.168.1.14:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes
      });

      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.analysis) && response.data.analysis.length > 0) {
          return {
            analysis: response.data.analysis[0],
            roast: response.data.roast,
          };
        } else {
          throw new Error('No face detected in the image');
        }
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Server Error: ${error.response.data.error}\n\nDetails: ${error.response.data.details}`);
        } else if (error.request) {
          throw new Error('Network Error: No response received from the server. Please check your connection and try again.');
        } else {
          throw new Error(`An unexpected error occurred: ${error.message}`);
        }
      } else {
        throw new Error('An unexpected error occurred while processing the image.');
      }
    }
  }
);

interface FaceAnalysisState {
  imageUri: string | null;
  analysis: any | null;
  roast: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: FaceAnalysisState = {
  imageUri: null,
  analysis: null,
  roast: null,
  loading: false,
  error: null,
};

const faceAnalysisSlice = createSlice({
  name: 'faceAnalysis',
  initialState,
  reducers: {
    setImageUri: (state, action) => {
      state.imageUri = action.payload;
      state.analysis = null;
      state.roast = null;
      state.error = null;
    },
    clearAnalysis: (state) => {
      state.analysis = null;
      state.roast = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload.analysis;
        state.roast = action.payload.roast;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { setImageUri, clearAnalysis } = faceAnalysisSlice.actions;

export default faceAnalysisSlice.reducer;