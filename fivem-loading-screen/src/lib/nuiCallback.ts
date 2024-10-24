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
		const response = await fetch(`nui://${resourceName}${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('NUI Callback Error - Response not OK:', response.status, errorText);
			throw new Error(`Error ${response.status}: ${errorText}`);
		}

		const responseData = await response.json();
		return responseData;
	} catch (error) {
		console.error('NUI Callback Error:', error);
		throw error;
	}
}