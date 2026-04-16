import { NextRequest, NextResponse } from 'next/server';

interface GooglePlaceReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetailsResponse {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GooglePlaceReview[];
  };
  status: string;
  error_message?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('place_id');
    
    if (!placeId) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'place_id parameter is required' 
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Google Places API key not configured',
          reviews: [],
          rating: 0,
          totalRatings: 0
        },
        { status: 500 }
      );
    }

    const fields = 'name,rating,user_ratings_total,reviews';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Google Places API returned ${response.status}`);
    }

    const data: GooglePlaceDetailsResponse = await response.json();
    
    console.log('Google Places API Response Status:', data.status);
    console.log('Google Places API Response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API Error:', data.status, data.error_message);
      return NextResponse.json(
        { 
          status: 'error', 
          message: data.error_message || `Google Places API error: ${data.status}`,
          reviews: [],
          rating: 0,
          totalRatings: 0
        },
        { status: 400 }
      );
    }

    if (!data.result || !data.result.reviews || data.result.reviews.length === 0) {
      console.warn('No reviews found in Google Places API response');
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'No reviews found for this place',
          reviews: [],
          rating: data.result?.rating || 0,
          totalRatings: data.result?.user_ratings_total || 0
        },
        { status: 200 }
      );
    }

    // Transform Google reviews to our format
    const reviews = (data.result.reviews || []).map((review) => ({
      name: review.author_name,
      rating: review.rating,
      comment: review.text,
      date: review.relative_time_description,
      img: review.profile_photo_url || '/img/default-avatar.png',
      prof: 'Customer', // Default profession since Google doesn't provide this
      authorUrl: review.author_url,
      time: review.time,
    }));

    return NextResponse.json({
      status: 'success',
      name: data.result?.name || '',
      rating: data.result?.rating || 0,
      totalRatings: data.result?.user_ratings_total || 0,
      reviews: reviews,
    });
  } catch (error: any) {
    console.error('Google Reviews API error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to fetch Google reviews',
        reviews: [],
        rating: 0,
        totalRatings: 0
      },
      { status: 500 }
    );
  }
}
