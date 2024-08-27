// src/utils/toast.js
import { Toast } from 'flowbite-react';

export const showToast = (message, type = 'success') => {
  Toast({
    content: message,
    color: type === 'error' ? 'failure' : type,
    duration: 3000,
  }).show();
};