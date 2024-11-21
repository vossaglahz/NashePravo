import { IFilterUsers } from '@/interfaces/IFilterUsers.interface';
import { AdminService } from '@/services/admin.service';
import { RequestHandler } from 'express';

export class AdminController {
    private service: AdminService;

    constructor() {
        this.service = new AdminService();
    }

    approveRequest: RequestHandler = async (req, res): Promise<void> => {
        try {
            const requestId = req.params.id;
            const request = await this.service.approveRequest(requestId);
            res.status(200).send(request);
        } catch (error) {
            console.error('Error in approving request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    rejectRequest: RequestHandler = async (req, res): Promise<void> => {
        try {
            const requestId = req.params.id;
            const request = await this.service.rejectRequest(requestId);

            res.status(200).send(request);
        } catch (error) {
            console.error('Error in rejecting request:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getAllRequest: RequestHandler = async (req, res): Promise<void> => {
        const requests = await this.service.getAllRequest();
        res.send(requests);
    };

    getAllUsers: RequestHandler = async (req, res): Promise<void> => {
        const { page, limit, sorted, isActivatedByEmail, isConfirmed, role, permanentBlock } = req.query as unknown as IFilterUsers;

        const users = await this.service.getAllUsers({ page, limit, sorted, isActivatedByEmail, isConfirmed, role, permanentBlock });
        res.send(users);
    };
}
