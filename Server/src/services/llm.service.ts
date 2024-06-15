import { AzureKeyCredential, ChatRequestMessageUnion, ChatRequestSystemMessage, ChatRequestUserMessage, OpenAIClient } from "@azure/openai";

class LlmService {

    private static systemMessage: ChatRequestSystemMessage = {
        content: `You are a friendly bot and your name is JAMIE. 
        You are helping a user with a poker game. The user is asking you for advice on how to play the game.`,
        role: "system"
    };

    static instance: LlmService;
    static getInstance(): LlmService {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new LlmService();
            return this.instance;
        }
    }

    async postVoice(messages: ChatRequestMessageUnion[]) {
        const ep = process.env.AZURE_OPENAI_ENDPOINT!;
        const secret = process.env.AZURE_OPENAI_API_KEY!
        const gptModel = new OpenAIClient(
            ep,
            new AzureKeyCredential(secret),
        );
        try {
            const result = await gptModel.getChatCompletions(process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME_GPT4!, messages, {
                maxTokens: 200,
                temperature: 0.7
            });

            for (const choice of result.choices) {
                console.log(choice.message?.content);
            }
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

export default LlmService;