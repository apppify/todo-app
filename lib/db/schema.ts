import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar({ length: 50 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  first_name: varchar("first_name", { length: 50 }),
  last_name: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  metadata: jsonb("metadata")
    .$type<UserMetadata>()
    .notNull()
    .default({
      settings: {
        language: "en",
        timezone: "UTC",
      },
    }),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  metadata: jsonb("metadata").$type<TeamMetadata>().notNull().default({}),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: varchar("uid")
    .notNull()
    .references(() => users.id),
  teamId: integer("tid")
    .notNull()
    .references(() => teams.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const sprints = pgTable("sprints", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("name", { length: 100 }),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  teamId: integer("tid")
    .notNull()
    .references(() => teams.id),
  userId: varchar("uid")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relations
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  sprints: many(sprints),
}));

export const sprintsRelations = relations(sprints, ({ one }) => ({
  team: one(teams),
  user: one(users),
}));

// const orderStatusEnum = pgEnum("order_status", [
//   "pending",
//   "processing",
//   "shipped",
//   "delivered",
//   "cancelled",
// ]);

// export const activityLogs = pgTable("activity_logs", {
//   id: serial("id").primaryKey(),
//   teamId: integer("team_id")
//     .notNull()
//     .references(() => teams.id),
//   userId: integer("user_id").references(() => users.id),
//   action: text("action").notNull(),
//   timestamp: timestamp("timestamp").notNull().defaultNow(),
//   ipAddress: varchar("ip_address", { length: 45 }),
// });

// export const invitations = pgTable("invitations", {
//   id: serial("id").primaryKey(),
//   teamId: integer("team_id")
//     .notNull()
//     .references(() => teams.id),
//   email: varchar("email", { length: 255 }).notNull(),
//   role: varchar("role", { length: 50 }).notNull(),
//   invitedBy: integer("invited_by")
//     .notNull()
//     .references(() => users.id),
//   invitedAt: timestamp("invited_at").notNull().defaultNow(),
//   status: varchar("status", { length: 20 }).notNull().default("pending"),
// });

// export const usersRelations = relations(users, ({ many }) => ({
//   teamMembers: many(teamMembers),
//   invitationsSent: many(invitations),
// }));

// export const invitationsRelations = relations(invitations, ({ one }) => ({
//   team: one(teams, {
//     fields: [invitations.teamId],
//     references: [teams.id],
//   }),
//   invitedBy: one(users, {
//     fields: [invitations.invitedBy],
//     references: [users.id],
//   }),
// }));

// export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
//   team: one(teams, {
//     fields: [activityLogs.teamId],
//     references: [teams.id],
//   }),
//   user: one(users, {
//     fields: [activityLogs.userId],
//     references: [users.id],
//   }),
// }));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Sprint = typeof sprints.$inferSelect;
export type NewSprint = typeof sprints.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

// export type TeamDataWithMembers = Team & {
//   teamMembers: (TeamMember & {
//     user: Pick<User, "id" | "name" | "email">;
//   })[];
// };

const UserMetadataSchema = z.object({
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]),
    })
    .optional(),
  profile: z
    .object({
      bio: z.string().optional(),
      socialLinks: z.array(z.string().url()).optional(),
      skills: z.array(z.string()).optional(),
    })
    .optional(),
  settings: z.object({
    language: z.string(),
    timezone: z.string(),
  }),
});
type UserMetadata = z.infer<typeof UserMetadataSchema>;

const TeamMetadataSchema = z.object({
  preferences: z
    .object({
      badgeColor: z.enum(["blue", "red", "green", "custom"]).optional(),
      badgeCustomColor: z.string().optional(),
      isMuted: z.boolean(),
    })
    .optional(),
});
type TeamMetadata = z.infer<typeof TeamMetadataSchema>;

// export enum ActivityType {
//   SIGN_UP = "SIGN_UP",
//   SIGN_IN = "SIGN_IN",
//   SIGN_OUT = "SIGN_OUT",
//   UPDATE_PASSWORD = "UPDATE_PASSWORD",
//   DELETE_ACCOUNT = "DELETE_ACCOUNT",
//   UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
//   CREATE_TEAM = "CREATE_TEAM",
//   REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
//   INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
//   ACCEPT_INVITATION = "ACCEPT_INVITATION",
// }
