import {bot_token} from "./secret.js";
import axios from "axios";

export function stream2buffer(stream) {

    return new Promise((resolve, reject) => {

        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));

    });
}

export const getTgUserPhoto = async (userId) => {
    try {
        let url1 = `https://api.telegram.org/bot${bot_token}/getUserProfilePhotos?user_id=` + userId;
        const response1 = await axios.get(url1, { responseType: 'json' });
        if (response1.status !== 200) {
            return null;
        }

        let result = response1.data.result;

        const photo_sizes = result.photos[0];
        const photoSize = photo_sizes[photo_sizes.length-1]
        const fileId = photoSize.file_id

        let url2 = `https://api.telegram.org/bot${bot_token}/getFile?file_id=` + fileId
        const response2 = await axios.get(url2, { responseType: 'text' });
        if (response2.status !== 200) {
            return null;
        }

        let data = JSON.parse(response2.data)
        let url3 = `https://api.telegram.org/file/bot${bot_token}/` + data.result.file_path
        const response3 = await axios.get(url3, { responseType: 'stream' });
        if (response3.status !== 200) {
            return null;
        }

        console.log("downloading "+data.result.file_path)
        let buffer;
        await stream2buffer(response3.data).then(buf => {
            buffer = buf;
        })

        return buffer;

    } catch (error) {
        console.error(error);
    }
}