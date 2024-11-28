'use server';

import { withUser } from '../action.middleware';
import { createSprint } from '../db/queries';
import { SprintCreateDataType, sprintCreateSchema } from '../dto';

export const sprintCreateAction = withUser(sprintCreateSchema, async (data, fd, uid) => {
  const sprint = await createSprint({ ...data, userId: uid });
  return new Response('Sprint created successfully', { status: 200 });
});
