import { PYTHON_URL } from '$env/static/private';
import { fetch, Agent, Response } from 'undici';

const PROCESS_TIMEOUT = 7200000;

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

export async function process_noslides(uuid: string): Promise<string> {
	const response = await fetch(`${PYTHON_URL}/process_noslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ uuid }),
		dispatcher: new Agent({ headersTimeout: PROCESS_TIMEOUT })
	});
	const transcript = await response.text();
	return transcript;
}

export async function process_slides(uuid: string) {
	const response = await fetch(`${PYTHON_URL}/process_slides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ uuid }),
		dispatcher: new Agent({ headersTimeout: PROCESS_TIMEOUT })
	});
	return processResponse(response);
}

export async function process_genslides(uuid: string) {
	const response = await fetch(`${PYTHON_URL}/process_genslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ uuid }),
		dispatcher: new Agent({ headersTimeout: PROCESS_TIMEOUT })
	});
	return processResponse(response);
}
