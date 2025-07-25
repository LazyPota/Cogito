(async () => {
    const { translateToEnglish, translateToIndonesian } = require("./src/services/translate.service");

    const idText = "Saya percaya lingkungan harus dijaga.";
    const enText = await translateToEnglish(idText);
    console.log("EN:", enText); // expect: I believe the environment must be protected

    const backToId = await translateToIndonesian(enText);
    console.log("ID:", backToId); // expect: Saya percaya lingkungan harus dijaga
})();
