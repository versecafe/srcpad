import { expect, test, describe } from "bun:test";
import { db } from "@/core.ts";
import { users } from "@/db/schema.ts";
import { eq } from "drizzle-orm";

// ensure the db is correctly created, migrated, and sql driver works
describe("user", async () => {
  const id = Math.random().toString(36).substring(2, 10);
  test("user creation", async () => {
    await db.insert(users).values({ id: id });
    const result = await db.select().from(users).where(eq(users.id, id));
    expect(id).toEqual(result[0]?.id ?? "");
  });

  test("user deletion", async () => {
    await db.delete(users).where(eq(users.id, id));
    const result = await db.select().from(users).where(eq(users.id, id));
    expect(result).toBeEmpty();
  });
});
