import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface FaceAnalysisState {
  imageUri: string | null;
  analysis: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: FaceAnalysisState = {
  imageUri: null,
  analysis: null,
  loading: false,
  error: null,
};

export const uploadImage = createAsyncThunk(
  'faceAnalysis/uploadImage',
  async (imageUri: string, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await axios.post('http://192.168.1.14:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const faceAnalysisSlice = createSlice({
  name: 'faceAnalysis',
  initialState,
  reducers: {
    setImageUri: (state, action: PayloadAction<string | null>) => {
      state.imageUri = action.payload;
      state.analysis = null;
      state.error = null;
    },
    clearAnalysis: (state) => {
      state.analysis = null;
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
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setImageUri, clearAnalysis } = faceAnalysisSlice.actions;
export default faceAnalysisSlice.reducer;