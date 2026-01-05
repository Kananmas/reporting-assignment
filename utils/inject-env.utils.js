import {readFileSync} from "fs";

export function injectEnv() {
    const file = readFileSync("./.env").toString();
    

    file.split("\n").forEach((item) => {
        const [key , value] = item.split("=");
        process.env[key.trim()] = value.trim();
    })
}