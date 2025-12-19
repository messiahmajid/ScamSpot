

const { DecisionTreeClassifier } = require('ml-cart');

class ScamClassifierService {
    constructor() {
        this.classifier = new DecisionTreeClassifier({
            gainFunction: 'gini',
            maxDepth: 10,
            randomState: 42
        });

        // Training dataset
        this.trainingData = [
            {
                text: "I need you to help me with something very important. Kindly text me back as soon as possible.",
                label: 1
            },
            {
                text: "Hi Amy, how are you?",
                label: 0
            },
            {
                text: "I need to get some amazon gift cards for some cancer patients that I promised as a birthday gift, but I can’t do this at the moment. Can you get it from any store? I’ll have it refunded. Thanks.",
                label: 1
            },
            {
                text: "Hello, how are you? What can I do to help?",
                label: 0
            },
            {
                text: "Please purchase the cards and send over pictures of the front and back of the cards.",
                label: 1
            }
        ];

        // Initialize and train model
        this.initialize();
    }

    initialize() {
        const features = this.trainingData.map(item =>
            this.extractFeatures({
                content: item.text,
                confidenceScores: { positive: 0.5, negative: 0.5, neutral: 0.5 }
            })
        );
        const labels = this.trainingData.map(item => item.label);
        this.classifier.train(features, labels);
    }

    extractFeatures(message) {
        const text = message.content.toLowerCase();
        return [
            message.confidenceScores.positive,
            message.confidenceScores.negative,
            message.confidenceScores.neutral,
            text.length,
            text.includes('gift card') ? 1 : 0,
            text.includes('refund') ? 1 : 0,
            text.includes('urgent') ? 1 : 0
        ];
    }

    classifyMessage(message) {
        if (!message?.content || typeof message.content !== 'string') {
            return { ...message, scamPrediction: 0 };
        }

        try {
            const features = this.extractFeatures(message);
            const prediction = this.classifier.predict([features])[0];
            return {
                ...message,
                scamPrediction: prediction === 1 ? "scam" : "no scam" // Convert to text
            };
        } catch (error) {
            console.error('Classification error:', error);
            return {
                ...message,
                scamPrediction: "no scam" // Default to no scam on error
            };
        }
    }

    classifyConversation(messages) {
        return messages.map(msg => this.classifyMessage(msg));
    }
}

// Export singleton instance
module.exports = ScamClassifierService
