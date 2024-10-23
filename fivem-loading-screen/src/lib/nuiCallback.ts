interface FiveMWindow extends Window {
	invokeNative: (native: string, arg: string) => void;
	GetParentResourceName?: () => string;
	nuiHandoverData: NuiHandoverData;
}

  interface NuiHandoverData {
	name: string;
	id: number;
	steamid: string;
  }
  
  declare const window: FiveMWindow;
  
  export async function nuiCallback<T, R>(endpoint: string, data: T): Promise<R> {
	const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : '';
  
	try {
	  const response = await fetch(`https://${resourceName}${endpoint}`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(data),
	  });
  
	  // Check if the response is okay (status in the range 200-299)
	  if (!response.ok) {
		const errorText = await response.text(); // Get error text if available
		console.error('NUI Callback Error - Response not OK:', response.status, errorText);
		throw new Error(`Error ${response.status}: ${errorText}`);
	  }
  
	  // Parse and return the JSON response
	  const responseData = await response.json();
	  return responseData;
	} catch (error) {
	  console.error('NUI Callback Error:', error);
	  throw error; // Re-throw the error after logging
	}
  }
  