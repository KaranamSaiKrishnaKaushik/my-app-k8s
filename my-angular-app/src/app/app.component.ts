import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';
  number1: number | null = null;
  number2: number | null = null;
  result: number | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Add mock mode for testing
  useMockApi = true; // Set to true for testing without backend

  constructor(private http: HttpClient) {}

  // Simple test method that doesn't use HTTP at all
  onSumLocal() {
    if (this.number1 === null || this.number2 === null) {
      this.errorMessage = 'Please enter both numbers';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;
    
    setTimeout(() => {
      this.result = this.number1! + this.number2!;
      this.isLoading = false;
      console.log('Local calculation result:', this.result);
    }, 500);
  }

  onSum() {
    console.log('onSum called, useMockApi:', this.useMockApi);
    
    if (this.number1 === null || this.number2 === null) {
      this.errorMessage = 'Please enter both numbers';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;
    
    // Mock API for testing
    if (this.useMockApi) {
      console.log('Using mock API - should not make HTTP request');
      setTimeout(() => {
        this.result = this.number1! + this.number2!;
        this.isLoading = false;
        console.log('Mock API result:', this.result);
      }, 500);
      return;
    }
    
    console.log('Making HTTP request to API');
    
    const requestBody = {
      number1: this.number1,
      number2: this.number2
    };

    console.log('Sending request:', requestBody);

    // Use absolute URL to bypass Angular router completely
    const apiUrl = 'http://backend:5000/My/add-numbers';
    
    this.http.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe({
        next: (response) => {
          console.log('Raw response:', response);
          console.log('Response type:', typeof response);
          
          try {
            // Try to parse as JSON if it's a string
            let parsedResponse;
            if (typeof response === 'string') {
              console.log('Response is string, attempting to parse as JSON');
              if (response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html')) {
                throw new Error('Received HTML instead of JSON - this indicates the API endpoint is not found');
              }
              parsedResponse = JSON.parse(response);
            } else {
              parsedResponse = response;
            }
            
            console.log('Parsed response:', parsedResponse);
            console.log('All response keys:', Object.keys(parsedResponse || {}));
            
            // Try multiple ways to extract the result
            if (parsedResponse && typeof parsedResponse.Sum === 'number') {
              this.result = parsedResponse.Sum;
              console.log('Used parsedResponse.Sum:', this.result);
            } else if (parsedResponse && typeof parsedResponse.sum === 'number') {
              this.result = parsedResponse.sum;
              console.log('Used parsedResponse.sum:', this.result);
            } else if (typeof parsedResponse === 'number') {
              this.result = parsedResponse;
              console.log('Response is direct number:', this.result);
            } else if (parsedResponse && Object.keys(parsedResponse).length > 0) {
              // Try to find any numeric value in the response
              const firstKey = Object.keys(parsedResponse)[0];
              const firstValue = parsedResponse[firstKey];
              if (typeof firstValue === 'number') {
                this.result = firstValue;
                console.log(`Used parsedResponse.${firstKey}:`, this.result);
              } else {
                console.error('Cannot extract result from response:', parsedResponse);
                this.errorMessage = `Cannot parse result from response: ${JSON.stringify(parsedResponse)}`;
              }
            } else {
              console.error('Invalid or empty response:', parsedResponse);
              this.errorMessage = `Invalid response: ${JSON.stringify(parsedResponse)}`;
            }
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw response that failed to parse:', response);
            const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
            this.errorMessage = `Failed to parse response as JSON. Raw response: ${responseStr.substring(0, 200)}...`;
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error details:', error);
          
          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Please ensure your C# API is running and accessible.';
          } else if (error.status === 404) {
            this.errorMessage = 'API endpoint not found. Please check if the endpoint "My/add-numbers" exists in your C# API.';
          } else if (error.status >= 400 && error.status < 500) {
            this.errorMessage = `Client error (${error.status}): ${error.error?.message || error.message}`;
          } else if (error.status >= 500) {
            this.errorMessage = `Server error (${error.status}): ${error.error?.message || 'Internal server error'}`;
          } else {
            this.errorMessage = `Error: ${error.message}`;
          }
        }
      });
  }
}

