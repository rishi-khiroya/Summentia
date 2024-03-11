import { test, expect } from 'vitest';
import { getVideo } from "../src/lib/panopto_downloader";

test('test get video', async () => {
    const video = await getVideo();

    if (video != null){
        console.log(video);
    } else{
        console.log("something went wrong");
        console.log(video);
    }
    
}, 70000);