const fs = require('fs');

let content = fs.readFileSync('lib/Utils/messages.js', 'utf8');

// The reason for invalid media type might be because `prepareWAMessageMedia` doesn't know about `stickerPack`.
// We need to bypass `prepareWAMessageMedia` for `stickerPack`.
content = content.replace(
    "    else {\n        m = await (0, exports.prepareWAMessageMedia)(message, options);\n    }\n    if ('stickerPack' in message) {\n        m.stickerPackMessage = await prepareStickerPackMessage(message, options);\n    }",
    "    else if ('stickerPack' in message) {\n        m.stickerPackMessage = await prepareStickerPackMessage(message.stickerPack, options);\n    }\n    else {\n        m = await (0, exports.prepareWAMessageMedia)(message, options);\n    }"
);

// We also need to define `prepareStickerPackMessage` because it wasn't added correctly or was overwritten.
if (!content.includes('const prepareStickerPackMessage = async (message, options) => {')) {
    const stickerPackLogic = `
const prepareStickerPackMessage = async (message, options) => {
    const obj = {};
    if (message.contextInfo) {
        obj.contextInfo = message.contextInfo;
    }
    obj.stickerPackId = message.stickerPackId || '';
    obj.name = message.name || '';
    obj.publisher = message.publisher || '';
    obj.packDescription = message.packDescription || '';
    obj.trayIconFileName = message.trayIconFileName || '';
    if (message.imageDataHash) obj.imageDataHash = Buffer.from(message.imageDataHash, 'base64');
    obj.stickerPackSize = message.stickerPackSize || 0;
    obj.stickerPackOrigin = WAProto_1.proto.Message.StickerPackMessage.StickerPackOrigin.USER_CREATED;

    obj.stickers = [];
    if (message.stickers) {
        for (const sticker of message.stickers) {
            obj.stickers.push({
                fileSha256: Buffer.from(sticker.fileSha256 || '', 'base64'),
                fileEncSha256: Buffer.from(sticker.fileEncSha256 || '', 'base64'),
                mediaKey: Buffer.from(sticker.mediaKey || '', 'base64'),
                mimetype: sticker.mimetype || 'image/webp',
                height: sticker.height || 0,
                width: sticker.width || 0,
                directPath: sticker.directPath || '',
                fileLength: sticker.fileLength || 0,
                mediaKeyTimestamp: sticker.mediaKeyTimestamp || 0,
                isAnimated: sticker.isAnimated || false,
                isAvatar: sticker.isAvatar || false,
                isLottie: sticker.isLottie || false,
                emojis: sticker.emojis || []
            });
        }
    }

    if (message.trayIcon) {
        let trayIconInfo = undefined;
        if (message.trayIconUrl) {
            trayIconInfo = { trayIconUrl: message.trayIconUrl };
        }
        else if (message.trayIcon) {
            trayIconInfo = { stream: message.trayIcon };
        }

        const mediaBuff = await (0, exports.getRawMediaUploadData)(trayIconInfo, 'sticker', options);
        obj.trayIconFileName = trayIconInfo.trayIconFileName || 'tray.png';
        const uploadResponse = await options.upload(mediaBuff, {
            mediaType: 'sticker',
            fileEncSha256B64: '',
        });
        obj.fileSha256 = uploadResponse.fileSha256;
        obj.fileEncSha256 = uploadResponse.fileEncSha256;
        obj.mediaKey = uploadResponse.mediaKey;
        obj.directPath = uploadResponse.directPath;
        obj.mediaKeyTimestamp = uploadResponse.mediaKeyTimestamp;
        obj.fileLength = uploadResponse.fileLength;
    }
    return WAProto_1.proto.Message.StickerPackMessage.fromObject(obj);
};
`;
    content = content.replace("exports.generateWAMessageContent = void 0;", "exports.generateWAMessageContent = void 0;\n" + stickerPackLogic);
}

fs.writeFileSync('lib/Utils/messages.js', content);
