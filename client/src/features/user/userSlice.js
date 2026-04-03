import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import api from '../../api/axios'


const initialState = {
    value: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const { data } = await api.get('api/user/data', {
        headers: {
            'x-dev-user': localStorage.getItem('dev_user') || '',
            'x-dev-user-password': localStorage.getItem('dev_user_password') || ''
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