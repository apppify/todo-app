import { z } from "zod";
// import { User } from "@/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";
// import { getTeamForUser, getUser } from '@/lib/db/queries';
import { redirect } from "next/navigation";

interface ActionSuccess<T> {
  data: T;
  error?: never;
}

interface ActionError {
  error: string;
  data?: never;
}

export type ActionState<T = unknown> = ActionSuccess<T> | ActionError;

// export type ActionState = {
//   error?: string;
//   success?: string;
//   [key: string]: any; // This allows for additional properties
// };

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message } as T;
    }

    return action(result.data, formData);
  };
}

export type ValidatedActionWithUserFunction<
  S extends z.ZodType,
  TReturn = unknown
> = (
  validatedData: z.infer<S>,
  formData: FormData,
  userId: string
) => Promise<ActionState<TReturn>>;

export function withUser<S extends z.ZodType, TReturn = unknown>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, TReturn>
): (
  prevState: ActionState<TReturn>,
  formData: FormData
) => Promise<ActionState<TReturn>> {
  return async (
    prevState: ActionState<TReturn>,
    formData: FormData
  ): Promise<ActionState<TReturn>> => {
    try {
      const clerk_user = await currentUser();

      if (!clerk_user) {
        return {
          error: "User is not authenticated",
        };
      }

      const parseResult = schema.safeParse(Object.fromEntries(formData));

      if (!parseResult.success) {
        return {
          error: parseResult.error.errors[0].message,
        };
      }

      return await action(parseResult.data, formData, clerk_user.id);
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };
}

// type ActionWithTeamFunction<T> = (
//   formData: FormData,
//   team: TeamDataWithMembers
// ) => Promise<T>;

// export function withTeam<T>(action: ActionWithTeamFunction<T>) {
//   return async (formData: FormData): Promise<T> => {
//     const user = await getUser();
//     if (!user) {
//       redirect('/sign-in');
//     }

//     const team = await getTeamForUser(user.id);
//     if (!team) {
//       throw new Error('Team not found');
//     }

//     return action(formData, team);
//   };
// }
