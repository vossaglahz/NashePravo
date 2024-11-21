import { AiQuestionDto } from '@/dto/openAiQuestion.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { OpenAIService } from '@/services/OpenAI.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export class OpenAIController {
    private service: OpenAIService;

    constructor() {
        this.service = new OpenAIService();
    }

    getMessageOpenAi: RequestHandler = async (req, res): Promise<void> => {
        try {
            const questionDto = plainToInstance(AiQuestionDto, {
                message: req.body.message,
                role: req.body.role,
                type: req.body.type,
                document: undefined,
            });
         
            if (req.file) {
                questionDto.document = {
                    src: req.file.path, 
                    name: req.file.originalname
                }
            }

            const validationErrors = await validate(questionDto);
            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }
            
            const msgOpenAi = await this.service.getMessageOpenAi(questionDto);
            
            res.status(200).send(msgOpenAi);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
