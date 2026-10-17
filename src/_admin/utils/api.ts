import toast from 'react-hot-toast';

// تنظیم آدرس پایه API
const API_BASE = '/api';

// تابع کمکی برای اطمینان از صحت اسلش‌ها در آدرس نهایی
const getUrl = (url: string) => {
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${cleanUrl}`;
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('badiz_token');
  }
  return null;
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('badiz_token');
    window.location.href = '/admin/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok || !data.success) {
    const errorMsg = data.message || 'خطایی رخ داد';
    throw new Error(errorMsg);
  }
  return data;
};

const getHeaders = (isFormData = false) => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${getToken()}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  get: async (url: string) => {
    const res = await fetch(getUrl(url), { headers: getHeaders() });
    return handleResponse(res);
  },
  post: async (url: string, body: any) => {
    const res = await fetch(getUrl(url), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },
  put: async (url: string, body: any) => {
    const res = await fetch(getUrl(url), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },
  patch: async (url: string, body: any) => {
    const res = await fetch(getUrl(url), {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },
  del: async (url: string) => {
    const res = await fetch(getUrl(url), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  postForm: async (url: string, formData: FormData) => {
    const res = await fetch(getUrl(url), {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    return handleResponse(res);
  },
  putForm: async (url: string, formData: FormData) => {
    const res = await fetch(getUrl(url), {
      method: 'PUT',
      headers: getHeaders(true),
      body: formData
    });
    return handleResponse(res);
  }
};