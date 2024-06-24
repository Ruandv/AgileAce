import fs from 'fs';
import { AzureKeyCredential, ChatRequestMessageUnion, ChatRequestSystemMessage, GetImagesOptions, OpenAIClient } from "@azure/openai";

class LlmService {
    private ep: string;
    private secret: string;
    constructor() {
        this.ep = process.env.AZURE_OPENAI_ENDPOINT!;
        this.secret = process.env.AZURE_OPENAI_API_KEY!
    }

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

    async postCompletion(messages: ChatRequestMessageUnion[]) {
        const gptModel = new OpenAIClient(
            this.ep,
            new AzureKeyCredential(this.secret),
        );
        messages.push(LlmService.systemMessage)
        messages.push({ role: 'system', content: `the current time is : ${new Date()}` });
        try {
            const result = await gptModel.getChatCompletions(process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME_GPT4!, messages, {
                maxTokens: 200,
                temperature: 0.9,
            });

            for (const choice of result.choices) {
                console.log(choice.message?.content,result.usage?.totalTokens);
            }
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async generateImage(message: string) {
        if (!this.ep || !this.secret) {
            return JSON.parse(fs.readFileSync('./public/avatars/avatar_unknown.json', 'utf8'));
        }
        const model = new OpenAIClient(
            this.ep,
            new AzureKeyCredential(this.secret),
        );
        const options: GetImagesOptions = {
            n: 1,
            size: "1024x1024",
            style: 'vivid',
            responseFormat: "b64_json"
        }
        const prompt = message;
        // const response = await model.getImages(process.env.AZURE_OPENAI_API_IMAGE_DEPLOYMENT_NAME!,
        //     prompt,options);

        const response = { data: [{ url: "https://dalleproduse.blob.core.windows.net/private/images/4e59a74b-bcfb-441d-b250-e776f5206097/generated_00.png?se=2024-06-17T17%3A35%3A58Z&sig=p70NcjmIbrb9fQrLa7SrkAR7qPLMfGO4HwqGXSI8fg0%3D&ske=2024-06-22T12%3A55%3A44Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2024-06-15T12%3A55%3A44Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02" }] };
        return response;
    }
}
export default LlmService;