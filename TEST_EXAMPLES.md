
# How to test Interactive / Rich Messages with DinzBaileys

Here is the format you can use to test the newly ported interactive messages (Code Block, Tables, and AI Icon).

### 1. Code Block Message
```javascript
await sock.sendMessage(jid, {
    richResponse: {
        code: [
            {
                language: "javascript",
                code: "console.log('Hello World!');"
            }
        ]
    }
});
```

### 2. Table Message
```javascript
await sock.sendMessage(jid, {
    richResponse: {
        table: [
            { isHeading: true, items: ["Name", "Age"] },
            { isHeading: false, items: ["Alice", "24"] },
            { isHeading: false, items: ["Bob", "28"] }
        ]
    }
});
```

### 3. AI Icon Message
*(Note: Only works in private chat!)*
```javascript
await sock.sendMessage(jid, {
    text: "Hello, I am an AI bot!",
    ai: true
});
```

### 4. Sticker Pack Message
```javascript
await sock.sendMessage(jid, {
    stickerPack: {
        stickerPackId: "12345",
        name: "My Sticker Pack",
        publisher: "DinzID",
        trayIconUrl: "https://example.com/icon.png",
        stickers: [
            { directPath: "/path/to/sticker1" } // Ensure proper paths/URL
        ]
    }
});
```
