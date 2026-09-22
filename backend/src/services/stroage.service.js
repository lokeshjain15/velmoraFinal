import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

// Function to upload a file to ImageKit
export async function uploadFile({buffer, fileName, folder = "velmora"}) {
    if (!config.IMAGEKIT_PRIVATE_KEY) {
        throw new Error("IMAGEKIT_PRIVATE_KEY is not configured");
    }

    const client = new ImageKit({ privateKey: config.IMAGEKIT_PRIVATE_KEY });
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}
