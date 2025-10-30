import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CloudDetectionResult {
  success: boolean;
  filename: string;
  predictions: {
    model_id: string;
    image_dimensions: {
      width: number;
      height: number;
    };
    predictions: Array<{
      class: string;
      confidence: number;
      bounding_box: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    summary: {
      total_detections: number;
      confidence_threshold: number;
    };
  };
}

export interface WeatherData {
  success: boolean;
  location: string;
  weather: {
    location: {
      name: string;
      country: string;
      coordinates: {
        lat: number;
        lon: number;
      };
    };
    current: {
      temperature: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      description: string;
      main: string;
      icon: string;
      visibility: number;
    };
    wind: {
      speed: number;
      direction: number;
      gust?: number;
    };
    clouds: {
      coverage: number;
    };
    sun: {
      sunrise: number;
      sunset: number;
    };
    timestamp: number;
  };
}

export interface CombinedAnalysis {
  success: boolean;
  filename: string;
  location: string;
  cloud_detection: CloudDetectionResult['predictions'];
  weather: WeatherData['weather'];
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  async detectClouds(file: File): Promise<CloudDetectionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${this.baseUrl}/detect-clouds`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getWeather(city: string, country?: string): Promise<WeatherData> {
    const params = new URLSearchParams({ city });
    if (country) params.append('country', country);

    const response = await axios.get(`${this.baseUrl}/weather?${params.toString()}`);
    return response.data;
  }

  async getForecast(city: string, country?: string, days: number = 5) {
    const params = new URLSearchParams({ city, days: days.toString() });
    if (country) params.append('country', country);

    const response = await axios.get(`${this.baseUrl}/weather/forecast?${params.toString()}`);
    return response.data;
  }

  async health() {
    const response = await axios.get(`${this.baseUrl}/health`);
    return response.data;
  }

  // (history-related APIs removed)
  async analyzeCombined(file: File, city: string, country?: string): Promise<CombinedAnalysis> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams({ city });
    if (country) params.append('country', country);

    const response = await axios.post(
      `${this.baseUrl}/analyze?${params.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}

export const apiClient = new ApiClient();
