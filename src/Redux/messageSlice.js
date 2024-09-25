// src/redux/messageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  unreadCount: 0,
  optimisticMessages:0,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
        if(state.optimisticMessages>0){
            let n=state.messages.length;
            state.messages[n-state.optimisticMessages]=action.payload;
            state.optimisticMessages--;
        }
        else{
            state.messages.push(action.payload);
        }

      // Increase unreadCount if not viewing the chat
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    resetUnreadCount:(state)=>{
        state.unreadCount=0;
    },
    initMessages:(state,action)=>{
        state.messages=action.payload;
    },
    incOptimisticMessages:(state)=>{
        state.optimisticMessages++;
    }
  },
});

export const { addMessage, markMessagesAsRead,initMessages,resetUnreadCount,incOptimisticMessages } = messageSlice.actions;

export default messageSlice.reducer;
