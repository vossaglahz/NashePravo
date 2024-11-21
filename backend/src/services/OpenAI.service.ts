import { AiQuestionDto } from '@/dto/openAiQuestion.dto';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse'; 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
    async getMessageOpenAi(questionDto: AiQuestionDto) {
        try {
            const messages = [
                { role: 'system', content: questionDto.type },
                { role: 'user', content: questionDto.message },
            ];

            if(questionDto.document) {
                const jsonlFilePath = await this.convertPdfToJsonl(questionDto.document);
                const fileContent = await this.extractTextFromJsonl(jsonlFilePath);

                messages.push(
                    { 
                        role: 'user', 
                        content: `Содержимое загруженного файла: ${fileContent}`,
                    }
                )
            };

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
            });
            const responseMessage = completion.choices[0].message.content;

            return { responseMessage };
        } catch (error: any) {
            console.error('Ошибка при выполнении запроса к OpenAI:', error);
            throw new Error('Ошибка сервера');
        }
    };

    async extractTextFromJsonl(filePath: string): Promise<string> {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').map(line => JSON.parse(line).content).join(' ');
    }

    async convertPdfToJsonl(document: { src: string; name: string }): Promise<string> {
        return new Promise((resolve, reject) => {
            const pdfBuffer = fs.readFileSync(document.src);
            pdf(pdfBuffer).then(data => {
                const jsonlData = data.text.split('\n').map(line => JSON.stringify({ content: line })).join('\n');
                const jsonlFilePath = path.join('./public/uploads', `${document.name}.jsonl`);
                fs.writeFileSync(jsonlFilePath, jsonlData);
                resolve(jsonlFilePath);
            }).catch(err => {
                reject(err);
            });
        });
    };
};
