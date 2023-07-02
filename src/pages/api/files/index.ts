import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { fileValidationSchema } from 'validationSchema/files';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFiles();
    case 'POST':
      return createFile();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFiles() {
    const data = await prisma.file
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'file'));
    return res.status(200).json(data);
  }

  async function createFile() {
    await fileValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.permission?.length > 0) {
      const create_permission = body.permission;
      body.permission = {
        create: create_permission,
      };
    } else {
      delete body.permission;
    }
    const data = await prisma.file.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
