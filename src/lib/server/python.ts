const PYTHON_URL = 'http://localhost:8000';

export async function process_noslides(project_folder: string): Promise<string> {
	const response = await fetch(`${PYTHON_URL}/process_noslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ project_folder })
	});
	const transcript = await response.text();
	return transcript;
}
