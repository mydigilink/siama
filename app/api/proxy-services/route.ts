import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ||
    process.env.PUBLIC_API_BASE_URL ||
    'https://api.siama.in/api/v1/public'
  );
};

// Helper function to make HTTP/HTTPS request with custom agent for development
async function fetchWithCustomAgent(url: string, options: RequestInit = {}): Promise<{ status: number; data: any; headers: Record<string, string> }> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const urlObj = new URL(url);
  const isHttps = urlObj.protocol === 'https:';

  // In development, create a custom agent that doesn't reject unauthorized certificates
  if (isDevelopment && isHttps) {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Only in development - bypasses SSL verification
    });

    // Use Node.js native https module with custom agent
    return new Promise((resolve, reject) => {
      const requestOptions: https.RequestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        },
        agent,
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              status: res.statusCode || 200,
              data: jsonData,
              headers: res.headers as Record<string, string>,
            });
          } catch (parseError) {
            resolve({
              status: res.statusCode || 200,
              data: data,
              headers: res.headers as Record<string, string>,
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  // Use standard fetch for production or non-HTTPS
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });
  
  const data = await response.json().catch(() => ({}));
  return {
    status: response.status,
    data,
    headers: Object.fromEntries(response.headers.entries()),
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiBaseUrl = getApiBaseUrl();
    const apiUrl = `${apiBaseUrl}/services`;
    
    // Build query string from search params
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    // Use custom fetch with SSL bypass in development
    const result = await fetchWithCustomAgent(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (result.status >= 400) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: result.data?.message || `API returned ${result.status}`,
          data: result.data,
        },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error('Proxy API error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Network error',
        error: error?.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}

