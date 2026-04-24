const fs = require('fs');

let content = fs.readFileSync('lib/Utils/generics.js', 'utf8');
content = content.replace(
    "const generateMessageID = () => 'ILSYM-' + (0, crypto_1.randomBytes)(6).toString('hex').toUpperCase();",
    "const generateMessageID = () => '3EB0' + (0, crypto_1.randomBytes)(18).toString('hex').toUpperCase().substring(0, 18);"
);
fs.writeFileSync('lib/Utils/generics.js', content);

let richContent = fs.readFileSync('lib/Utils/rich-message-utils.js', 'utf8');
richContent = richContent.replace("const { RichSubMessageType } = require('../Types');", "const { RichSubMessageType } = require('../Types/RichType');");

fs.writeFileSync('lib/Utils/rich-message-utils.js', richContent);
