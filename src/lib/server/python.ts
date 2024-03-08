import { PYTHON_URL } from '$env/static/private';
import { fetch, Agent, Response } from 'undici';

const processResponse = async (response: Response) => ({
	success: response.ok,
	data: response.ok ? await response.json() : await response.text()
});

export async function handshake(): Promise<boolean> {
	try {
		const response = await fetch(`${PYTHON_URL}/handshake`, {
			method: 'GET',
			dispatcher: new Agent({ headersTimeout: 1000 })
		});
		return response.ok;
	} catch (_) {
		return false;
	}
}

export async function process_noslides(project_folder: string): Promise<string> {
	const response = await fetch(`${PYTHON_URL}/process_noslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ project_folder }),
		dispatcher: new Agent({ headersTimeout: 3600000 })
	});
	const transcript = await response.text();
	return transcript;
}

export async function process_slides(project_folder: string) {
	const response = await fetch(`${PYTHON_URL}/process_slides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ project_folder }),
		dispatcher: new Agent({ headersTimeout: 3600000 })
	});
	return processResponse(response);
}

export async function process_genslides(project_folder: string) {
	const response = await fetch(`${PYTHON_URL}/process_genslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ project_folder }),
		dispatcher: new Agent({ headersTimeout: 3600000 })
	});
	return processResponse(response);
}
