class SentimentAnalyzer {
    constructor(options = {}) {
        this.endpoint = (options.endpoint || process.env.AZUREURL || "").replace(/\/$/, "");
        this.key = options.key || process.env.AZUREKEY;
        this.timeoutMs = options.timeoutMs || Number(process.env.DETECTION_SERVICE_TIMEOUT_MS || 3500);
    }

    _formatConversation(messages) {
        return messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    }

    _neutral(messages, message) {
        return messages.map(msg => ({
            ...msg,
            error: message,
            sentiment: "neutral",
            confidenceScores: {
                positive: 0,
                neutral: 1,
                negative: 0
            }
        }));
    }

    async analyzeConversation(messages) {
        if (!Array.isArray(messages) || messages.length === 0) {
            return [];
        }

        if (!this.endpoint || !this.key) {
            return this._neutral(messages, "Azure Text Analytics is not configured");
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const conversationText = this._formatConversation(messages);
            const response = await fetch(`${this.endpoint}/text/analytics/v3.1/sentiment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": this.key
                },
                signal: controller.signal,
                body: JSON.stringify({
                    documents: [{
                        id: "1",
                        text: conversationText.slice(0, 5000),
                        language: "en"
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Azure Text Analytics returned ${response.status}`);
            }

            const payload = await response.json();
            const documentResult = payload.documents?.[0];
            if (!documentResult) {
                throw new Error("Azure Text Analytics returned no document result");
            }

            return messages.map((message, index) => ({
                ...message,
                sentiment: documentResult.sentences?.[index]?.sentiment || documentResult.sentiment || "neutral",
                confidenceScores: documentResult.sentences?.[index]?.confidenceScores ||
                    documentResult.confidenceScores || {
                        positive: 0,
                        neutral: 0,
                        negative: 0
                    }
            }));
        } catch (error) {
            console.error("Sentiment analysis error:", error);
            return this._neutral(messages, error.message);
        } finally {
            clearTimeout(timer);
        }
    }
}

module.exports = SentimentAnalyzer;
