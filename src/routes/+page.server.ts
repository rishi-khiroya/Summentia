import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';


export const actions = {
    transcribe: async ({ request }) => {

        const formData = Object.fromEntries(await request.formData());

        if (

            !(formData.fileToUpload as File).name ||
            (formData.fileToUpload as File).name === 'undefined'
          ) {
            return fail(400, {
              error: true,
              message: 'You must provide a file to upload.'
            });
          }

        const file: File = formData.fileToUpload as File;
        console.log(file.name);

    }
} satisfies Actions;