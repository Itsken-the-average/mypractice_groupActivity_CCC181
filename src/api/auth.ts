const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = 'campusconnect_token';

export type User = {
  id: number | string;
  name: string;
  email: string;
};

export type LoginResult = {
  token: string;
  user: User;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError('Cannot reach the server. Please try again.', 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new ApiError(
        'Something went wrong on our side. Please try again later.',
        response.status
      );
    }
    throw new ApiError((data && data.error) || 'Request failed.', response.status);
  }

  return data as T;
}

export function login(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(): Promise<User> {
  const token = getToken();
  return request<User>('/users/me', {
    headers: { Authorization: `Bearer ${token ?? ''}` },
  });
}