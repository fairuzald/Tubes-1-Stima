import { toast } from "react-hot-toast";

// Define an interface for API request options
interface ApiRequestOptions {
  body?: BodyInit;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  loadingMessage: string;
  successMessage: string;
  endpoint: string;
  onSuccess: (data: any) => void;
}

// Define an interface extending RequestInit to include a timeout option
interface ExtendedRequestInit extends RequestInit {
  timeout?: number;
}

// Function to make an API request using fetch and toast for messaging
export async function makeApiRequest({
  body,
  method,
  headers,
  loadingMessage,
  successMessage,
  endpoint,
  onSuccess,
}: ApiRequestOptions) {
  try {
    // Use toast.promise to show loading, success, and error messages
    await toast.promise(
      // Use fetch to make the API request
      fetch(process.env.NEXT_PUBLIC_API + endpoint, {
        method: method,
        headers: headers,
        timeout: 30000000, 
        keepAlive: true,
        noDelay: true,
        // Include the request body for non-GET requests
        ...(method !== "GET" ? { body: body } : {}),
      } as ExtendedRequestInit)
        .then(async (response) => {
          // Check if the response is not okay, log and throw an error
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
          // If the response is okay, parse JSON and call onSuccess callback
          return response.json();
        })
        .then((data) => {
          onSuccess(data);
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
      {
        // Provide loading, success, and error messages for toast
        loading: loadingMessage,
        success: successMessage,
        error: (err: any) => `Processing failed: ${err.message}`,
      }
    );
  } catch (error) {
    // Log any unhandled errors
    console.error("Unhandled error:", error);
  }
}
