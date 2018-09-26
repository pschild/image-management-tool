import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({response: 'Hello, World!'});
});

router.get('/:name', (req: Request, res: Response) => {
    const { name } = req.params;
    res.json({response: `Hello, ${name}!`});
});

export const WelcomeController: Router = router;
