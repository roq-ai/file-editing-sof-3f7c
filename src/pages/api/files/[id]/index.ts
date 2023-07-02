import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { fileValidationSchema } from 'validationSchema/files';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.file
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFileById();
    case 'PUT':
      return updateFileById();
    case 'DELETE':
      return deleteFileById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFileById() {
    const data = await prisma.file.findFirst(convertQueryToPrismaUtil(req.query, 'file'));
    return res.status(200).json(data);
  }

  async function updateFileById() {
    await fileValidationSchema.validate(req.body);
    const data = await prisma.file.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFileById() {
    const data = await prisma.file.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
