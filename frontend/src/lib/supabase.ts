import { createClient } from "@supabase/supabase-js";

// Client for public access (auth, realtime, public schemas)
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Service Role Client (SERVER-SIDE ONLY)
 * Use this for admin tasks like writing to protected tables (leads)
 * or triggering emails without RLS policies getting in the way.
 *
 * SECURITY: NEVER expose this to the client.
 */
export const supabaseAdmin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing Supabase admin keys (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)"
        );
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
