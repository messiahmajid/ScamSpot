const { OpenAI } = require('openai');
const fs = require('fs').promises;
const mime = require('mime-types');

class MessageAnalyzer {
    constructor() {
        this.client = new OpenAI({
            apiKey:process.env.OPENAI
        });

        this.systemPrompt = `
        Analyze messaging screenshot and return JSON:
        {
            "platform": "PlatformName",
            "recipient": "ContactInfo",
            "messages": [{
                "sender": "Me|Contact",
                "content": "text",
                "timestamp": "HH:MM AM/PM",
                "type": "text|image|link|other"
            }]
        }
        RULES:
        1. Return empty messages array if none found
        2. Use exact message text
        3. Format links as #LINK#{url}#ENDLINK#
        4. Never return null values
        `.replace(/\s+/g, ' ').trim();
    }

    async analyze(imagePath) {
        try {
            const { buffer, mimeType } = await this._readImage(imagePath);
            const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                    role: "system",
                    content: this.systemPrompt
                }, {
                    role: "user",
                    content: [{
                        type: "image_url",
                        image_url: { url: dataUrl, detail: "high" }
                    }]
                }],
                response_format: { type: "json_object" },
                temperature: 0.1,
                max_tokens: 2000
            });

            return this._parse(response.choices[0].message.content);

        } catch (error) {
            return {
                error: {
                    message: error.message,
                    code: error.code || 'ANALYSIS_ERROR'
                }
            };
        }
    }

    async _readImage(path) {
        try {
            const buffer = await fs.readFile(path);
            return {
                buffer,
                mimeType: mime.lookup(path) || 'image/png'
            };
        } catch (error) {
            throw new Error(`File read failed: ${error.message}`);
        }
    }

    _parse(responseText) {
        try {
            const jsonString = responseText.replace(/```json|```/g, '');
            const data = JSON.parse(jsonString);

            if (!Array.isArray(data.messages)) {
                throw new Error('Invalid message format');
            }

            return {
                platform: data.platform || 'Unknown',
                recipient: data.recipient || 'Unknown',
                messages: data.messages.map(msg => ({
                    sender: msg.sender || 'Unknown',
                    content: msg.content || '',
                    timestamp: msg.timestamp || '00:00',
                    type: msg.type || 'text'
                }))
            };
        } catch (error) {
            console.error('Parse Error:', responseText);
            throw new Error(`Response parsing failed: ${error.message}`);
        }
    }
}

module.exports = MessageAnalyzer;