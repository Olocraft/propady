"use server";

import { getClient } from "@/db/db";

interface TransactionData {
  propertyId: string;
  amount: number;
  cryptoSymbol: string;
  cryptoAmount: string;
  buyerId: string;
}

/**
 * Creates a record of a property transaction
 */
export const recordTransaction = async (data: TransactionData) => {
  try {
    const supabase = await getClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    // Record the transaction
    const { error } = await supabase.from("investments").insert({
      property_id: data.propertyId,
      investor_id: data.buyerId || user.id,
      amount: data.amount,
      tokens: Math.floor(data.amount / 10), // Simple token calculation (1 token per $10)
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error recording transaction:", error);

    return false;
  }
};

/**
 * Verifies a blockchain transaction (mock implementation)
 */
export const verifyBlockchainTransaction = async (
  txHash: string,
  amount: number,
  cryptoSymbol: string
): Promise<boolean> => {
  // This is a mock implementation that would be replaced with actual blockchain verification
  console.log(`Verifying transaction: ${txHash} for ${amount} ${cryptoSymbol}`);

  // Simulate API call to verify transaction
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock successful verification (would be replaced with actual verification)
      resolve(true);
    }, 2000);
  });
};

/**
 * Get user's investment portfolio
 */
export const getUserInvestments = async () => {
  try {
    const supabase = await getClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    const { data, error } = await supabase
      .from("investments")
      .select(
        `
        *,
        properties:property_id(*)
      `
      )
      .eq("investor_id", user.id);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching investments:", error);
    return [];
  }
};
