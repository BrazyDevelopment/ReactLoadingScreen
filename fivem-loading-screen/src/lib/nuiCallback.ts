interface FiveMWindow extends Window {
	GetParentResourceName?: () => string;
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
	  
	  const responseData = await response.json();
	  return responseData;
	} catch (error) {
	  console.error('NUI Callback Error:', error);
	  throw error;
	}
  }