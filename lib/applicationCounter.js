import ApplicationCounter from "../models/ApplicationCounter.js";

/**
 * Atomically increments and returns the next persistent Application Number.
 * 
 * Concurrency Safety:
 * Uses MongoDB findOneAndUpdate with $inc, which is atomic at the document level.
 * Even under high concurrent application submissions, each application is guaranteed
 * a unique, monotonically increasing sequential integer.
 * 
 * @returns {Promise<number>} Next sequential application number (1, 2, 3...)
 */
export async function getNextApplicationNumber() {
  const counter = await ApplicationCounter.findOneAndUpdate(
    { _id: "application" },
    { $inc: { sequence: 1 } },
    {
      upsert: true,
      new: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );

  return counter.sequence;
}

/**
 * Retrieves the current sequence value without incrementing.
 * @returns {Promise<number>} Current highest sequence number
 */
export async function getCurrentApplicationNumber() {
  const counter = await ApplicationCounter.findById("application").lean();
  return counter?.sequence || 0;
}

/**
 * Initializes or updates the persistent counter to at least the given sequence number.
 * Used during migrations and setup. Never decrements an existing higher counter.
 * 
 * @param {number} minimumSequence 
 * @returns {Promise<number>} The updated or existing sequence value
 */
export async function initializeApplicationCounter(minimumSequence) {
  const target = Math.max(0, Number(minimumSequence) || 0);

  const existing = await ApplicationCounter.findById("application");
  if (!existing) {
    const created = await ApplicationCounter.create({
      _id: "application",
      sequence: target,
    });
    return created.sequence;
  }

  if (existing.sequence < target) {
    existing.sequence = target;
    await existing.save();
  }

  return existing.sequence;
}
