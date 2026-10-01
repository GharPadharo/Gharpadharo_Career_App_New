import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";

const SENSITIVE_KEYS = new Set([
  "phone",
  "resume",
  "fileurl",
  "publicid",
  "password",
  "token",
  "secret",
  "key",
  "coverletter",
  "aboutyourself",
]);

/**
 * Strips sensitive candidate or system credentials from activity metadata
 */
function sanitizeMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }
  const clean = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      continue;
    }
    // Allow basic primitive types and simple objects
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    } else if (value instanceof mongoose.Types.ObjectId) {
      clean[key] = value.toString();
    }
  }
  return clean;
}

// Window for deduplicating repeated application view events
const VIEW_ACTIVITY_DEDUPE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// In-flight concurrency lock to prevent parallel race conditions (e.g. StrictMode / simultaneous requests)
const inFlightOperations =
  globalThis.__inFlightActivityOperations ||
  (globalThis.__inFlightActivityOperations = new Map());

/**
 * Server-side helper to record persistent recruitment activity
 * 
 * Fails safely without interrupting core business mutations.
 * Deduplicates repeated application_viewed events within a 5-minute window
 * to prevent duplicate activity feed noise from re-renders or concurrent requests.
 * 
 * @param {Object} options
 * @param {string} options.type - One of the valid activity types
 * @param {string} options.title - Short event title
 * @param {string} options.description - Safe, non-sensitive narrative description
 * @param {"application"|"job"} options.entityType - Target entity collection
 * @param {string|mongoose.Types.ObjectId} [options.entityId] - Target document ID
 * @param {string|mongoose.Types.ObjectId} [options.actorId] - Authenticated admin user ID
 * @param {Object} [options.metadata] - Additional non-sensitive event context
 * @returns {Promise<Object|null>} The created activity document or null on error
 */
export async function logActivity({
  type,
  title,
  description,
  entityType,
  entityId = null,
  actorId = null,
  metadata = {},
}) {
  try {
    if (!type || !title || !description || !entityType) {
      console.warn("logActivity: Missing required activity arguments", { type, title, entityType });
      return null;
    }

    await connectDB();

    const sanitizedMeta = sanitizeMetadata(metadata);

    let parsedEntityId = null;
    if (entityId && mongoose.Types.ObjectId.isValid(entityId)) {
      parsedEntityId = new mongoose.Types.ObjectId(entityId);
    }

    let parsedActorId = null;
    if (actorId && mongoose.Types.ObjectId.isValid(actorId)) {
      parsedActorId = new mongoose.Types.ObjectId(actorId);
    }

    // Deduplication logic for application_viewed events
    if (type === "application_viewed" && parsedEntityId) {
      const lockKey = `application_viewed:${parsedEntityId.toString()}:${
        parsedActorId ? parsedActorId.toString() : "system"
      }`;

      // If an identical view operation is already in-flight, await its result
      if (inFlightOperations.has(lockKey)) {
        return await inFlightOperations.get(lockKey);
      }

      const operationPromise = (async () => {
        // Query MongoDB for recent duplicate within deduplication window
        const windowStart = new Date(Date.now() - VIEW_ACTIVITY_DEDUPE_WINDOW_MS);
        const dedupeQuery = {
          type: "application_viewed",
          entityId: parsedEntityId,
          createdAt: { $gte: windowStart },
        };
        if (parsedActorId) {
          dedupeQuery.actorId = parsedActorId;
        }

        const existingRecent = await Activity.findOne(dedupeQuery).sort({ createdAt: -1 });
        if (existingRecent) {
          return existingRecent;
        }

        return await Activity.create({
          type,
          title: title.trim().slice(0, 200),
          description: description.trim().slice(0, 1000),
          entityType,
          entityId: parsedEntityId,
          actorId: parsedActorId,
          metadata: sanitizedMeta,
          createdAt: new Date(),
        });
      })();

      inFlightOperations.set(lockKey, operationPromise);
      try {
        return await operationPromise;
      } finally {
        inFlightOperations.delete(lockKey);
      }
    }

    // Standard activity creation for all mutation events
    const activity = await Activity.create({
      type,
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 1000),
      entityType,
      entityId: parsedEntityId,
      actorId: parsedActorId,
      metadata: sanitizedMeta,
      createdAt: new Date(),
    });

    return activity;
  } catch (error) {
    // Fail safely: Never let activity logging disrupt primary business logic
    console.error("Failed to log activity event safely:", error);
    return null;
  }
}
