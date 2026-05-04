import axios from "axios"
import { parse } from "node-html-parser"

const commonHeaders = {             // bypass steam-age-check
    "Cookie": "birthtime=600000000; wants_mature_content=1; path=/; domain=store.steampowered.com",
    "Accept-Language": "en-US;q=1.0"
};

// takes app_id, Scrapes game details from Steam Store webpage 
// Store page does not have Cloudflare protection, unlike steamdb 
const getDataFromSteamStore = async (appID) => {

    if (!appID || !(Number.isInteger(appID) && appID > 0)) throw new Error("INVALID_APPID");
    
    const url = `https://store.steampowered.com/app/${appID}`;

    try {
        const { data } = await axios.get(url, { headers: commonHeaders });
        const parsed = parse(data);

        const name = parsed.querySelector(".apphub_AppName")?.innerHTML;
        const iconSrc = parsed.querySelector(".apphub_AppIcon img")?.attributes.src;
        return {
            name: name || "Unknown",
            icon: iconSrc ? iconSrc.match(/([^\\\/\:\*\?\"\<\>\|])+$/)[0].replace(".jpg", "") : null
        }
    } catch(err) {
        console.error("Scraper Failed: ", err.message);
        return null;
    }
}

// undocumented steam storefront api, used by steam-store itself 
const getDataFromSteamStoreAPI = async (appID) => {
    
    if (!appID || !(Number.isInteger(appID) && appID > 0)) throw new Error("INVALID_APPID");

    const url = `https://store.steampowered.com/api/appdetails?appids=${appID}`;

    try {
        const { data } = await axios.get(url, { headers: commonHeaders });

        if (data && data[appID]?.success) {
            return {
                name: data[appID].data.name
            };
        }
        
        console.error("Steam-Store-API failure for ID:", appID);
        return null;
    } catch(err) {
        console.error("API Request Failed: ", err.message);
        return null;
    }
}

// fallback to store api in case store-page fails 
const getDataFromSteamStoreFallbackStoreAPI = async (appID) => {
    
    let result = await getDataFromSteamStore(appID);
    
    if (!result) {
        console.log("Attempting Fallback...");
        result = await getDataFromSteamStoreAPI(appID);
    }

    return result;
}