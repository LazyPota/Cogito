const JsGoogleTranslateFree = require("@kreisler/js-google-translate-free");

const translateToIndonesian = async (text) => {
    try {
        const result = await JsGoogleTranslateFree.translate({
            from: "en",
            to: "id",
            text,
        });
        return result;
    } catch (err) {
        console.error("Translate to Indonesian error:", err.message);
        return text;
    }
};

const translateToEnglish = async (text) => {
    try {
        const result = await JsGoogleTranslateFree.translate({
            from: "id",
            to: "en",
            text,
        });
        return result;
    } catch (err) {
        console.error("Translate to English error:", err.message);
        return text;
    }
};

module.exports = {
    translateToIndonesian,
    translateToEnglish,
};
