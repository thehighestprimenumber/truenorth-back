import fetch from "node-fetch";

export const getRandomStringFromAPI = async () => {
    const response = await fetch("https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new");
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }
    return await response.text();
};
