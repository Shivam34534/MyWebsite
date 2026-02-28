import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import api from '../../api/axios'


const initialState = {
    value: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token) => {
    // Token format is "mock-token:userId:password" or just "mock-token"
    const [tokenType, userId, password] = token.split(':')

    const { data } = await api.get('api/user/data', {
        headers: {
            Authorization: `Bearer ${tokenType}`,
            'x-dev-user': userId || localStorage.getItem('dev_user'),
            'x-dev-user-password': password || localStorage.getItem('dev_user_password'),
            'x-dev-user-image': JSON.parse(localStorage.getItem('mock_user_data') || '{}')?.profile_picture || '',
            'x-dev-user-fullname': JSON.parse(localStorage.getItem('mock_user_data') || '{}')?.fullName || ''
        }
    })
    return data.success ? data.data : null
})

export const UpdateUser = createAsyncThunk('user/update', async ({ userData, token }) => {
    const { data } = await api.post('api/user/update', userData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (data.success) {
        toast.success(data.message)
        return data.user
    } else {
        toast.error(data.message)
        return null
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.value = action.payload
        }).addCase(UpdateUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
    }
})

export default userSlice.reducer