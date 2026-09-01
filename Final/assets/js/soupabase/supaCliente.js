import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://cykxqbhasmcxjndzrjsx.supabase.co";
const SUPABASE_ANOM_KEY = "sb_publishable_-GoCwTTiysb5v49Ylozzuw_6ZUdzp94";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANOM_KEY);
