import express, {Request, Response} from "express"
import {PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

const client = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req:Request, res:Response) => {
    const zapId = req.params.zapId;
    const body = req.body;

    await client.$transaction(async (tx:Prisma.TransactionClient) => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });;

        await tx.zapRunOutbox.create(
            {
            data: {
                zapRunId: run.id
            }
        })
    })
    res.json({
        message: "Webhook received"
    })
})

app.listen(3002);