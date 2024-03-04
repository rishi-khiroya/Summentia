const PYTHON_URL = 'http://localhost:8000';

async function run(project_folder: string) {
	console.log('Processing no slides...');
	const body = JSON.stringify({ project_folder });

	console.log(body);

	const response = await fetch(`${PYTHON_URL}/process_noslides`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	});

	console.log('Received response.');

	const transcript = await response.text();

	console.log('Transcript = ' + transcript);
	return transcript;
}

run(`/mnt/s/Work/Coding/summentia-data/iml2`);
